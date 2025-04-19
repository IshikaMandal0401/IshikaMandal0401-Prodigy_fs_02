import axios from 'axios';
import { Employee } from '../types';

const API_URL = 'http://localhost:3000/api';

export const fetchEmployees = async (searchTerm?: string): Promise<Employee[]> => {
  try {
    const response = await axios.get(`${API_URL}/employees`, {
      params: searchTerm ? { search: searchTerm } : {},
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch employees');
  }
};

export const fetchEmployeeById = async (id: string): Promise<Employee> => {
  try {
    const response = await axios.get(`${API_URL}/employees/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch employee details');
  }
};

export const createEmployee = async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> => {
  try {
    const response = await axios.post(`${API_URL}/employees`, employeeData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to create employee');
  }
};

export const updateEmployee = async (id: number, employeeData: Partial<Employee>): Promise<Employee> => {
  try {
    const response = await axios.put(`${API_URL}/employees/${id}`, employeeData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update employee');
  }
};

export const deleteEmployee = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/employees/${id}`);
  } catch (error) {
    throw new Error('Failed to delete employee');
  }
};