import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const feedbackCollection = collection(db, 'feedback');

export const createFeedback = async (feedbackData) => {
    try {
        const docRef = await addDoc(feedbackCollection, feedbackData);
        return { id: docRef.id, ...feedbackData };
    } catch (error) {
        console.error('Error adding feedback: ', error);
        throw new Error('Could not create feedback');
    }
};

export const getFeedback = async () => {
    try {
        const feedbackSnapshot = await getDocs(feedbackCollection);
        return feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching feedback: ', error);
        throw new Error('Could not fetch feedback');
    }
};

export const updateFeedback = async (id, updatedData) => {
    try {
        const feedbackDoc = doc(db, 'feedback', id);
        await updateDoc(feedbackDoc, updatedData);
    } catch (error) {
        console.error('Error updating feedback: ', error);
        throw new Error('Could not update feedback');
    }
};

export const deleteFeedback = async (id) => {
    try {
        const feedbackDoc = doc(db, 'feedback', id);
        await deleteDoc(feedbackDoc);
    } catch (error) {
        console.error('Error deleting feedback: ', error);
        throw new Error('Could not delete feedback');
    }
};