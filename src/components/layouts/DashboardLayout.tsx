import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Home, BookOpen as Book, Award, Settings, 
  LogOut, Menu, X, UserCircle, CreditCard
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { tier } = useSubscription();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarLinks = [
    { to: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/unit/1', icon: <Book size={20} />, label: 'Units' },
    { to: '/subscribe', icon: <CreditCard size={20} />, label: 'Subscribe' },
  ];

  return (
    <div className="min-h-screen bg-accent-neutral flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar} 
              className="mr-2 md:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            <NavLink to="/dashboard" className="flex items-center gap-2">
              <BookOpen className="text-primary-500" size={28} />
              <span className="text-xl font-bold text-primary-500">Tagalog Learn</span>
            </NavLink>
          </div>
          
          <div className="flex items-center gap-3">
            {tier && tier !== 'free' && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-peach text-gray-800">
                {tier === 'premium' ? 'Premium' : 'Basic'} Plan
              </span>
            )}
            <div className="relative group">
              <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100">
                <UserCircle size={28} className="text-gray-600" />
                <span className="hidden md:block text-sm font-medium">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </button>
              
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <NavLink 
                  to="/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile Settings
                </NavLink>
                <button 
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:w-64 md:min-h-0 md:shadow-none`}
      >
        <div className="p-4 flex justify-between items-center md:hidden">
          <div className="flex items-center gap-2">
            <BookOpen className="text-primary-500" size={24} />
            <span className="font-bold text-lg text-primary-500">Tagalog Learn</span>
          </div>
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h4 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Account
            </h4>
            <ul className="mt-2 space-y-2">
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </NavLink>
              </li>
              <li>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-red-600 hover:bg-gray-100 transition-colors text-left"
                >
                  <LogOut size={20} />
                  <span>Sign out</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex">
        <div className="hidden md:block md:w-64 flex-shrink-0"></div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 px-4 py-8 md:px-8"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;