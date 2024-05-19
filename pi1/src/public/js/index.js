import { ProductManager } from "../../dao/productManager.js";
const socket = io();

const productManager = new ProductManager();

document.addEventListener('DOMContentLoaded', async () => {
    const productList = await productManager.getProducts();
    socket.emit('products', productList);
});
