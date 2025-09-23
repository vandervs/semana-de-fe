
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Map, Marker, Icon, IconOptions, LatLngExpression, LeafletMouseEvent } from "leaflet";
import { Skeleton } from "./ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "./ui/button";
import { FormDescription } from "./ui/form";

type LocationPickerProps = {
    onLocationChange: (lat: number, lon: number, name: string) => void;
};

type SearchResult = {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
};

export function LocationPicker({ onLocationChange }: LocationPickerProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
    
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    const { toast } = useToast();

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map | null>(null);
    const markerRef = useRef<Marker | null>(null);
    const LRef = useRef<typeof import("leaflet") | null>(null);

    const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
    const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
    const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
    
    const defaultIcon: Icon<IconOptions> | undefined = LRef.current?.icon({
        iconUrl,
        iconRetinaUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const placeMarker = useCallback((lat: number, lng: number) => {
        const L = LRef.current;
        if (!L || !mapRef.current) return;
        
        const newPos: LatLngExpression = [lat, lng];
        
        if (markerRef.current) {
            markerRef.current.setLatLng(newPos);
        } else {
            markerRef.current = L.marker(newPos, { icon: defaultIcon, draggable: true }).addTo(mapRef.current);
            markerRef.current.on('dragend', handleMarkerDragEnd);
        }
        mapRef.current.setView(newPos, 16);
    }, [defaultIcon]);

    const reverseGeocode = useCallback(async (lat: number, lng: number) => {
        setIsReverseGeocoding(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            if (data && data.display_name) {
                const newName = data.display_name;
                setSearchQuery(newName); // Update input field with the address
                onLocationChange(lat, lng, newName);
            } else {
                 setSearchQuery("Endereço não encontrado.");
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
            setIsReverseGeocoding(false);
        }
    }, [onLocationChange, toast]);

    const handleMarkerDragEnd = useCallback((e: any) => {
        const { lat, lng } = e.target.getLatLng();
        reverseGeocode(lat, lng);
    }, [reverseGeocode]);

    const handleMapClick = useCallback((e: LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        placeMarker(lat, lng);
        reverseGeocode(lat, lng);
    }, [placeMarker, reverseGeocode]);


    useEffect(() => {
        let isMounted = true;
        
        import("leaflet").then(L => {
            if (!isMounted || !mapContainerRef.current) return;

            LRef.current = L;

            if (!mapRef.current) {
                // Centered on RJ, MG, ES area.
                const targetArea: LatLngExpression = [-20.0, -42.5]; 
                const map = L.map(mapContainerRef.current).setView(targetArea, 7);
                mapRef.current = map;

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                map.on('click', handleMapClick);
            }
        });

        return () => {
            isMounted = false;
            if (mapRef.current) {
                mapRef.current.off('click', handleMapClick);
                if (markerRef.current) {
                    markerRef.current.off('dragend', handleMarkerDragEnd);
                }
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (debouncedSearchQuery && debouncedSearchQuery.length > 2) {
            const search = async () => {
                setIsSearching(true);
                setSearchResults([]);
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(debouncedSearchQuery)}&format=json&addressdetails=1&countrycodes=BR`);
                    const data: SearchResult[] = await response.json();
                    
                    const simplifiedResults = data.map(result => {
                        const address = (result as any).address;
                        const city = address?.city || address?.town || address?.village || '';
                        const suburb = address?.suburb || address?.city_district || '';
                        const displayName = [result.display_name.split(',')[0], suburb, city].filter(Boolean).join(', ');
                        return {...result, display_name: displayName};
                    });

                    setSearchResults(simplifiedResults.slice(0, 5));
                } catch (error) {
                    console.error("Erro na busca de endereço:", error);
                    toast({
                        variant: "destructive",
                        title: "Erro de Busca",
                        description: "Não foi possível realizar a busca.",
                    });
                } finally {
                    setIsSearching(false);
                }
            };
            search();
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchQuery, toast]);

    const handleSelectResult = (result: SearchResult) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setSearchQuery(result.display_name);
        setSearchResults([]);
        placeMarker(lat, lng);
        onLocationChange(lat, lng, result.display_name);
    };

    return (
        <div className="space-y-2 relative">
             <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Digite um endereço ou nome de local..."
            />
            {isSearching && <p className="text-sm text-muted-foreground p-2">Buscando...</p>}
            {!isSearching && searchResults.length > 0 && (
                 <div className="absolute top-full left-0 right-0 z-[1000] bg-card border rounded-md shadow-lg mt-1">
                    {searchResults.map(result => (
                        <Button
                            key={result.place_id}
                            variant="ghost"
                            className="w-full justify-start text-left h-auto py-2 px-3"
                            onClick={() => handleSelectResult(result)}
                        >
                            {result.display_name}
                        </Button>
                    ))}
                 </div>
            )}
            <FormDescription className="pt-2">
                Pesquise por um endereço ou mova o pino no mapa para definir a localização.
            </FormDescription>
            <div className="h-80 w-full rounded-md border overflow-hidden relative mt-2">
                <div ref={mapContainerRef} className="h-full w-full" />
                 {isReverseGeocoding && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                        <p>Atualizando endereço...</p>
                    </div>
                 )}
            </div>
        </div>
    );
}
