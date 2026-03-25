export type Role = 'student' | 'supervisor' | 'admin';
export type ProjectStatus = 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
export type SubmissionStatus = 'pending_review' | 'reviewed';

export interface Student {
  id: string;
  name: string;
  matricNumber: string;
  department: string;
  email: string;
  avatar: string;
  supervisorId: string;
}

export interface Supervisor {
  id: string;
  name: string;
  department: string;
  email: string;
  avatar: string;
  staffId: string;
}

export interface Project {
  id: string;
  studentId: string;
  supervisorId: string;
  title: string;
  description: string;
  category: string;
  status: ProjectStatus;
  githubUrl: string;
  totalCommits: number;
  lastCommitMessage: string;
  lastCommitDate: string;
  languagesUsed: { name: string; percentage: number; color: string }[];
  weeklyCommits: number[];
  submittedDate: string;
  supervisorComment?: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Submission {
  id: string;
  studentId: string;
  projectId: string;
  documentType: string;
  title: string;
  uploadDate: string;
  status: SubmissionStatus;
  feedback?: string;
  feedbackDate?: string;
  feedbackBy?: string;
}

export interface Standup {
  id: string;
  studentId: string;
  weekNumber: number;
  date: string;
  workedOn: string;
  nextWeek: string;
  blockers: string;
}

export interface Feedback {
  id: string;
  studentId: string;
  submissionId: string;
  supervisorId: string;
  comment: string;
  date: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  role: Role;
  message: string;
  date: string;
  read: boolean;
  type: 'proposal' | 'feedback' | 'milestone' | 'standup' | 'system';
}

export const students: Student[] = [
  { id: 's1', name: 'Adaeze Okonkwo', matricNumber: 'CS/2021/001', department: 'Computer Science', email: 'adaeze@university.edu', avatar: 'AO', supervisorId: 'sup1' },
  { id: 's2', name: 'Emeka Nwosu', matricNumber: 'CS/2021/002', department: 'Computer Science', email: 'emeka@university.edu', avatar: 'EN', supervisorId: 'sup1' },
  { id: 's3', name: 'Fatima Aliyu', matricNumber: 'CS/2021/003', department: 'Computer Science', email: 'fatima@university.edu', avatar: 'FA', supervisorId: 'sup2' },
];

export const supervisors: Supervisor[] = [
  { id: 'sup1', name: 'Dr. Chukwuemeka Obi', department: 'Software Engineering', email: 'c.obi@university.edu', avatar: 'CO', staffId: 'SE/001' },
  { id: 'sup2', name: 'Dr. Amina Yusuf', department: 'Cybersecurity', email: 'a.yusuf@university.edu', avatar: 'AY', staffId: 'CY/001' },
];

export const projects: Project[] = [
  {
    id: 'p1', studentId: 's1', supervisorId: 'sup1',
    title: 'Blockchain Voting System', description: 'A decentralized voting system built on Ethereum blockchain to ensure transparent and tamper-proof elections for student government.',
    category: 'Blockchain', status: 'approved', githubUrl: 'https://github.com/adaeze/blockchain-voting',
    totalCommits: 47, lastCommitMessage: 'feat: add vote tallying smart contract', lastCommitDate: '2025-03-23',
    languagesUsed: [{ name: 'JavaScript', percentage: 60, color: 'hsl(270 100% 80%)' }, { name: 'CSS', percentage: 20, color: 'hsl(217 91% 60%)' }, { name: 'HTML', percentage: 20, color: 'hsl(0 0% 55%)' }],
    weeklyCommits: [3, 5, 8, 2, 7, 4, 6, 12], submittedDate: '2025-02-15',
  },
  {
    id: 'p2', studentId: 's2', supervisorId: 'sup1',
    title: 'AI Plagiarism Detector', description: 'An AI-powered tool that uses NLP techniques to detect plagiarism in academic submissions with high accuracy.',
    category: 'AI/ML', status: 'in_progress', githubUrl: 'https://github.com/emeka/plagiarism-detector',
    totalCommits: 23, lastCommitMessage: 'fix: improve text similarity algorithm', lastCommitDate: '2025-03-20',
    languagesUsed: [{ name: 'Python', percentage: 75, color: 'hsl(270 100% 80%)' }, { name: 'JavaScript', percentage: 25, color: 'hsl(217 91% 60%)' }],
    weeklyCommits: [1, 3, 2, 5, 4, 0, 3, 5], submittedDate: '2025-02-20',
  },
  {
    id: 'p3', studentId: 's3', supervisorId: 'sup2',
    title: 'Smart Campus Energy Monitor', description: 'IoT-based energy monitoring system for campus buildings with real-time analytics and predictive maintenance alerts.',
    category: 'Web Development', status: 'pending', githubUrl: 'https://github.com/fatima/energy-monitor',
    totalCommits: 0, lastCommitMessage: '', lastCommitDate: '',
    languagesUsed: [], weeklyCommits: [0, 0, 0, 0, 0, 0, 0, 0], submittedDate: '2025-03-22',
  },
];

export const milestones: Milestone[] = [
  { id: 'm1', projectId: 'p1', title: 'Complete database design', dueDate: '2025-02-28', completed: true },
  { id: 'm2', projectId: 'p1', title: 'Build smart contract', dueDate: '2025-03-10', completed: true },
  { id: 'm3', projectId: 'p1', title: 'Frontend integration', dueDate: '2025-03-28', completed: false },
  { id: 'm4', projectId: 'p1', title: 'Final testing', dueDate: '2025-04-08', completed: false },
  { id: 'm5', projectId: 'p2', title: 'Data collection pipeline', dueDate: '2025-03-15', completed: true },
  { id: 'm6', projectId: 'p2', title: 'Model training', dueDate: '2025-04-01', completed: false },
];

export const submissions: Submission[] = [
  { id: 'sub1', studentId: 's1', projectId: 'p1', documentType: 'Proposal', title: 'Blockchain Voting System Proposal', uploadDate: '2025-02-15', status: 'reviewed', feedback: 'Well-structured proposal. Approved.', feedbackDate: '2025-02-18', feedbackBy: 'sup1' },
  { id: 'sub2', studentId: 's1', projectId: 'p1', documentType: 'Chapter 1', title: 'Introduction and Literature Review', uploadDate: '2025-03-05', status: 'reviewed', feedback: 'Good literature review. Add more recent references.', feedbackDate: '2025-03-08', feedbackBy: 'sup1' },
  { id: 'sub3', studentId: 's1', projectId: 'p1', documentType: 'Chapter 2', title: 'System Design and Architecture', uploadDate: '2025-03-20', status: 'pending_review' },
  { id: 'sub4', studentId: 's2', projectId: 'p2', documentType: 'Proposal', title: 'AI Plagiarism Detector Proposal', uploadDate: '2025-02-20', status: 'reviewed', feedback: 'Interesting approach. Consider edge cases.', feedbackDate: '2025-02-25', feedbackBy: 'sup1' },
  { id: 'sub5', studentId: 's2', projectId: 'p2', documentType: 'Draft', title: 'Initial Draft - Chapters 1-2', uploadDate: '2025-03-18', status: 'pending_review' },
];

export const standups: Standup[] = [
  { id: 'st1', studentId: 's1', weekNumber: 6, date: '2025-03-21', workedOn: 'Implemented vote tallying smart contract and unit tests', nextWeek: 'Start frontend integration with Web3.js', blockers: 'None' },
  { id: 'st2', studentId: 's1', weekNumber: 5, date: '2025-03-14', workedOn: 'Completed smart contract for ballot creation', nextWeek: 'Add vote tallying and result verification', blockers: 'Gas optimization needed for large elections' },
  { id: 'st3', studentId: 's2', weekNumber: 6, date: '2025-03-21', workedOn: 'Improved text similarity algorithm accuracy to 92%', nextWeek: 'Build web interface for document upload', blockers: 'Need access to larger training dataset' },
  { id: 'st4', studentId: 's1', weekNumber: 4, date: '2025-03-07', workedOn: 'Database schema design and smart contract boilerplate', nextWeek: 'Build ballot creation contract', blockers: 'Learning Solidity syntax' },
];

export const feedbacks: Feedback[] = [
  { id: 'f1', studentId: 's1', submissionId: 'sub1', supervisorId: 'sup1', comment: 'Well-structured proposal. Approved.', date: '2025-02-18', read: true },
  { id: 'f2', studentId: 's1', submissionId: 'sub2', supervisorId: 'sup1', comment: 'Good literature review. Add more recent references from 2024.', date: '2025-03-08', read: false },
  { id: 'f3', studentId: 's2', submissionId: 'sub4', supervisorId: 'sup1', comment: 'Interesting approach. Consider edge cases with code-switching text.', date: '2025-02-25', read: true },
];

export const notifications: Notification[] = [
  { id: 'n1', userId: 's1', role: 'student', message: 'Your proposal has been approved', date: '2025-02-18', read: true, type: 'proposal' },
  { id: 'n2', userId: 's1', role: 'student', message: 'Dr. Obi gave feedback on your Chapter 1 submission', date: '2025-03-08', read: false, type: 'feedback' },
  { id: 'n3', userId: 's1', role: 'student', message: 'Milestone due in 3 days: Frontend integration', date: '2025-03-25', read: false, type: 'milestone' },
  { id: 'n4', userId: 'sup1', role: 'supervisor', message: 'New standup submitted by Adaeze Okonkwo', date: '2025-03-21', read: false, type: 'standup' },
  { id: 'n5', userId: 'sup1', role: 'supervisor', message: 'New proposal from Fatima Aliyu pending review', date: '2025-03-22', read: false, type: 'proposal' },
  { id: 'n6', userId: 'sup1', role: 'supervisor', message: 'New submission from Emeka Nwosu', date: '2025-03-18', read: true, type: 'feedback' },
  { id: 'n7', userId: 'admin', role: 'admin', message: 'New student registered: Fatima Aliyu', date: '2025-03-22', read: false, type: 'system' },
  { id: 'n8', userId: 'admin', role: 'admin', message: 'Project approved: Blockchain Voting System', date: '2025-02-18', read: true, type: 'system' },
];

export const currentUsers = {
  student: { id: 's1', name: 'Adaeze Okonkwo', role: 'student' as Role, avatar: 'AO' },
  supervisor: { id: 'sup1', name: 'Dr. Chukwuemeka Obi', role: 'supervisor' as Role, avatar: 'CO' },
  admin: { id: 'admin', name: 'Admin User', role: 'admin' as Role, avatar: 'AU' },
};
