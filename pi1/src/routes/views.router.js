import express from 'express';
import { ProductManager } from '../dao/productManager.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', (req, res) => {
    res.render('index', {});
});

router.get('/home', async (req, res) => {
    try {
        const productList = await productManager.getProducts();
        res.render('home', { products: productList });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const productList = await productManager.getProducts();
        res.render('realTimeProducts', { products: productList });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
});

export default router;
