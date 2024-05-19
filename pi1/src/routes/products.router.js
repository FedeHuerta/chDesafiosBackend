import { Router } from "express";
import { ProductManager } from '../dao/productManager.js';

const router = Router()
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const limit = parseInt(req.query.limit) || products.length;
        res.json(products.slice(0, limit));
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        res.status(500).json({ error: 'Error al cargar los productos' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error("Error al cargar el producto:", error);
        res.status(500).json({ error: 'Error al cargar el producto' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;
        if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        await productManager.addProduct(req.body);
        res.status(201).json({ message: `Producto "${title}" agregado correctamente.` });
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;
        await productManager.updateProduct(productId, updatedFields);
        res.status(200).json({ message: `Producto con ID ${productId} actualizado correctamente.` });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        await productManager.deleteProduct(productId);
        res.status(200).json({ message: `Producto con ID ${productId} eliminado correctamente.` });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default router;
