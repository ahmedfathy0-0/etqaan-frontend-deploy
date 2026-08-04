import { api } from '@/lib/api';

export interface Batch {
  id: number;
  name: string;
  schedule_description?: string;
  term_id: number;
  _count?: {
    batch_students: number;
  };
}

export const getBatches = async () => {
  const response = await api.get<Batch[]>('/batches');
  return response.data;
};

export const getPublicBatches = async () => {
  const response = await api.get<Batch[]>('/batches/public');
  return response.data;
};

export const getBatchById = async (batchId: string | number) => {
  const response = await api.get(`/batches/${batchId}`);
  return response.data;
};

export const enrollStudentsInBatch = async (batchId: string | number, studentIds: number[]) => {
  const response = await api.post(`/batches/${batchId}/bulk-enroll`, { studentIds });
  return response.data;
};

export const createBatch = async (data: any) => {
  const response = await api.post('/batches', data);
  return response.data;
};

export const updateBatch = async (batchId: number | string, data: any) => {
  const response = await api.put(`/batches/${batchId}`, data);
  return response.data;
};

export const deleteBatch = async (batchId: number) => {
  const response = await api.delete(`/batches/${batchId}`);
  return response.data;
};
