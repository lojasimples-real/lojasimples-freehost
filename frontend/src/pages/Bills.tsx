import { Layout } from "@/components/layout/Layout";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PlusCircle, AlertCircle, Edit, CheckCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { NewBillModal } from '@/components/bills/NewBillModal';
import { EditBillModal } from '@/components/bills/EditBillModal';
import { useBills } from '@/hooks/useBills';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { ResponsiveTable } from '@/components/layout/Mobile';

const Bills = () => {
  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);
  const [isEditBillModalOpen, setIsEditBillModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const { bills, isLoading, markAsPaid, deleteBill } = useBills();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const handleEdit = (bill) => {
    setSelectedBill(bill);
    setIsEditBillModalOpen(true);
  };

  const handleMarkAsPaid = (bill) => {
    setSelectedBill(bill);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmMarkAsPaid = () => {
    markAsPaid.mutate(selectedBill._id);
    setIsConfirmDialogOpen(false);
  };

  const handleDelete = (bill) => {
    setSelectedBill(bill);
    setIsDeleteConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteBill.mutate(selectedBill._id);
    setIsDeleteConfirmDialogOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Contas a Pagar</h1>
          <Button onClick={() => setIsNewBillModalOpen(true)} className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Nova Conta
          </Button>
        </div>

        {bills.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-8">
            <img src="/no-bills.svg" alt="No bills" className="w-64 h-64 mb-4" />
            <p className="text-gray-500">Você ainda não registrou nenhuma conta</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill._id}>
                    <TableCell>{bill.name}</TableCell>
                    <TableCell>
                      {new Date(bill.dueDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>R$ {bill.value.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-sm font-medium",
                          {
                            "bg-yellow-100 text-yellow-800": bill.status === "Pendente",
                            "bg-red-100 text-red-800": bill.status === "Vencido",
                            "bg-green-100 text-green-800": bill.status === "Pago",
                          }
                        )}
                      >
                        {bill.status === "Vencido" && <AlertCircle className="w-4 h-4" />}
                        {bill.status === "Pendente" && "Pendente"}
                        {bill.status === "Vencido" && "Vencido"}
                        {bill.status === "Pago" && "Pago"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(bill)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleMarkAsPaid(bill)}>
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(bill)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <NewBillModal 
          isOpen={isNewBillModalOpen}
          onClose={() => setIsNewBillModalOpen(false)}
        />
        <EditBillModal 
          isOpen={isEditBillModalOpen}
          onClose={() => setIsEditBillModalOpen(false)}
          bill={selectedBill}
        />

        <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Pagamento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza de que deseja marcar esta conta como paga?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmMarkAsPaid}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isDeleteConfirmDialogOpen} onOpenChange={setIsDeleteConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza de que deseja excluir esta conta?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default Bills;