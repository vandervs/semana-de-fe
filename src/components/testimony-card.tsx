import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Initiative } from "@/lib/definitions";
import { MessageCircle, BookOpen, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const interactionDetails: {
    [key in Initiative['interactionType']]: {
        icon: React.ElementType;
        label: string;
        badgeVariant: "default" | "secondary" | "outline" | "destructive";
        iconClassName: string;
    }
} = {
    conversation: {
        icon: MessageCircle,
        label: "Conversa Espiritual",
        badgeVariant: "outline",
        iconClassName: "text-accent-foreground"
    },
    presentation: {
        icon: BookOpen,
        label: "Apresentação do Evangelho",
        badgeVariant: "secondary",
        iconClassName: "text-secondary-foreground"
    },
    acceptance: {
        icon: UserCheck,
        label: "Aceitou a Cristo",
        badgeVariant: "default",
        iconClassName: "text-primary-foreground"
    },
};

export function TestimonyCard({ initiative }: { initiative: Initiative }) {
    const details = interactionDetails[initiative.interactionType];
    const Icon = details.icon;

    const formattedDate = new Date(initiative.date).toLocaleDateString('pt-BR', {
      timeZone: 'UTC', // Dates in mock data don't have timezone, so UTC is safe
    });

    return (
        <Card className="flex h-full flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader className="p-0">
                <div className="relative aspect-video w-full">
                    <Image
                        src={initiative.photoUrl}
                        alt={`Testemunho de ${initiative.locationName}`}
                        fill
                        className="object-cover"
                        data-ai-hint={initiative.photoHint}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-6 flex-1">
                <Badge variant={details.badgeVariant} className="mb-4">
                    <Icon className={cn("mr-2 h-4 w-4", details.iconClassName)} />
                    {details.label}
                </Badge>
                <p className="mb-4 text-muted-foreground italic">"{initiative.testimony}"</p>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground p-6 pt-0">
                <span>{initiative.locationName}</span>
                <span>{formattedDate}</span>
            </CardFooter>
        </Card>
    );
}
