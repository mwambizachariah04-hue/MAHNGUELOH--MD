module.exports = {
    name: 'ping',
    description: 'Check if bot is online',
    category: 'utility',
    run: (message) => {
        message.channel.send('Pong!');
    }
};