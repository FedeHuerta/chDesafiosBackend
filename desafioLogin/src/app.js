import 'dotenv/config';
import express, { json, urlencoded } from "express";
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import sessionsRouter from './routes/sessions.router.js';
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import chatRouter from './routes/chat.router.js';
import { Server } from 'socket.io';
import { ProductManager } from "./dao/productManager.js";
import Message from "./dao/models/message.model.js";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';

const productManager = new ProductManager();
const PORT = 8080;
const app = express();
const httpServer = app.listen(PORT, console.log(`Server running on port ${PORT}`));

app.use(express.json());
app.use(urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Conectado a la base de datos"))
    .catch(error => console.error("Error en la conexión", error));

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL, ttl: 100
    }),
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false
}));

const socketServer = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts/', cartsRouter);
app.use('/chat', chatRouter);
app.use('/api/sessions', sessionsRouter);

socketServer.on('connection', (socket) => {
    console.log("New client connected.");

    socket.on('sendMessage', async (data) => {
        try {
            const newMessage = new Message(data);
            await newMessage.save();
            socketServer.emit('newMessage', data);
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on('addProduct', async (product) => {
        try {
            await productManager.addProduct(product);
            const updatedProducts = await productManager.getProducts();
            socketServer.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error("Error agregando el producto a la lista:", error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            const updatedProducts = await productManager.getProducts();
            socketServer.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error("Error eliminando un producto de la lista:", error);
        }
    });
});