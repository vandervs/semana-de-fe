"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import type { Map, Marker, Icon, IconOptions, LatLngExpression, LeafletMouseEvent } from "leaflet";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const LRef = useRef<typeof import("leaflet") | null>(null);

  // Dynamically import Leaflet on the client side
  useEffect(() => {
    import("leaflet").then(L => {
        LRef.current = L;
    });
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 3 || (selectedLocation && debouncedQuery === selectedLocation.display_name)) {
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
  }, [debouncedQuery, selectedLocation]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.display_name); // Keep full name in input for clarity
    setSelectedLocation(suggestion);
    setSuggestions([]);
  };

  // Reverse geocode to get address from lat/lng
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        if (data && data.display_name) {
            const newName = data.display_name;
            setQuery(newName); // Update input with new address
            onLocationSelect(lat, lng, newName);
        }
    } catch (error) {
        console.error("Erro na geocodificação reversa:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível encontrar o endereço para esta localização.",
        });
    } finally {
        setIsLoading(false);
    }
  }, [onLocationSelect, toast]);


  const handleMapClick = useCallback((e: LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
    }
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  const handleMarkerDragEnd = useCallback((e: L.DragEndEvent) => {
    const { lat, lng } = e.target.getLatLng();
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  // Initialize and update map
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
      const lat = parseFloat(selectedLocation.lat);
      const lon = parseFloat(selectedLocation.lon);

      if (!mapRef.current) {
        const map = L.map(mapContainerRef.current);
        mapRef.current = map;
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        map.on('click', handleMapClick);
      }
      
      const newPos: LatLngExpression = [lat, lon];
      mapRef.current.setView(newPos, 16);
      
      if (markerRef.current) {
          markerRef.current.setLatLng(newPos);
      } else {
          const marker = L.marker(newPos, { icon: defaultIcon, draggable: true }).addTo(mapRef.current);
          markerRef.current = marker;
          marker.on('dragend', handleMarkerDragEnd);
      }
      onLocationSelect(lat, lon, selectedLocation.display_name);
    }
    
    // Cleanup
    return () => {
        if(mapRef.current){
            mapRef.current.off('click', handleMapClick);
            // Don't destroy the map, just remove listeners if needed.
            // Full destruction handled by parent component unmount.
        }
        if (markerRef.current) {
            markerRef.current.off('dragend', handleMarkerDragEnd);
        }
    }
  }, [selectedLocation, onLocationSelect, handleMapClick, handleMarkerDragEnd]);


  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if(selectedLocation) setSelectedLocation(null); // Allow new search
          }}
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
