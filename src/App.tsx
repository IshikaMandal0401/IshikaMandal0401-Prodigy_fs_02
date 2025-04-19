import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes with shared layout */}
          <Route element={<Layout requireAuth />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          
          {/* Admin-only routes */}
          <Route element={<Layout requireAuth adminOnly />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
          
          {/* Redirect from home to dashboard if authenticated */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;