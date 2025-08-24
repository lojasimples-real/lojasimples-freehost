const Client = require('../models/Client');
const moment = require('moment-timezone');
require('moment/locale/pt-br'); // Importar o locale português

exports.getReportData = async (req, res) => {
  try {
    const userId = req.userId;
    const clients = await Client.find({ user: userId });
    
    // Set timezone to Brazil
    moment.tz.setDefault('America/Sao_Paulo');
    moment.locale('pt-br');
    
    const sixMonthsAgo = moment().subtract(6, 'months').startOf('month').toDate();
    
    // Get all transactions from last 6 months
    const transactions = clients.flatMap(client => {
      const payments = client.payments.map(p => ({
        ...p.toObject(),
        type: 'payment',
        date: moment(p.date).toDate()
      }));
      
      const purchases = client.purchases.map(p => ({
        ...p.toObject(),
        type: 'purchase',
        date: moment(p.date).toDate()
      }));
      
      return [...payments, ...purchases];
    }).filter(t => t.date >= sixMonthsAgo);

    // Group transactions by month
    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = moment(transaction.date).format('MMM YYYY');
      const existing = acc.find(d => d.month === month);
      
      if (existing) {
        if (transaction.type === 'payment') {
          existing.payments += transaction.amount;
        } else {
          existing.purchases += transaction.amount;
        }
      } else {
        acc.push({
          month,
          payments: transaction.type === 'payment' ? transaction.amount : 0,
          purchases: transaction.type === 'purchase' ? transaction.amount : 0
        });
      }
      
      return acc;
    }, []);

    // Ensure all months are present
    const lastSixMonths = Array.from({ length: 6 }, (_, i) => 
      moment().subtract(i, 'months').format('MMM YYYY')
    ).reverse();
    
    const completeData = lastSixMonths.map(month => {
      const monthData = monthlyData.find(d => d.month === month);
      return monthData || { month, payments: 0, purchases: 0 };
    });

    // Calculate totals and changes
    const currentMonth = moment().startOf('month');
    const lastMonth = moment().subtract(1, 'month').startOf('month');

    const currentMonthData = transactions.filter(t => moment(t.date).isSameOrAfter(currentMonth));
    const lastMonthData = transactions.filter(t => 
      moment(t.date).isSameOrAfter(lastMonth) && moment(t.date).isBefore(currentMonth)
    );

    const totalCurrentPayments = currentMonthData
      .filter(t => t.type === 'payment')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalLastPayments = lastMonthData
      .filter(t => t.type === 'payment')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalCurrentPurchases = currentMonthData
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalLastPurchases = lastMonthData
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + t.amount, 0);

    const calculateChange = (current, previous) => {
      if (previous === 0) return 0;
      return ((current - previous) / previous) * 100;
    };

    const totalDebt = clients.reduce((acc, client) => acc + client.totalDebt, 0);

    res.json({
      totalDebt,
      totalPayments: totalCurrentPayments,
      totalPurchases: totalCurrentPurchases,
      totalPaymentsChange: calculateChange(totalCurrentPayments, totalLastPayments),
      totalPurchasesChange: calculateChange(totalCurrentPurchases, totalLastPurchases),
      monthlyData: completeData
    });

  } catch (error) {
    console.error('Erro ao buscar dados do relatório:', error);
    res.status(500).json({ message: 'Erro ao buscar dados do relatório', error });
  }
};