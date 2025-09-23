
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
import { adminStorage } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

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
  photo: z.string().optional(),
  university: z.string().min(2, { message: "Por favor, insira o nome da universidade." }),
  evangelismTools: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Você precisa selecionar pelo menos uma ferramenta.",
  }),
});

export type InitiativeInput = z.infer<typeof InitiativeInputSchema>;

async function uploadImageToStorage(photoDataUri: string, folder: string): Promise<string> {
    const bucket = adminStorage().bucket();
    const uniqueFilename = `${uuidv4()}.jpg`;
    const filePath = `${folder}/${uniqueFilename}`;
    const file = bucket.file(filePath);

    // Extract the base64 part of the data URI
    const base64EncodedImageString = photoDataUri.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');

    // Define content type
    const contentType = photoDataUri.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';
    
    // Upload the file
    await file.save(imageBuffer, {
        metadata: {
            contentType: contentType,
        },
        public: true, // Make the file publicly accessible
    });

    // Return the public URL
    return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
}


const submitInitiativeFlow = ai.defineFlow(
  {
    name: 'submitInitiativeFlow',
    inputSchema: InitiativeInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    
    let photoUrl = '';
    
    if (input.photo) {
        try {
            photoUrl = await uploadImageToStorage(input.photo, 'initiatives');
            console.log('Image uploaded successfully:', photoUrl);
        } catch (error) {
            console.error('Failed to upload image:', error);
            // Fallback to a placeholder if upload fails
            const seed = Math.floor(Math.random() * 1000) + 1;
            photoUrl = `https://picsum.photos/seed/err${seed}/600/400`;
        }
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
        photoHint: 'encontro pessoas', // Generic hint for now
    };
    
    await addInitiative(newInitiative);
  }
);


export async function submitInitiative(input: InitiativeInput): Promise<void> {
    await submitInitiativeFlow(input);
}
