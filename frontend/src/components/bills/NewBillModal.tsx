import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBills } from '@/hooks/useBills';
import { formatCurrency } from '@/lib/utils';

interface NewBillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewBillModal({ isOpen, onClose }: NewBillModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    dueDate: '',
  });

  const { addBill } = useBills();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Remove R$ and convert , to . for parsing
      const numericValue = formData.value
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim();
      
      const parsedValue = parseFloat(numericValue);
      
      if (isNaN(parsedValue)) {
        throw new Error('Valor inválido');
      }

      await addBill.mutateAsync({
        name: formData.name,
        value: numericValue,
        dueDate: formData.dueDate,
      });

      setFormData({ name: '', value: '', dueDate: '' });
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar conta:', error);
    }
  };

  const handleValueChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setFormData({ ...formData, value: '' });
      return;
    }
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(value) / 100);
    
    setFormData({ ...formData, value: formattedValue });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Nova Conta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label>Nome</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label>Valor</label>
              <Input
                type="text"
                value={formData.value}
                onChange={handleValueChange}
                placeholder="R$ 0,00"
              />
            </div>
            <div>
              <label>Data de Vencimento</label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}