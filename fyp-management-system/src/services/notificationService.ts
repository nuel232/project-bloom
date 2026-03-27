import { db } from './firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';

const notificationsCollection = collection(db, 'notifications');

export const createNotification = async (notificationData) => {
    try {
        const docRef = await addDoc(notificationsCollection, notificationData);
        return { id: docRef.id, ...notificationData };
    } catch (error) {
        console.error("Error adding notification: ", error);
        throw error;
    }
};

export const updateNotification = async (id, notificationData) => {
    try {
        const notificationDoc = doc(db, 'notifications', id);
        await updateDoc(notificationDoc, notificationData);
    } catch (error) {
        console.error("Error updating notification: ", error);
        throw error;
    }
};

export const deleteNotification = async (id) => {
    try {
        const notificationDoc = doc(db, 'notifications', id);
        await deleteDoc(notificationDoc);
    } catch (error) {
        console.error("Error deleting notification: ", error);
        throw error;
    }
};

export const getNotifications = (callback) => {
    return onSnapshot(notificationsCollection, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(notifications);
    });
};