import type { Initiative } from './definitions';
import { db } from './firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

export async function getInitiatives(): Promise<Initiative[]> {
    const initiativesCol = collection(db, 'initiatives');
    const q = query(initiativesCol, orderBy('createdAt', 'desc'));
    const initiativeSnapshot = await getDocs(q);
    const initiativeList = initiativeSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            date: data.date, 
        } as Initiative;
    });
    return initiativeList;
}

export async function addInitiative(initiative: Omit<Initiative, 'id' | 'createdAt'>) {
    try {
        const initiativesCol = collection(db, 'initiatives');
        await addDoc(initiativesCol, {
            ...initiative,
            createdAt: serverTimestamp()
        });
        console.log("Initiative added to Firestore");
    } catch (error) {
        console.error("Error adding initiative to Firestore: ", error);
        throw new Error("Could not add initiative to database.");
    }
}
