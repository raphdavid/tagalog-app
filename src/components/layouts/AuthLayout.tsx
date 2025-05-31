import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent-neutral">
        <div className="animate-bounce-light">
          <div className="h-16 w-16 rounded-full bg-primary-500 opacity-75"></div>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding/Illustration */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex md:w-1/2 bg-primary-500 text-white p-8 flex-col justify-center items-center"
      >
        <div className="max-w-md mx-auto">
          <div className="mb-6 flex justify-center">
            <BookOpen size={64} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Tagalog Learn</h1>
          <p className="text-xl mb-6">Start your journey to mastering Filipino language today.</p>
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-1">Learn at Your Own Pace</h3>
              <p>Our structured curriculum makes learning Tagalog enjoyable and effective.</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-1">Interactive Lessons</h3>
              <p>Practice pronunciation, vocabulary, and grammar through engaging activities.</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-1">Track Your Progress</h3>
              <p>See your improvement over time with detailed statistics and achievements.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right side - Auth Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 flex flex-col justify-center items-center p-8 bg-accent-neutral"
      >
        <div className="w-full max-w-md">
          <div className="md:hidden flex justify-center mb-8">
            <div className="bg-primary-500 p-3 rounded-full">
              <BookOpen size={40} className="text-white" />
            </div>
          </div>
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;