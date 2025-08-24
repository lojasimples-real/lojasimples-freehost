import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useClients } from '@/hooks/useClients';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import MaskedInput from 'react-text-mask';
import { useQueryClient } from '@tanstack/react-query';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  phone: string;
  address: string;
}

export function NewClientModal({ isOpen, onClose }: NewClientModalProps) {
  const { addClient, clients } = useClients();
  const { control, handleSubmit, reset } = useForm<FormData>();
  const queryClient = useQueryClient();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingClient, setPendingClient] = useState<FormData | null>(null);

  const checkClientExists = (name: string, phone: string) => {
    return clients.some(client => client.name === name || client.phone === phone);
  };

  const onSubmit = async (data: FormData) => {
    if (checkClientExists(data.name, data.phone)) {
      setPendingClient(data);
      setIsConfirmOpen(true);
      return;
    }
    await handleAddClient(data);
  };

  const handleAddClient = async (data: FormData) => {
    try {
      const formattedPhone = data.phone.replace(/\D/g, ''); // Remove formatação
      await addClient.mutateAsync({ 
        ...data, 
        phone: formattedPhone,
        totalPurchase: 0,
        totalPayments: 0,
        totalDebt: 0,
        lastPaymentDate: new Date().toISOString()
      });
      reset();
      onClose();
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
    }
  };

  const handleConfirmAddClient = async () => {
    if (pendingClient) {
      await handleAddClient(pendingClient);
      setPendingClient(null);
      setIsConfirmOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>Preencha os detalhes do novo cliente.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label>Nome</label>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => <Input {...field} />}
              />
            </div>
            <div>
              <label>Telefone</label>
              <Controller
                name="phone"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <MaskedInput
                    mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                    {...field}
                    render={(ref, props) => (
                      <Input ref={ref} {...props} placeholder="Whatsapp" />
                    )}
                  />
                )}
              />
            </div>
            <div>
              <label>Endereço</label>
              <Controller
                name="address"
                control={control}
                defaultValue=""
                render={({ field }) => <Input {...field} />}
              />
            </div>
            <div className="mt-4">
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação</AlertDialogTitle>
            <AlertDialogDescription>
              Um cliente com o mesmo nome ou número de telefone já existe. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAddClient}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}