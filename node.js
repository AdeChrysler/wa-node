const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(bodyParser.json());

const client = new Client({
    authStrategy: new LocalAuth(),
});

const N8N_WEBHOOK_URL = 'https://automation.kuut.us/webhook-test/2a4b0138-8604-4f77-8e1a-be2cdd548abd'; // Set your n8n webhook URL here

client.on('message', async message => {
    console.log(`Received message: ${message.body}`);

    // Trigger your n8n webhook
    try {
        await axios.post(N8N_WEBHOOK_URL, {
            message: message.body,
            from: message.from
        });
    } catch (error) {
        console.error('Error sending data to n8n webhook:', error);
    }

    // Send a reply
    message.reply('Message received!');
});

client.on('qr', qr => {
    console.log('QR Code received');
    qrcode.generate(qr, { small: true }, code => {
        console.log(code);
    });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

// Set up webhook endpoint
app.post('/webhook', (req, res) => {
    console.log('Webhook triggered:', req.body);
    res.sendStatus(200);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
