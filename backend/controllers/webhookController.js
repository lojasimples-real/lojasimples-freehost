const User = require('../models/User');
const bcrypt = require('bcrypt');


exports.handleSaleApproved = async (req, res) => {
    try {
        const { customer, plan } = req.body;

        
        const { name, email, document, phone_number } = customer;
        const { name: planName, charge_frequency } = plan;

        
        let user = await User.findOne({ 'customer.email': email });

        if (!user) {
            
            user = new User({
                customer: {
                    name,
                    email,
                    document,
                    phone_number
                },
                plan: {
                    name: planName,
                    charge_frequency
                },
                isActive: true 
            });

            await user.save();
        } else {
            
            user.plan.name = planName;
            user.plan.charge_frequency = charge_frequency;
            user.isActive = true; 
            await user.save();
        }

        
        
        const passwordCreationLink = `http://localhost:5000/create-password?email=${encodeURIComponent(email)}`;
        console.log(`Enviar para o WhatsApp (${phone_number}): ${passwordCreationLink}`);

        return res.status(200).json({ message: 'Usuário processado com sucesso' });
    } catch (error) {
        console.error('Erro ao processar o webhook:', error);
        return res.status(500).json({ message: 'Erro interno no servidor' });
    }
};