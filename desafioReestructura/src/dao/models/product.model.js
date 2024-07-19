const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema, model } = mongoose;

const productSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: { type: String, unique: true },
    stock: Number,
    status: Boolean,
    category: String
});
productSchema.plugin(mongoosePaginate);

const Product = model('Product', productSchema);

module.exports = Product;
