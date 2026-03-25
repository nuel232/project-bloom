import { students, projects } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const Reports = () => {
  const completionData = [
    { department: 'Computer Science', completed: 1, total: 3 },
    { department: 'Software Eng.', completed: 0, total: 1 },
    { department: 'Cybersecurity', completed: 0, total: 1 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <button onClick={() => toast.success('Exported successfully!')} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Download className="h-4 w-4" /> Export as PDF
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: projects.length },
          { label: 'Completed', value: projects.filter(p => p.status === 'completed').length },
          { label: 'In Progress', value: projects.filter(p => p.status === 'in_progress').length },
          { label: 'Pending', value: projects.filter(p => p.status === 'pending').length },
        ].map(s => (
          <div key={s.label} className="glass-card p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Completion Rate Chart */}
      <div className="glass-card p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Department Completion Rate</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={completionData}>
              <XAxis dataKey="department" tick={{ fontSize: 10, fill: 'hsl(0,0%,55%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(0,0%,55%)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(0,0%,13%)', border: '1px solid hsl(0,0%,18%)', borderRadius: '8px', color: 'hsl(0,0%,95%)' }} />
              <Bar dataKey="total" fill="hsl(0,0%,30%)" radius={[4, 4, 0, 0]} name="Total" />
              <Bar dataKey="completed" fill="hsl(270,100%,80%)" radius={[4, 4, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* All Projects Table */}
      <div className="glass-card p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">All Projects</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase">Student</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase">Project</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Commits</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => {
                const student = students.find(s => s.id === p.studentId);
                return (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="py-3 text-foreground">{student?.name}</td>
                    <td className="py-3 text-foreground">{p.title}</td>
                    <td className="py-3"><StatusBadge status={p.status} /></td>
                    <td className="py-3 text-muted-foreground hidden md:table-cell">{p.totalCommits}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
