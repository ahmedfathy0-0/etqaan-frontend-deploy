import { api } from '@/lib/api';

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalSheikhs: number;
  totalBatches: number;
  totalAdmins: number;
  recentActivity: {
    todayRecords: number;
    weekRecords: number;
  };
}

export const getAdminStats = async () => {
  const response = await api.get<AdminStats>('/admin/stats');
  return response.data;
};
