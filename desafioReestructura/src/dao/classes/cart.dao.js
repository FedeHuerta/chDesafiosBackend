const Cart  = require('../models/cart.model.js');
const Product  = require('../models/product.model.js');

class CartManager {
    constructor() { }

    async createCart() {
        try {
            const newCart = new Cart({ products: [] });
            await newCart.save();
            console.log("Carrito creado:", newCart);
            return newCart;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('products.productId');
            if (cart) {
                console.log(`El carrito con ID ${cart._id} ha sido encontrado`);
                return cart;
            } else {
                console.log(`El carrito con ID '${cartId}' no ha sido encontrado.`);
                return null;
            }
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con ID '${cartId}' no encontrado.`);
            }

            const product = await Product.findById(productId);
            if (!product) {
                throw new Error(`Producto con ID '${productId}' no encontrado.`);
            }

            const productIndex = cart.products.findIndex(item => item.productId.equals(productId));

            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ productId: product._id, quantity });
            }

            await cart.save();
            console.log(`Producto ${productId} agregado al carrito ${cartId}.`);
            return cart;
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
            throw error;
        }
    }

    async getCarts() {
        try {
            return await Cart.find().populate('products.productId');
        } catch (error) {
            console.error("Error al obtener los carritos:", error);
            return [];
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con ID '${cartId}' no encontrado.`);
            }
            cart.products = cart.products.filter(item => !item.productId.equals(productId));
            await cart.save();
            console.log(`Producto ${productId} eliminado del carrito ${cartId}.`);
            return cart;
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con ID '${cartId}' no encontrado.`);
            }

            const productIndex = cart.products.findIndex(item => item.productId.equals(productId));

            if (productIndex > -1) {
                cart.products[productIndex].quantity = quantity;
            } else {
                throw new Error(`Producto con ID '${productId}' no encontrado en el carrito.`);
            }

            await cart.save();
            console.log(`Cantidad del producto ${productId} actualizada en el carrito ${cartId}.`);
            return cart;
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito:", error);
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con ID '${cartId}' no encontrado.`);
            }

            cart.products = [];
            await cart.save();
            console.log(`Todos los productos eliminados del carrito ${cartId}.`);
            return cart;
        } catch (error) {
            console.error("Error al eliminar todos los productos del carrito:", error);
            throw error;
        }
    }
}

module.exports = {
    CartManager
};
