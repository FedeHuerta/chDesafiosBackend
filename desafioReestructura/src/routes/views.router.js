const express = require('express');
const {
    getProducts,
    getProductById
} = require('../controllers/product.controller.js');
const Cart = require('../dao/models/cart.model.js');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth.js');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {});
});

router.get('/home', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const products = await getProducts(req, res);
        res.render('home', {
            products: products.payload,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const productList = await getProducts(req, res);
        res.render('realTimeProducts', { products: productList.payload });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
});

router.get('/products', async (req, res) => {
    try {
        const products = await getProducts(req, res);
        if (!products || !products.docs || products.docs.length === 0) {
            throw new Error('Productos no encontrados o payload no definido');
        }

        res.render('products', { products: products.docs, user: req.session.user });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error al obtener productos");
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        await getProductById(req, res);
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).send("Error al obtener el producto");
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        const page = req.query.page || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const cart = await Cart.findById(cartId)
            .populate({
                path: 'products.productId',
                options: { limit, skip }
            })
            .lean();

        if (cart) {
            res.render('cart', { cart, page, user: req.session.user });
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});



router.get('/login', isNotAuthenticated, (req, res) => {
    const error = req.query.error;
    res.render('login', { error });
});

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register');
});

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.session.user });
});

router.get('/admin', isAuthenticated, (req, res) => {
    if (req.session.user.role === 'admin') {
        res.render('admin', { user: req.session.user });
    } else {
        res.redirect('/profile');
    }
});

module.exports = router;
