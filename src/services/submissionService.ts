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
  Query,
  QueryConstraint,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { Submission, SubmissionStatus } from '@/data/mockData';
import { uploadFile } from './supabase';

/**
 * Create a new submission
 */
export const createSubmission = async (
  data: Omit<Submission, 'id'>,
  file?: File
): Promise<string> => {
  try {
    let fileUrl: string | undefined;

    // Upload file to Supabase Storage if provided
    if (file) {
      fileUrl = await uploadFile(file, data.studentId);
    }

    const submissionsRef = collection(db, 'submissions');
    const docRef = await addDoc(submissionsRef, {
      ...data,
      fileUrl,
      fileName: file?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to create submission: ${(error as Error).message}`);
  }
};

/**
 * Get submission by ID
 */
export const getSubmission = async (submissionId: string): Promise<Submission | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'submissions', submissionId));
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Submission) : null;
  } catch (error) {
    throw new Error(`Failed to fetch submission: ${(error as Error).message}`);
  }
};

/**
 * Get submissions by student ID
 */
export const getStudentSubmissions = async (studentId: string): Promise<Submission[]> => {
  try {
    const q = query(collection(db, 'submissions'), where('studentId', '==', studentId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Submission[];
  } catch (error) {
    throw new Error(`Failed to fetch submissions: ${(error as Error).message}`);
  }
};

/**
 * Get submissions by project ID
 */
export const getProjectSubmissions = async (projectId: string): Promise<Submission[]> => {
  try {
    const q = query(collection(db, 'submissions'), where('projectId', '==', projectId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Submission[];
  } catch (error) {
    throw new Error(`Failed to fetch submissions: ${(error as Error).message}`);
  }
};

/**
 * Get pending submissions (for supervisors to review)
 */
export const getPendingSubmissions = async (supervisorId?: string): Promise<Submission[]> => {
  try {
    const constraints: QueryConstraint[] = [
      where('status', '==', 'pending_review'),
    ];

    if (supervisorId) {
      constraints.push(where('supervisorId', '==', supervisorId));
    }

    const q = query(collection(db, 'submissions'), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Submission[];
  } catch (error) {
    throw new Error(`Failed to fetch pending submissions: ${(error as Error).message}`);
  }
};

/**
 * Update submission
 */
export const updateSubmission = async (
  submissionId: string,
  data: Partial<Submission>
): Promise<void> => {
  try {
    const submissionRef = doc(db, 'submissions', submissionId);
    await updateDoc(submissionRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error(`Failed to update submission: ${(error as Error).message}`);
  }
};

/**
 * Delete submission
 */
export const deleteSubmission = async (submissionId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'submissions', submissionId));
  } catch (error) {
    throw new Error(`Failed to delete submission: ${(error as Error).message}`);
  }
};

/**
 * Subscribe to student submissions
 */
export const subscribeToStudentSubmissions = (
  studentId: string,
  callback: (submissions: Submission[]) => void
): (() => void) => {
  const q = query(collection(db, 'submissions'), where('studentId', '==', studentId));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const submissions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Submission[];
    callback(submissions);
  });

  return unsubscribe;
};

/**
 * Subscribe to pending submissions
 */
export const subscribeToPendingSubmissions = (
  callback: (submissions: Submission[]) => void
): (() => void) => {
  const q = query(collection(db, 'submissions'), where('status', '==', 'pending_review'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const submissions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Submission[];
    callback(submissions);
  });

  return unsubscribe;
};
