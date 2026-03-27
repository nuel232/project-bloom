import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const projectsCollection = collection(db, 'projects');

export const createProject = async (projectData) => {
    try {
        const docRef = await addDoc(projectsCollection, projectData);
        return { id: docRef.id, ...projectData };
    } catch (error) {
        console.error("Error adding project: ", error);
        throw new Error("Could not create project");
    }
};

export const getProjects = async () => {
    try {
        const querySnapshot = await getDocs(projectsCollection);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching projects: ", error);
        throw new Error("Could not fetch projects");
    }
};

export const updateProject = async (projectId, updatedData) => {
    const projectDoc = doc(db, 'projects', projectId);
    try {
        await updateDoc(projectDoc, updatedData);
        return { id: projectId, ...updatedData };
    } catch (error) {
        console.error("Error updating project: ", error);
        throw new Error("Could not update project");
    }
};

export const deleteProject = async (projectId) => {
    const projectDoc = doc(db, 'projects', projectId);
    try {
        await deleteDoc(projectDoc);
    } catch (error) {
        console.error("Error deleting project: ", error);
        throw new Error("Could not delete project");
    }
};