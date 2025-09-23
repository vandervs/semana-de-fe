
"use client";

import { StatsCard } from "@/components/stats-card";
import { Progress } from "@/components/ui/progress";
import { Users, Target, CheckCircle } from "lucide-react";

interface ProgressDisplayProps {
    peopleReached: number;
}

const STUDENTS_INVOLVED = 500;
const GOAL = 5000;

export function ProgressDisplay({ peopleReached }: ProgressDisplayProps) {
    const progressPercentage = (peopleReached / GOAL) * 100;

    return (
        <div className="my-8 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <StatsCard 
                    title="Alunos Envolvidos"
                    value={STUDENTS_INVOLVED}
                    icon={Users}
                />
                <StatsCard 
                    title="Pessoas Alcançadas"
                    value={peopleReached}
                    icon={CheckCircle}
                />
                <StatsCard 
                    title="Meta"
                    value={GOAL}
                    icon={Target}
                />
            </div>
            <div className="space-y-2">
                <Progress value={progressPercentage} className="h-4" />
                <p className="text-right text-sm font-medium text-muted-foreground">
                    {Math.round(progressPercentage)}% da meta alcançada
                </p>
            </div>
        </div>
    );
}
