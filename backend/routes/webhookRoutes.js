const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');
const KIRVANO_TOKEN = process.env.KIRVANO_TOKEN || 'Hi8Z5E6TWCu6';

router.post('/kirvano-webhook', async (req, res) => {
    const token = req.headers['security-token'];
    const payload = req.body;

    if (token !== KIRVANO_TOKEN) {
        console.warn('Token inválido recebido no webhook.');
        return res.status(403).json({ message: 'Token inválido' });
    }

    if (token !== KIRVANO_TOKEN) {
        return res.status(403).json({ message: 'Token inválido' });
    }

    try {
        const { event, customer, created_at, plan } = payload;

        if (!customer || !customer.email) {
            return res.status(400).json({ message: 'Dados de cliente ausentes ou inválidos' });
        }

        const customerEmail = customer.email;
        const customerName = customer.name || 'Cliente Desconhecido';

        let user = await User.findOne({ 'customer.email': customerEmail });

        switch (event) {
            case 'SALE_APPROVED':
            case 'SUBSCRIPTION_RENEWED':
                if (!user) {
                    user = new User({
                        customer: {
                            name: customerName,
                            email: customerEmail,
                            document: customer.document,
                            phone_number: customer.phone_number
                        },
                        plan: {
                            name: plan.name,
                            charge_frequency: plan.charge_frequency
                        },
                        isActive: false,
                        licenseStatus: 'pending',
                        createdAt: created_at
                    });
                }

                const resetToken = crypto.randomBytes(32).toString('hex');
                const tokenExpires = new Date(Date.now() + 60 * 60 * 1000);

                user.passwordResetToken = resetToken;
                user.tokenExpires = tokenExpires;

                await user.save();

                const passwordLink = `https://app.lojasimples.site/reset-password/${resetToken}`;
                console.log(`Link para criar senha enviado para ${customerEmail}: ${passwordLink}`);
                break;

            case 'SUBSCRIPTION_CANCELED':
                if (user) {
                    user.licenseStatus = 'canceled';
                    user.subscriptionEnd = created_at;
                    await user.save();
                }
                break;

            case 'SUBSCRIPTION_EXPIRED':
                if (user) {
                    user.licenseStatus = 'expired';
                    user.subscriptionEnd = created_at;
                    await user.save();
                }
                break;

            default:
                console.log(`Evento não reconhecido: ${event}`);
                return res.status(400).json({ message: 'Evento não suportado' });
        }

        res.status(200).json({ message: 'Webhook processado com sucesso' });
    } catch (error) {
        console.error('Erro ao processar webhook:', error);
        res.status(500).json({ message: 'Erro ao processar webhook', error });
    }
});

module.exports = router;