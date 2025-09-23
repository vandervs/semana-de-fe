
'use server';
/**
 * @fileOverview A flow to handle initiative submissions.
 *
 * - submitInitiative - A function that handles the initiative submission process.
 * - InitiativeInput - The input type for the submitInitiative function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { addInitiative } from '@/lib/data';
import type { Initiative } from '@/lib/definitions';

const PersonSchema = z.object({
    name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
    contact: z.string().optional(),
});

const InitiativeInputSchema = z.object({
  locationName: z.string().min(3, { message: "Selecione uma localização no mapa." }),
  latitude: z.number(),
  longitude: z.number(),
  evangelists: z.array(PersonSchema).min(1, "Adicione pelo menos um participante."),
  evangelized: z.array(PersonSchema).min(1, "Adicione pelo menos uma pessoa evangelizada."),
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

export type InitiativeInput = z.infer<typeof InitiativeInputSchema>;

const submitInitiativeFlow = ai.defineFlow(
  {
    name: 'submitInitiativeFlow',
    inputSchema: InitiativeInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    
    let photoUrl = '';
    // Use a generic hint since we are no longer processing the image with AI.
    let photoHint = 'encontro pessoas';

    if (input.photo) {
        // In a real app, we would upload this to a storage bucket.
        // For this demo, we'll convert it to a data URI to show in the testimony card.
        const arrayBuffer = await input.photo.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        photoUrl = `data:${input.photo.type};base64,${buffer.toString('base64')}`;
    } else {
        // If no photo was uploaded, generate a random placeholder URL.
        const seed = Math.floor(Math.random() * 1000) + 1;
        photoUrl = `https://picsum.photos/seed/ev${seed}/600/400`;
    }

    const newInitiative: Omit<Initiative, 'id'> = {
        ...input,
        date: new Date().toISOString().split('T')[0],
        interactionTypes: input.interactionTypes as any,
        photoUrl,
        photoHint,
    };
    
    await addInitiative(newInitiative);
  }
);


export async function submitInitiative(input: InitiativeInput): Promise<void> {
    await submitInitiativeFlow(input);
}

    