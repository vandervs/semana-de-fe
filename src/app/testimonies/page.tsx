"use client";

import { TestimonyCard } from "@/components/testimony-card";
import { getInitiatives } from "@/lib/data";
import type { Initiative } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TestimoniesPage() {
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
         // Set up a poller to refresh data periodically
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
      }, []);

    if (loading) {
        return (
            <section className="container py-8 md:py-12">
                <div className="space-y-2 mb-8">
                    <Skeleton className="h-12 w-1/2" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-[200px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="container py-8 md:py-12">
            <div className="space-y-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Testemunhos do Campo</h1>
                <p className="text-muted-foreground md:text-xl/relaxed">
                    Leia histórias de como Deus está se movendo no Sudeste do Brasil.
                </p>
            </div>
            
            {initiatives.length === 0 ? (
                <div className="flex justify-center items-center h-40">
                    <p className="text-muted-foreground">Nenhum testemunho encontrado.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {initiatives.map((initiative) => (
                        <TestimonyCard key={initiative.id} initiative={initiative} />
                    ))}
                </div>
            )}
        </section>
    );
}
