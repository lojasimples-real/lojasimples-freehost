import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ClientsTable = ({ clients }) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const sortedClients = [...clients].sort((a, b) => {
    if (sortConfig.key === null) {
      return 0;
    }
    if (sortConfig.key === 'name') {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    }
    if (sortConfig.key === 'totalDebt') {
      if (a.totalDebt < b.totalDebt) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a.totalDebt > b.totalDebt) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    }
    if (sortConfig.key === 'lastPaymentDate') {
      if (!a.lastPaymentDate) return sortConfig.direction === 'ascending' ? 1 : -1;
      if (!b.lastPaymentDate) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (new Date(a.lastPaymentDate) < new Date(b.lastPaymentDate)) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (new Date(a.lastPaymentDate) > new Date(b.lastPaymentDate)) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    if (sortConfig.direction === 'ascending') {
      return <ArrowUp className="w-4 h-4" />;
    }
    return <ArrowDown className="w-4 h-4" />;
  };

  const truncateName = (name: string, limit: number = 8) => {
    if (name.length <= limit) return name;
    return `${name.slice(0, limit)}...`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-4 font-medium text-gray-500">
              <button
                className="flex items-center gap-1 hover:text-gray-700"
                onClick={() => requestSort('name')}
              >
                Nome
                {getSortIcon('name')}
              </button>
            </th>
            <th className="text-left p-4 font-medium text-gray-500">
              <button
                className="flex items-center gap-1 hover:text-gray-700"
                onClick={() => requestSort('totalDebt')}
              >
                Valor Devido
                {getSortIcon('totalDebt')}
              </button>
            </th>
            <th className="text-left p-4 font-medium text-gray-500">
              <button
                className="flex items-center gap-1 hover:text-gray-700"
                onClick={() => requestSort('lastPaymentDate')}
              >
                Último Pagamento
                {getSortIcon('lastPaymentDate')}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedClients.map((client) => (
            <tr
              key={client._id}
              className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/clients/${client._id}`)}
            >
              <td className="p-4">
                  <span className="md:hidden">{truncateName(client.name)}</span>
                  <span className="hidden md:block">{client.name}</span>
                </td>
              <td className="p-4">R$ {client.totalDebt.toFixed(2)}</td>
              <td className="p-4">
                {client.lastPaymentDate 
                  ? new Date(client.lastPaymentDate).toLocaleDateString("pt-BR")
                  : "Sem pagamentos"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};