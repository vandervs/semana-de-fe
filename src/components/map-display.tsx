"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import type { Initiative } from "@/lib/definitions";
import { MessageCircle, BookOpen, UserCheck, MapPin } from "lucide-react";
import React, { useRef, useEffect } from "react";

// Fix for default icon path issue with webpack
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

const interactionTypes: { [key: string]: string } = {
  conversation: "Conversa Espiritual",
  presentation: "Apresentação do Evangelho",
  acceptance: "Aceitou a Cristo",
};

interface MapDisplayProps {
  initiatives: Initiative[];
}

const MapDisplay: React.FC<MapDisplayProps> = ({ initiatives }) => {
  // Center of Southeast Brazil
  const position: [number, number] = [-21.5, -45.0];
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This effect runs only once on mount
    if (mapContainerRef.current && !mapRef.current) {
        const map = L.map(mapContainerRef.current).setView(position, 6);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        initiatives.forEach(initiative => {
            const marker = L.marker([initiative.latitude, initiative.longitude]).addTo(map);
            
            const popupContent = `
                <div class="w-64">
                    <h3 class="font-bold text-base mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2 inline-block text-destructive"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        ${initiative.locationName}
                    </h3>
                    <div class="text-sm mb-2 capitalize font-medium">
                        ${interactionTypes[initiative.interactionType] || initiative.interactionType}
                    </div>
                    <p class="text-sm text-gray-500 mb-2 italic">"${initiative.testimony}"</p>
                    <p class="text-xs text-right text-gray-500">- ${initiative.evangelistName} com ${initiative.evangelizedName}</p>
                </div>
            `;
            marker.bindPopup(popupContent);
        });
    }

    // Cleanup function
    return () => {
        if (mapRef.current) {
            mapRef.current.off();
            mapRef.current.remove();
            mapRef.current = null;
        }
    };
  }, [initiatives, position]);

  return (
    <div ref={mapContainerRef} className="h-full w-full z-0" />
  );
};

export default MapDisplay;
