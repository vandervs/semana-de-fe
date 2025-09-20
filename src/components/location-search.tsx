"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import type { Map, Marker, Icon, IconOptions, LatLngExpression, LeafletMouseEvent } from "leaflet";

type Suggestion = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
};

type LocationSearchProps = {
    onLocationSelect: (lat: number, lon: number, name: string) => void;
};

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Suggestion | null>(null);
  
  const debouncedQuery = useDebounce(query, 500);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const LRef = useRef<typeof import("leaflet") | null>(null);

  useEffect(() => {
    // Import Leaflet dynamically on the client side
    import("leaflet").then(L => {
        LRef.current = L;
    });
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 3) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${debouncedQuery}&countrycodes=br&limit=5`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
      }
      setIsLoading(false);
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSelectedLocation(suggestion);
    setQuery(suggestion.display_name);
    setSuggestions([]);
  };

  const handleMapClick = useCallback((e: LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
    }
    if (selectedLocation) {
        onLocationSelect(lat, lng, selectedLocation.display_name);
    }
  }, [selectedLocation, onLocationSelect]);


  useEffect(() => {
    const L = LRef.current;
    if (!L) return;

    const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
    const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
    const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

    const defaultIcon: Icon<IconOptions> = L.icon({
        iconUrl,
        iconRetinaUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });


    if (selectedLocation && mapContainerRef.current) {
      if (!mapRef.current) {
        const map = L.map(mapContainerRef.current);
        mapRef.current = map;
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        map.on('click', handleMapClick);
      }
      
      const newPos: LatLngExpression = [parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lon)];
      mapRef.current.setView(newPos, 15);
      
      if (markerRef.current) {
          markerRef.current.setLatLng(newPos);
      } else {
          const marker = L.marker(newPos, { icon: defaultIcon, draggable: true }).addTo(mapRef.current);
          markerRef.current = marker;

          marker.on('dragend', (e) => {
              const { lat, lng } = e.target.getLatLng();
              onLocationSelect(lat, lng, selectedLocation.display_name);
          });
      }
      onLocationSelect(newPos[0], newPos[1], selectedLocation.display_name);
    }
    
    // Cleanup
    return () => {
        if(mapRef.current){
            mapRef.current.off('click', handleMapClick);
        }
    }
  }, [selectedLocation, onLocationSelect, handleMapClick]);


  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite um endereço, bairro ou cidade..."
          className="pr-10"
        />
        {isLoading && <Skeleton className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full" />}
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.place_id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-3 hover:bg-muted cursor-pointer text-sm"
              >
                {suggestion.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedLocation && (
        <div className="h-64 w-full rounded-md border overflow-hidden">
            <div ref={mapContainerRef} className="h-full w-full" />
        </div>
      )}
    </div>
  );
}
