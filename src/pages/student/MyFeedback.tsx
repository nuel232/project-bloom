import { useRole } from '@/contexts/RoleContext';
import { feedbacks, submissions, supervisors } from '@/data/mockData';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MyFeedback = () => {
  const { currentUser } = useRole();
  const myFeedbacks = feedbacks.filter(f => f.studentId === currentUser.id).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">My Feedback</h1>

      {myFeedbacks.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No feedback received yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-w-2xl">
          {myFeedbacks.map(fb => {
            const sub = submissions.find(s => s.id === fb.submissionId);
            const sup = supervisors.find(s => s.id === fb.supervisorId);
            return (
              <div key={fb.id} className={cn('glass-card p-5 border-l-2', fb.read ? 'border-l-transparent' : 'border-l-primary')}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{sub?.documentType} — {sub?.title}</span>
                  <span className="text-xs text-muted-foreground">{fb.date}</span>
                </div>
                <p className="text-sm text-foreground mb-2">{fb.comment}</p>
                <p className="text-xs text-muted-foreground">— {sup?.name}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyFeedback;
