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

export default router;
