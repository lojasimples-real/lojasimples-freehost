const express = require('express');
const router = express.Router();
const { getBills, addBill, updateBill, deleteBill, getBillDetails, markAsPaid } = require('../controllers/billController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas protegidas com autenticação
router.use(authMiddleware);

router.get('/', getBills); // Listar contas
router.post('/', addBill); // Adicionar conta
router.put('/:id', updateBill); // Atualizar conta
router.delete('/:id', deleteBill); // Excluir conta
router.get('/:id', getBillDetails); // Buscar detalhes de uma conta
router.patch('/:id/mark-as-paid', markAsPaid); // Marcar conta como paga

module.exports = router;