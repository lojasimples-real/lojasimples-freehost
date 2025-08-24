const User = require('../models/User');
const Client = require('../models/Client');

// Função para calcular diferença de dias entre duas datas
const daysDifference = (date1, date2) => {
  const timeDifference = Math.abs(date2 - date1);
  return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
};

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    // Busca todos os clientes do usuário, populando as compras e pagamentos
    const clients = await Client.find({ user: userId })
      .populate('purchases')
      .populate('payments');

    // Calculando o total de dívidas de todos os clientes
    const totalDebt = clients.reduce((acc, client) => {
      const clientDebt = client.purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
      const clientPayments = client.payments.reduce((sum, payment) => sum + payment.amount, 0);
      return acc + Math.max(0, clientDebt - clientPayments);
    }, 0);

    // Calculando o total pago de todos os clientes
    const totalPaid = clients.reduce((acc, client) => {
      return acc + client.payments.reduce((sum, payment) => sum + payment.amount, 0);
    }, 0);

    // Verificação de dívidas sem pagamento em 30+ dias após a última compra
    const today = new Date();
    const clientsWithDebtNotifications = clients.filter(client => {
      const lastPurchaseDate = client.purchases.length > 0
        ? new Date(Math.max(...client.purchases.map(purchase => new Date(purchase.date))))
        : null;

      if (!lastPurchaseDate) return false;

      const lastPaymentDate = client.payments.length > 0
        ? new Date(Math.max(...client.payments.map(payment => new Date(payment.date))))
        : null;

      const daysSinceLastPurchase = daysDifference(today, lastPurchaseDate);
      const daysSinceLastPayment = lastPaymentDate ? daysDifference(today, lastPaymentDate) : daysSinceLastPurchase;

      return daysSinceLastPurchase > 30 && daysSinceLastPayment > 30;
    });

    // Contar clientes com pagamentos atrasados
    const latePaymentsCount = clientsWithDebtNotifications.length;

    // Retornando os dados para o dashboard
    res.json({
      userName: user.customer.name,
      clientsCount: clients.length,
      totalDebt,
      totalPaid,
      latePaymentsCount,
      clients,
      debtNotifications: clientsWithDebtNotifications.map(client => {
        const lastPurchaseDate = client.purchases.length > 0
          ? new Date(Math.max(...client.purchases.map(purchase => new Date(purchase.date))))
          : null;
        const lastPaymentDate = client.payments.length > 0
          ? new Date(Math.max(...client.payments.map(payment => new Date(payment.date))))
          : null;
        return {
          clientId: client._id,
          name: client.name,
          daysSinceLastPurchase: lastPurchaseDate ? daysDifference(today, lastPurchaseDate) : null,
          daysSinceLastPayment: lastPaymentDate ? daysDifference(today, lastPaymentDate) : null
        };
      })
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar dados do dashboard', error });
  }
};