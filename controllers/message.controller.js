// controllers/message.controller.js
import pool from '../config/db.js';

export const saveMessage = async ({ sender_id, receiver_id, message }) => {
  const [result] = await pool.query(
    'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
    [sender_id, receiver_id, message]
  );

  
  return {
    id: result.insertId,
    sender_id,
    receiver_id,
    message,
    timestamp: new Date().toISOString()
  };
};
