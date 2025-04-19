import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema, EmployeeFormData } from '../../utils/validation';
import { Employee } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { User, Mail, Phone, Briefcase, Calendar, DollarSign, MapPin } from 'lucide-react';

interface EmployeeFormProps {
  initialData?: Partial<Employee>;
  onSubmit: (data: EmployeeFormData) => void;
  isSubmitting: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      first_name: initialData.first_name || '',
      last_name: initialData.last_name || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      position: initialData.position || '',
      department: initialData.department || '',
      hire_date: initialData.hire_date || new Date().toISOString().split('T')[0],
      salary: initialData.salary || null,
      address: initialData.address || '',
      city: initialData.city || '',
      state: initialData.state || '',
      zip: initialData.zip || '',
    },
  });

  const departments = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Product', label: 'Product' },
    { value: 'Design', label: 'Design' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Customer Support', label: 'Customer Support' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            id="first_name"
            placeholder="John"
            icon={<User className="h-5 w-5 text-gray-400" />}
            error={errors.first_name?.message}
            {...register('first_name')}
          />
          <Input
            label="Last Name"
            id="last_name"
            placeholder="Doe"
            icon={<User className="h-5 w-5 text-gray-400" />}
            error={errors.last_name?.message}
            {...register('last_name')}
          />
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Phone"
            id="phone"
            placeholder="(555) 123-4567"
            icon={<Phone className="h-5 w-5 text-gray-400" />}
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>
      </div>

      <div className="bg-teal-50 p-4 rounded-md mb-6">
        <h3 className="text-lg font-semibold text-teal-800 mb-2">Employment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Position"
            id="position"
            placeholder="Software Developer"
            icon={<Briefcase className="h-5 w-5 text-gray-400" />}
            error={errors.position?.message}
            {...register('position')}
          />
          <Select
            label="Department"
            id="department"
            options={departments}
            error={errors.department?.message}
            {...register('department')}
          />
          <Input
            label="Hire Date"
            id="hire_date"
            type="date"
            icon={<Calendar className="h-5 w-5 text-gray-400" />}
            error={errors.hire_date?.message}
            {...register('hire_date')}
          />
          <Input
            label="Salary"
            id="salary"
            type="number"
            placeholder="75000"
            icon={<DollarSign className="h-5 w-5 text-gray-400" />}
            error={errors.salary?.message}
            {...register('salary', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-md mb-6">
        <h3 className="text-lg font-semibold text-amber-800 mb-2">Address Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Street Address"
            id="address"
            placeholder="123 Main St"
            icon={<MapPin className="h-5 w-5 text-gray-400" />}
            error={errors.address?.message}
            {...register('address')}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              id="city"
              placeholder="New York"
              error={errors.city?.message}
              {...register('city')}
            />
            <Input
              label="State"
              id="state"
              placeholder="NY"
              error={errors.state?.message}
              {...register('state')}
            />
            <Input
              label="ZIP Code"
              id="zip"
              placeholder="10001"
              error={errors.zip?.message}
              {...register('zip')}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {initialData.id ? 'Update Employee' : 'Create Employee'}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;