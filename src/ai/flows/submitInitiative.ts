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
  evangelists: z.array(PersonSchema).min(1, "Adicione pelo menos um evangelista."),
  evangelized: z.array(PersonSchema).min(1, "Adicione pelo menos uma pessoa evangelizada."),
  testimony: z.string().min(20, { message: "O testemunho deve ter pelo menos 20 caracteres." }).max(500, { message: "O testemunho não pode exceder 500 caracteres."}),
  interactionTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Você precisa selecionar pelo menos um tipo de interação.",
  }),
  photo: z.instanceof(File).optional(),
});

export type InitiativeInput = z.infer<typeof InitiativeInputSchema>;

const PhotoGenerationInputSchema = z.object({
    testimony: z.string(),
    photoDataUri: z.string().optional().describe(
        "An optional photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

const PhotoGenerationOutputSchema = z.object({
    photoHint: z.string().describe("A short, two-word hint for an AI image generator based on the testimony and/or photo, like 'sorriso praia' or 'parque cidade'. Should be in Portuguese."),
});


const generatePhotoHint = ai.definePrompt({
    name: 'generatePhotoHint',
    input: { schema: PhotoGenerationInputSchema },
    output: { schema: PhotoGenerationOutputSchema },
    prompt: `Based on the following testimony (and photo, if provided), provide a two-word hint in Portuguese for an AI image generator to create a representative image.

Testimony: {{{testimony}}}
{{#if photoDataUri}}
Photo: {{media url=photoDataUri}}
{{/if}}
`,
});


const submitInitiativeFlow = ai.defineFlow(
  {
    name: 'submitInitiativeFlow',
    inputSchema: InitiativeInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    
    let photoUrl = '';
    let photoHint = 'abstrato moderno';
    let photoDataUri: string | undefined = undefined;

    if (input.photo) {
        // In a real app, we would upload this to a storage bucket.
        // For this demo, we'll convert it to a data URI to show in the testimony card
        // and pass to the hint generator.
        const arrayBuffer = await input.photo.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        photoDataUri = `data:${input.photo.type};base64,${buffer.toString('base64')}`;
        photoUrl = photoDataUri;
    }

    const { output } = await generatePhotoHint({
        testimony: input.testimony,
        photoDataUri: photoDataUri
    });
    
    if (output) {
        photoHint = output.photoHint;
    }
    
    // If no photo was uploaded, generate a placeholder URL.
    if (!photoUrl) {
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
