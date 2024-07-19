const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const messageSchema = new Schema({
    user: String,
    message: String
}, { timestamps: true });

const Message = model('Message', messageSchema);

module.exports = Message;