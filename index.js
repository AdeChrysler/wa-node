const express = require('express');
const bodyParser = require('body-parser');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;
const n8nWebhookUrl = 'https://your-n8n-webhook-url'; // Replace with your n8n webhook URL

// Middleware
app.use(bodyParser.json());

// WhatsApp client setup
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (message) => {
    console.log('Received message:', message.body);

    // Send the message data to n8n webhook
    try {
        await axios.post(n8nWebhookUrl, {
            from: message.from,
            body: message.body,
            timestamp: message.timestamp
        });
        console.log('Webhook sent to n8n');
    } catch (error) {
        console.error('Error sending webhook to n8n:', error);
    }
});

client.initialize();

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
