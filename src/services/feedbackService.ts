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
} from 'firebase/firestore';
import { db } from './firebase';
import { Feedback } from '@/data/mockData';

/**
 * Create feedback for a submission
 */
export const createFeedback = async (data: Omit<Feedback, 'id'>): Promise<string> => {
  try {
    const feedbacksRef = collection(db, 'feedbacks');
    const docRef = await addDoc(feedbacksRef, {
      ...data,
      createdAt: new Date().toISOString(),
    });

    // Mark submission as reviewed
    if (data.submissionId) {
      const submissionRef = doc(db, 'submissions', data.submissionId);
      await updateDoc(submissionRef, {
        status: 'reviewed',
        feedback: data.comment,
        feedbackDate: new Date().toISOString(),
        feedbackBy: data.supervisorId,
        updatedAt: new Date().toISOString(),
      });
    }

    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to create feedback: ${(error as Error).message}`);
  }
};

/**
 * Get feedback by ID
 */
export const getFeedback = async (feedbackId: string): Promise<Feedback | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'feedbacks', feedbackId));
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Feedback) : null;
  } catch (error) {
    throw new Error(`Failed to fetch feedback: ${(error as Error).message}`);
  }
};

/**
 * Get all feedback for a student
 */
export const getStudentFeedback = async (studentId: string): Promise<Feedback[]> => {
  try {
    const q = query(collection(db, 'feedbacks'), where('studentId', '==', studentId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Feedback[];
  } catch (error) {
    throw new Error(`Failed to fetch feedback: ${(error as Error).message}`);
  }
};

/**
 * Get feedback for a specific submission
 */
export const getSubmissionFeedback = async (submissionId: string): Promise<Feedback[]> => {
  try {
    const q = query(
      collection(db, 'feedbacks'),
      where('submissionId', '==', submissionId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Feedback[];
  } catch (error) {
    throw new Error(`Failed to fetch feedback: ${(error as Error).message}`);
  }
};

/**
 * Get feedback given by a supervisor
 */
export const getSupervisorFeedback = async (supervisorId: string): Promise<Feedback[]> => {
  try {
    const q = query(
      collection(db, 'feedbacks'),
      where('supervisorId', '==', supervisorId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Feedback[];
  } catch (error) {
    throw new Error(`Failed to fetch feedback: ${(error as Error).message}`);
  }
};

/**
 * Update feedback
 */
export const updateFeedback = async (
  feedbackId: string,
  data: Partial<Feedback>
): Promise<void> => {
  try {
    const feedbackRef = doc(db, 'feedbacks', feedbackId);
    await updateDoc(feedbackRef, data);
  } catch (error) {
    throw new Error(`Failed to update feedback: ${(error as Error).message}`);
  }
};

/**
 * Mark feedback as read
 */
export const markFeedbackAsRead = async (feedbackId: string): Promise<void> => {
  try {
    const feedbackRef = doc(db, 'feedbacks', feedbackId);
    await updateDoc(feedbackRef, { read: true });
  } catch (error) {
    throw new Error(`Failed to mark feedback as read: ${(error as Error).message}`);
  }
};

/**
 * Delete feedback
 */
export const deleteFeedback = async (feedbackId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'feedbacks', feedbackId));
  } catch (error) {
    throw new Error(`Failed to delete feedback: ${(error as Error).message}`);
  }
};

/**
 * Subscribe to student feedback
 */
export const subscribeToStudentFeedback = (
  studentId: string,
  callback: (feedbacks: Feedback[]) => void
): (() => void) => {
  const q = query(collection(db, 'feedbacks'), where('studentId', '==', studentId));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const feedbacks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Feedback[];
    callback(feedbacks);
  });

  return unsubscribe;
};

/**
 * Get unread feedback count for a student
 */
export const getUnreadFeedbackCount = async (studentId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, 'feedbacks'),
      where('studentId', '==', studentId),
      where('read', '==', false)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    throw new Error(`Failed to fetch unread feedback count: ${(error as Error).message}`);
  }
};
