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

export const getConversationsForUser = async (userId) => {
  const [conversations] = await pool.execute(
    `SELECT 
      u.id as participant_id,
      u.name as participant_name,
      u.avatar as participant_avatar,
      m.message as last_message,
      m.timestamp as last_message_time,
      (SELECT COUNT(*) FROM messages 
       WHERE ((sender_id = u.id AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = u.id))
       AND is_read = false AND sender_id != ?) as unread_count
    FROM users u
    JOIN messages m ON (
      (m.sender_id = u.id AND m.receiver_id = ?)
      OR (m.sender_id = ? AND m.receiver_id = u.id)
    )
    WHERE u.id != ?
    GROUP BY u.id
    ORDER BY MAX(m.timestamp) DESC`,
    [userId, userId, userId, userId, userId, userId]
  );
  return conversations;
};

export const markMessagesAsRead = async (messageIds) => {
  if (!messageIds || messageIds.length === 0) return;
  
  const [result] = await pool.execute(
    `UPDATE messages SET is_read = true WHERE id IN (?)`,
    [messageIds]
  );
  return result;
};