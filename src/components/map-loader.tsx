"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { Initiative } from '@/lib/definitions';

interface MapLoaderProps {
    initiatives: Initiative[];
}

export function MapLoader({ initiatives }: MapLoaderProps) {
    const MapDisplay = dynamic(() => import('@/components/map-display'), {
        ssr: false,
        loading: () => <Skeleton className="h-full w-full" />,
    });

    return <MapDisplay initiatives={initiatives} />;
}
