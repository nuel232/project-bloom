import { useState } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { standups } from '@/data/mockData';
import { toast } from 'sonner';
import { Send, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

const WeeklyStandup = () => {
  const { currentUser } = useRole();
  const [form, setForm] = useState({ workedOn: '', nextWeek: '', blockers: '' });
  const [expanded, setExpanded] = useState<string | null>(null);
  const myStandups = standups.filter(s => s.studentId === currentUser.id).sort((a, b) => b.weekNumber - a.weekNumber);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Standup submitted successfully!');
    setForm({ workedOn: '', nextWeek: '', blockers: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Weekly Standup</h1>

      <form onSubmit={handleSubmit} className="glass-card p-6 max-w-2xl space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">What did you work on this week?</label>
          <textarea value={form.workedOn} onChange={e => setForm({ ...form, workedOn: e.target.value })} required rows={3} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">What will you work on next week?</label>
          <textarea value={form.nextWeek} onChange={e => setForm({ ...form, nextWeek: e.target.value })} required rows={3} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Any blockers?</label>
          <textarea value={form.blockers} onChange={e => setForm({ ...form, blockers: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="None" />
        </div>
        <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Send className="h-4 w-4" /> Submit Standup
        </button>
      </form>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Past Standups</h2>
        {myStandups.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No standups submitted yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-w-2xl">
            {myStandups.map(s => (
              <div key={s.id} className="glass-card overflow-hidden">
                <button onClick={() => setExpanded(expanded === s.id ? null : s.id)} className="w-full flex items-center justify-between p-4 text-left">
                  <span className="text-sm font-medium text-foreground">Week {s.weekNumber} — {s.date}</span>
                  {expanded === s.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
                {expanded === s.id && (
                  <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                    <div><p className="text-xs text-muted-foreground font-medium">Worked on:</p><p className="text-sm text-foreground">{s.workedOn}</p></div>
                    <div><p className="text-xs text-muted-foreground font-medium">Next week:</p><p className="text-sm text-foreground">{s.nextWeek}</p></div>
                    <div><p className="text-xs text-muted-foreground font-medium">Blockers:</p><p className="text-sm text-foreground">{s.blockers || 'None'}</p></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyStandup;
