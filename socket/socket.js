export default function socketHandler(io) {
  
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

   
    socket.on('authenticate', ({ userId, token }) => {
      console.log(`User ${userId} authenticated`);
      
  
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      
   
      io.emit('userStatusChanged', { 
        userId, 
        isOnline: true 
      });
    });

    
    socket.on('sendPrivateMessage', async (data) => {
      const { senderId, receiverId, content } = data;
      
      try {
        
        const message = {
          sender_id: senderId,
          receiver_id: receiverId,
          message: content
        };
        
       
        const savedMessage = {
          ...message,
          id: Date.now().toString(), 
          timestamp: new Date().toISOString()
        };
        
  
        socket.emit('messageSent', {
          ...savedMessage,
          status: 'sent'
        });

       
        if (onlineUsers.has(receiverId)) {
          const receiverSocketId = onlineUsers.get(receiverId);
          
         
          io.to(receiverSocketId).emit('receivePrivateMessage', {
            ...savedMessage,
            status: 'delivered'
          });
        }
        
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('messageError', {
          error: 'Failed to send message'
        });
      }
    });

   
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
      
        io.emit('userStatusChanged', { 
          userId: socket.userId, 
          isOnline: false 
        });
      }
    });
  });
}