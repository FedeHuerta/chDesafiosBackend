const User = require('../dao/models/user.model.js');
const { createHash, isValidPassword } = require('../utils.js');
const { CartManager } = require('../dao/classes/cart.dao.js');

const cartManager = new CartManager();

const registerUser = async (req, res, next) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const newCart = await cartManager.createCart();
        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: newCart._id,
            role: 'user'
        });

        const savedUser = await newUser.save();

        res.redirect('/login');
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        if (!isValidPassword(user, password)) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart
        };

        res.redirect('/products')
    } catch (error) {
        next(error);
    }
};

const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        res.redirect('/login')
    });
};

const githubCallback = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user.cart) {
            const newCart = await cartManager.createCart();
            user.cart = newCart._id;
            await user.save();
        }
        req.session.user = user;
        res.redirect('/products');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    githubCallback
};
