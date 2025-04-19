import React from 'react';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import { Outlet, Navigate } from 'react-router-dom';

interface LayoutProps {
  requireAuth?: boolean;
  adminOnly?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  requireAuth = false,
  adminOnly = false
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check authentication if required
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check admin role if required
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} EmployeeHub - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;