import { Router } from 'express';
import passport from 'passport';

const router = Router();


router.post('/register', passport.authenticate('register', { failureRedirect: 'failregister' }), async (req, res) => {
    res.redirect('/login');
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
            role: req.user.role
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
    passport.authenticate("github", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect(`/login?error=${encodeURIComponent(info.message)}`);
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.session.user = user;
            return res.redirect("/products");
        });
    })(req, res, next);
});


export default router;
