// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: `Acesso negado, faça login` });
    }

    const token = authHeader.split(' ')[1];

    try {
        const verified = jwt.verify(token, `${JWT_SECRET}`);

        req.userId = verified.userId || verified.id;

        const user = await User.findById(req.userId);
        if (!user || user.licenseStatus !== 'active') {
            return res.status(403).json({ message: `Licença inativa ou inválida` });
        }

        next();
    } catch (error) {
        console.error('Erro na verificação do token:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado' });
        }

        return res.status(400).json({ message: 'Token inválido ou expirado' });
    }
};