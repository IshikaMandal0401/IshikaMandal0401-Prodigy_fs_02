import React from 'react';
import { Employee } from '../../types';
import { Phone, Mail, Briefcase, Building, Calendar, DollarSign, MapPin } from 'lucide-react';

interface EmployeeDetailsProps {
  employee: Employee;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee }) => {
  return (
    <div className="bg-white overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-blue-50">
        <h3 className="text-lg leading-6 font-medium text-blue-900">
          Employee Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-blue-600">
          Personal details and application.
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Full name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {employee.first_name} {employee.last_name}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-blue-500" /> Email
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {employee.email}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-blue-500" /> Phone
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {employee.phone || 'Not provided'}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-teal-500" /> Position
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {employee.position}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Building className="w-4 h-4 mr-2 text-teal-500" /> Department
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {employee.department}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-teal-500" /> Hire Date
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {new Date(employee.hire_date).toLocaleDateString()}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-teal-500" /> Salary
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {employee.salary ? `$${employee.salary.toLocaleString()}` : 'Not provided'}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-amber-500" /> Address
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {employee.address ? (
                <div>
                  <p>{employee.address}</p>
                  <p>
                    {employee.city ? `${employee.city}, ` : ''}
                    {employee.state || ''} {employee.zip || ''}
                  </p>
                </div>
              ) : (
                'Not provided'
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default EmployeeDetails;