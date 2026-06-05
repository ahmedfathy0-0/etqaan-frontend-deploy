import { api } from '@/lib/api';

export interface Exam {
  id: number;
  title: string;
  exam_date: string;
  max_score: number;
  batch_id: number;
  created_at: string;
}

export interface ExamWithDetails extends Exam {
  exam_grades: any[];
}

export const getBatchExams = async (batchId: number | string) => {
  const response = await api.get<Exam[]>(`/batches/${batchId}/exams`);
  return response.data;
};

export const createExam = async (data: Partial<Exam>) => {
  const payload = {
    batchId: data.batch_id,
    title: data.title,
    examDate: data.exam_date,
    maxScore: data.max_score,
  };
  const response = await api.post<Exam>('/exams', payload);
  return response.data;
};

export const getExamDetails = async (examId: number | string) => {
  const response = await api.get<ExamWithDetails>(`/exams/${examId}`);
  return response.data;
};

export const saveExamGrades = async (examId: number | string, grades: any[]) => {
  const response = await api.post(`/exams/${examId}/results`, { results: grades });
  return response.data;
};
