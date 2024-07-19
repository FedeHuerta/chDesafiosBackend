const { ProductManager } = require("../../dao/productManager.js");
const socket = require('socket.io-client')();

const productManager = new ProductManager();

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const productList = await productManager.getProducts();
        socket.emit('products', productList);
    } catch (error) {
        console.error('Error al cargar la lista de productos:', error);
    }
});
