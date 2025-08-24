const Bill = require('../models/Bill');
const moment = require('moment-timezone');

// Função para calcular o status com base na data de vencimento
const calculateStatus = (dueDate) => {
  const now = moment().tz("America/Sao_Paulo");
  const dueDateInBrasilia = moment(dueDate).tz("America/Sao_Paulo");

  return now.isBefore(dueDateInBrasilia, 'day') ? 'Pendente' : 'Vencido';
};

// Listar todas as contas de um usuário
exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.userId });
    console.log('Contas recuperadas:', bills);
    res.json(bills);
  } catch (error) {
    console.error('Erro ao buscar boletos:', error);
    res.status(500).json({ error: 'Erro ao buscar boletos.' });
  }
};

// Adicionar uma nova conta
exports.addBill = async (req, res) => {
  try {
    const { name, value, dueDate } = req.body;

    if (!value) {
      return res.status(400).json({ message: 'O valor é obrigatório.' });
    }

    // Convert value to number
    const parsedValue = parseFloat(value);
    
    if (isNaN(parsedValue)) {
      return res.status(400).json({ message: 'O valor deve ser um número válido.' });
    }

    const adjustedDueDate = moment(dueDate).tz("America/Sao_Paulo").startOf('day');
    const status = calculateStatus(adjustedDueDate);

    const billData = { 
      name, 
      value: parsedValue,
      dueDate: adjustedDueDate.toDate(),
      userId: req.userId, 
      status,
    };

    const newBill = new Bill(billData);
    await newBill.save();

    res.status(201).json({ message: 'Conta adicionada com sucesso.', bill: newBill });
  } catch (error) {
    console.error('Erro ao adicionar conta:', error);
    res.status(500).json({ error: 'Erro ao adicionar a conta.' });
  }
};

// Atualizar conta
exports.updateBill = async (req, res) => {
  try {
    const { dueDate } = req.body;
    let updatedData = req.body;

    if (dueDate) {
      updatedData.status = calculateStatus(dueDate);
    }

    const updatedBill = await Bill.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updatedBill);
  } catch (error) {
    console.error('Erro ao atualizar conta:', error);
    res.status(500).json({ error: 'Erro ao atualizar a conta.' });
  }
};

// Excluir conta
exports.deleteBill = async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Conta excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    res.status(500).json({ error: 'Erro ao excluir a conta.' });
  }
};

// Buscar detalhes de uma conta
exports.getBillDetails = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ error: 'Conta não encontrada.' });
    }
    res.json(bill);
  } catch (error) {
    console.error('Erro ao buscar detalhes da conta:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes da conta.' });
  }
};

// Atualizar status para "Pago"
exports.markAsPaid = async (req, res) => {
  try {
    const billId = req.params.id;

    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ error: "Conta não encontrada." });
    }

    if (bill.status === "Pago") {
      return res.status(400).json({ error: "Esta conta já está marcada como paga." });
    }

    bill.status = "Pago";
    await bill.save();

    res.json({ message: "Conta marcada como paga com sucesso.", bill });
  } catch (error) {
    console.error("Erro ao marcar como paga:", error);
    res.status(500).json({ error: "Erro ao marcar a conta como paga." });
  }
};