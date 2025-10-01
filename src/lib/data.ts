import type { Initiative } from './definitions';
import { db } from './firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';

export async function getInitiatives(): Promise<Initiative[]> {
    const initiativesCol = collection(db, 'initiatives');
    const q = query(initiativesCol, orderBy('createdAt', 'desc'));
    const initiativeSnapshot = await getDocs(q);
    const initiativeList = initiativeSnapshot.docs.map(doc => {
        const data = doc.data();
        
        let createdAtStr: string | null = null;
        if (data.createdAt && data.createdAt instanceof Timestamp) {
            createdAtStr = data.createdAt.toDate().toISOString();
        }

        return {
            id: doc.id,
            locationName: data.locationName,
            latitude: data.latitude,
            longitude: data.longitude,
            evangelists: data.evangelists,
            evangelized: data.evangelized,
            testimony: data.testimony,
            interactionTypes: data.interactionTypes,
            university: data.university,
            evangelismTools: data.evangelismTools,
            date: data.date, 
            photoUrl: data.photoUrl || '',
            photoHint: data.photoHint || '',
            createdAt: createdAtStr,
        } as Initiative;
    });
    return initiativeList;
}

export async function addInitiative(initiative: Omit<Initiative, 'id'>) {
    try {
        const initiativesCol = collection(db, 'initiatives');
        // The 'initiative' object from the flow now correctly contains the photoUrl.
        // We pass the whole object to be saved.
        await addDoc(initiativesCol, {
            ...initiative,
            createdAt: serverTimestamp()
        });
        console.log("Initiative added to Firestore with data:", initiative);
    } catch (error) {
        console.error("Error adding initiative to Firestore: ", error);
        throw new Error("Could not add initiative to database.");
    }
}
