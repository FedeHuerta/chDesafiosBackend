require('dotenv/config');
const express = require("express");
const handlebars = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const passport = require('passport');
const { Server } = require('socket.io');
const Message = require("./dao/models/message.model.js");
const initializePassport = require('./config/passport.config.js');

// Importar rutas
const sessionsRouter = require('./routes/sessions.router.js');
const viewsRouter = require('./routes/views.router.js');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const chatRouter = require('./routes/chat.router.js');

// Configuración inicial
const PORT = 8080;
const app = express();
const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la db MongoDB
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(error => {
        console.error("MongoDB connection error:", error);
    });


// Configuración de la sesión
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
        ttl: 100, // Tiempo de vida de la sesión en segundos
    }),
}));

// Inicialización de Passport.js
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

// Configuración de Handlebars como motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

// Rutas principales
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/chat', chatRouter);
app.use('/api/sessions', sessionsRouter);

// Configuración de Socket.io
const socketServer = new Server(httpServer);

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

    socket.on('disconnect', () => {
        console.log("Client disconnected.");
    });
});


module.exports = app;
