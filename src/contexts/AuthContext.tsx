import React, { createContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { getUserProfile, UserProfile } from '@/services/authService';
import { Role } from '@/data/mockData';

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  role: Role | null;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          const profile = await getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
        } else {
          setUser(null);
          setUserProfile(null);
        }
        setError(null);
      } catch (err) {
        setError((err as Error).message);
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    role: userProfile?.role || null,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
