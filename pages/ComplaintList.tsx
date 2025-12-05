import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole, Complaint, ComplaintStatus } from '../types';
import { getComplaints } from '../services/mockData';
import { Search, Filter, ArrowLeft } from 'lucide-react';

interface ComplaintListProps {
  user: User;
}

export const ComplaintList: React.FC<ComplaintListProps> = ({ user }) => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filtered, setFiltered] = useState<Complaint[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const all = getComplaints();
    let userComplaints = [];
    if (user.role === UserRole.STUDENT) {
      userComplaints = all.filter(c => c.studentId === user.id);
    } else if (user.role === UserRole.HOD && user.department) {
      userComplaints = all.filter(c => c.sentTo.includes(user.department!) || c.category.includes(user.department!));
    } else {
      userComplaints = all;
    }
    setComplaints(userComplaints);
    setFiltered(userComplaints);
  }, [user]);

  useEffect(() => {
    let result = complaints;
    
    if (filterStatus !== 'All') {
      result = result.filter(c => c.status === filterStatus);
    }

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(lower) || 
        c.id.toLowerCase().includes(lower)
      );
    }

    setFiltered(result);
  }, [filterStatus, search, complaints]);

  const getStatusColor = (status: ComplaintStatus) => {
    switch(status) {
      case ComplaintStatus.RESOLVED: return 'bg-green-100 text-green-800 border-green-200';
      case ComplaintStatus.REJECTED: return 'bg-red-100 text-red-800 border-red-200';
      case ComplaintStatus.IN_REVIEW: return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {user.role === UserRole.STUDENT ? 'My Complaints' : 'Received Complaints'}
          </h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search ID or Title..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
             <select
              className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              {Object.values(ComplaintStatus).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">ID</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Title</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Category</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {complaint.id}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 font-medium truncate max-w-[200px]">{complaint.title}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{complaint.sentTo}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {complaint.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(complaint.status as ComplaintStatus)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/complaints/${complaint.id}`)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No complaints found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};