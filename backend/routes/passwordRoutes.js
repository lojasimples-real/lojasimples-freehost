const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            passwordResetToken: token,
            tokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token inválido ou expirado' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.isActive = true;
        
        user.licenseStatus = 'active';
        user.passwordResetToken = undefined;
        user.tokenExpires = undefined;
        await user.save();

        return res.status(200).json({ message: 'Senha criada com sucesso. Sua conta está ativa!' });
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        return res.status(500).json({ message: 'Erro ao redefinir senha', error });
    }
});

module.exports = router;