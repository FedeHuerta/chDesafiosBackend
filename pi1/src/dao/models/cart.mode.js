import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number
    }]
});

export const Cart = mongoose.model('Cart', cartSchema);
