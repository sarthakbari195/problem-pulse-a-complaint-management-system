import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  List, 
  LogOut, 
  User as UserIcon,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  if (!user) return <>{children}</>;

  const isStudent = user.role === UserRole.STUDENT;

  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/', 
      icon: LayoutDashboard 
    },
    ...(isStudent ? [
      { 
        label: 'New Complaint', 
        path: '/create', 
        icon: PlusCircle 
      }
    ] : []),
    { 
      label: 'All Complaints', 
      path: '/complaints', 
      icon: List 
    },
  ];

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={toggleMenu} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-indigo-900 text-white transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="h-16 flex items-center justify-between px-6 bg-indigo-950">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <span className="text-xl font-bold tracking-wide">ProblemPulse</span>
          </div>
          <button onClick={toggleMenu} className="lg:hidden text-gray-300 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-indigo-800">
            <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center">
              <span className="text-lg font-semibold">{user.name.charAt(0)}</span>
            </div>
            <div className="overflow-hidden">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-xs text-indigo-300 truncate">{user.role}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-indigo-700 text-white shadow-lg' 
                      : 'text-indigo-100 hover:bg-indigo-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-indigo-950 text-indigo-200 hover:bg-indigo-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm lg:hidden h-16 flex items-center px-4">
          <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900">
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 font-semibold text-gray-800">Problem Pulse</span>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};