import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSession } from '@/api/sessions';
import type { CreateSessionPayload } from '@/api/sessions';

export function useCreateSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateSessionPayload) => createSession(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['batch', variables.batchId] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}
