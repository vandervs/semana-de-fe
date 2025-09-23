
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
        <div className="my-10 md:my-16">
            <div className="mb-8 grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:gap-4">
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
            <div className="space-y-3 px-4">
                <Progress value={progressPercentage} className="h-4" />
                <p className="text-center text-lg font-bold text-primary">
                    {Math.ceil(progressPercentage)}% da meta alcançada!
                </p>
            </div>
        </div>
    );
}
