import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  limit,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import { Notification } from '@/data/mockData';

/**
 * Create a notification
 */
export const createNotification = async (
  data: Omit<Notification, 'id'>
): Promise<string> => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const docRef = await addDoc(notificationsRef, {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to create notification: ${(error as Error).message}`);
  }
};

/**
 * Get notification by ID
 */
export const getNotification = async (notificationId: string): Promise<Notification | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'notifications', notificationId));
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Notification) : null;
  } catch (error) {
    throw new Error(`Failed to fetch notification: ${(error as Error).message}`);
  }
};

/**
 * Get all notifications for a user
 */
export const getUserNotifications = async (
  userId: string,
  options?: { limit?: number; unreadOnly?: boolean }
): Promise<Notification[]> => {
  try {
    const constraints: QueryConstraint[] = [where('userId', '==', userId)];

    if (options?.unreadOnly) {
      constraints.push(where('read', '==', false));
    }

    constraints.push(orderBy('date', 'desc'));

    if (options?.limit) {
      constraints.push(limit(options.limit));
    }

    const q = query(collection(db, 'notifications'), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Notification[];
  } catch (error) {
    throw new Error(`Failed to fetch notifications: ${(error as Error).message}`);
  }
};

/**
 * Get unread notification count for a user
 */
export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    throw new Error(`Failed to fetch unread notification count: ${(error as Error).message}`);
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, { read: true });
  } catch (error) {
    throw new Error(`Failed to mark notification as read: ${(error as Error).message}`);
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    const querySnapshot = await getDocs(q);

    for (const docSnap of querySnapshot.docs) {
      await updateDoc(doc(db, 'notifications', docSnap.id), { read: true });
    }
  } catch (error) {
    throw new Error(`Failed to mark all notifications as read: ${(error as Error).message}`);
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'notifications', notificationId));
  } catch (error) {
    throw new Error(`Failed to delete notification: ${(error as Error).message}`);
  }
};

/**
 * Subscribe to user notifications with real-time updates
 */
export const subscribeToUserNotifications = (
  userId: string,
  callback: (notifications: Notification[]) => void
): (() => void) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const notifications = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Notification[];
    callback(notifications);
  });

  return unsubscribe;
};

/**
 * Subscribe to unread notification count for real-time updates
 */
export const subscribeToUnreadNotificationCount = (
  userId: string,
  callback: (count: number) => void
): (() => void) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    callback(querySnapshot.size);
  });

  return unsubscribe;
};
