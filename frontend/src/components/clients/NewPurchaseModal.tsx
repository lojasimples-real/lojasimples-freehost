// filepath: /c:/Users/kauam/Loja simples 2.0/frontend/src/components/clients/NewPurchaseModal.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useClients } from '@/hooks/useClients';
import { useToast } from "@/components/ui/use-toast";
import moment from 'moment-timezone';
import { formatCurrency } from '@/lib/utils';

interface NewPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
}

export function NewPurchaseModal({ isOpen, onClose, clientId }: NewPurchaseModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: moment().tz("America/Sao_Paulo").format('YYYY-MM-DD'),
  });

  const { addPurchase } = useClients();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Remove currency symbol and format amount
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

      if (!formData.description.trim()) {
        toast({
          title: "Erro",
          description: "Por favor, insira uma descrição",
          variant: "destructive",
        });
        return;
      }

      const purchaseData = {
        clientId,
        description: formData.description,
        amount: parsedAmount,
        date: moment.tz(formData.date, "America/Sao_Paulo").toDate(),
      };

      console.log('Dados enviados:', purchaseData);
      
      await addPurchase.mutateAsync(purchaseData);

      setFormData({
        description: '',
        amount: '',
        date: moment().tz("America/Sao_Paulo").format('YYYY-MM-DD'),
      });
      
      onClose();
      
      toast({
        title: "Sucesso",
        description: "Compra registrada com sucesso",
      });
    } catch (error) {
      console.error('Erro ao adicionar compra:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar a compra",
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
          <DialogTitle>Nova Compra</DialogTitle>
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
            <Button type="submit">Adicionar Compra</Button>
          </div>  
        </form>
      </DialogContent>
    </Dialog>
  );
}