
"use client";

import { StatsCard } from "@/components/stats-card";
import { Progress } from "@/components/ui/progress";
import { Users, Target, CheckCircle, MessageCircle, BookOpen, HeartHandshake } from "lucide-react";

interface ProgressDisplayProps {
    peopleReached: number;
    conversations: number;
    presentations: number;
    acceptances: number;
}

const STUDENTS_INVOLVED = 500;
const GOAL = 5000;

export function ProgressDisplay({ peopleReached, conversations, presentations, acceptances }: ProgressDisplayProps) {
    const progressPercentage = (peopleReached / GOAL) * 100;

    return (
        <div className="my-10 md:my-16">
            <div className="mb-8 grid grid-cols-2 gap-x-4 gap-y-8 text-center">
                <StatsCard 
                    title="Alunos Envolvidos"
                    value={STUDENTS_INVOLVED}
                    icon={Users}
                />
                <StatsCard 
                    title="Objetivo"
                    value={GOAL}
                    icon={Target}
                />
                 <StatsCard 
                    title="Pessoas Alcançadas"
                    value={peopleReached}
                    icon={CheckCircle}
                />
                <StatsCard 
                    title="Conversas Espirituais"
                    value={conversations}
                    icon={MessageCircle}
                />
                <StatsCard 
                    title="Apresentações do Evangelho"
                    value={presentations}
                    icon={BookOpen}
                />
                <StatsCard 
                    title="Decisões por Cristo"
                    value={acceptances}
                    icon={HeartHandshake}
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
