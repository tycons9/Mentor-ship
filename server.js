// server.js
import express from 'express';
import http from 'http'; // ✅ Needed for Socket.IO server
import { Server } from 'socket.io'; // ✅ Socket.IO import
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { PORT } from './config/env.js';
import { connectToDatabase } from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js'; 
import profileRoutes from './routes/profile.routes.js';
import messageRoutes from './routes/message.routes.js';
import socketHandler from './socket/socket.js';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5501', // or your frontend URL
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(cors({
  origin: 'http://127.0.0.1:5501',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.send('🚀 SkillBridge backend is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/messages', messageRoutes);

// Start server and connect to DB
server.listen(PORT, async () => {
  socketHandler(io); // 🔌 Initialize Socket.IO
  await connectToDatabase();
  console.log(`🟢 Server running with Socket.IO at http://localhost:${PORT}`);
});
