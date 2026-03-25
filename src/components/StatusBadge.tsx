import { cn } from '@/lib/utils';
import { ProjectStatus, SubmissionStatus } from '@/data/mockData';

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/15 text-warning border-warning/30' },
  approved: { label: 'Approved', className: 'bg-success/15 text-success border-success/30' },
  rejected: { label: 'Rejected', className: 'bg-destructive/15 text-destructive border-destructive/30' },
  in_progress: { label: 'In Progress', className: 'bg-info/15 text-info border-info/30' },
  completed: { label: 'Completed', className: 'bg-primary/15 text-primary border-primary/30' },
  pending_review: { label: 'Pending Review', className: 'bg-warning/15 text-warning border-warning/30' },
  reviewed: { label: 'Reviewed', className: 'bg-success/15 text-success border-success/30' },
};

interface StatusBadgeProps {
  status: ProjectStatus | SubmissionStatus | string;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status] || { label: status, className: 'bg-muted text-muted-foreground border-border' };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', config.className, className)}>
      {config.label}
    </span>
  );
};
