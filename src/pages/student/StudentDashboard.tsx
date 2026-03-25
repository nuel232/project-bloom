import { GitCommit, Calendar, ArrowRight, MessageSquare, Upload, Eye } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { students, supervisors, projects, milestones, feedbacks, standups } from '@/data/mockData';
import { useRole } from '@/contexts/RoleContext';
import { Link } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const StudentDashboard = () => {
  const { currentUser } = useRole();
  const student = students.find(s => s.id === currentUser.id)!;
  const project = projects.find(p => p.studentId === student.id);
  const supervisor = supervisors.find(s => s.id === student.supervisorId);
  const projectMilestones = milestones.filter(m => m.projectId === project?.id);
  const latestFeedback = feedbacks.filter(f => f.studentId === student.id).sort((a, b) => b.date.localeCompare(a.date))[0];
  const upcomingMilestones = projectMilestones.filter(m => !m.completed).slice(0, 2);
  const commitData = (project?.weeklyCommits || []).map((v, i) => ({ week: `W${i + 1}`, commits: v }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {student.name.split(' ')[0]} 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's an overview of your final year project</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Project Status */}
        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Project Status</h3>
          {project ? (
            <>
              <p className="text-sm font-medium text-foreground mb-2">{project.title}</p>
              <StatusBadge status={project.status} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No project submitted yet</p>
          )}
        </div>

        {/* Supervisor */}
        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Supervisor</h3>
          {supervisor ? (
            <>
              <p className="text-sm font-medium text-foreground">{supervisor.name}</p>
              <p className="text-xs text-muted-foreground">{supervisor.department}</p>
              <p className="text-xs text-muted-foreground">{supervisor.email}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Not assigned yet</p>
          )}
        </div>

        {/* Latest Feedback */}
        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Latest Feedback</h3>
          {latestFeedback ? (
            <>
              <p className="text-sm text-foreground line-clamp-2">{latestFeedback.comment}</p>
              <p className="text-xs text-muted-foreground mt-2">{latestFeedback.date}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No feedback yet</p>
          )}
        </div>

        {/* Upcoming Milestones */}
        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Upcoming Milestones</h3>
          {upcomingMilestones.length > 0 ? (
            <div className="space-y-2">
              {upcomingMilestones.map(m => (
                <div key={m.id} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{m.title}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {m.dueDate}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming milestones</p>
          )}
        </div>

        {/* GitHub Activity */}
        <div className="glass-card p-5 md:col-span-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">GitHub Activity</h3>
          {project && project.totalCommits > 0 ? (
            <div className="flex items-start gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <GitCommit className="h-4 w-4 text-primary" />
                  <span className="text-2xl font-bold text-foreground">{project.totalCommits}</span>
                  <span className="text-xs text-muted-foreground">commits</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Last: {project.lastCommitMessage}</p>
                <p className="text-xs text-muted-foreground">{project.lastCommitDate}</p>
              </div>
              <div className="flex-1 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={commitData}>
                    <Area type="monotone" dataKey="commits" stroke="hsl(270,100%,80%)" fill="hsl(270,100%,80%)" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No commits yet. Push your first commit to get started!</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/student/standup" className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <MessageSquare className="h-4 w-4" /> Submit Standup
        </Link>
        <Link to="/student/submissions" className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
          <Upload className="h-4 w-4" /> Upload Document
        </Link>
        <Link to="/student/feedback" className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
          <Eye className="h-4 w-4" /> View Feedback
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;
