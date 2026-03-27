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
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import { Standup } from '@/data/mockData';

/**
 * Create a standup entry
 */
export const createStandup = async (data: Omit<Standup, 'id'>): Promise<string> => {
  try {
    const standupsRef = collection(db, 'standups');
    const docRef = await addDoc(standupsRef, {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to create standup: ${(error as Error).message}`);
  }
};

/**
 * Get standup by ID
 */
export const getStandup = async (standupId: string): Promise<Standup | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'standups', standupId));
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Standup) : null;
  } catch (error) {
    throw new Error(`Failed to fetch standup: ${(error as Error).message}`);
  }
};

/**
 * Get all standups for a student
 */
export const getStudentStandups = async (studentId: string): Promise<Standup[]> => {
  try {
    const q = query(
      collection(db, 'standups'),
      where('studentId', '==', studentId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Standup[];
  } catch (error) {
    throw new Error(`Failed to fetch standups: ${(error as Error).message}`);
  }
};

/**
 * Get latest standup for a student
 */
export const getLatestStudentStandup = async (studentId: string): Promise<Standup | null> => {
  try {
    const q = query(
      collection(db, 'standups'),
      where('studentId', '==', studentId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;
    return docs.length > 0 ? ({ id: docs[0].id, ...docs[0].data() } as Standup) : null;
  } catch (error) {
    throw new Error(`Failed to fetch latest standup: ${(error as Error).message}`);
  }
};

/**
 * Get latest standups across all students (for supervisor dashboard)
 */
export const getLatestStandups = async (limit: number = 10): Promise<Standup[]> => {
  try {
    const q = query(
      collection(db, 'standups'),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .slice(0, limit)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Standup[];
  } catch (error) {
    throw new Error(`Failed to fetch latest standups: ${(error as Error).message}`);
  }
};

/**
 * Update standup
 */
export const updateStandup = async (
  standupId: string,
  data: Partial<Standup>
): Promise<void> => {
  try {
    const standupRef = doc(db, 'standups', standupId);
    await updateDoc(standupRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error(`Failed to update standup: ${(error as Error).message}`);
  }
};

/**
 * Delete standup
 */
export const deleteStandup = async (standupId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'standups', standupId));
  } catch (error) {
    throw new Error(`Failed to delete standup: ${(error as Error).message}`);
  }
};

/**
 * Subscribe to student standups with real-time updates
 */
export const subscribeToStudentStandups = (
  studentId: string,
  callback: (standups: Standup[]) => void
): (() => void) => {
  const q = query(
    collection(db, 'standups'),
    where('studentId', '==', studentId),
    orderBy('date', 'desc')
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const standups = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Standup[];
    callback(standups);
  });

  return unsubscribe;
};

/**
 * Subscribe to latest standups (for supervisor dashboard)
 */
export const subscribeToLatestStandups = (
  callback: (standups: Standup[]) => void,
  limitCount: number = 10
): (() => void) => {
  const q = query(
    collection(db, 'standups'),
    orderBy('date', 'desc')
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const standups = querySnapshot.docs
      .slice(0, limitCount)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Standup[];
    callback(standups);
  });

  return unsubscribe;
};

/**
 * Check if student submitted standup this week
 */
export const hasStudentSubmittedThisWeek = async (studentId: string): Promise<boolean> => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, 'standups'),
      where('studentId', '==', studentId),
      where('date', '>=', startOfWeek.toISOString())
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size > 0;
  } catch (error) {
    throw new Error(`Failed to check standup submission: ${(error as Error).message}`);
  }
};
