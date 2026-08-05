import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBatchExams, createExam, getExamDetails, saveExamGrades } from '@/api/exams';
import type { Exam } from '@/api/exams';

export function useBatchExams(batchId: string | number) {
  return useQuery({
    queryKey: ['exams', 'batch', String(batchId)],
    queryFn: () => getBatchExams(batchId),
    enabled: !!batchId,
  });
}

export function useExamDetails(examId: string | number) {
  return useQuery({
    queryKey: ['exam', String(examId)],
    queryFn: () => getExamDetails(examId),
    enabled: !!examId,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Exam>) => createExam(data),
    onSuccess: (_, variables) => {
      if (variables.batch_id) {
        queryClient.invalidateQueries({ queryKey: ['batch', String(variables.batch_id)] });
      }
    },
  });
}

export function useSaveExamGrades() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ examId, grades }: { examId: string | number, grades: any[], batchId?: string | number }) => saveExamGrades(examId, grades),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exam', String(variables.examId)] });
      if (variables.batchId) {
        queryClient.invalidateQueries({ queryKey: ['batch', String(variables.batchId)] });
      }
    },
  });
}
