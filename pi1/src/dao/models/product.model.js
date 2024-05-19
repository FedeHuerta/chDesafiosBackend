import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: { type: String, unique: true },
    stock: Number,
    status: Boolean,
    category: String
});

export const Product = mongoose.model('Product', productSchema);
