// routes/messageRoutes.js
import express from 'express';
import { sendMessage, getMessagesBetweenUsers } from '../models/message.model.js';

const router = express.Router();

// POST /api/messages
router.post('/', async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  if (!senderId || !receiverId || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const messageId = await sendMessage(senderId, receiverId, message);
    res.status(201).json({ message: 'Message sent', id: messageId });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/messages/:userA/:userB
router.get('/:userA/:userB', async (req, res) => {
  const { userA, userB } = req.params;

  try {
    const messages = await getMessagesBetweenUsers(userA, userB);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
