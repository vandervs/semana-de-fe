"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import type { Initiative } from "@/lib/definitions";
import { MessageCircle, BookOpen, UserCheck, MapPin } from "lucide-react";
import React from "react";

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

const InteractionIcon = ({ type }: { type: Initiative['interactionType'] }) => {
  switch (type) {
    case 'conversation':
      return <MessageCircle className="h-4 w-4 mr-2 inline-block text-blue-500" />;
    case 'presentation':
      return <BookOpen className="h-4 w-4 mr-2 inline-block text-green-500" />;
    case 'acceptance':
      return <UserCheck className="h-4 w-4 mr-2 inline-block text-amber-500" />;
    default:
      return null;
  }
};

interface MapDisplayProps {
  initiatives: Initiative[];
}

const MapDisplay: React.FC<MapDisplayProps> = ({ initiatives }) => {
  // Center of Southeast Brazil
  const position: [number, number] = [-21.5, -45.0];

  return (
    <MapContainer center={position} zoom={6} scrollWheelZoom={true} className="h-full w-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {initiatives.map((initiative) => (
        <Marker key={initiative.id} position={[initiative.latitude, initiative.longitude]}>
          <Popup>
            <div className="w-64">
              <h3 className="font-bold text-base mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-2 inline-block text-destructive" />
                {initiative.locationName}
              </h3>
              <div className="text-sm mb-2">
                <InteractionIcon type={initiative.interactionType} />
                <span className="capitalize font-medium">{initiative.interactionType.replace('_', ' ')}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2 italic">"{initiative.testimony}"</p>
              <p className="text-xs text-right text-muted-foreground">
                - {initiative.evangelistName} with {initiative.evangelizedName}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapDisplay;
