import { api } from '@/lib/api';

export interface AvailableStudent {
  id: number;
  full_name: string;
  guardian_name?: string;
  guardian_phone?: string;
  gender?: "male" | "female";
  user_id?: number | null;
  user?: {
    id: number;
    name: string;
    email: string;
    plain_password?: string;
  } | null;
}

export interface NewStudentData {
  full_name: string;
  guardian_name: string;
  guardian_phone: string;
  gender: "male" | "female";
}

export const getStudents = async () => {
  const response = await api.get<AvailableStudent[]>('/students');
  return response.data;
};

export const createStudent = async (data: NewStudentData) => {
  const response = await api.post<AvailableStudent>('/students', data);
  return response.data;
};

export const updateStudent = async (studentId: number, data: Partial<NewStudentData>) => {
  const response = await api.put<AvailableStudent>(`/students/${studentId}`, data);
  return response.data;
};

export const deleteStudent = async (studentId: number) => {
  const response = await api.delete(`/students/${studentId}`);
  return response.data;
};
