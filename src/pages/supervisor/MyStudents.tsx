import { useRole } from '@/contexts/RoleContext';
import { students, projects, milestones } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { Link } from 'react-router-dom';
import { GitCommit, Users } from 'lucide-react';

const MyStudents = () => {
  const { currentUser } = useRole();
  const myStudents = students.filter(s => s.supervisorId === currentUser.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">My Students</h1>

      {myStudents.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No students assigned yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {myStudents.map(student => {
            const project = projects.find(p => p.studentId === student.id);
            const projectMilestones = milestones.filter(m => m.projectId === project?.id);
            const completed = projectMilestones.filter(m => m.completed).length;
            const total = projectMilestones.length;
            const progress = total > 0 ? (completed / total) * 100 : 0;

            return (
              <div key={student.id} className="glass-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.matricNumber}</p>
                  </div>
                  {project && <StatusBadge status={project.status} />}
                </div>
                {project && (
                  <>
                    <p className="text-sm text-foreground">{project.title}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><GitCommit className="h-3 w-3" />{project.totalCommits} commits</span>
                      <span>{project.lastCommitDate || 'No commits'}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{completed}/{total}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </>
                )}
                <Link to={`/supervisor/students/${student.id}`} className="block text-center px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors">
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyStudents;
