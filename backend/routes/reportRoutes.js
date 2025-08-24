const express = require('express');
const router = express.Router();
const { getReportData } = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota para obter dados dos relatórios
router.get('/', authMiddleware, getReportData);

module.exports = router;