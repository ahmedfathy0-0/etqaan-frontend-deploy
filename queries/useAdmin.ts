import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '@/api/admin';

export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
  });
}
