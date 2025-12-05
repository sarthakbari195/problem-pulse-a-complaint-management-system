import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  ArrowRight
} from 'lucide-react';
import { User, UserRole, Complaint, ComplaintStatus } from '../types';
import { getComplaints } from '../services/mockData';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = React.useState<Complaint[]>([]);

  React.useEffect(() => {
    const allComplaints = getComplaints();
    if (user.role === UserRole.STUDENT) {
      setComplaints(allComplaints.filter(c => c.studentId === user.id));
    } else if (user.role === UserRole.HOD && user.department) {
      setComplaints(allComplaints.filter(c => c.sentTo.includes(user.department!) || c.category.includes(user.department!)));
    } else {
      // Admin sees all
      setComplaints(allComplaints);
    }
  }, [user]);

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === ComplaintStatus.PENDING).length;
    const resolved = complaints.filter(c => c.status === ComplaintStatus.RESOLVED).length;
    const inReview = complaints.filter(c => c.status === ComplaintStatus.IN_REVIEW).length;
    return { total, pending, resolved, inReview };
  }, [complaints]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [complaints]);

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const StatCard = ({ title, value, icon: Icon, color, bgColor }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between border border-gray-100">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Complaints" 
          value={stats.total} 
          icon={FileText} 
          color="text-indigo-600" 
          bgColor="bg-indigo-50" 
        />
        <StatCard 
          title="Pending" 
          value={stats.pending} 
          icon={Clock} 
          color="text-amber-600" 
          bgColor="bg-amber-50" 
        />
        <StatCard 
          title="In Review" 
          value={stats.inReview} 
          icon={AlertCircle} 
          color="text-blue-600" 
          bgColor="bg-blue-50" 
        />
        <StatCard 
          title="Resolved" 
          value={stats.resolved} 
          icon={CheckCircle} 
          color="text-green-600" 
          bgColor="bg-green-50" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Complaints by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Activity</h3>
          {complaints.length > 0 ? (
            <div className="space-y-4">
              {complaints.slice(0, 4).map(complaint => (
                <div key={complaint.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => navigate(`/complaints/${complaint.id}`)}>
                  <div>
                    <h4 className="font-medium text-gray-900 truncate max-w-[200px]">{complaint.title}</h4>
                    <span className="text-xs text-gray-500">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    complaint.status === ComplaintStatus.RESOLVED ? 'bg-green-100 text-green-800' :
                    complaint.status === ComplaintStatus.PENDING ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
              ))}
              <button 
                onClick={() => navigate('/complaints')}
                className="w-full text-center text-sm text-indigo-600 font-medium hover:text-indigo-800 mt-2 flex items-center justify-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
};