import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const standupCollection = collection(db, 'standups');

export const createStandup = async (standupData) => {
    try {
        const docRef = await addDoc(standupCollection, standupData);
        return { id: docRef.id, ...standupData };
    } catch (error) {
        console.error("Error creating standup: ", error);
        throw error;
    }
};

export const getStandups = async () => {
    try {
        const standupSnapshot = await getDocs(standupCollection);
        return standupSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching standups: ", error);
        throw error;
    }
};

export const updateStandup = async (id, updatedData) => {
    try {
        const standupDoc = doc(db, 'standups', id);
        await updateDoc(standupDoc, updatedData);
    } catch (error) {
        console.error("Error updating standup: ", error);
        throw error;
    }
};

export const deleteStandup = async (id) => {
    try {
        const standupDoc = doc(db, 'standups', id);
        await deleteDoc(standupDoc);
    } catch (error) {
        console.error("Error deleting standup: ", error);
        throw error;
    }
};