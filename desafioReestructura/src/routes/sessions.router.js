const express = require('express');
const passport = require('passport');
const {
    registerUser,
    loginUser,
    logoutUser,
    githubCallback
} = require('../controllers/user.controller.js');

const router = express.Router();

router.post('/register', registerUser);
router.get('/failregister', (req, res) => res.status(400).json({ error: 'Registro fallido' }));

router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), loginUser);
router.get('/faillogin', (req, res) => res.status(400).json({ error: 'Inicio de sesión fallido' }));

router.post('/logout', logoutUser);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), githubCallback);

router.get('/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    } else {
        res.status(401).json({ error: 'No hay un usuario autenticado' });
    }
});

module.exports = router;
