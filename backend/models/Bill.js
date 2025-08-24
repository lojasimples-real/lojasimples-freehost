const mongoose = require('mongoose');
const moment = require('moment-timezone');
const billSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { type: String, required: true }, // Nome da conta
  value: { type: Number, required: true }, // Valor
  dueDate: { 
    type: Date, 
    required: true,
    default: () => moment().tz("America/Sao_Paulo").toDate() // Data de vencimento no horário de Brasília
  },
  status: { 
    type: String, 
    enum: ['Pendente', 'Pago', 'Vencido'], 
    default: 'Pendente' 
  }, // Status da conta
  barcode: { type: String }, // Código de barras
  bank: { type: String }, // Banco e agência (se decodificado)
  beneficiary: { type: String }, // Beneficiário
  digitableLine: { type: String }, // Linha digitável
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);