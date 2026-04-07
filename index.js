// WhatsApp Bot Code
const commands = {
    "hello": "Hello, how can I help you?",
    // ... all 327+ commands here, using proper string concatenation instead of template literals
};

function handleCommand(command) {
    if (commands[command]) {
        return commands[command];
    } else {
        return "Command not found.";
    }
}

// Error handling
try {
    // Code to handle incoming messages
} catch (error) {
    console.error("An error occurred:", error);
}