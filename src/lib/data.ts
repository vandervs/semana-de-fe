
import type { Initiative } from './definitions';
import { db } from './firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, Timestamp, doc, runTransaction, getDoc } from 'firebase/firestore';

export async function getInitiatives(): Promise<Initiative[]> {
    const initiativesCol = collection(db, 'initiatives');
    const q = query(initiativesCol, orderBy('createdAt', 'desc'));
    const initiativeSnapshot = await getDocs(q);
    const initiativeList = initiativeSnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Safely convert timestamp
        const createdAt = data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate().toISOString() 
            : new Date().toISOString();

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
            createdAt: createdAt,
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
    } catch (error) {
        console.error("Error adding initiative to Firestore: ", error);
        throw new Error("Could not add initiative to database.");
    }
}

export async function getTaskCounts(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    try {
        const snapshot = await getDocs(collection(db, 'task_counts'));
        snapshot.forEach(doc => {
            counts[doc.id] = doc.data().count || 0;
        });
    } catch (error) {
        console.error("Error getting task counts:", error);
    }
    return counts;
}

export async function updateTaskCount(taskId: string, increment: number): Promise<void> {
  const taskDocRef = doc(db, 'task_counts', taskId);

  try {
    await runTransaction(db, async (transaction) => {
      const taskDoc = await transaction.get(taskDocRef);
      
      if (!taskDoc.exists()) {
        // If doc doesn't exist, create it. Only set to 1 if increment is positive.
        transaction.set(taskDocRef, { count: increment > 0 ? 1 : 0 });
      } else {
        const newCount = (taskDoc.data().count || 0) + increment;
        transaction.update(taskDocRef, { count: Math.max(0, newCount) }); // Ensure count doesn't go below 0
      }
    });
  } catch (e) {
    console.error("Transaction failed: ", e);
  }
}
