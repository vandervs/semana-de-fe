"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MessageCircle, BookOpen, UserCheck } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { LocationSearch } from "./location-search";

const formSchema = z.object({
  locationName: z.string().min(3, { message: "A localização deve ter pelo menos 3 caracteres." }),
  latitude: z.number(),
  longitude: z.number(),
  evangelizedName: z.string().min(2, { message: "O nome da pessoa deve ter pelo menos 2 caracteres." }),
  evangelistName: z.string().min(2, { message: "Seu nome deve ter pelo menos 2 caracteres." }),
  testimony: z.string().min(20, { message: "O testemunho deve ter pelo menos 20 caracteres." }).max(500, { message: "O testemunho não pode exceder 500 caracteres."}),
  interactionType: z.enum(["conversation", "presentation", "acceptance"], { required_error: "Você precisa selecionar um tipo de interação." }),
  photo: z.any().optional(), // Em um aplicativo real, você validaria este arquivo
});

export function InitiativeForm() {
    const [isSuccess, setIsSuccess] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            locationName: "",
            evangelizedName: "",
            evangelistName: "",
            testimony: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Em um aplicativo real, você chamaria uma ação de servidor aqui.
        console.log("Formulário enviado:", values);
        
        setIsSuccess(true);
        form.reset();

        setTimeout(() => {
            setIsSuccess(false);
        }, 5000);
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Compartilhe Sua História</CardTitle>
                <CardDescription>Preencha o formulário abaixo para adicionar uma iniciativa ao mapa.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="evangelistName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Seu Nome</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ex: João" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="evangelizedName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome da Pessoa</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ex: Maria" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                         <FormField
                            control={form.control}
                            name="locationName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Localização</FormLabel>
                                    <FormControl>
                                         <LocationSearch 
                                            onLocationSelect={(lat, lon, name) => {
                                                form.setValue("latitude", lat);
                                                form.setValue("longitude", lon);
                                                form.setValue("locationName", name);
                                            }}
                                         />
                                    </FormControl>
                                    <FormDescription>
                                        Pesquise por um endereço e posicione o marcador no mapa.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="testimony"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Testemunho</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Compartilhe um breve testemunho de como foi..."
                                            className="resize-none"
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="interactionType"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Tipo de Interação</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col md:flex-row gap-4 pt-2"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="conversation" />
                                                </FormControl>
                                                <FormLabel className="font-normal flex items-center">
                                                    <MessageCircle className="mr-2 h-5 w-5 text-muted-foreground" />
                                                    Conversa Espiritual
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="presentation" />
                                                </FormControl>
                                                <FormLabel className="font-normal flex items-center">
                                                    <BookOpen className="mr-2 h-5 w-5 text-muted-foreground" />
                                                    Apresentação do Evangelho
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="acceptance" />
                                                </FormControl>
                                                <FormLabel className="font-normal flex items-center">
                                                    <UserCheck className="mr-2 h-5 w-5 text-muted-foreground" />
                                                    Aceitou a Cristo
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="photo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Foto (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                    <FormDescription>
                                        Uma foto do momento ou do lugar.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {isSuccess && (
                            <div className="rounded-md border border-green-500/20 bg-green-500/10 p-4 flex items-center gap-3 text-sm text-green-800 dark:text-green-200">
                                <CheckCircle className="h-5 w-5"/>
                                <p>Obrigado pela sua submissão! Ela aparecerá no mapa em breve.</p>
                            </div>
                        )}

                        <Button type="submit" size="lg" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
                           {form.formState.isSubmitting ? 'Enviando...' : 'Enviar para o Mapa'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
