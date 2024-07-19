const express = require('express');
const router = express.Router();
const {
    createCart,
    getCartById,
    addProductToCart,
    deleteProductFromCart,
    updateProductQuantity,
    clearCart
} = require('../controllers/cart.controller.js');

router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid', clearCart);

module.exports = router;
