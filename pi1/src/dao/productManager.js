import { Product } from './models/product.model.js';

export class ProductManager {
    constructor() { }

    async addProduct(productData) {
        try {
            productData.status = productData.status === 'on';
            const product = new Product(productData);
            await product.save();
            console.log("Producto agregado exitosamente.");
            return product;
        } catch (error) {
            console.error("Error agregando un producto a la lista:", error);
            throw error;
        }
    }

    async getProducts() {
        try {
            return await Product.find().lean();
        } catch (error) {
            console.error("Error leyendo los productos desde la base de datos:", error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            if (product) {
                console.log(`Producto encontrado: ${product.title}`);
                return product;
            } else {
                console.log(`El producto con ID '${id}' no ha sido encontrado.`);
                return null;
            }
        } catch (error) {
            console.error("Error leyendo el producto desde la base de datos:", error);
            return null;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const product = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
            if (product) {
                console.log(`Producto con ID '${id}' actualizado exitosamente.`);
                return product;
            } else {
                console.log(`El producto con ID '${id}' no ha sido encontrado.`);
                return null;
            }
        } catch (error) {
            console.error("Error actualizando el producto:", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const product = await Product.findByIdAndDelete(id);
            if (product) {
                console.log(`Producto con ID '${id}' eliminado exitosamente.`);
                return product;
            } else {
                console.log(`El producto con ID '${id}' no ha sido encontrado.`);
                return null;
            }
        } catch (error) {
            console.error("Error eliminando el producto:", error);
            throw error;
        }
    }
}
