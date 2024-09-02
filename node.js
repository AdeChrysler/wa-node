const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const bodyParser = require('body-parser');
const qrcode = require('qrcode-terminal');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', qr => {
    // Generate and save QR code to a file
    qrcode.generate(qr, { small: true }, qrCode => {
        fs.writeFileSync(path.join(__dirname, 'public', 'qrcode.txt'), qrCode);
    });
});

client.on('message', async message => {
    console.log(`Received message: ${message.body}`);

    // Trigger your N8N webhook
    await axios.post('YOUR_N8N_WEBHOOK_URL', {
        message: message.body,
        from: message.from
    });

    // Send a reply
    message.reply('Message received!');
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
