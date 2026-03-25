import { useState } from 'react';
import { students, supervisors } from '@/data/mockData';
import { toast } from 'sonner';
import { Search, X, Users } from 'lucide-react';

const ManageUsers = () => {
  const [tab, setTab] = useState<'students' | 'supervisors'>('students');
  const [search, setSearch] = useState('');
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [selectedSup, setSelectedSup] = useState('');

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));
  const filteredSupervisors = supervisors.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Manage Users</h1>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex bg-secondary rounded-md p-0.5">
          <button onClick={() => setTab('students')} className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${tab === 'students' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Students</button>
          <button onClick={() => setTab('supervisors')} className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${tab === 'supervisors' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Supervisors</button>
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Search by name or email..." />
        </div>
      </div>

      <div className="overflow-x-auto">
        {tab === 'students' ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase">Name</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase">Email</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Department</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Matric No.</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">Supervisor</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(s => {
                const sup = supervisors.find(sp => sp.id === s.supervisorId);
                return (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 text-foreground">{s.name}</td>
                    <td className="py-3 text-muted-foreground">{s.email}</td>
                    <td className="py-3 text-muted-foreground hidden md:table-cell">{s.department}</td>
                    <td className="py-3 text-muted-foreground hidden md:table-cell">{s.matricNumber}</td>
                    <td className="py-3 text-muted-foreground hidden lg:table-cell">{sup?.name || 'Unassigned'}</td>
                    <td className="py-3">
                      <button onClick={() => setAssignModal(s.id)} className="px-2 py-1 text-xs rounded bg-primary/15 text-primary hover:bg-primary/25 transition-colors">Assign Supervisor</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase">Name</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase">Email</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Department</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Staff ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredSupervisors.map(s => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="py-3 text-foreground">{s.name}</td>
                  <td className="py-3 text-muted-foreground">{s.email}</td>
                  <td className="py-3 text-muted-foreground hidden md:table-cell">{s.department}</td>
                  <td className="py-3 text-muted-foreground hidden md:table-cell">{s.staffId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setAssignModal(null)} />
          <div className="relative bg-card border border-border rounded-lg p-6 w-full max-w-md animate-fade-in">
            <button onClick={() => setAssignModal(null)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            <h2 className="text-lg font-semibold text-foreground mb-4">Assign Supervisor</h2>
            <select value={selectedSup} onChange={e => setSelectedSup(e.target.value)} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-3">
              <option value="">Select supervisor</option>
              {supervisors.map(s => <option key={s.id} value={s.id}>{s.name} — {s.department}</option>)}
            </select>
            <button onClick={() => { toast.success('Supervisor assigned!'); setAssignModal(null); setSelectedSup(''); }} className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Assign</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
