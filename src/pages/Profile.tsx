import { useState } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { toast } from 'sonner';
import { User, Save } from 'lucide-react';

const Profile = () => {
  const { currentUser } = useRole();
  const [form, setForm] = useState({
    name: currentUser.name,
    department: 'Computer Science',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      <div className="glass-card p-6 max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xl font-bold">{currentUser.avatar}</div>
          <div>
            <p className="text-foreground font-medium">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Department</label>
            <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Profile Picture</label>
            <input type="file" accept="image/*" className="w-full text-sm text-muted-foreground file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:bg-secondary file:border-0 file:text-sm file:text-foreground" />
          </div>
          <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
