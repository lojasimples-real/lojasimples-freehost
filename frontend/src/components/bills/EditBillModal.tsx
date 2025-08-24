import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBills } from '@/hooks/useBills';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

interface Bill {
  _id: string;
  name: string;
  value: number;
  dueDate: Date;
}

interface EditBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill;
}

export function EditBillModal({ isOpen, onClose, bill }: EditBillModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    dueDate: '',
  });
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const { editBill } = useBills();

  useEffect(() => {
    if (bill) {
      setFormData({
        name: bill.name,
        value: bill.value.toString().replace('.', ','),
        dueDate: new Date(bill.dueDate).toISOString().split('T')[0],
      });
    }
  }, [bill]);

  const handleValueChange = (e) => {
    const value = e.target.value.replace(',', '.');
    setFormData({ ...formData, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsConfirmDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await editBill.mutateAsync({
        ...formData,
        value: parseFloat(formData.value),
        dueDate: new Date(formData.dueDate),
        _id: bill._id,
      });
      onClose();
    } catch (error) {
      console.error('Erro ao editar conta:', error);
    }
    setIsConfirmDialogOpen(false);
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Conta</DialogTitle>
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
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
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
          <Button type="submit">Salvar</Button>
        </form>
      </DialogContent>
    </Dialog>

    <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Edição</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja salvar as alterações nesta conta?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}