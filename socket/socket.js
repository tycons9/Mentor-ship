// socket/socket.js
import { sendMessage } from '../models/message.model.js';

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a personal room based on userId
    socket.on('join', (userId) => {
      socket.join(userId.toString());
      console.log(`User ${userId} joined room ${userId}`);
    });

    // Handle message sending
    socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
      try {
        const messageId = await sendMessage(senderId, receiverId, message);
        const payload = {
          id: messageId,
          sender_id: senderId,
          receiver_id: receiverId,
          message,
          timestamp: new Date().toISOString(),
        };

        // Send to receiver
        io.to(receiverId.toString()).emit('receiveMessage', payload);

        // Optional: also emit back to sender (for confirmation)
        socket.emit('messageSent', payload);
      } catch (err) {
        console.error('Socket error:', err);
        socket.emit('error', 'Message send failed');
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

export default socketHandler;
