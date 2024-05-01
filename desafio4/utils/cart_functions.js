import { promises as fs } from 'fs';

export class CartManager {
    constructor(path) {
        this.path = path;
    }

    async createCart() {
        try {
            let carts = await this.getCarts();
            const cartId = carts.length + 1;
            const newCart = {
                id: cartId,
                products: []
            };
            carts.push(newCart);
            await fs.writeFile(this.path, JSON.stringify(carts), 'utf8');
            console.log("Carrito creado:", newCart);
            return newCart;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cartId);
            if (cart) {
                console.log(`El carrito con ID ${cartId} ha sido encontrado`);
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
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex(cart => cart.id === cartId);
            if (cartIndex === -1) {
                throw new Error(`Carrito con ID '${cartId}' no encontrado.`);
            }

            const cart = carts[cartIndex];
            const productIndex = cart.products.findIndex(item => item.productId === productId);
            if (productIndex === -1) {
                cart.products.push({ productId, quantity });
            } else {
                cart.products[productIndex].quantity += quantity;
            }

            await fs.writeFile(this.path, JSON.stringify(carts), 'utf8');
            console.log(`Producto ${productId} agregado al carrito ${cartId}.`);
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
            throw error;
        }
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            const carts = JSON.parse(data);
            return carts;
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('El archivo carts.json no existe, se creará uno nuevo.');
                return [];
            } else {
                console.error("Error al obtener los carritos:", error);
                return [];
            }
        }
    }
}
