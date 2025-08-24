const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const authMiddleware = require('../middleware/authMiddleware');

// Get all clients
router.get('/', authMiddleware, async (req, res) => {
    try {
      const clients = await Client.find({ user: req.userId });
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar clientes', error });
    }
  });

// Cadastro de Cliente
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const newClient = new Client({
            user: req.userId,
            name,
            phone,
            address,
            purchases: [],
            payments: [],
            totalDebt: 0,
            totalPayments: 0,
            lastPaymentDate: null
        });

        await newClient.save();
        res.status(201).json({ message: 'Cliente adicionado com sucesso!' });
    } catch (error) {
        console.error('Erro ao adicionar cliente:', error);
        res.status(500).json({ message: 'Erro ao adicionar cliente', error });
    }
});

// Verificar cliente por ID e exibir histórico completo
router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const client = await Client.findOne({ 
            _id: id, 
            user: req.userId 
        });

        if (!client) {
            return res.status(404).json({ 
                message: 'Cliente não encontrado ou não pertence a esta loja.' 
            });
        }

        // Calculate totals
        const totalPurchases = client.purchases.reduce((acc, purchase) => acc + purchase.amount, 0);
        const totalPayments = client.payments.reduce((acc, payment) => acc + payment.amount, 0);
        const currentDebt = totalPurchases - totalPayments;

        // Combine transactions
        const transactions = [
            ...client.purchases.map(purchase => ({ 
                ...purchase.toObject(), 
                type: 'purchase' 
            })),
            ...client.payments.map(payment => ({ 
                ...payment.toObject(), 
                type: 'payment' 
            }))
        ];

        res.json({
            client: {
                ...client.toObject(),
                totalPurchases,
                totalPayments,
                currentDebt
            },
            transactions
        });
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        res.status(500).json({ 
            message: 'Erro ao buscar detalhes do cliente',
            error: error.message 
        });
    }
});

// Excluir Cliente
router.delete('/:id', authMiddleware, async (req, res) => {
    const clientId = req.params.id;

    try {
        const client = await Client.findOneAndDelete({ _id: clientId, user: req.userId });

        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado ou não pertence a esta loja.' });
        }

        res.status(200).json({ message: 'Cliente excluído com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir cliente', error });
    }
});

// Adicionar Compra
router.post('/:id/purchase', authMiddleware, async (req, res) => {
    const { description, amount, date } = req.body;
    const { id } = req.params;

    try {
        const client = await Client.findOne({ _id: id, user: req.userId });

        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado ou não pertence a esta loja.' });
        }

        // Check if amount is already a number
        let parsedAmount = amount;
        if (typeof amount === 'string') {
            parsedAmount = parseFloat(amount.replace('.', '').replace(',', '.'));
        }

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ message: 'Valor da compra inválido!' });
        }

        client.purchases.push({
            description,
            amount: parsedAmount,
            date: new Date(date),
        });

        client.totalPurchase += parsedAmount;
        client.totalDebt += parsedAmount;

        await client.save();

        res.status(201).json({ 
            message: 'Compra registrada com sucesso!', 
            newPurchase: client.purchases[client.purchases.length - 1] 
        });
    } catch (error) {
        console.error('Erro ao registrar compra:', error);
        res.status(500).json({ message: 'Erro ao registrar compra', error });
    }
});

// Adicionar Pagamento
router.post('/:id/payment', authMiddleware, async (req, res) => {
    const { amount, date, observation } = req.body;
    const { id } = req.params;

    try {
        const client = await Client.findOne({ user: req.userId, _id: id }).populate('payments');

        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado!' });
        }

        // Check if amount is already a number
        let parsedAmount = amount;
        if (typeof amount === 'string') {
            parsedAmount = parseFloat(amount.replace('.', '').replace(',', '.'));
        }

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ message: 'Valor de pagamento inválido!' });
        }

        if (parsedAmount > client.totalDebt) {
            return res.status(400).json({ message: 'Pagamento maior que o valor da dívida!' });
        }

        const validTotalPayments = isNaN(client.totalPayments) ? 0 : client.totalPayments;
        const validTotalDebt = isNaN(client.totalDebt) ? 0 : client.totalDebt;

        const newPayment = {
            amount: parsedAmount,
            date: date || new Date(),
            observation: observation || '',
        };

        client.totalPayments = validTotalPayments + parsedAmount;
        client.totalDebt = validTotalDebt - parsedAmount;
        client.payments.push(newPayment);
        client.lastPaymentDate = date;

        await client.save();

        res.status(200).json({ message: 'Pagamento registrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao adicionar pagamento:', error);
        res.status(500).json({ message: 'Erro ao adicionar pagamento', error });
    }
});

router.post('/:id/quit', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const client = await Client.findOne({ user: req.userId, _id: id });

        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado!' });
        }

        console.log(client);

        if (client.totalDebt <= 0) {
            return res.status(400).json({ message: 'Cliente não possui dívida para quitar!' });
        }

        const totalDebt = client.totalDebt;
        const payment = {
            amount: totalDebt,
            date: new Date(),
            observation: 'Quitação total da dívida'
        };

        client.totalPayments += totalDebt;
        client.totalDebt = 0;
        client.payments.push(payment);

        client.lastPaymentDate = new Date();

        await client.save();

        res.status(200).json({ message: 'Dívida quitada com sucesso!', client });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao quitar dívida', error });
    }
});

// Rota para excluir uma transação
router.delete('/:clientId/transaction/:transactionId', authMiddleware, async (req, res) => {
    const { clientId, transactionId } = req.params;

    try {
        const client = await Client.findOne({ user: req.userId, _id: clientId });

        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado!' });
        }

        const purchaseIndex = client.purchases.findIndex(p => p._id.toString() === transactionId);
        if (purchaseIndex !== -1) {
            const purchase = client.purchases[purchaseIndex];
            client.purchases.splice(purchaseIndex, 1);
            client.totalPurchase -= purchase.amount;
            client.totalDebt -= purchase.amount;
        } else {
            const paymentIndex = client.payments.findIndex(p => p._id.toString() === transactionId);
            if (paymentIndex !== -1) {
                const payment = client.payments[paymentIndex];
                client.payments.splice(paymentIndex, 1);
                client.totalPayments -= payment.amount;
                client.totalDebt += payment.amount;
            } else {
                return res.status(404).json({ message: 'Transação não encontrada!' });
            }
        }

        await client.save();

        res.status(200).json({ message: 'Transação excluída com sucesso!', client });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao excluir transação', error });
    }
});

module.exports = router;