import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useClients } from '@/hooks/useClients';
import { useToast } from "@/components/ui/use-toast";
import moment from 'moment-timezone';
import { formatCurrency } from '@/lib/utils';

interface NewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  currentDebt: number;
}

export function NewPaymentModal({ isOpen, onClose, clientId, currentDebt }: NewPaymentModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    amount: '',
    date: moment().tz("America/Sao_Paulo").format('YYYY-MM-DD'),
    observation: ''
  });

  const { addPayment } = useClients();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Remove currency formatting and convert to number
      const numericValue = formData.amount
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim();
      
      const parsedAmount = parseFloat(numericValue);
      
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        toast({
          title: "Erro",
          description: "Por favor, insira um valor válido",
          variant: "destructive",
        });
        return;
      }

      // debt validation
      if (parsedAmount > currentDebt) {
        toast({
          title: "Erro",
          description: "O valor do pagamento não pode ser maior que a dívida atual",
          variant: "destructive",
        });
        return;
      }

      if (currentDebt <= 0) {
        toast({
          title: "Erro",
          description: "Este cliente não possui dívidas pendentes",
          variant: "destructive",
        });
        return;
      }

      const paymentData = {
        clientId,
        amount: parsedAmount,
        date: moment.tz(formData.date, "America/Sao_Paulo").toDate(),
        observation: formData.observation
      };

      console.log('Enviando pagamento:', paymentData);

      await addPayment.mutateAsync(paymentData);
      
      setFormData({
        amount: '',
        date: moment().tz("America/Sao_Paulo").format('YYYY-MM-DD'),
        observation: ''
      });
      
      onClose();
      
      toast({
        title: "Sucesso",
        description: "Pagamento registrado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao adicionar pagamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar o pagamento",
        variant: "destructive",
      });
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setFormData({ ...formData, amount: '' });
      return;
    }
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(value) / 100);
    
    setFormData({ ...formData, amount: formattedValue });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Novo Pagamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
          <div>
              <label>Descrição</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <label>Valor</label>
              <Input
                type="text"
                value={formData.amount}
                onChange={handleAmountChange}
                placeholder="R$ 0,00"
              />
            </div>
            <div>
              <label>Data</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button type="submit">Adicionar Pagamento</Button>
          </div>  
        </form>
      </DialogContent>
    </Dialog>
  );
}