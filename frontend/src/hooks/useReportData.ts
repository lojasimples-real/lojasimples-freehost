import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useReportData = () => {
  return useQuery({
    queryKey: ['reportData'],
    queryFn: async () => {
      const response = await api.get('/reports');
      return response.data;
    }
  });
};