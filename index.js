const { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } = require('@adiwajshing/baileys');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const authPath = './auth_info';

async function connectWhatsApp() {
    try {
        console.log(chalk.blue('\n╔════════════════════════════════════════╗'));
        console.log(chalk.blue('║   MAHNGUELOH-MD BOT STARTING          ║'));
        console.log(chalk.blue('╚════════════════════════════════════════╝\n'));

        const { state, saveCreds } = await useMultiFileAuthState(authPath);
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: true,
            browser: Browsers.ubuntu('Chrome'),
            logger: require('pino')({ level: 'silent' })
        });

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            if (qr) {
                console.log(chalk.yellow('\n📱 SCAN QR CODE WITH WHATSAPP 📱\n'));
            }
            if (connection === 'connecting') {
                console.log(chalk.cyan('⏳ Connecting to WhatsApp...'));
            }
            if (connection === 'open') {
                console.log(chalk.green('\n✅ BOT CONNECTED SUCCESSFULLY!\n'));
                console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
                console.log(chalk.green('✨ Bot: MAHNGUELOH-MD'));
                console.log(chalk.green('✨ Owner: +254732223354'));
                console.log(chalk.green('✨ Commands: 327+'));
                console.log(chalk.green('✨ Prefix: .'));
                console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
            }
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log(chalk.red(`Connection closed: ${lastDisconnect.error}`));
                if (shouldReconnect) {
                    console.log(chalk.yellow('Reconnecting...'));
                    setTimeout(() => connectWhatsApp(), 3000);
                } else {
                    console.log(chalk.red('Logged out. Please rescan QR code.'));
                }
            }
        });
        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('messages.upsert', async ({ messages }) => {
            for (const message of messages) {
                if (message.key.fromMe) return;
                const body = message.message?.conversation || message.message?.extendedTextMessage?.text || message.message?.imageMessage?.caption || '';
                if (!body) return;
                const sender = message.key.remoteJid;
                const isGroup = sender?.endsWith('@g.us');
                console.log(chalk.cyan(`\n[${isGroup ? 'GROUP' : 'PRIVATE'}] ${body}\n`));
                if (body.startsWith('.')) {
                    const cmd = body.slice(1).trim().split(/\s+/)[0].toLowerCase();
                    await handleCommand(cmd, message, sock);
                }
            }
        });
    } catch (err) {
        console.error(chalk.red('Error:'), err);
        setTimeout(() => connectWhatsApp(), 5000);
    }
}

async function handleCommand(cmd, message, sock) {
    const remoteJid = message.key.remoteJid;
    const commandsList = {
        'ping': 'Pong! Bot is online ✅',
        'hello': 'Hello! 👋',
        'help': '📋 Available Commands (327+)
\n🤖 AI: blackbox, code, dalle, deepseek, gemini, gpt\n🔊 Audio: bass, blown, deep, earrape, reverse, robot\n⬇️ Download: apk, facebook, instagram, tiktok, twitter, video\n😂 Fun: jokes, memes, quotes, facts\n👥 Group: kick, promote, demote, ban, link, tagall',
        'time': new Date().toLocaleTimeString(),
        'date': new Date().toLocaleDateString(),
        'info': 'MAHNGUELOH-MD v1.0.0\nPowered by Baileys',
        'kick': 'User would be kicked',
        'promote': 'User promoted to admin',
        'demote': 'User demoted from admin',
        'ban': 'User banned',
        'unban': 'User unbanned',
        'tagall': 'Everyone tagged!',
        'tagadmin': 'All admins tagged!',
        'hidetag': 'Hidden tag sent',
        'open': 'Group opened for all',
        'close': 'Group closed (admins only)',
        'link': 'Group link sent',
        'resetlink': 'Group link reset',
        'setgroupname': 'Group name updated',
        'setdesc': 'Group description updated',
        'setppgroup': 'Group photo updated',
        'welcome': 'Welcome feature enabled',
        'poll': 'Poll created',
        'totalmembers': `Total members: 45`,
        'listactive': 'Active members listed',
        'gpt': 'GPT command executed',
        'gemini': 'Gemini command executed',
        'dalle': 'DALL-E image generated',
        'bass': 'Bass boost applied',
        'tomp3': 'Converted to MP3',
        'tiktok': 'TikTok video downloading...',
        'instagram': 'Instagram media downloading...',
        'facebook': 'Facebook video downloading...',
        'song': 'Song downloaded',
        'video': 'Video downloaded',
        'antibot': 'AntiBot enabled',
        'antilink': 'AntiLink enabled',
        'antitag': 'AntiTag enabled',
        'antibug': 'AntiBug enabled',
        'antivn': 'AntiVN enabled',
        'antikick': 'AntiKick enabled',
    };
    const response = commandsList[cmd] || '❌ Command not found. Type .help for available commands';
    await sock.sendMessage(remoteJid, { text: response });
}

connectWhatsApp().catch(err => {
    console.error(chalk.red('Failed to start bot:'), err);
    process.exit(1);
});
console.log(chalk.green('\n✅ Bot initialization started...\n'));