import express from 'express';
import { ProductManager } from '../../utils/product_functions.js';

const router = express.Router();
const productManager = new ProductManager('products.json');

router.get('/', (req, res) => {
    res.render('index', {})
})

router.get('/home', async (req, res) => {
    try {
        const productList = await productManager.getProducts();
        res.render('home', { products: productList });
    } catch (error) {
        console.error(e);
    }
});

router.get('/realtimeproducts', async (rec, res) => {
    try {
        const productList = await productManager.getProducts();
        res.render('realTimeProducts', { products: productList })
    } catch (error) {
        console.error(e);
    }
})
export default router