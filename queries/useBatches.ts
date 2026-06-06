import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBatches, getBatchById, enrollStudentsInBatch, createBatch, deleteBatch, updateBatch } from '@/api/batches';
import type { Batch } from '@/api/batches';

// Additional types for specific endpoints can be defined here or in the API module
interface Student {
  id: number;
  batch_student_id: number;
  name: string;
  points: number;
  avatarIndex?: number;
  rank?: number;
}

export function useBatches() {
  return useQuery({
    queryKey: ['batches'],
    queryFn: getBatches,
  });
}

export function useBatchDetails(batchId: string | number) {
  return useQuery({
    queryKey: ['batch', batchId],
    queryFn: async () => {
      const data = await getBatchById(batchId);
      
      const studentsList = data.batch_students?.map((bs: any, index: number) => ({
        id: bs.student.id,
        batch_student_id: bs.id,
        name: bs.student.full_name,
        points: bs.league_points || 0,
        avatarIndex: index % 12,
      })) || [];

      studentsList.sort((a: Student, b: Student) => b.points - a.points);
      
      return { batch: data, students: studentsList };
    },
    enabled: !!batchId,
  });
}

export function useEnrollStudents() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ batchId, studentIds }: { batchId: string | number, studentIds: number[] }) => 
      enrollStudentsInBatch(batchId, studentIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['batch', variables.batchId] });
    },
  });
}

export function useCreateBatch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => createBatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}

export function useUpdateBatch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ batchId, data }: { batchId: number; data: any }) => updateBatch(batchId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['batch', variables.batchId] });
    },
  });
}

export function useDeleteBatch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (batchId: number) => deleteBatch(batchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}
