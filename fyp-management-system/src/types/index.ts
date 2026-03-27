export interface User {
  id: string;
  email: string;
  role: 'admin' | 'supervisor' | 'student';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export interface Submission {
  id: string;
  projectId: string;
  studentId: string;
  content: string;
  submittedAt: Date;
}

export interface Feedback {
  id: string;
  submissionId: string;
  reviewerId: string;
  comments: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface Standup {
  id: string;
  date: Date;
  participants: string[];
  notes: string;
}