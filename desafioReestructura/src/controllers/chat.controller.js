const { saveMessage } = require('../dao/classes/message.dao.js');

async function handleNewMessage(socket, data) {
    try {
        const { user, message } = data;
        const newMessage = await saveMessage(user, message);
        socket.emit('newMessage', newMessage);
    } catch (error) {
        console.error("Error handling new message:", error);
        throw new Error(`Error handling new message: ${error.message}`);
    }
}

module.exports = {
    handleNewMessage
};
