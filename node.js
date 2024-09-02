const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('message', async message => {
    console.log(`Received message: ${message.body}`);

    // Trigger your N8 webhook
    await axios.post('https://automation.kuut.us/webhook-test/2a4b0138-8604-4f77-8e1a-be2cdd548abd', {
        message: message.body,
        from: message.from
    });

    // Send a reply
    message.reply('Message received!');
});

client.on('qr', qr => {
    console.log('QR RECEIVED', qr);
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
