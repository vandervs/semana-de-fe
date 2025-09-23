
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { MessageCircle, BookOpen, UserCheck, PlusCircle, X, Building2, Wrench, Users, UserPlus, MapPin, PenSquare, Camera } from "lucide-react";
import React from "react";
import { useRouter } from 'next/navigation';

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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { LocationPicker } from "./location-picker";
import { cn } from "@/lib/utils";
import { submitInitiative } from "@/ai/flows/submitInitiative";
import { useToast } from "@/hooks/use-toast";


const personSchema = z.object({
    name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
    contact: z.string().optional(),
});

const formSchema = z.object({
  locationName: z.string().min(3, { message: "Selecione uma localização no mapa." }),
  latitude: z.number(),
  longitude: z.number(),
  evangelists: z.array(personSchema).min(1, "Adicione pelo menos um participante."),
  evangelized: z.array(personSchema).min(1, "Adicione pelo menos uma pessoa evangelizada."),
  testimony: z.string().min(20, { message: "O testemunho deve ter pelo menos 20 caracteres." }).max(500, { message: "O testemunho não pode exceder 500 caracteres."}),
  interactionTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Você precisa selecionar pelo menos um tipo de interação.",
  }),
  photo: z.instanceof(File).optional(),
  university: z.string().min(2, { message: "Por favor, insira o nome da universidade." }),
  evangelismTools: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Você precisa selecionar pelo menos uma ferramenta.",
  }),
});

const interactionTypesItems = [
    { id: "conversation", label: "Conversa Espiritual", icon: MessageCircle },
    { id: "presentation", label: "Apresentação do Evangelho", icon: BookOpen },
    { id: "acceptance", label: "Aceitou a Cristo", icon: UserCheck },
];

const evangelismToolsItems = [
    { id: "god-tools", label: "God Tools App" },
    { id: "conecta", label: "Conecta" },
    { id: "perspectiva", label: "Perspectiva" },
    { id: "4-leis", label: "4 Leis Espirituais" },
    { id: "outros", label: "Outros" },
];

export function InitiativeForm() {
    const [isSuccess, setIsSuccess] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            locationName: "",
            testimony: "",
            evangelists: [{ name: "", contact: "" }],
            evangelized: [{ name: "", contact: "" }],
            interactionTypes: [],
            university: "",
            evangelismTools: [],
        },
    });
    
    const { fields: evangelistsFields, append: appendEvangelist, remove: removeEvangelist } = useFieldArray({
        control: form.control,
        name: "evangelists",
    });

    const { fields: evangelizedFields, append: appendEvangelized, remove: removeEvangelized } = useFieldArray({
        control: form.control,
        name: "evangelized",
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Formulário enviado:", values);
        
        try {
            await submitInitiative(values);
            setIsSuccess(true);
            
            // This revalidates the data on the server and fetches the new list
            router.refresh();

            // Reset form after successful submission
            form.reset();
            
            setTimeout(() => {
                setIsSuccess(false);
            }, 5000);

        } catch(error) {
            console.error("Erro ao enviar iniciativa:", error);
            toast({
                variant: "destructive",
                title: "Erro ao Enviar",
                description: "Ocorreu um erro ao enviar sua iniciativa. Por favor, tente novamente.",
            });
        }
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Compartilhe Sua História</CardTitle>
                <CardDescription>Preencha o formulário abaixo para adicionar uma iniciativa ao mapa.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        
                        <div className="space-y-4">
                            <FormLabel className="flex items-center">
                                <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                                Participantes
                            </FormLabel>
                            {evangelistsFields.map((field, index) => (
                                <div key={field.id} className="flex items-end gap-2">
                                    <div className="grid grid-cols-2 gap-2 flex-1">
                                         <FormField
                                            control={form.control}
                                            name={`evangelists.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={cn(index !== 0 && "sr-only")}>Nome</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="ex: João" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                         <FormField
                                            control={form.control}
                                            name={`evangelists.${index}.contact`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={cn(index !== 0 && "sr-only")}>Contato (opcional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Telefone ou e-mail" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {evangelistsFields.length > 1 && (
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeEvangelist(index)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => appendEvangelist({ name: "", contact: "" })}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Adicionar participante
                            </Button>
                        </div>
                        
                        <FormField
                            control={form.control}
                            name="university"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center">
                                        <Building2 className="mr-2 h-5 w-5 text-muted-foreground" />
                                        Universidade e Campus
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="ex: UFRJ, USP, etc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <FormLabel className="flex items-center">
                                <UserPlus className="mr-2 h-5 w-5 text-muted-foreground" />
                                Pessoas Evangelizadas
                            </FormLabel>
                            {evangelizedFields.map((field, index) => (
                                <div key={field.id} className="flex items-end gap-2">
                                    <div className="grid grid-cols-2 gap-2 flex-1">
                                        <FormField
                                            control={form.control}
                                            name={`evangelized.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                     <FormLabel className={cn(index !== 0 && "sr-only")}>Nome</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="ex: Maria" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                         <FormField
                                            control={form.control}
                                            name={`evangelized.${index}.contact`}
                                            render={({ field }) => (
                                                <FormItem>
                                                     <FormLabel className={cn(index !== 0 && "sr-only")}>Contato (opcional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Telefone ou e-mail" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {evangelizedFields.length > 1 && (
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeEvangelized(index)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                             <Button type="button" variant="outline" size="sm" onClick={() => appendEvangelized({ name: "", contact: "" })}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Adicionar pessoa
                            </Button>
                        </div>

                         <FormField
                            control={form.control}
                            name="locationName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center">
                                        <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                                        Localização
                                    </FormLabel>
                                    <FormControl>
                                         <LocationPicker 
                                            onLocationChange={(lat, lon, name) => {
                                                form.setValue("latitude", lat);
                                                form.setValue("longitude", lon);
                                                form.setValue("locationName", name, { shouldValidate: true });
                                            }}
                                         />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="testimony"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center">
                                        <PenSquare className="mr-2 h-5 w-5 text-muted-foreground" />
                                        Testemunho
                                    </FormLabel>
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
                            name="interactionTypes"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel>Tipos de Interação</FormLabel>
                                        <FormDescription>
                                            Selecione todas as opções que se aplicam.
                                        </FormDescription>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4 pt-2">
                                        {interactionTypesItems.map((item) => (
                                            <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="interactionTypes"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item.id}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(item.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...field.value, item.id])
                                                                            : field.onChange(
                                                                                field.value?.filter(
                                                                                    (value) => value !== item.id
                                                                                )
                                                                            )
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal flex items-center">
                                                                <item.icon className="mr-2 h-5 w-5 text-muted-foreground" />
                                                                {item.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="evangelismTools"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="flex items-center">
                                            <Wrench className="mr-2 h-5 w-5 text-muted-foreground" />
                                            Ferramentas de Evangelismo Usadas
                                        </FormLabel>
                                        <FormDescription>
                                            Selecione todas as ferramentas que você utilizou.
                                        </FormDescription>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                                        {evangelismToolsItems.map((item) => (
                                            <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="evangelismTools"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item.id}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(item.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...field.value, item.id])
                                                                            : field.onChange(
                                                                                field.value?.filter(
                                                                                    (value) => value !== item.id
                                                                                )
                                                                            )
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                {item.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="photo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center">
                                        <Camera className="mr-2 h-5 w-5 text-muted-foreground" />
                                        Foto (Opcional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                                    </FormControl>
                                    <FormDescription>
                                        Uma foto do momento ou do lugar. Se não for enviada, uma imagem será gerada por IA.
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

    