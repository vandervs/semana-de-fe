
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
}

export function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        const animationDuration = 1000; // 1 second
        const frameDuration = 1000 / 60; // 60 fps
        const totalFrames = Math.round(animationDuration / frameDuration);
        let frame = 0;

        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentValue = Math.round(value * progress);
            setAnimatedValue(currentValue);

            if (frame === totalFrames) {
                clearInterval(counter);
                setAnimatedValue(value); // Ensure it ends on the exact value
            }
        }, frameDuration);

        return () => clearInterval(counter);
    }, [value]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {animatedValue.toLocaleString('pt-BR')}
                </div>
            </CardContent>
        </Card>
    );
}
