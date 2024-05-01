import express, { json, urlencoded } from "express";
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import { Server } from 'socket.io';
import { ProductManager } from "../utils/product_functions.js";

const productManager = new ProductManager('products.json');
const PORT = 8080;
const app = express();
const httpServer = app.listen(PORT, console.log(`Server running on port ${PORT}`));

app.use(express.json());
app.use(urlencoded({ extended: true }));

const socketServer = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts/', cartsRouter);


socketServer.on('connection', (socket) => {
    console.log("New client connected.");

    socket.on('addProduct', async (product) => {
        await productManager.addProduct(product.title, product.description, product.price, product.thumbnail, product.code, product.stock, product.status, product.category);
        const updatedProducts = await productManager.getProducts();
        socketServer.emit('updateProducts', updatedProducts);
    });

    socket.on('deleteProduct', async (productId) => {
        await productManager.deleteProduct(productId);
        const updatedProducts = await productManager.getProducts();
        socketServer.emit('updateProducts', updatedProducts);
    });
});