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
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
  photo: z.any().optional(),
});

export type InitiativeInput = z.infer<typeof InitiativeInputSchema>;

const PhotoGenerationInputSchema = z.object({
    testimony: z.string(),
});

const PhotoGenerationOutputSchema = z.object({
    photoHint: z.string().describe("A short, two-word hint for an AI image generator based on the testimony, like 'sorriso praia' or 'parque cidade'."),
});


const generatePhotoHint = ai.definePrompt({
    name: 'generatePhotoHint',
    input: { schema: PhotoGenerationInputSchema },
    output: { schema: PhotoGenerationOutputSchema },
    prompt: `Based on the following testimony, provide a two-word hint for an AI image generator to create a representative image. The hint should be in Portuguese.

Testimony: {{{testimony}}}
`,
});


const submitInitiativeFlow = ai.defineFlow(
  {
    name: 'submitInitiativeFlow',
    inputSchema: InitiativeInputSchema,
    outputSchema: z.custom<Initiative>(),
  },
  async (input) => {
    const newId = Date.now().toString();

    let photoUrl = '';
    let photoHint = 'abstrato moderno';

    if (input.photo && input.photo.length > 0) {
        // In a real app, you would upload the file to a storage bucket
        // and get a public URL. For now, we'll find a random placeholder.
        const randomIndex = Math.floor(Math.random() * PlaceHolderImages.length);
        const randomImage = PlaceHolderImages[randomIndex];
        photoUrl = randomImage.imageUrl;
        photoHint = randomImage.imageHint;
    } else {
         const { output } = await generatePhotoHint({testimony: input.testimony});
        if (output) {
            photoHint = output.photoHint;
        }
       
        const seed = Math.floor(Math.random() * 1000) + 1;
        photoUrl = `https://picsum.photos/seed/ev${seed}/600/400`;
    }

    const newInitiative: Initiative = {
        ...input,
        id: newId,
        date: new Date().toISOString().split('T')[0],
        interactionTypes: input.interactionTypes as any,
        photoUrl,
        photoHint,
    };
    
    addInitiative(newInitiative);

    return newInitiative;
  }
);


export async function submitInitiative(input: InitiativeInput): Promise<Initiative> {
    return await submitInitiativeFlow(input);
}
