import { useState } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { useRole } from '@/contexts/RoleContext';
import { submissions } from '@/data/mockData';
import { toast } from 'sonner';
import { Upload, X, FileText, MessageCircle } from 'lucide-react';

const docTypes = ['Proposal', 'Chapter 1', 'Chapter 2', 'Chapter 3', 'Draft', 'Final Submission'];

const MySubmissions = () => {
  const { currentUser } = useRole();
  const [showModal, setShowModal] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<string | null>(null);
  const [form, setForm] = useState({ docType: '', title: '' });
  const mySubmissions = submissions.filter(s => s.studentId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Document uploaded successfully!');
    setShowModal(false);
    setForm({ docType: '', title: '' });
  };

  const viewedSubmission = mySubmissions.find(s => s.id === feedbackModal);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">My Submissions</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Upload className="h-4 w-4" /> Upload Document
        </button>
      </div>

      {mySubmissions.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No submissions yet. Upload your first document!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mySubmissions.map(sub => (
            <div key={sub.id} className="glass-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-primary/15 text-primary text-xs font-medium">{sub.documentType}</span>
                <StatusBadge status={sub.status} />
              </div>
              <p className="text-sm font-medium text-foreground">{sub.title}</p>
              <p className="text-xs text-muted-foreground">{sub.uploadDate}</p>
              {sub.status === 'reviewed' && (
                <button onClick={() => setFeedbackModal(sub.id)} className="flex items-center gap-1 text-xs text-primary hover:underline">
                  <MessageCircle className="h-3 w-3" /> View Feedback
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-card border border-border rounded-lg p-6 w-full max-w-md animate-fade-in">
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            <h2 className="text-lg font-semibold text-foreground mb-4">Upload Document</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Document Type</label>
                <select value={form.docType} onChange={e => setForm({ ...form, docType: e.target.value })} required className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Select type</option>
                  {docTypes.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Document title" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">File (PDF)</label>
                <input type="file" accept=".pdf" className="w-full text-sm text-muted-foreground file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:bg-secondary file:border-0 file:text-sm file:text-foreground" />
              </div>
              <button type="submit" className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal && viewedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setFeedbackModal(null)} />
          <div className="relative bg-card border border-border rounded-lg p-6 w-full max-w-md animate-fade-in">
            <button onClick={() => setFeedbackModal(null)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            <h2 className="text-lg font-semibold text-foreground mb-2">Feedback</h2>
            <p className="text-xs text-muted-foreground mb-3">{viewedSubmission.documentType} — {viewedSubmission.title}</p>
            <p className="text-sm text-foreground">{viewedSubmission.feedback}</p>
            <p className="text-xs text-muted-foreground mt-3">{viewedSubmission.feedbackDate}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
