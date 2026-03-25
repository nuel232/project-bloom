import { useState } from 'react';
import { students, supervisors, projects } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { ExternalLink, FolderOpen } from 'lucide-react';

const statuses = ['all', 'pending', 'approved', 'in_progress', 'completed'];
const departments = ['all', 'Computer Science', 'Software Engineering', 'Cybersecurity'];

const AllProjects = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  const filtered = projects.filter(p => {
    const student = students.find(s => s.id === p.studentId);
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (deptFilter !== 'all' && student?.department !== deptFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">All Projects</h1>

      <div className="flex gap-3 flex-wrap">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace('_', ' ')}</option>)}
        </select>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          {departments.map(d => <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No projects match the filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase">Student</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase">Title</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Supervisor</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">Department</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">GitHub</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const student = students.find(s => s.id === p.studentId);
                const sup = supervisors.find(s => s.id === p.supervisorId);
                return (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 text-foreground">{student?.name}</td>
                    <td className="py-3 text-foreground">{p.title}</td>
                    <td className="py-3 text-muted-foreground hidden md:table-cell">{sup?.name}</td>
                    <td className="py-3 text-muted-foreground hidden lg:table-cell">{student?.department}</td>
                    <td className="py-3"><StatusBadge status={p.status} /></td>
                    <td className="py-3 hidden lg:table-cell">
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 text-xs">
                        <ExternalLink className="h-3 w-3" /> Repo
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllProjects;
