import { useRole } from '@/contexts/RoleContext';
import { Role } from '@/data/mockData';
import { RefreshCw } from 'lucide-react';

const roleLabels: Record<Role, string> = {
  student: 'Student',
  supervisor: 'Supervisor',
  admin: 'Admin',
};

const roles: Role[] = ['student', 'supervisor', 'admin'];

export const RoleSwitcher = () => {
  const { role, setRole } = useRole();

  const nextRole = () => {
    const idx = roles.indexOf(role);
    const next = roles[(idx + 1) % roles.length];
    setRole(next);
  };

  return (
    <button
      onClick={nextRole}
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg hover:opacity-90 transition-opacity"
      title="Switch role"
    >
      <RefreshCw className="h-3.5 w-3.5" />
      {roleLabels[role]}
    </button>
  );
};
