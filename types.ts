export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  HOD = 'HOD',
  AUTHORITY = 'AUTHORITY'
}

export enum ComplaintStatus {
  PENDING = 'Pending',
  IN_REVIEW = 'In Review',
  RESOLVED = 'Resolved',
  REJECTED = 'Rejected'
}

export enum ComplaintCategory {
  FEES = 'Fees Related',
  ACADEMIC = 'Academic',
  HOSTEL = 'Hostel',
  TRANSPORT = 'Transport',
  TECHNICAL = 'Technical Issue',
  DISCIPLINE = 'Discipline',
  OTHERS = 'Others'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string; // For HOD/Students
  designation?: string; // For Authorities
}

export interface Reply {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  isInternal: boolean; // For staff only notes
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  sentTo: string; // Designation or Department name
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  replies: Reply[];
  attachmentUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}