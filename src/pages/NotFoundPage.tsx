import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-accent-neutral flex flex-col items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-6">
          <span className="text-9xl font-bold text-primary-500">404</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        
        <p className="text-gray-600 mb-8">
          Oops! The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        
        <Link 
          to="/" 
          className="btn-primary inline-flex items-center gap-2"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;