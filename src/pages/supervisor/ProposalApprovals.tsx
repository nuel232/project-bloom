import { useState } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { students, projects } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, X } from 'lucide-react';

const ProposalApprovals = () => {
  const { currentUser } = useRole();
  const myStudents = students.filter(s => s.supervisorId === currentUser.id);
  const pendingProjects = projects.filter(p => p.status === 'pending' && myStudents.some(s => s.id === p.studentId));
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Proposal Approvals</h1>

      {pendingProjects.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No pending proposals to review</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {pendingProjects.map(p => {
            const student = students.find(s => s.id === p.studentId);
            return (
              <div key={p.id} className="glass-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{student?.name}</span>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-base font-semibold text-foreground">{p.title}</p>
                <p className="text-sm text-muted-foreground">{p.description}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>GitHub: <a href={p.githubUrl} className="text-primary hover:underline">{p.githubUrl}</a></p>
                  <p>Submitted: {p.submittedDate}</p>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => toast.success('Proposal approved!')} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-success text-success-foreground text-xs font-medium hover:opacity-90">
                    <CheckCircle className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button onClick={() => setRejectModal(p.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-destructive text-destructive-foreground text-xs font-medium hover:opacity-90">
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setRejectModal(null)} />
          <div className="relative bg-card border border-border rounded-lg p-6 w-full max-w-md animate-fade-in">
            <button onClick={() => setRejectModal(null)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            <h2 className="text-lg font-semibold text-foreground mb-4">Rejection Reason</h2>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Explain why this proposal is being rejected..." />
            <button onClick={() => { toast.success('Proposal rejected.'); setRejectModal(null); setReason(''); }} className="mt-3 w-full px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90">Reject Proposal</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalApprovals;
