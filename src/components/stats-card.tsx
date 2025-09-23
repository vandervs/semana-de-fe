
"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
}

export function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        if (value === 0) {
            setAnimatedValue(0);
            return;
        }

        const animationDuration = 1500; // ms
        const frameDuration = 1000 / 60; // 60 fps
        const totalFrames = Math.round(animationDuration / frameDuration);
        let frame = 0;

        const counter = setInterval(() => {
            frame++;
            const progress = Math.pow(frame / totalFrames, 0.5); // Ease-out
            const currentValue = Math.round(value * progress);
            
            if (currentValue >= value) {
                setAnimatedValue(value);
                clearInterval(counter);
                return;
            }

            setAnimatedValue(currentValue);

            if (frame === totalFrames) {
                clearInterval(counter);
            }
        }, frameDuration);

        return () => clearInterval(counter);
    }, [value]);

    return (
        <div className="flex items-center justify-start p-4">
            <Icon className="h-10 w-10 text-primary mr-4" />
            <div className="text-left">
                <div className="text-4xl font-extrabold text-foreground tracking-tighter">
                    {animatedValue.toLocaleString('pt-BR')}
                </div>
                <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider mt-1">{title}</h3>
            </div>
        </div>
    );
}
