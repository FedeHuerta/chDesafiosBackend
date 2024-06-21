import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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
productSchema.plugin(mongoosePaginate);

export const Product = mongoose.model('Product', productSchema);
