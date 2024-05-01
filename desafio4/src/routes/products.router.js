import { Router } from "express";
import { ProductManager } from '../../utils/product_functions.js';

const router = Router()

const productManager = new ProductManager('products.json');

router.get('/', async (req, res) => {
    try {
        const productList = await productManager.loadProducts();
        const limit = parseInt(req.query.limit) || productList.products.length;
        const products = productList.products.slice(0, limit);
        res.json(products);
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        res.status(500).json({ error: 'Error al cargar los productos' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
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

        await productManager.addProduct(title, description, price, thumbnail, code, stock, status, category);
        res.status(201).json({ message: `Producto "${title}" agregado correctamente.` });
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;
        if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const productId = parseInt(req.params.pid);
        const updatedFields = { title, description, price, thumbnail, code, stock, status, category };
        await productManager.updateProduct(productId, updatedFields);
        res.status(200).json({ message: `Producto con ID ${productId} actualizado correctamente.` });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        await productManager.deleteProduct(productId);
        res.status(200).json({ message: `Producto con ID ${productId} eliminado correctamente.` });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});


export default router;