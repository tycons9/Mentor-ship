import express from 'express';
import pool from '../config/db.js'; // Add this import
import { 
  sendMessage, 
  getMessagesBetweenUsers, 
  getConversationsForUser,
  markMessagesAsRead
} from '../models/message.model.js';

const router = express.Router();

// POST /api/messages
router.post('/', async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  if (!sender_id || !receiver_id || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const messageId = await sendMessage(sender_id, receiver_id, message);
    
    // Get the newly created message using the imported pool
    const [newMessage] = await pool.query(
      'SELECT * FROM messages WHERE id = ?',
      [messageId]
    );
    
    res.status(201).json(newMessage[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/messages/conversations/:userId
router.get('/conversations/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await getConversationsForUser(userId);
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
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

// POST /api/messages/mark-as-read
router.post('/mark-as-read', async (req, res) => {
  const { messageIds } = req.body;

  if (!messageIds || !Array.isArray(messageIds)) {
    return res.status(400).json({ error: 'Invalid message IDs' });
  }

  try {
    await markMessagesAsRead(messageIds);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;