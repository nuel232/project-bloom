import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Role } from '@/data/mockData';

export interface AuthUser extends User {
  role?: Role;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  department?: string;
  matricNumber?: string;
  staffId?: string;
  photoURL?: string;
  createdAt: string;
}

/**
 * Register a new user with email, password, and role
 */
export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  role: Role,
  additionalData?: Partial<UserProfile>
): Promise<UserProfile> => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, { displayName });

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName,
      role,
      createdAt: new Date().toISOString(),
      ...additionalData,
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return userProfile;
  } catch (error) {
    throw new Error(`Registration failed: ${(error as Error).message}`);
  }
};

/**
 * Login user with email and password
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<UserProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user profile from Firestore
    const docSnap = await getDoc(doc(db, 'users', user.uid));
    if (!docSnap.exists()) {
      throw new Error('User profile not found');
    }

    return docSnap.data() as UserProfile;
  } catch (error) {
    throw new Error(`Login failed: ${(error as Error).message}`);
  }
};

/**
 * Logout current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(`Logout failed: ${(error as Error).message}`);
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'users', uid));
    return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
  } catch (error) {
    throw new Error(`Failed to fetch user profile: ${(error as Error).message}`);
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, data, { merge: true });

    // Update Firebase Auth profile if display name or photo changed
    const currentUser = auth.currentUser;
    if (currentUser) {
      const updateData: { displayName?: string; photoURL?: string } = {};
      if (data.displayName) updateData.displayName = data.displayName;
      if (data.photoURL) updateData.photoURL = data.photoURL;
      if (Object.keys(updateData).length > 0) {
        await updateProfile(currentUser, updateData);
      }
    }
  } catch (error) {
    throw new Error(`Failed to update user profile: ${(error as Error).message}`);
  }
};

/**
 * Seed test accounts (run once)
 */
export const seedTestAccounts = async (): Promise<void> => {
  const testAccounts = [
    {
      email: 'admin@test.com',
      password: 'password123',
      name: 'Admin User',
      role: 'admin' as Role,
    },
    {
      email: 'supervisor@test.com',
      password: 'password123',
      name: 'Dr. Chukwuemeka Obi',
      role: 'supervisor' as Role,
      department: 'Software Engineering',
      staffId: 'SE/001',
    },
    {
      email: 'student@test.com',
      password: 'password123',
      name: 'Adaeze Okonkwo',
      role: 'student' as Role,
      department: 'Computer Science',
      matricNumber: 'CS/2021/001',
    },
  ];

  for (const account of testAccounts) {
    try {
      // Check if user already exists
      const existingUser = await getUserProfile(
        (await signInWithEmailAndPassword(auth, account.email, account.password)).user.uid
      ).catch(() => null);

      if (!existingUser) {
        await registerUser(
          account.email,
          account.password,
          account.name,
          account.role,
          {
            department: account.department,
            staffId: account.staffId,
            matricNumber: account.matricNumber,
          }
        );
      }
    } catch (error) {
      // User might already exist, continue
      console.log(`Account ${account.email} already exists or error occurred`);
    }
  }
};
