import { Router } from 'express';
import passport from 'passport';
import { CartManager } from '../dao/cartManager.js';
import User from '../dao/models/user.model.js';

const router = Router();
const cartManager = new CartManager();


router.post('/register', passport.authenticate('register', { failureRedirect: 'failregister' }), async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        req.user.cart = newCart._id;
        await req.user.save();
        res.redirect('/login');
    } catch (error) {
        console.error("Error al registrarse: ", error);
        res.status(500).send('Error al registrarse');
    }
});

router.get('/failregister', async (req, res) => {
    console.log("Estrategia fallida")
    res.send({ error: "Falló" })
})

router.post('/login', passport.authenticate('login', { failureRedirect: 'faillogin' }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "Datos incompletos" })
    try {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
            cart: req.user.cart
        };
        console.log(req.session.user)
        res.redirect('/profile');

    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
    }
});

router.get('/faillogin', (req, res) => {
    res.status(404).send('Usuario o contraseña incorrectos');
})

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});


router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })


router.get("/githubcallback", (req, res, next) => {
    passport.authenticate("github", async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect(`/login?error=${encodeURIComponent(info.message)}`);
        }
        try {
            req.logIn(user, async (err) => {
                if (err) {
                    return next(err);
                }
                if (!user.cart) {
                    const newCart = await cartManager.createCart();
                    user.cart = newCart._id;
                    await user.save();
                }
                req.session.user = user;
                return res.redirect("/products");
            });
        } catch (error) {
            console.error("Error al autenticar con GitHub: ", error);
            return res.status(500).send('Error al autenticar con GitHub');
        }
    })(req, res, next);
});

router.get('/current', (req,res)=> {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    } else {
        res.status(401).send('No hay un usuario autenticado');
    }
})

export default router;
