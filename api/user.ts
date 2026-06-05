import { api } from '@/lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  plain_password?: string;
}

export const getUsers = async () => {
  const response = await api.get<User[]>('/user');
  return response.data;
};

export const createUser = async (data: Partial<User>) => {
  const response = await api.post<User>('/user', data);
  return response.data;
};

export const deleteUser = async (userId: number) => {
  const response = await api.delete(`/user/${userId}`);
  return response.data;
};
