
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

  const { peopleReached, conversations, presentations, acceptances } = useMemo(() => {
    const stats = {
      peopleReached: 0,
      conversations: 0,
      presentations: 0,
      acceptances: 0,
    };

    initiatives.forEach(initiative => {
      const evangelizedCount = initiative.evangelized.length;
      stats.peopleReached += evangelizedCount;

      if (initiative.interactionTypes.includes('conversation')) {
        stats.conversations += evangelizedCount;
      }
      if (initiative.interactionTypes.includes('presentation')) {
        stats.presentations += evangelizedCount;
      }
      if (initiative.interactionTypes.includes('acceptance')) {
        stats.acceptances += evangelizedCount;
      }
    });

    return stats;
  }, [initiatives]);


  const MapDisplay = useMemo(() => dynamic(() => import('@/components/map-display'), {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
  }), []);

  if (loading) {
    return (
        <section className="container grid flex-1 grid-cols-1 gap-10 py-6 lg:grid-cols-3 lg:gap-12">
            <div className="col-span-1">
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
                 <div className="my-10 space-y-8">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
            <div className="col-span-2 h-[80vh] w-full">
                <Skeleton className="h-full w-full rounded-lg" />
            </div>
        </section>
    )
  }

  return (
    <section className="container grid flex-1 grid-cols-1 gap-10 py-6 lg:grid-cols-3 lg:gap-12">
        <div className="col-span-1">
            <div className="space-y-4">
                 <h1 className="inline-block font-headline text-4xl font-bold tracking-tight lg:text-5xl">
                    Mapa de Iniciativas
                </h1>
                <p className="text-xl text-muted-foreground">
                    Veja o evangelho se espalhando pelo Sudeste do Brasil.
                </p>
            </div>
            <ProgressDisplay 
              peopleReached={peopleReached}
              conversations={conversations}
              presentations={presentations}
              acceptances={acceptances}
            />
        </div>
        <div className="relative col-span-2 h-[80vh] w-full rounded-lg border bg-card shadow-lg overflow-hidden z-0">
            <MapDisplay initiatives={initiatives} />
        </div>
    </section>
  );
}
