
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

export async function addInitiative(initiative: Omit<Initiative, 'id'>) {
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

export async function incrementTaskCount(taskId: string): Promise<void> {
  const taskRef = doc(db, 'task_engagement', taskId);

  try {
    await runTransaction(db, async (transaction) => {
      const taskDoc = await transaction.get(taskRef);
      if (!taskDoc.exists()) {
        transaction.set(taskRef, { count: 1 });
      } else {
        const newCount = (taskDoc.data().count || 0) + 1;
        transaction.update(taskRef, { count: newCount });
      }
    });
  } catch (e) {
    console.error("Transaction failed: ", e);
    throw new Error("Could not update task count.");
  }
}

export async function getTaskCounts(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    const q = query(collection(db, "task_engagement"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        counts[doc.id] = doc.data().count;
    });
    return counts;
}
