import { Router } from "express";
import { CartManager } from '../dao/cartManager.js';

const router = Router();
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

router.get('/:cid', async (req, res) => {
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
});

router.post('/:cid/product/:pid', async (req, res) => {
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
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        await cartManager.deleteProductFromCart(cartId, productId);
        res.status(200).json({ message: `Producto ${productId} eliminado del carrito ${cartId}.` });
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
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
});

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        await cartManager.clearCart(cartId);
        res.status(200).json({ message: `Todos los productos eliminados del carrito ${cartId}.` });
    } catch (error) {
        console.error("Error al eliminar todos los productos del carrito:", error);
        res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
    }
});

export default router;
