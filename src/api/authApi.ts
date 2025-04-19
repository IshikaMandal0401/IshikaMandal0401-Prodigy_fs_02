import axios from 'axios';
import { User } from '../types';

const API_URL = 'http://localhost:3000/api';

export const registerUser = async (username: string, password: string, role: 'admin' | 'user' = 'user'): Promise<{ userId: number }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to register user');
  }
};

export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await axios.get(`${API_URL}/user/profile`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user profile');
  }
};