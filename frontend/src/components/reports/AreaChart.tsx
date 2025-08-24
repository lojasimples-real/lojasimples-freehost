import { Area, AreaChart as RechartsAreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import moment from 'moment-timezone';

interface AreaChartProps {
  data: {
    month: string;
    payments: number;
    purchases: number;
  }[];
}

export const AreaChart = ({ data }: AreaChartProps) => {

  const chartData = data.map(item => ({
    ...item,
    payments: Number(item.payments) || 0,
    purchases: Number(item.purchases) || 0
  }));

  return (
    <div className="w-full h-[400px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPagamentos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCompras" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickFormatter={(value) => `R$ ${value.toLocaleString()}`}
          />
          <Tooltip 
            formatter={(value: number) => [`R$ ${value.toLocaleString()}`, '']}
            labelFormatter={(label) => `Período: ${label}`}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="payments"
            name="Pagamentos"
            stroke="#22C55E"
            fillOpacity={1}
            fill="url(#colorPagamentos)"
            stackId="1"
          />
          <Area
            type="monotone"
            dataKey="purchases"
            name="Compras"
            stroke="#0EA5E9"
            fillOpacity={1}
            fill="url(#colorCompras)"
            stackId="2"
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};