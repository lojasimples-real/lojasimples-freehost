import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/pt-br';

interface FinancialSummaryProps {
  data: {
    totalDebt: number;
    totalPayments: number;
    totalPurchases: number;
    totalPaymentsChange: number;
    totalPurchasesChange: number;
  };
}

// Mapa de meses em português
const monthsInPortuguese: { [key: string]: string } = {
  'January': 'Janeiro',
  'February': 'Fevereiro',
  'March': 'Março',
  'April': 'Abril',
  'May': 'Maio',
  'June': 'Junho',
  'July': 'Julho',
  'August': 'Agosto',
  'September': 'Setembro',
  'October': 'Outubro',
  'November': 'Novembro',
  'December': 'Dezembro'
};

export const FinancialSummary = ({ data }: FinancialSummaryProps) => {
  // Obtém o mês atual em inglês e converte para português
  const currentMonthInEnglish = moment().format('MMMM');
  const currentMonth = monthsInPortuguese[currentMonthInEnglish];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const summaryData = [
    {
      title: `Pagamentos de compras em ${currentMonth}`,
      value: formatCurrency(data.totalPayments),
      change: `${data.totalPaymentsChange.toFixed(1)}%`,
      type: data.totalPaymentsChange >= 0 ? 'positive' : 'negative'
    },
    {
      title: `Vendas a crédito em ${currentMonth}`,
      value: formatCurrency(data.totalPurchases),
      change: `${data.totalPurchasesChange.toFixed(1)}%`,
      type: data.totalPurchasesChange >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Valores a Receber',
      value: formatCurrency(data.totalDebt),
      type: 'neutral'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <ArrowUpIcon className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <ArrowDownIcon className="w-4 h-4 text-red-500" />;
      default:
        return <MinusIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {summaryData.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">{item.title}</h3>
            {getIcon(item.type)}
          </div>
          <p className="text-2xl font-semibold mt-2">{item.value}</p>
          <div className={`flex items-center mt-2 ${getChangeColor(item.type)}`}>
            <span className="text-sm font-medium">{item.change}</span>
            <span className="text-sm text-gray-500 ml-1">vs. mês anterior</span>
          </div>
        </div>
      ))}
    </div>
  );
};