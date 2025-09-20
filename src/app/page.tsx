
"use client";

import { mockInitiatives } from '@/lib/data';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const initiatives = mockInitiatives;

  const MapDisplay = useMemo(() => dynamic(() => import('@/components/map-display'), {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
  }), []);

  return (
    <section className="container flex-1 py-6">
       <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
          <div className="flex-1 space-y-4">
            <h1 className="inline-block font-headline text-4xl font-bold tracking-tight lg:text-5xl">
              Mapa de Iniciativas
            </h1>
            <p className="text-xl text-muted-foreground">
              Veja o evangelho se espalhando pelo Sudeste do Brasil.
            </p>
          </div>
        </div>
        <div className="mt-8 h-[60vh] w-full rounded-lg border bg-card shadow-lg overflow-hidden md:h-[70vh]">
            <MapDisplay initiatives={initiatives} />
        </div>
    </section>
  );
}
