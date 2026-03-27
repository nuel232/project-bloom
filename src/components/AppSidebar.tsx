import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, FileText, Upload, MessageSquare, MessageCircle,
  Users, CheckSquare, ClipboardList, BarChart3, FolderOpen,
  User, X, Menu
} from 'lucide-react';
import { useState } from 'react';

const navConfig = {
  student: [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Proposal', path: '/student/proposal', icon: FileText },
    { label: 'Submissions', path: '/student/submissions', icon: Upload },
    { label: 'Standup', path: '/student/standup', icon: MessageSquare },
    { label: 'Feedback', path: '/student/feedback', icon: MessageCircle },
    { label: 'Profile', path: '/profile', icon: User },
  ],
  supervisor: [
    { label: 'Dashboard', path: '/supervisor/dashboard', icon: LayoutDashboard },
    { label: 'My Students', path: '/supervisor/students', icon: Users },
    { label: 'Proposals', path: '/supervisor/proposals', icon: CheckSquare },
    { label: 'Submissions', path: '/supervisor/submissions', icon: ClipboardList },
    { label: 'Profile', path: '/profile', icon: User },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Projects', path: '/admin/projects', icon: FolderOpen },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Profile', path: '/profile', icon: User },
  ],
};

export const AppSidebar = () => {
  const { role } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = navConfig[role as keyof typeof navConfig] || [];

  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
        {role === 'student' ? 'Student' : role === 'supervisor' ? 'Supervisor' : 'Admin'} Menu
      </p>
      {items.map(item => {
        const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              active
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-3 left-14 z-50 p-1.5 rounded-md bg-card border border-border"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-60 h-full bg-sidebar border-r border-sidebar-border animate-slide-in">
            <div className="flex items-center justify-between p-3 border-b border-sidebar-border">
              <span className="text-sm font-semibold text-foreground">Menu</span>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 flex-col bg-sidebar border-r border-sidebar-border min-h-screen shrink-0">
        {nav}
      </aside>
    </>
  );
};
