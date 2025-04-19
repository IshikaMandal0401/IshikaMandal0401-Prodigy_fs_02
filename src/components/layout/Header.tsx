import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <User className="w-6 h-6 mr-2" />
          EmployeeHub
        </Link>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            <div className="hidden sm:block">
              <span className="text-blue-100">
                {/* Logged in as: <span className="font-semibold">{user?.username}</span> */}
                {user?.role === 'admin' && (
                  <span className="ml-2 text-xs bg-amber-500 text-amber-950 px-2 py-0.5 rounded-full">
                    {/* Admin */}
                  </span>
                )}
              </span>
            </div>
            
            <nav className="flex items-center gap-4">
              <Link to="/dashboard" className="hover:text-blue-200 transition-colors">
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <Link to="/users" className="hover:text-blue-200 transition-colors">
                  Manage Users
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="flex items-center bg-blue-800 hover:bg-blue-900 px-3 py-1.5 rounded transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </nav>
          </div>
        ) : (
          <nav className="flex items-center gap-4">
            <Link to="/login" className="hover:text-blue-200 transition-colors">
              Login
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;