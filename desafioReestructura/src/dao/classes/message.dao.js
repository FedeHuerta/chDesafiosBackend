const Message = require('../models/message.model.js');

async function saveMessage(user, message) {
    try {
        const newMessage = new Message({ user, message });
        await newMessage.save();
        return newMessage;
    } catch (error) {
        throw new Error(`Error saving message: ${error.message}`);
    }
}

module.exports = {
    saveMessage
};
