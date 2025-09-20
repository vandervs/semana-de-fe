"use client";

import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import type { Initiative } from "@/lib/definitions";
import React, { useRef, useEffect } from "react";

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

const interactionTypesMap: { [key: string]: string } = {
  conversation: "Conversa Espiritual",
  presentation: "Apresentação do Evangelho",
  acceptance: "Aceitou a Cristo",
};

const getInteractionLabels = (types: string[]) => {
    if (!types) return '';
    return types.map(t => interactionTypesMap[t]).join(', ');
}

interface MapDisplayProps {
  initiatives: Initiative[];
}

const MapDisplay: React.FC<MapDisplayProps> = ({ initiatives }) => {
  // Centered on RJ, MG, ES area.
  const position: [number, number] = [-20.0, -42.5]; 
  const zoomLevel = 7;
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
        const map = L.map(mapContainerRef.current).setView(position, zoomLevel);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (mapRef.current && initiatives) {
        initiatives.forEach(initiative => {
            const marker = L.marker([initiative.latitude, initiative.longitude], { icon: defaultIcon }).addTo(mapRef.current!);
            markersRef.current.push(marker);
            
            const evangelists = initiative.evangelists.map(p => p.name).join(', ');
            const evangelized = initiative.evangelized.map(p => p.name).join(', ');

            const popupContent = `
                <div class="w-64 p-1">
                    <h3 class="font-bold text-base mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2 inline-block text-destructive"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        ${initiative.locationName}
                    </h3>
                    <div class="text-sm mb-2 capitalize font-medium text-muted-foreground">
                        ${getInteractionLabels(initiative.interactionTypes)}
                    </div>
                    <p class="text-sm text-foreground mb-2 italic">"${initiative.testimony}"</p>
                    <p class="text-xs text-right text-muted-foreground">- ${evangelists} com ${evangelized}</p>
                </div>
            `;
            marker.bindPopup(popupContent);
        });
    }

  }, [initiatives, position, zoomLevel]);
  
  // Cleanup function to run when the component unmounts
  useEffect(() => {
    return () => {
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
    };
  }, []);

  return (
    <div ref={mapContainerRef} className="h-full w-full z-0" />
  );
};

export default MapDisplay;
