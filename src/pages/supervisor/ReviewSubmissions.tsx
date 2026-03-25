import { useState } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { students, submissions } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { toast } from 'sonner';
import { X, ClipboardList, Eye, MessageCircle } from 'lucide-react';

const ReviewSubmissions = () => {
  const { currentUser } = useRole();
  const myStudents = students.filter(s => s.supervisorId === currentUser.id);
  const pendingSubs = submissions.filter(s => myStudents.some(st => st.id === s.studentId) && s.status === 'pending_review');
  const [feedbackModal, setFeedbackModal] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Review Submissions</h1>

      {pendingSubs.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No submissions pending review</p>
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {pendingSubs.map(sub => {
            const student = students.find(s => s.id === sub.studentId);
            return (
              <div key={sub.id} className="glass-card p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{student?.name}</span>
                  <StatusBadge status={sub.status} />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-primary/15 text-primary text-xs font-medium">{sub.documentType}</span>
                  <span className="text-sm text-foreground">{sub.title}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{sub.uploadDate}</p>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80">
                    <Eye className="h-3.5 w-3.5" /> View File
                  </button>
                  <button onClick={() => setFeedbackModal(sub.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
                    <MessageCircle className="h-3.5 w-3.5" /> Give Feedback
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {feedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setFeedbackModal(null)} />
          <div className="relative bg-card border border-border rounded-lg p-6 w-full max-w-md animate-fade-in">
            <button onClick={() => setFeedbackModal(null)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            <h2 className="text-lg font-semibold text-foreground mb-4">Give Feedback</h2>
            <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={4} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Write your feedback..." />
            <button onClick={() => { toast.success('Feedback submitted!'); setFeedbackModal(null); setFeedback(''); }} className="mt-3 w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSubmissions;
