
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
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

// Securely initialize Firebase Admin SDK for Vercel environment
if (!admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (!privateKey) {
            throw new Error("FIREBASE_PRIVATE_KEY environment variable is not set.");
        }
        if (!process.env.FIREBASE_CLIENT_EMAIL) {
            throw new Error("FIREBASE_CLIENT_EMAIL environment variable is not set.");
        }
        if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
            throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is not set.");
        }


        admin.initializeApp({
            credential: admin.credential.cert({
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey,
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            }),
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
        console.log("Firebase Admin SDK initialized successfully.");
    } catch (error) {
        console.error("Error initializing Firebase Admin SDK:", error);
        // We throw the error to ensure build fails if config is wrong.
        throw new Error("Could not initialize Firebase Admin SDK. Please check server environment variables.");
    }
}


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
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
        console.error('Firebase Storage bucket name is not configured.');
        throw new Error('Firebase Storage bucket name is not configured.');
    }
    const bucket = admin.storage().bucket(bucketName);
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
    
    let photoUrlValue = '';
    
    if (input.photo) {
        try {
            photoUrlValue = await uploadImageToStorage(input.photo, 'initiatives');
            console.log('Image uploaded successfully:', photoUrlValue);
        } catch (error) {
            console.error('Failed to upload image:', error);
            // Don't re-throw, allow submission without image
            photoUrlValue = '';
        }
    }
    
    const newInitiative: Omit<Initiative, 'id'> = {
        locationName: input.locationName,
        latitude: input.latitude,
        longitude: input.longitude,
        evangelists: input.evangelists,
        evangelized: input.evangelized,
        testimony: input.testimony,
        interactionTypes: input.interactionTypes as any,
        university: input.university,
        evangelismTools: input.evangelismTools,
        date: new Date().toISOString().split('T')[0],
        photoUrl: photoUrlValue, // Use the uploaded image URL
        photoHint: 'encontro pessoas', // Generic hint for now
    };
    
    await addInitiative(newInitiative);
  }
);


export async function submitInitiative(input: InitiativeInput): Promise<void> {
    await submitInitiativeFlow(input);
}
