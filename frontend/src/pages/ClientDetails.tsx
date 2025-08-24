import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientInfo } from "@/components/client-details/ClientInfo";
import { ActionButtons } from "@/components/client-details/ActionButtons";
import { TransactionsTable } from "@/components/client-details/TransactionsTable";
import { NewPurchaseModal } from "@/components/clients/NewPurchaseModal";
import { NewPaymentModal } from "@/components/clients/NewPaymentModal";
import { ChargeModal } from '@/components/clients/ChargeModal';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import api from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment-timezone';
import { ResponsiveTable } from '@/components/layout/Mobile';

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [client, setClient] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewPurchaseModalOpen, setIsNewPurchaseModalOpen] = useState(false);
  const [isNewPaymentModalOpen, setIsNewPaymentModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmQuitOpen, setIsConfirmQuitOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isConfirmDeleteClientOpen, setIsConfirmDeleteClientOpen] = useState(false);
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);

  const fetchClientDetails = async () => {
    try {
      const response = await api.get(`/client/${id}`);
      setClient(response.data.client);
      setTransactions(response.data.transactions || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar detalhes do cliente",
        description: "Não foi possível carregar os detalhes do cliente",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, [id, toast]);

  const handleModalClose = () => {
    setIsNewPurchaseModalOpen(false);
    setIsNewPaymentModalOpen(false);
    fetchClientDetails(); // Atualiza os dados do cliente
  };

  const handleDelete = (transactionId: string) => {
    setSelectedTransaction(transactionId);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/client/${id}/transaction/${selectedTransaction}`);
      toast({
        title: "Sucesso",
        description: "Transação excluída com sucesso",
      });
      fetchClientDetails();
    } catch (error) {
      toast({
        title: "Erro ao excluir transação",
        description: "Não foi possível excluir a transação",
        variant: "destructive",
      });
    } finally {
      setIsConfirmDeleteOpen(false);
    }
  };

  const handleQuit = () => {
    if (!client?.currentDebt || client.currentDebt <= 0) {
      toast({
        title: "Erro",
        description: "Este cliente não possui dívidas pendentes",
        variant: "destructive",
      });
      return;
    }
    setIsConfirmQuitOpen(true);
  };

  const handleConfirmQuit = async () => {
    try {
      await api.post(`/client/${id}/quit`);
      toast({
        title: "Sucesso",
        description: "Dívida quitada com sucesso",
      });
      fetchClientDetails();
    } catch (error) {
      toast({
        title: "Erro ao quitar dívida",
        description: "Não foi possível quitar a dívida",
        variant: "destructive",
      });
    } finally {
      setIsConfirmQuitOpen(false);
    }
  };

  const handleDeleteClient = () => {
    setIsConfirmDeleteClientOpen(true);
  };

  const handleConfirmDeleteClient = async () => {
    try {
      await api.delete(`/client/${id}`);
      toast({
        title: "Sucesso",
        description: "Cliente excluído com sucesso",
      });
      navigate("/clients");
    } catch (error) {
      toast({
        title: "Erro ao excluir cliente",
        description: "Não foi possível excluir o cliente",
        variant: "destructive",
      });
    } finally {
      setIsConfirmDeleteClientOpen(false);
    }
  };

  if (!client) {
    return <div>Carregando...</div>;
  }

  // Ordenar transações por data (mais recentes no topo)
  const sortedTransactions = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Detalhes</h1>
          <Button className="bg-red-500" onClick={handleDeleteClient}>
            Excluir Cliente
          </Button>
        </div>
        <ClientInfo client={client} />
        <ActionButtons 
          onAddPurchase={() => setIsNewPurchaseModalOpen(true)} 
          onAddPayment={() => setIsNewPaymentModalOpen(true)}
          onQuit={handleQuit}
          onCharge={() => setIsChargeModalOpen(true)}
        />

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-8">
            <img src="/no-transactions.svg" alt="No transactions" className="w-64 h-64 mb-4" />
            <p className="text-gray-500">Você ainda não registrou nada aqui</p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="purchases">Compras</TabsTrigger>
              <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <TransactionsTable
                transactions={sortedTransactions}
                onDelete={handleDelete}
              />
            </TabsContent>

            <TabsContent value="purchases" className="mt-6">
              <TransactionsTable
                transactions={sortedTransactions.filter((t) => t.type === "purchase")}
                onDelete={handleDelete}
              />
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <TransactionsTable
                transactions={sortedTransactions.filter((t) => t.type === "payment")}
                onDelete={handleDelete}
              />
            </TabsContent>
          </Tabs>
        )}

        <NewPurchaseModal 
          isOpen={isNewPurchaseModalOpen} 
          onClose={handleModalClose} 
          clientId={id} 
        />
        <NewPaymentModal 
          isOpen={isNewPaymentModalOpen} 
          onClose={handleModalClose} 
          clientId={id}
          currentDebt={client?.currentDebt || 0}
        />
        <ChargeModal 
          isOpen={isChargeModalOpen}
          onClose={() => setIsChargeModalOpen(false)}
          client={client}
        />
          
        <AlertDialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza de que deseja excluir esta transação?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isConfirmQuitOpen} onOpenChange={setIsConfirmQuitOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Quitação</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza de que deseja quitar a dívida total deste cliente?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmQuit}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isConfirmDeleteClientOpen} onOpenChange={setIsConfirmDeleteClientOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão do Cliente</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza de que deseja excluir este cliente? Esta ação é permanente e não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDeleteClient}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default ClientDetails;