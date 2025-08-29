import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ClientsTable } from "@/components/dashboard/ClientsTable";
import { Users, AlertCircle, DollarSign, UserPlus } from "lucide-react";
import { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useStoreSettings } from "@/hooks/useStoreSettings";
import FilterDropdown, { FilterOption } from "@/components/dashboard/FilterDropdown";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState<FilterOption>("todos");
  const { data, error, isLoading } = useDashboardData();
  const { storeName } = useStoreSettings();

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Ocorreu um erro: {error.message}</div>; 
  
  const filteredClients = data?.clients?.filter(client => {
    const matchesSearchTerm = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const lastPurchaseDate = client.purchases.length > 0
      ? new Date(Math.max(...client.purchases.map(purchase => new Date(purchase.date))))
      : null;
    const lastPaymentDate = client.payments.length > 0
      ? new Date(Math.max(...client.payments.map(payment => new Date(payment.date))))
      : null;
    const daysSinceLastPurchase = lastPurchaseDate ? (new Date().getTime() - lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24) : 0;
    const daysSinceLastPayment = lastPaymentDate ? (new Date().getTime() - lastPaymentDate.getTime()) / (1000 * 60 * 60 * 24) : daysSinceLastPurchase;
    const isLate = filterOption === "atrasados" ? daysSinceLastPurchase > 30 && daysSinceLastPayment > 30 : true;
    return matchesSearchTerm && isLate;
  }) || [];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{storeName || 'Minha Loja'}</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-96">
            <SearchBar onSearch={setSearchTerm} />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <FilterDropdown onFilterChange={setFilterOption} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            title="Total de Clientes"
            value={data.clientsCount.toString()}
            icon={Users}
          />
          <StatsCard
            title="Clientes Atrasados"
            value={data.latePaymentsCount.toString()}
            icon={AlertCircle}
            variant="danger"
          />
          <StatsCard
            title="Total em Dívidas"
            value={`R$ ${data.totalDebt.toFixed(2)}`}
            icon={DollarSign}
            variant="warning"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Clientes Recentes
          </h2>
          <ClientsTable clients={filteredClients} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;