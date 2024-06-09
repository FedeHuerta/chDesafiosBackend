import { Router } from "express";
import { ProductManager } from '../dao/productManager.js';
import { Product } from "../dao/models/product.model.js";

const router = Router()
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query, availability } = req.query;
        const limitValue = parseInt(limit);
        const pageValue = parseInt(page);
        const skipValue = (pageValue - 1) * limitValue;
        const statusStage = availability === 'true' ? { $match: { status: true } } : { $match: { status: false } }; // Aca si availability es true matchea resultados con true, y si es false, con false
        const matchStage = query ? { $match: { $or: [{ category: query }] } } : { $match: {} }; // Aca busca las categorias solicitadas
        const sortStage = sort && sort !== 'undefined' ? { $sort: { price: sort === 'asc' ? 1 : -1 } } : { $sort: { _id: 1 } }; //Aca hace un sort dependiendo de si se realiza la busqueda con 'asc' o 'desc'
        const pipeline = [
            matchStage,
            sortStage,
            statusStage,
            {
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [{ $skip: skipValue }, { $limit: limitValue }]
                }
            }
        ];
        const result = await Product.aggregate(pipeline);
        const totalItems = result[0].metadata[0] ? result[0].metadata[0].total : 0;
        const totalPages = Math.ceil(totalItems / limitValue);
        const hasPrevPage = pageValue > 1;
        const hasNextPage = pageValue < totalPages;
        const prevLink = hasPrevPage ? `/api/products?limit=${limitValue}&page=${pageValue - 1}${sort && sort !== 'undefined' ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;
        const nextLink = hasNextPage ? `/api/products?limit=${limitValue}&page=${pageValue + 1}${sort && sort !== 'undefined' ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;
        res.json({
            status: 'success',
            payload: result[0].data,
            totalPages,
            prevPage: hasPrevPage ? pageValue - 1 : null,
            nextPage: hasNextPage ? pageValue + 1 : null,
            page: pageValue,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        res.status(500).json({ status: 'error', error: 'Error al cargar los productos' });
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