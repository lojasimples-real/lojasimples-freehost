import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      const response = await api.get('/dashboard');
      return response.data;
    }
  });
};