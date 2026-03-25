import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { students, projects, milestones, submissions, standups } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { GitCommit, ExternalLink, X, ChevronDown, ChevronUp, Plus, Calendar } from 'lucide-react';

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const student = students.find(s => s.id === id);
  const project = projects.find(p => p.studentId === id);
  const projectMilestones = milestones.filter(m => m.projectId === project?.id);
  const studentSubmissions = submissions.filter(s => s.studentId === id);
  const studentStandups = standups.filter(s => s.studentId === id).sort((a, b) => b.weekNumber - a.weekNumber);

  const [feedbackModal, setFeedbackModal] = useState<string | null>(null);
  const [milestoneModal, setMilestoneModal] = useState(false);
  const [expandedStandup, setExpandedStandup] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [newMilestone, setNewMilestone] = useState({ title: '', dueDate: '' });

  const commitData = (project?.weeklyCommits || []).map((v, i) => ({ week: `W${i + 1}`, commits: v }));

  if (!student) return <div className="p-6 text-muted-foreground">Student not found</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">{student.name}</h1>

      {/* Student Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Student Info</h3>
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Matric:</span> <span className="text-foreground">{student.matricNumber}</span></p>
            <p><span className="text-muted-foreground">Department:</span> <span className="text-foreground">{student.department}</span></p>
            <p><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{student.email}</span></p>
          </div>
        </div>
        {project && (
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Project Info</h3>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">{project.title}</p>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-xs text-muted-foreground mb-2">{project.description}</p>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              <ExternalLink className="h-3 w-3" /> GitHub Repo
            </a>
          </div>
        )}
      </div>

      {/* GitHub Activity */}
      {project && project.totalCommits > 0 && (
        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">GitHub Activity</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GitCommit className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">{project.totalCommits}</span>
                <span className="text-sm text-muted-foreground">total commits</span>
              </div>
              <p className="text-xs text-muted-foreground">Last: {project.lastCommitMessage}</p>
              <p className="text-xs text-muted-foreground">{project.lastCommitDate}</p>
              {/* Languages */}
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">Languages</p>
                <div className="h-3 rounded-full overflow-hidden flex">
                  {project.languagesUsed.map((l, i) => (
                    <div key={i} className="h-full" style={{ width: `${l.percentage}%`, backgroundColor: l.color }} />
                  ))}
                </div>
                <div className="flex gap-3 mt-2">
                  {project.languagesUsed.map((l, i) => (
                    <span key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
                      {l.name} {l.percentage}%
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-48">
              <p className="text-xs text-muted-foreground mb-2">Weekly Commits (Last 8 weeks)</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commitData}>
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(0,0%,55%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(0,0%,55%)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(0,0%,13%)', border: '1px solid hsl(0,0%,18%)', borderRadius: '8px', color: 'hsl(0,0%,95%)' }} />
                  <Bar dataKey="commits" fill="hsl(270,100%,80%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Milestones */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Milestones</h3>
          <button onClick={() => setMilestoneModal(true)} className="flex items-center gap-1 text-xs text-primary hover:underline"><Plus className="h-3 w-3" /> Add</button>
        </div>
        <div className="space-y-2">
          {projectMilestones.map(m => (
            <div key={m.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${m.completed ? 'bg-success' : 'bg-muted'}`} />
                <span className="text-sm text-foreground">{m.title}</span>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{m.dueDate}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Submissions */}
      <div className="glass-card p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Submissions</h3>
        {studentSubmissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No submissions yet</p>
        ) : (
          <div className="space-y-2">
            {studentSubmissions.map(sub => (
              <div key={sub.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <span className="text-xs text-primary font-medium">{sub.documentType}</span>
                  <p className="text-sm text-foreground">{sub.title}</p>
                  <p className="text-xs text-muted-foreground">{sub.uploadDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={sub.status} />
                  {sub.status === 'pending_review' && (
                    <button onClick={() => setFeedbackModal(sub.id)} className="px-2 py-1 text-xs rounded bg-primary text-primary-foreground hover:opacity-90">Feedback</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Standup Log */}
      <div className="glass-card p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Standup Log</h3>
        {studentStandups.length === 0 ? (
          <p className="text-sm text-muted-foreground">No standups yet</p>
        ) : (
          <div className="space-y-2">
            {studentStandups.map(s => (
              <div key={s.id} className="border border-border/50 rounded-md overflow-hidden">
                <button onClick={() => setExpandedStandup(expandedStandup === s.id ? null : s.id)} className="w-full flex items-center justify-between p-3 text-left">
                  <span className="text-sm text-foreground">Week {s.weekNumber} — {s.date}</span>
                  {expandedStandup === s.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
                {expandedStandup === s.id && (
                  <div className="px-3 pb-3 space-y-2 border-t border-border/50 pt-2 text-sm">
                    <div><span className="text-xs text-muted-foreground">Worked on:</span><p className="text-foreground">{s.workedOn}</p></div>
                    <div><span className="text-xs text-muted-foreground">Next week:</span><p className="text-foreground">{s.nextWeek}</p></div>
                    <div><span className="text-xs text-muted-foreground">Blockers:</span><p className="text-foreground">{s.blockers || 'None'}</p></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setFeedbackModal(null)} />
          <div className="relative bg-card border border-border rounded-lg p-6 w-full max-w-md animate-fade-in">
            <button onClick={() => setFeedbackModal(null)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            <h2 className="text-lg font-semibold text-foreground mb-4">Give Feedback</h2>
            <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={4} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Enter feedback..." />
            <button onClick={() => { toast.success('Feedback submitted!'); setFeedbackModal(null); setFeedback(''); }} className="mt-3 w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Submit Feedback</button>
          </div>
        </div>
      )}

      {/* Milestone Modal */}
      {milestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMilestoneModal(false)} />
          <div className="relative bg-card border border-border rounded-lg p-6 w-full max-w-md animate-fade-in">
            <button onClick={() => setMilestoneModal(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            <h2 className="text-lg font-semibold text-foreground mb-4">Add Milestone</h2>
            <div className="space-y-3">
              <input value={newMilestone.title} onChange={e => setNewMilestone({ ...newMilestone, title: e.target.value })} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Milestone title" />
              <input type="date" value={newMilestone.dueDate} onChange={e => setNewMilestone({ ...newMilestone, dueDate: e.target.value })} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <button onClick={() => { toast.success('Milestone added!'); setMilestoneModal(false); setNewMilestone({ title: '', dueDate: '' }); }} className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetail;
