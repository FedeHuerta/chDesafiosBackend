import { Router } from 'express';
import User from '../dao/models/user.model.js';
import bcrypt from 'bcryptjs';

const router = Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ first_name, last_name, email, age, password: hashedPassword });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error al registrar usuario.');
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = null;
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') { // Necesité hardcodear este usuario por pedido de consignas
            user = {
                id: 'admin_id', 
                first_name: 'Admin',
                last_name: 'Admin',
                email: 'adminCoder@coder.com',
                age: 0,
                role: 'admin'
            };
        } else {
            // Realizo la verificación normal con la base de datos para otros usuarios
            user = await User.findOne({ email });

            if (!user) {
                return res.status(404).send('Usuario o contraseña incorrectos');
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).send('Usuario o contraseña incorrectos');
            }
        }

        req.session.user = user;
        if (user.role === 'admin') {
            return res.redirect('/admin');
        }
        res.redirect('/products');
    } catch (err) {
        res.status(500).send('Error al iniciar sesión.');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión.');
        }

        res.redirect('/login');
    });
});

export default router;