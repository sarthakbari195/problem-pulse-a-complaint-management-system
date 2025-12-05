import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComplaintCategory, ComplaintStatus, User } from '../types';
import { getComplaints, saveComplaints } from '../services/mockData';
import { Send, Upload, ArrowLeft } from 'lucide-react';

interface ComplaintFormProps {
  user: User;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({ user }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ComplaintCategory.ACADEMIC,
    sentTo: 'HOD - CSE', // Default
  });

  const sentToOptions = [
    'HOD - CSE',
    'HOD - IT',
    'HOD - AIDS',
    'HOD - Mechanical',
    'HOD - Civil',
    'HOD - ECE',
    'Accounts Section',
    'Exam Cell',
    'Director',
    'Principal',
    'Hostel Warden'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const newComplaint = {
        id: `CMP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        studentId: user.id,
        studentName: user.name,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        sentTo: formData.sentTo,
        status: ComplaintStatus.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        replies: []
      };

      const existing = getComplaints();
      saveComplaints([newComplaint, ...existing]); // Add to top
      
      navigate('/complaints');
    } catch (error) {
      console.error('Failed to submit', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 bg-indigo-900 text-white">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold">Submit a Complaint</h1>
          <p className="text-indigo-200 mt-2">Fill in the details below to raise your issue.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as ComplaintCategory})}
              >
                {Object.values(ComplaintCategory).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Send To</label>
              <select
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={formData.sentTo}
                onChange={(e) => setFormData({...formData, sentTo: e.target.value})}
              >
                {sentToOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Complaint Title</label>
            <input
              type="text"
              required
              placeholder="Brief summary of the issue"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
            <textarea
              required
              rows={6}
              placeholder="Explain the issue in detail..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (Optional)</label>
             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
               <Upload className="w-8 h-8 mb-2 text-gray-400" />
               <span className="text-sm">Click to upload image or PDF</span>
               <input type="file" className="hidden" />
             </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium mr-4 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Complaint</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};