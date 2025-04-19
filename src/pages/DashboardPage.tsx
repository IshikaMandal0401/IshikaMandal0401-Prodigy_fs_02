import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchEmployees, deleteEmployee } from '../api/employeeApi';
import { Employee } from '../types';
import EmployeeTable from '../components/employee/EmployeeTable';
import EmployeeDetails from '../components/employee/EmployeeDetails';
import EmployeeForm from '../components/employee/EmployeeForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { UserPlus, AlertTriangle } from 'lucide-react';
import { EmployeeFormData } from '../utils/validation';
import { createEmployee, updateEmployee } from '../api/employeeApi';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteConfirmEmployee, setDeleteConfirmEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch employees
  const loadEmployees = async (search = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchEmployees(search);
      setEmployees(data);
    } catch (err) {
      // setError('Failed to fetch employees. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    loadEmployees(term);
  };

  // Handle create employee
  const handleCreateEmployee = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    try {
      await createEmployee(data);
      setShowAddModal(false);
      loadEmployees(searchTerm);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create employee');
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update employee
  const handleUpdateEmployee = async (data: EmployeeFormData) => {
    if (!editEmployee) return;
    
    setIsSubmitting(true);
    try {
      await updateEmployee(editEmployee.id, data);
      setEditEmployee(null);
      loadEmployees(searchTerm);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update employee');
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete employee
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmEmployee) return;
    
    setIsSubmitting(true);
    try {
      await deleteEmployee(deleteConfirmEmployee.id);
      setDeleteConfirmEmployee(null);
      loadEmployees(searchTerm);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete employee');
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
          {/* <p className="text-gray-600 mt-1">Manage your organization's employees</p> */}
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            icon={<UserPlus className="w-5 h-5" />}
            size="lg"
          >
            Add Employee
          </Button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Employee Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onView={setViewEmployee}
          onEdit={setEditEmployee}
          onDelete={setDeleteConfirmEmployee}
          isAdmin={isAdmin}
          onSearch={handleSearch}
        />
      )}

      {/* View Employee Modal */}
      <Modal
        isOpen={Boolean(viewEmployee)}
        onClose={() => setViewEmployee(null)}
        title="Employee Details"
        maxWidth="lg"
      >
        {viewEmployee && <EmployeeDetails employee={viewEmployee} />}
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={Boolean(editEmployee)}
        onClose={() => setEditEmployee(null)}
        title="Edit Employee"
        maxWidth="lg"
      >
        {editEmployee && (
          <EmployeeForm
            initialData={editEmployee}
            onSubmit={handleUpdateEmployee}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Employee"
        maxWidth="lg"
      >
        <EmployeeForm
          onSubmit={handleCreateEmployee}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmEmployee)}
        onClose={() => setDeleteConfirmEmployee(null)}
        title="Confirm Deletion"
        maxWidth="sm"
      >
        {deleteConfirmEmployee && (
          <div>
            <div className="bg-red-50 p-4 rounded-md mb-4">
              <p className="text-red-700">
                Are you sure you want to delete the employee record for{' '}
                <span className="font-semibold">
                  {deleteConfirmEmployee.first_name} {deleteConfirmEmployee.last_name}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmEmployee(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                isLoading={isSubmitting}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DashboardPage;