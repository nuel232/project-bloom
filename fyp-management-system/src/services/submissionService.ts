import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const submissionsCollection = collection(db, 'submissions');

export const createSubmission = async (submissionData) => {
    try {
        const docRef = await addDoc(submissionsCollection, submissionData);
        return { id: docRef.id, ...submissionData };
    } catch (error) {
        console.error("Error creating submission: ", error);
        throw new Error("Failed to create submission");
    }
};

export const getSubmissions = async () => {
    try {
        const querySnapshot = await getDocs(submissionsCollection);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching submissions: ", error);
        throw new Error("Failed to fetch submissions");
    }
};

export const updateSubmission = async (id, updatedData) => {
    try {
        const submissionDoc = doc(db, 'submissions', id);
        await updateDoc(submissionDoc, updatedData);
    } catch (error) {
        console.error("Error updating submission: ", error);
        throw new Error("Failed to update submission");
    }
};

export const deleteSubmission = async (id) => {
    try {
        const submissionDoc = doc(db, 'submissions', id);
        await deleteDoc(submissionDoc);
    } catch (error) {
        console.error("Error deleting submission: ", error);
        throw new Error("Failed to delete submission");
    }
};