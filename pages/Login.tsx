import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { getUsers, initializeData } from '../services/mockData';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Initialize mock data on first load of login screen
  React.useEffect(() => {
    initializeData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = getUsers();
    const user = users.find(u => u.email === email);

    // Simple password check mock (in real app, use bcrypt)
    if (password === 'password') {
      onLogin(user);
      navigate('/');
    } else {
      setError('Invalid credentials. (Try password: "password")');
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    const users = getUsers();
    const user = users.find(u => u.role === role);
    if (user) {
      onLogin(user);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 bg-indigo-950 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-800 mb-4">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Problem Pulse</h1>
          <p className="text-indigo-300 text-sm mt-2">College Complaint Management System</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-4 uppercase tracking-wider">Quick Demo Login</p>
            <div className="space-y-2">
              <button onClick={() => handleDemoLogin(UserRole.STUDENT)} className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors">
                <span>Student Demo</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={() => handleDemoLogin(UserRole.HOD)} className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors">
                <span>HOD/Faculty Demo</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={() => handleDemoLogin(UserRole.ADMIN)} className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors">
                <span>Admin Demo</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};