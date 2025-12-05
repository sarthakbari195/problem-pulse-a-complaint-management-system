import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ComplaintForm } from './pages/ComplaintForm';
import { ComplaintList } from './pages/ComplaintList';
import { ComplaintDetails } from './pages/ComplaintDetails';
import { User, UserRole } from './types';
import { initializeData } from './services/mockData';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeData();
    const storedUser = localStorage.getItem('pp_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('pp_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pp_user');
  };

  if (isLoading) return null;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
        } />
        
        <Route path="/*" element={
          !user ? (
            <Navigate to="/login" replace />
          ) : (
            <Layout user={user} onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<Dashboard user={user} />} />
                
                {/* Student only routes */}
                {user.role === UserRole.STUDENT && (
                  <Route path="/create" element={<ComplaintForm user={user} />} />
                )}

                <Route path="/complaints" element={<ComplaintList user={user} />} />
                <Route path="/complaints/:id" element={<ComplaintDetails user={user} />} />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          )
        } />
      </Routes>
    </Router>
  );
};

export default App;