import { z } from 'zod';

// User validation schemas
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  role: z.enum(['admin', 'user']).default('user'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// Employee validation schema
export const employeeSchema = z.object({
  first_name: z.string().min(2, 'First name is required and must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name is required and must be at least 2 characters'),
  email: z.string().email('Invalid email address format'),
  phone: z.string().optional().nullable(),
  position: z.string().min(2, 'Position is required'),
  department: z.string().min(2, 'Department is required'),
  hire_date: z.string().min(1, 'Hire date is required'),
  salary: z.number().positive('Salary must be a positive number').optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zip: z.string().optional().nullable(),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;