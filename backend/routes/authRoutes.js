const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ 'customer.email' :email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ userId: user._id }, `${process.env.JWT_SECRET}`, { expiresIn: '30d' });

        res.json({ message: 'Login bem-sucedido!', token, user });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro ao fazer login', error });
    }
});

router.post('/create-password', async (req, res) => {
    try {
        const { userId, password } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

        if (user.status === 'active') {
            return res.status(400).json({ message: 'A senha já foi criada.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.status = 'active';
        await user.save();

        res.status(200).json({ message: 'Senha criada com sucesso. Você pode fazer login agora.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar senha', error });
    }
});

module.exports = router;