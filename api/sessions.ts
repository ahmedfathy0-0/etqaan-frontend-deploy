import { api } from '@/lib/api';

export interface CreateSessionPayload {
  batchId: number;
  date: string;
  records: any[];
}

export const createSession = async (payload: CreateSessionPayload) => {
  const response = await api.post('/sessions', payload);
  return response.data;
};
