"use client";

import { TestimonyCard } from "@/components/testimony-card";
import { mockInitiatives } from "@/lib/data";
import type { Initiative } from "@/lib/definitions";
import { useEffect, useState } from "react";

export default function TestimoniesPage() {
    const [initiatives, setInitiatives] = useState<Initiative[]>(mockInitiatives);

    useEffect(() => {
        // This is a workaround to update the initiatives when the mock data changes.
        // In a real app, you would fetch this data from an API.
        const interval = setInterval(() => {
          if (initiatives.length !== mockInitiatives.length) {
            setInitiatives([...mockInitiatives]);
          }
        }, 1000);
        return () => clearInterval(interval);
      }, [initiatives.length]);

    return (
        <section className="container py-8 md:py-12">
            <div className="space-y-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Testemunhos do Campo</h1>
                <p className="text-muted-foreground md:text-xl/relaxed">
                    Leia histórias de como Deus está se movendo no Sudeste do Brasil.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {initiatives.map((initiative) => (
                    <TestimonyCard key={initiative.id} initiative={initiative} />
                ))}
            </div>
        </section>
    );
}
