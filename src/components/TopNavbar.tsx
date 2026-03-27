import { useState, useRef, useEffect } from 'react';
import { Bell, GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { subscribeToUserNotifications } from '@/services/notificationService';
import { Notification } from '@/data/mockData';
import { cn } from '@/lib/utils';

export const TopNavbar = () => {
  const { userProfile } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userProfile?.uid) return;

    // Subscribe to real-time notifications
    const unsubscribe = subscribeToUserNotifications(userProfile.uid, setNotifications);
    return unsubscribe;
  }, [userProfile?.uid]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const userInitials = userProfile?.displayName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold text-foreground">FYP Manager</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-md hover:bg-secondary transition-colors"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-lg shadow-xl animate-fade-in overflow-hidden z-50">
              <div className="p-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground text-center">No notifications</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={cn(
                        'p-3 border-b border-border/50 hover:bg-secondary/50 transition-colors',
                        !n.read && 'bg-primary/5 border-l-2 border-l-primary'
                      )}
                    >
                      <p className="text-sm text-foreground">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{n.date}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold">
            {userInitials}
          </div>
          <span className="text-sm font-medium text-foreground hidden md:block">
            {userProfile?.displayName || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
};
