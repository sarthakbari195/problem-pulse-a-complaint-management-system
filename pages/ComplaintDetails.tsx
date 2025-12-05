import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, UserRole, Complaint, ComplaintStatus } from '../types';
import { getComplaints, saveComplaints } from '../services/mockData';
import { ArrowLeft, Send, Clock, User as UserIcon, Building } from 'lucide-react';

interface ComplaintDetailsProps {
  user: User;
}

export const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    const complaints = getComplaints();
    const found = complaints.find(c => c.id === id);
    if (found) {
      setComplaint(found);
    } else {
      navigate('/complaints');
    }
  }, [id, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [complaint?.replies]);

  const handleStatusChange = (newStatus: ComplaintStatus) => {
    if (!complaint) return;
    
    const updated = { ...complaint, status: newStatus, updatedAt: new Date().toISOString() };
    
    // Update local state
    setComplaint(updated);
    
    // Update storage
    const all = getComplaints();
    const newAll = all.map(c => c.id === complaint.id ? updated : c);
    saveComplaints(newAll);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !complaint) return;

    const newReply = {
      id: `rep-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      message: replyText,
      timestamp: new Date().toISOString(),
      isInternal: false
    };

    const updated = {
      ...complaint,
      replies: [...complaint.replies, newReply],
      updatedAt: new Date().toISOString()
    };

    setComplaint(updated);
    setReplyText('');

    const all = getComplaints();
    const newAll = all.map(c => c.id === complaint.id ? updated : c);
    saveComplaints(newAll);
  };

  if (!complaint) return null;

  const canManage = user.role === UserRole.ADMIN || user.role === UserRole.HOD || user.role === UserRole.AUTHORITY;
  const isResolved = complaint.status === ComplaintStatus.RESOLVED || complaint.status === ComplaintStatus.REJECTED;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/complaints')}
        className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Complaints
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-mono text-gray-400">{complaint.id}</span>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">{complaint.title}</h1>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                complaint.status === ComplaintStatus.RESOLVED ? 'bg-green-100 text-green-800' :
                complaint.status === ComplaintStatus.REJECTED ? 'bg-red-100 text-red-800' :
                complaint.status === ComplaintStatus.IN_REVIEW ? 'bg-blue-100 text-blue-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {complaint.status}
              </span>
            </div>
            
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-6">
              {complaint.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
               <div className="flex items-center">
                 <Building className="w-4 h-4 mr-2" />
                 Category: <span className="text-gray-900 font-medium ml-1">{complaint.category}</span>
               </div>
               <div className="flex items-center">
                 <Clock className="w-4 h-4 mr-2" />
                 Submitted: <span className="text-gray-900 font-medium ml-1">{new Date(complaint.createdAt).toLocaleDateString()}</span>
               </div>
               <div className="flex items-center">
                 <UserIcon className="w-4 h-4 mr-2" />
                 By: <span className="text-gray-900 font-medium ml-1">{complaint.studentName}</span>
               </div>
            </div>
          </div>

          {/* Discussion Thread */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
             <div className="p-4 border-b border-gray-100 bg-gray-50">
               <h3 className="font-semibold text-gray-800">Discussion History</h3>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
               {complaint.replies.length === 0 ? (
                 <div className="text-center text-gray-400 py-10">
                   No replies yet. Start the conversation.
                 </div>
               ) : (
                 complaint.replies.map((reply) => {
                   const isMe = reply.senderId === user.id;
                   return (
                     <div key={reply.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                         isMe 
                           ? 'bg-indigo-600 text-white rounded-br-none' 
                           : 'bg-gray-100 text-gray-800 rounded-bl-none'
                       }`}>
                         <div className="flex items-center justify-between gap-4 mb-1">
                           <span className={`text-xs font-bold ${isMe ? 'text-indigo-200' : 'text-gray-500'}`}>
                             {reply.senderName}
                           </span>
                           <span className={`text-[10px] ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                             {new Date(reply.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           </span>
                         </div>
                         <p className="text-sm">{reply.message}</p>
                       </div>
                     </div>
                   );
                 })
               )}
               <div ref={messagesEndRef} />
             </div>

             <div className="p-4 border-t border-gray-100">
               <div className="flex gap-2">
                 <input
                   type="text"
                   placeholder="Type a reply..."
                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                   value={replyText}
                   onChange={(e) => setReplyText(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                 />
                 <button 
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   <Send className="w-5 h-5" />
                 </button>
               </div>
             </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Complaint Info</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Sent To</p>
                <p className="font-medium text-gray-900">{complaint.sentTo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Current Status</p>
                <div className="mt-1">
                 <span className={`px-2 py-1 rounded text-sm font-medium ${
                    complaint.status === ComplaintStatus.RESOLVED ? 'bg-green-100 text-green-800' :
                    complaint.status === ComplaintStatus.REJECTED ? 'bg-red-100 text-red-800' :
                    complaint.status === ComplaintStatus.IN_REVIEW ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
              </div>
            </div>

            {canManage && !isResolved && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Update Status</h4>
                <div className="space-y-2">
                  {Object.values(ComplaintStatus).map((status) => (
                     status !== complaint.status && (
                       <button
                         key={status}
                         onClick={() => handleStatusChange(status)}
                         className={`w-full py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                           status === ComplaintStatus.RESOLVED 
                             ? 'border-green-200 text-green-700 hover:bg-green-50' 
                             : status === ComplaintStatus.REJECTED
                             ? 'border-red-200 text-red-700 hover:bg-red-50'
                             : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                         }`}
                       >
                         Mark as {status}
                       </button>
                     )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};