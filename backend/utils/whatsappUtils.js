const axios = require('axios');

const sendWhatsAppMessage = async (to, message) => {
  try {
    const response = await axios.post('https://api.gupshup.io/sm/api/v1/msg', {
      channel: 'whatsapp',
      source: '5598984296166',
      destination: to,
      message: message,
      type: 'text',
    }, {
      headers: {
        'apikey': 'sk_156631c09b0f4109ba24e8eb7f7d5832',
        'Content-Type': 'application/json',
      }
    });

    console.log('Mensagem enviada com sucesso:', response.data);
  } catch (error) {
    console.error('Erro ao enviar a mensagem:', error);
  }
};

module.exports = { sendWhatsAppMessage };