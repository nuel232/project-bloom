import React, { createContext, useContext, useState } from 'react';
import { Role, currentUsers } from '@/data/mockData';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  currentUser: typeof currentUsers.student;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('student');

  const currentUser = currentUsers[role];

  return (
    <RoleContext.Provider value={{ role, setRole, currentUser }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be inside RoleProvider');
  return ctx;
};
