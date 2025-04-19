import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginSchema, LoginFormData } from '../utils/validation';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, Lock } from 'lucide-react';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      await login(data.username, data.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide more specific error messages based on the error type
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK') {
          setApiError('Unable to connect to the server. Please ensure the backend is running at http://localhost:3000.');
        } else if (error.response) {
          // Server responded with an error status code
          setApiError(error.response.data?.message || `Server error: ${error.response.status}`);
        } else {
          setApiError('Error sending request to the server. Please try again.');
        }
      } else {
        setApiError('Invalid username or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Employee Management System
          </p>
        </div>
        
        {apiError && (
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {apiError}
                </h3>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md -space-y-px">
            <Input
              id="username"
              type="text"
              placeholder="Username"
              label="Username"
              icon={<User className="h-5 w-5 text-gray-400" />}
              error={errors.username?.message}
              {...register('username')}
            />
            
            <div className="mt-4">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                label="Password"
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                error={errors.password?.message}
                {...register('password')}
              />
            </div>
          </div>

          <div className="text-sm text-center">
           
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;