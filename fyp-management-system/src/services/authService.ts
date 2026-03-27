import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export const login = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const register = async (email: string, password: string, role: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Here you can save the role to Firestore or another database
        return userCredential.user;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw new Error(error.message);
    }
};