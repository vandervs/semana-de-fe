
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Map, Marker, Icon, IconOptions, LatLngExpression, LeafletMouseEvent } from "leaflet";
import { Skeleton } from "./ui/skeleton";

type LocationPickerProps = {
    onLocationChange: (lat: number, lon: number, name: string) => void;
};

export function LocationPicker({ onLocationChange }: LocationPickerProps) {
    const [address, setAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map | null>(null);
    const markerRef = useRef<Marker | null>(null);
    const LRef = useRef<typeof import("leaflet") | null>(null);

    const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
    const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
    const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

    useEffect(() => {
        import("leaflet").then(L => {
            LRef.current = L;
            initializeMap();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const reverseGeocode = useCallback(async (lat: number, lng: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            if (data && data.display_name) {
                const newName = data.display_name;
                setAddress(newName);
                onLocationChange(lat, lng, newName);
            } else {
                 setAddress("Endereço não encontrado.");
                 onLocationChange(lat, lng, "");
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
    }, [onLocationChange, toast]);

    const handleMarkerDragEnd = useCallback((e: any) => {
        const { lat, lng } = e.target.getLatLng();
        reverseGeocode(lat, lng);
    }, [reverseGeocode]);

    const handleMapClick = useCallback((e: LeafletMouseEvent) => {
        const L = LRef.current;
        if (!L) return;

        const { lat, lng } = e.latlng;
        const newPos: LatLngExpression = [lat, lng];

        if (markerRef.current) {
            markerRef.current.setLatLng(newPos);
        } else if (mapRef.current) {

            const defaultIcon: Icon<IconOptions> = L.icon({
                iconUrl,
                iconRetinaUrl,
                shadowUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            const marker = L.marker(newPos, { icon: defaultIcon, draggable: true }).addTo(mapRef.current);
            markerRef.current = marker;
            marker.on('dragend', handleMarkerDragEnd);
        }
        reverseGeocode(lat, lng);
    }, [reverseGeocode, handleMarkerDragEnd, iconUrl, iconRetinaUrl, shadowUrl]);

    const initializeMap = useCallback(() => {
        const L = LRef.current;
        if (!L || !mapContainerRef.current || mapRef.current) return;

        // Centered on RJ, MG, ES area.
        const targetArea: LatLngExpression = [-20.0, -42.5]; 
        const map = L.map(mapContainerRef.current).setView(targetArea, 7);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        map.on('click', handleMapClick);
        
    }, [handleMapClick]);


    useEffect(() => {
        initializeMap();
        
        return () => {
            if (mapRef.current) {
                mapRef.current.off('click', handleMapClick);
                if (markerRef.current) {
                    markerRef.current.off('dragend', handleMarkerDragEnd);
                }
            }
        };
    }, [initializeMap, handleMapClick, handleMarkerDragEnd]);


    return (
        <div className="space-y-4">
             <Input
                type="text"
                value={address}
                readOnly
                placeholder="O endereço aparecerá aqui após selecionar no mapa..."
                className="bg-muted"
            />
            <div className="h-80 w-full rounded-md border overflow-hidden relative">
                <div ref={mapContainerRef} className="h-full w-full" />
                 {isLoading && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                        <Skeleton className="h-10 w-32" />
                    </div>
                 )}
            </div>
        </div>
    );
}
