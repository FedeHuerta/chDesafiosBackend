const express = require('express');
const router = express.Router();
const { handleNewMessage } = require('../controllers/chat.controller.js');

router.get('/', (req, res) => {
    res.render('chat');
});

router.post('/message', async (req, res, next) => {
    const { user, message } = req.body;
    try {
        await handleNewMessage(req.io, { user, message });
        res.status(201).send('Message saved');
    } catch (error) {
        console.error("Error in message endpoint:", error);
        next(error);
    }
});

module.exports = router;
