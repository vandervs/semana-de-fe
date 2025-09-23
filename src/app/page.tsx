
"use client";

import { getInitiatives } from '@/lib/data';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Initiative } from '@/lib/definitions';
import { ProgressDisplay } from '@/components/progress-display';

export default function Home() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInitiatives();
        setInitiatives(data);
      } catch (error) {
        console.error("Failed to fetch initiatives", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const peopleReached = useMemo(() => {
    return initiatives.reduce((acc, initiative) => acc + initiative.evangelized.length, 0);
  }, [initiatives]);

  const MapDisplay = useMemo(() => dynamic(() => import('@/components/map-display'), {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
  }), []);

  if (loading) {
    return (
        <section className="container flex-1 py-6">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-12 w-96" />
                    <Skeleton className="h-6 w-[400px]" />
                </div>
            </div>
            <div className="my-8 grid gap-4 md:grid-cols-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="mt-8 h-[70vh] w-full rounded-lg" />
        </section>
    )
  }

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

        <ProgressDisplay peopleReached={peopleReached} />

        <div className="mt-8 h-[60vh] w-full rounded-lg border bg-card shadow-lg overflow-hidden md:h-[70vh]">
            <MapDisplay initiatives={initiatives} />
        </div>
    </section>
  );
}
