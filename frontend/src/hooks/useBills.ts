import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useBills = () => {
  const queryClient = useQueryClient();

  const { data: bills, isLoading } = useQuery({
    queryKey: ['bills'],
    queryFn: async () => {
      const response = await api.get('/bills');
      return response.data;
    },
  });

  const addBill = useMutation({
    mutationFn: async (newBill) => {
      const response = await api.post('/bills', newBill);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });

  const editBill = useMutation({
    mutationFn: async (updatedBill: { _id: string; amount: number; dueDate: string; description?: string }) => {
      const response = await api.put(`/bills/${updatedBill._id}`, updatedBill);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });

  const markAsPaid = useMutation({
    mutationFn: async (billId) => {
      const response = await api.patch(`/bills/${billId}/mark-as-paid`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });

  const deleteBill = useMutation({
    mutationFn: async (billId) => {
      const response = await api.delete(`/bills/${billId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });

  return {
    bills,
    isLoading,
    addBill,
    editBill,
    markAsPaid,
    deleteBill,
  };
};