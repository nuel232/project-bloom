import { useAuth } from '@/hooks/useAuth';
import { logoutUser } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export const RoleSwitcher = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      title="Logout"
    >
      <LogOut className="h-3.5 w-3.5" />
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </button>
  );
};
