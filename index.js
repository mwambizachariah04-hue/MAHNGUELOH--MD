const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Create a new client instance
const client = new Client({
    authStrategy: new LocalAuth() 
});

// Generate and display QR Code
client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

// Message handling
client.on('message', message => {
    console.log(`Received message: ${message.body}`);
    // Reply to the message
    if (message.body === 'Hello') {
        message.reply('Hi there!');
    }
});

// Ready event
client.on('ready', () => {
    console.log('Client is ready!');
});

// Initialize the client
client.initialize();