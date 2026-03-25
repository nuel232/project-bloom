import { useRole } from '@/contexts/RoleContext';
import { students, projects, submissions, standups } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { Users, FileText, ClipboardList, AlertTriangle } from 'lucide-react';

const SupervisorDashboard = () => {
  const { currentUser } = useRole();
  const myStudents = students.filter(s => s.supervisorId === currentUser.id);
  const myProjects = projects.filter(p => p.supervisorId === currentUser.id);
  const pendingProposals = myProjects.filter(p => p.status === 'pending');
  const pendingSubmissions = submissions.filter(s => myStudents.some(st => st.id === s.studentId) && s.status === 'pending_review');

  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const inactiveStudents = myProjects.filter(p => {
    if (!p.lastCommitDate) return true;
    return new Date(p.lastCommitDate) < twoWeeksAgo;
  });

  const recentStandups = standups
    .filter(s => myStudents.some(st => st.id === s.studentId))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Supervisor Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: myStudents.length, icon: Users, color: 'text-primary' },
          { label: 'Pending Proposals', value: pendingProposals.length, icon: FileText, color: 'text-warning' },
          { label: 'Pending Reviews', value: pendingSubmissions.length, icon: ClipboardList, color: 'text-info' },
          { label: 'Inactive Students', value: inactiveStudents.length, icon: AlertTriangle, color: 'text-destructive' },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Inactive Alert */}
      {inactiveStudents.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
          <p className="text-sm text-foreground">{inactiveStudents.length} student(s) have not committed in over 2 weeks. Follow up recommended.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Standups */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Recent Standups</h2>
          {recentStandups.length === 0 ? (
            <div className="glass-card p-8 text-center"><p className="text-muted-foreground text-sm">No standups yet</p></div>
          ) : (
            <div className="space-y-2">
              {recentStandups.map(s => {
                const student = students.find(st => st.id === s.studentId);
                return (
                  <div key={s.id} className="glass-card p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{student?.name}</span>
                      <span className="text-xs text-muted-foreground">Week {s.weekNumber} — {s.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{s.workedOn}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending Proposals */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Pending Proposals</h2>
          {pendingProposals.length === 0 ? (
            <div className="glass-card p-8 text-center"><p className="text-muted-foreground text-sm">No pending proposals</p></div>
          ) : (
            <div className="space-y-2">
              {pendingProposals.map(p => {
                const student = students.find(s => s.id === p.studentId);
                return (
                  <div key={p.id} className="glass-card p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{student?.name}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="text-sm text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{p.submittedDate}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
