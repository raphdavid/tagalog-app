import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout Components
import AuthLayout from './components/layouts/AuthLayout';
import DashboardLayout from './components/layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import UnitPage from './pages/UnitPage';
import LessonPage from './pages/LessonPage';
import AdminPage from './pages/AdminPage';
import SubscribePage from './pages/SubscribePage';
import NotFoundPage from './pages/NotFoundPage';
import FlashcardGamePage from './pages/FlashcardGamePage';

// Context & Utils
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent-neutral">
        <div className="animate-bounce-light">
          <div className="h-16 w-16 rounded-full bg-primary-500 opacity-75"></div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/unit/:id" element={<UnitPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/flashcards/:id" element={<FlashcardGamePage />} />
          <Route path="/subscribe" element={<SubscribePage />} />
        </Route>

        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          } 
        />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;