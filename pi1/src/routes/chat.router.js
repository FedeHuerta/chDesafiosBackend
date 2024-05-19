import express from 'express';
import Message from '../dao/models/message.model.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('chat');
});

router.post('/message', async (req, res) => {
    try {
        const { user, message } = req.body;
        const newMessage = new Message({ user, message });
        await newMessage.save();
        res.status(201).send('Message saved');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving message');
    }
});

export default router;
