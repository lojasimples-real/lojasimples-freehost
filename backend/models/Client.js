const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Modelo do Cliente
const clientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{11}$/, 'Por favor, insira um número de telefone válido.'],
    },
    address: {
      type: String,
      required: true,
    },
    // Array de compras, cada item é um objeto com descrição e valor
    purchases: [
      {
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: Date, default: () => moment().tz("America/Sao_Paulo").toDate() },
      }
    ],
    // Array de pagamentos, cada item é um objeto com valor e descrição
    payments: [
      {
        amount: { type: Number, required: true },
        date: { type: Date, default: () => moment().tz("America/Sao_Paulo").toDate() },
        description: { type: String, required: false }
      }
    ],
    totalPurchase: { type: Number, default: 0 },
    totalPayments: { type: Number, default: 0 },
    totalDebt: { type: Number, default: 0 },
    lastPaymentDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;