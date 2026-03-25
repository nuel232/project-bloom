import { students, supervisors, projects } from '@/data/mockData';
import { Users, UserCheck, FolderOpen, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const totalStudents = students.length;
  const totalSupervisors = supervisors.length;
  const totalProjects = projects.length;

  const statusCounts = {
    pending: projects.filter(p => p.status === 'pending').length,
    in_progress: projects.filter(p => p.status === 'in_progress').length,
    approved: projects.filter(p => p.status === 'approved').length,
    completed: projects.filter(p => p.status === 'completed').length,
  };

  const deptData = [
    { department: 'Computer Science', projects: 3 },
    { department: 'Software Eng.', projects: 1 },
    { department: 'Cybersecurity', projects: 1 },
  ];

  const pieData = [
    { name: 'Pending', value: statusCounts.pending, color: 'hsl(38,92%,50%)' },
    { name: 'Approved', value: statusCounts.approved, color: 'hsl(142,71%,45%)' },
    { name: 'In Progress', value: statusCounts.in_progress, color: 'hsl(217,91%,60%)' },
    { name: 'Completed', value: statusCounts.completed, color: 'hsl(270,100%,80%)' },
  ].filter(d => d.value > 0);

  const recentActivity = [
    { action: 'Fatima Aliyu submitted a new proposal', time: '2 hours ago' },
    { action: 'Dr. Obi approved Adaeze\'s proposal', time: '2 days ago' },
    { action: 'Emeka Nwosu uploaded Chapter 1 draft', time: '5 days ago' },
    { action: 'New student registered: Fatima Aliyu', time: '1 week ago' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: totalStudents, icon: Users, color: 'text-primary' },
          { label: 'Total Supervisors', value: totalSupervisors, icon: UserCheck, color: 'text-info' },
          { label: 'Total Projects', value: totalProjects, icon: FolderOpen, color: 'text-success' },
          { label: 'Pending', value: statusCounts.pending, icon: Activity, color: 'text-warning' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects per Department */}
        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Projects per Department</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <XAxis dataKey="department" tick={{ fontSize: 10, fill: 'hsl(0,0%,55%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(0,0%,55%)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(0,0%,13%)', border: '1px solid hsl(0,0%,18%)', borderRadius: '8px', color: 'hsl(0,0%,95%)' }} />
                <Bar dataKey="projects" fill="hsl(270,100%,80%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Project Status Breakdown</h3>
          <div className="h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(0,0%,13%)', border: '1px solid hsl(0,0%,18%)', borderRadius: '8px', color: 'hsl(0,0%,95%)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {pieData.map(d => (
              <span key={d.name} className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <span className="text-sm text-foreground">{a.action}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
