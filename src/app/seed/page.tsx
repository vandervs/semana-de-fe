"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addInitiative } from "@/lib/data";
import type { Initiative } from "@/lib/definitions";
import React from "react";

const sampleInitiatives: Omit<Initiative, 'id' | 'createdAt'>[] = [
    {
        locationName: "Praia de Copacabana, Rio de Janeiro, Brasil",
        latitude: -22.9714,
        longitude: -43.1823,
        evangelists: [{ name: "Carlos" }, { name: "Fernanda" }],
        evangelized: [{ name: "John" }],
        testimony: "Tivemos uma conversa maravilhosa sobre fé com um turista no calçadão. Ele estava muito aberto e curioso.",
        interactionTypes: ["conversation", "presentation"],
        date: "2024-07-20",
        photoUrl: "https://picsum.photos/seed/evrio1/600/400",
        photoHint: "praia sol"
    },
    {
        locationName: "Praça da Liberdade, Belo Horizonte, Minas Gerais, Brasil",
        latitude: -19.9328,
        longitude: -43.9352,
        evangelists: [{ name: "Lucas" }],
        evangelized: [{ name: "Mariana" }, { name: "Pedro" }],
        testimony: "Um grupo de estudantes parou para ouvir e uma pessoa aceitou a Cristo ali mesmo! Foi uma grande alegria.",
        interactionTypes: ["conversation", "presentation", "acceptance"],
        date: "2024-07-21",
        photoUrl: "https://picsum.photos/seed/evbh1/600/400",
        photoHint: "parque cidade"
    },
    {
        locationName: "Convento da Penha, Vila Velha, Espírito Santo, Brasil",
        latitude: -20.3297,
        longitude: -40.2870,
        evangelists: [{ name: "Ana" }, { name: "Tiago" }],
        evangelized: [{ name: "Sofia" }],
        testimony: "No topo do convento, com uma vista incrível, compartilhamos o evangelho. A pessoa ficou muito emocionada.",
        interactionTypes: ["conversation"],
        date: "2024-07-22",
        photoUrl: "https://picsum.photos/seed/eves1/600/400",
        photoHint: "vista montanha"
    }
];


export default function SeedPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const handleSeed = async () => {
        setIsLoading(true);
        setIsSuccess(false);
        try {
            for (const initiative of sampleInitiatives) {
                await addInitiative(initiative);
            }
            toast({
                title: "Sucesso!",
                description: "O banco de dados foi populado com dados de exemplo.",
            });
            setIsSuccess(true);
        } catch (error) {
            console.error("Erro ao popular o banco de dados:", error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Não foi possível adicionar os dados de exemplo. Verifique o console.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="container py-8 md:py-12">
            <div className="mx-auto flex max-w-md flex-col items-center justify-center space-y-6 text-center">
                <h1 className="text-3xl font-bold">Popular Banco de Dados</h1>
                <p className="text-muted-foreground">
                    Clique no botão abaixo para adicionar algumas iniciativas de exemplo ao seu banco de dados Firestore. Isso o ajudará a ver como o aplicativo funciona com dados reais.
                </p>
                <Button onClick={handleSeed} disabled={isLoading} size="lg">
                    {isLoading ? "Adicionando..." : "Adicionar Dados de Exemplo"}
                </Button>
                {isSuccess && (
                     <p className="text-green-600">Dados adicionados com sucesso! Você já pode vê-los no mapa e nos testemunhos.</p>
                )}
            </div>
        </section>
    );
}