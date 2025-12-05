import { User, UserRole, Complaint, ComplaintStatus, ComplaintCategory } from '../types';

const USERS_KEY = 'pp_users';
const COMPLAINTS_KEY = 'pp_complaints';

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'John Student', email: 'student@college.edu', role: UserRole.STUDENT, department: 'CSE' },
  { id: 'u2', name: 'Admin User', email: 'admin@college.edu', role: UserRole.ADMIN },
  { id: 'u3', name: 'Dr. Smith (HOD CSE)', email: 'hod.cse@college.edu', role: UserRole.HOD, department: 'CSE', designation: 'HOD - CSE' },
  { id: 'u4', name: 'Mr. Accounts', email: 'accounts@college.edu', role: UserRole.AUTHORITY, designation: 'Accounts Section' },
  { id: 'u5', name: 'Prof. Data (HOD AIDS)', email: 'hod.aids@college.edu', role: UserRole.HOD, department: 'AIDS', designation: 'HOD - AIDS' },
];

const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-2023-001',
    studentId: 'u1',
    studentName: 'John Student',
    title: 'WiFi not working in Lab 3',
    description: 'The internet connection in Computer Lab 3 has been down for 2 days.',
    category: ComplaintCategory.TECHNICAL,
    sentTo: 'HOD - CSE',
    status: ComplaintStatus.PENDING,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    replies: []
  },
  {
    id: 'CMP-2023-002',
    studentId: 'u1',
    studentName: 'John Student',
    title: 'Semester Fee Issue',
    description: 'I have paid the fee but it is not reflecting in the portal.',
    category: ComplaintCategory.FEES,
    sentTo: 'Accounts Section',
    status: ComplaintStatus.RESOLVED,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    replies: [
      {
        id: 'r1',
        senderId: 'u4',
        senderName: 'Mr. Accounts',
        message: 'Please attach your transaction ID.',
        timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
        isInternal: false
      },
      {
        id: 'r2',
        senderId: 'u1',
        senderName: 'John Student',
        message: 'Transaction ID is TXN123456.',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        isInternal: false
      },
      {
        id: 'r3',
        senderId: 'u4',
        senderName: 'Mr. Accounts',
        message: 'Verified. Updated on portal.',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        isInternal: false
      }
    ]
  }
];

export const initializeData = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem(COMPLAINTS_KEY)) {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(MOCK_COMPLAINTS));
  }
};

export const getComplaints = (): Complaint[] => {
  const data = localStorage.getItem(COMPLAINTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveComplaints = (complaints: Complaint[]) => {
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
};

export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};