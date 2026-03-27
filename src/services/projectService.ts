import {
  collection,
  doc,
  addDoc,
  setDoc,
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
import { Project, ProjectStatus } from '@/data/mockData';

/**
 * Create a new project
 */
export const createProject = async (data: Omit<Project, 'id'>): Promise<string> => {
  try {
    const projectsRef = collection(db, 'projects');
    const docRef = await addDoc(projectsRef, {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to create project: ${(error as Error).message}`);
  }
};

/**
 * Get project by ID
 */
export const getProject = async (projectId: string): Promise<Project | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'projects', projectId));
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Project) : null;
  } catch (error) {
    throw new Error(`Failed to fetch project: ${(error as Error).message}`);
  }
};

/**
 * Get all projects with optional filters
 */
export const getAllProjects = async (filters?: {
  studentId?: string;
  supervisorId?: string;
  status?: ProjectStatus;
}): Promise<Project[]> => {
  try {
    const constraints: QueryConstraint[] = [];

    if (filters?.studentId) {
      constraints.push(where('studentId', '==', filters.studentId));
    }
    if (filters?.supervisorId) {
      constraints.push(where('supervisorId', '==', filters.supervisorId));
    }
    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }

    const q = query(collection(db, 'projects'), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
  } catch (error) {
    throw new Error(`Failed to fetch projects: ${(error as Error).message}`);
  }
};

/**
 * Update project
 */
export const updateProject = async (
  projectId: string,
  data: Partial<Project>
): Promise<void> => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error(`Failed to update project: ${(error as Error).message}`);
  }
};

/**
 * Delete project
 */
export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (error) {
    throw new Error(`Failed to delete project: ${(error as Error).message}`);
  }
};

/**
 * Subscribe to project updates in real-time
 */
export const subscribeToProject = (
  projectId: string,
  callback: (project: Project | null) => void
): (() => void) => {
  const unsubscribe = onSnapshot(doc(db, 'projects', projectId), (doc) => {
    callback(
      doc.exists()
        ? ({ id: doc.id, ...doc.data() } as Project)
        : null
    );
  });

  return unsubscribe;
};

/**
 * Subscribe to all projects with filters
 */
export const subscribeToProjects = (
  callback: (projects: Project[]) => void,
  filters?: {
    studentId?: string;
    supervisorId?: string;
    status?: ProjectStatus;
  }
): (() => void) => {
  const constraints: QueryConstraint[] = [];

  if (filters?.studentId) {
    constraints.push(where('studentId', '==', filters.studentId));
  }
  if (filters?.supervisorId) {
    constraints.push(where('supervisorId', '==', filters.supervisorId));
  }
  if (filters?.status) {
    constraints.push(where('status', '==', filters.status));
  }

  const q = query(collection(db, 'projects'), ...constraints);
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const projects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
    callback(projects);
  });

  return unsubscribe;
};
