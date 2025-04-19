import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../utils/validation';
import { registerUser } from '../api/authApi';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { UserPlus, AlertTriangle } from 'lucide-react';

const UsersPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'user',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await registerUser(data.username, data.password, data.role);
      setSuccess(`User "${data.username}" created successfully!`);
      reset(); // Reset form after successful submission
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create user');
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Create and manage system users</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
          Create New User
        </h2>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-500 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-700">{success}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Username"
            id="username"
            placeholder="Enter username"
            error={errors.username?.message}
            {...register('username')}
          />
          
          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            {...register('password')}
          />
          
          <Input
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          
          <Select
            label="Role"
            id="role"
            options={[
              { value: 'user', label: 'Regular User' },
              { value: 'admin', label: 'Administrator' },
            ]}
            error={errors.role?.message}
            {...register('role')}
          />
          
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full"
            >
              Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersPage;