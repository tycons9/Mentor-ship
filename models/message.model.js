// models/messageModel.js
import pool from '../config/db.js';

export const sendMessage = async (senderId, receiverId, message) => {
  const [result] = await pool.execute(
    `INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`,
    [senderId, receiverId, message]
  );
  return result.insertId;
};

export const getMessagesBetweenUsers = async (userAId, userBId) => {
  const [messages] = await pool.execute(
    `SELECT * FROM messages
     WHERE (sender_id = ? AND receiver_id = ?)
        OR (sender_id = ? AND receiver_id = ?)
     ORDER BY timestamp ASC`,
    [userAId, userBId, userBId, userAId]
  );
  return messages;
};
