const { CartManager } = require('../dao/classes/cart.dao.js');

const cartManager = new CartManager();

const createCart = async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
};

const getCartById = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
};

const addProductToCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = parseInt(req.body.quantity) || 1;

        await cartManager.addProductToCart(cartId, productId, quantity);
        res.status(201).json({ message: `Producto agregado al carrito ${cartId} correctamente.` });
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
};

const deleteProductFromCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        await cartManager.deleteProductFromCart(cartId, productId);
        res.status(200).json({ message: `Producto ${productId} eliminado del carrito ${cartId}.` });
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
};

const updateProductQuantity = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = parseInt(req.body.quantity);

        await cartManager.updateProductQuantity(cartId, productId, quantity);
        res.status(200).json({ message: `Cantidad del producto ${productId} actualizada en el carrito ${cartId}.` });
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto en el carrito:", error);
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
};

const clearCart = async (req, res) => {
    try {
        const cartId = req.params.cid;

        await cartManager.clearCart(cartId);
        res.status(200).json({ message: `Todos los productos eliminados del carrito ${cartId}.` });
    } catch (error) {
        console.error("Error al eliminar todos los productos del carrito:", error);
        res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
    }
};

module.exports = {
    createCart,
    getCartById,
    addProductToCart,
    deleteProductFromCart,
    updateProductQuantity,
    clearCart
};
