const { WAConnection, MessageType } = require('@adiwajshing/baileys');
const fs = require('fs');

const ownerNumber = '254732223354';
const botName = 'MAHNGUELOH-MD';
const conn = new WAConnection();

async function connect() {
    conn.on('qr', qr => {
        console.log('SCAN THIS QR CODE:', qr);
    });

    conn.on('open', () => {
        console.log('Bot is connected');
    });

    await conn.connect();
    console.log('Connected as:', conn.user.jid);
}

const commandHandlers = {
    ping: (msg) => `Bot is online!`,
    hello: (msg) => `Hello, ${msg.sender}!`,
    help: (msg) => `Available commands: ping, hello, help, info, owner`,
    info: (msg) => `This bot is named ${botName}.`,
    owner: (msg) => `Owner: ${ownerNumber}`
};

conn.on('chat-update', async chatUpdate => {
    if (!chatUpdate.hasNewMessage) return;
    const message = chatUpdate.messages.all()[0];
    const messageContent = message.message.conversation;
    const command = messageContent.split(' ')[0];

    if (command in commandHandlers) {
        const response = commandHandlers[command](message);
        await conn.sendMessage(message.key.remoteJid, response, MessageType.text);
    }
});

connect();
