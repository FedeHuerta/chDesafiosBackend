const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, default: 'user' }
});

const User = model('User', userSchema);

module.exports = User;
