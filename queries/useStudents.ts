import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudents, createStudent } from '@/api/students';
import type { NewStudentData } from '@/api/students';

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: NewStudentData) => createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}
