import { useState } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { useRole } from '@/contexts/RoleContext';
import { projects } from '@/data/mockData';
import { toast } from 'sonner';
import { FileText, Send } from 'lucide-react';

const categories = ['Web Development', 'Mobile App', 'AI/ML', 'Blockchain', 'Cybersecurity', 'Other'];

const SubmitProposal = () => {
  const { currentUser } = useRole();
  const existingProject = projects.find(p => p.studentId === currentUser.id);
  const [form, setForm] = useState({ title: '', description: '', category: '', githubUrl: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Proposal submitted successfully!');
    setForm({ title: '', description: '', category: '', githubUrl: '' });
  };

  if (existingProject) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">My Proposal</h1>
        <div className="glass-card p-6 max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">{existingProject.title}</h2>
            <StatusBadge status={existingProject.status} />
          </div>
          <p className="text-sm text-muted-foreground mb-3">{existingProject.description}</p>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Category:</span> <span className="text-foreground">{existingProject.category}</span></p>
            <p><span className="text-muted-foreground">GitHub:</span> <a href={existingProject.githubUrl} className="text-primary hover:underline">{existingProject.githubUrl}</a></p>
            <p><span className="text-muted-foreground">Submitted:</span> <span className="text-foreground">{existingProject.submittedDate}</span></p>
          </div>
          {existingProject.supervisorComment && (
            <div className="mt-4 p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-medium">Supervisor Comment:</p>
              <p className="text-sm text-foreground mt-1">{existingProject.supervisorComment}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Submit Proposal</h1>
      <form onSubmit={handleSubmit} className="glass-card p-6 max-w-2xl space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Project Title</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter project title" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={4} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Describe your project" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Select category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">GitHub Repository URL</label>
          <input value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} required className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://github.com/..." />
        </div>
        <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Send className="h-4 w-4" /> Submit Proposal
        </button>
      </form>
    </div>
  );
};

export default SubmitProposal;
