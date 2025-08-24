import { Layout } from "@/components/layout/Layout";
import { AreaChart } from "@/components/reports/AreaChart";
import { FinancialSummary } from "@/components/reports/FinancialSummary";
import { useReportData } from '@/hooks/useReportData';
import moment from 'moment';
import 'moment/locale/pt-br'; // Importar o locale português
import { ResponsiveTable } from '@/components/layout/Mobile';

// Configurar o Moment.js para usar o idioma português
moment.locale('pt-br');

const Report = () => {
  const { data, isLoading } = useReportData();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const period = `Últimos 6 meses (${moment().subtract(6, 'months').format('DD/MM [de] YYYY')} - ${moment().format('DD/MM [de] YYYY')})`;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Relatório de Fiados</h1>
            <p className="text-gray-500 mt-2">Período: {period}</p>
          </div>

          <FinancialSummary data={data} />

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Últimos 6 meses:</h2>
            <AreaChart data={data.monthlyData} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Report;