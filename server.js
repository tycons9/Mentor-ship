// server.js
import express from 'express';
import http from 'http'; 
import { Server } from 'socket.io'; 
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { PORT } from './config/env.js';
import { connectToDatabase } from './config/db.js';
import path from 'path';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js'; 
import profileRoutes from './routes/profile.routes.js';
import messageRoutes from './routes/message.routes.js';
import socketHandler from './socket/socket.js';
import reviewRoutes from './routes/review.routes.js';
import sessionRoutes from "./routes/session.routes.js";
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const app = express();


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5501', 
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


app.get('/', (req, res) => {
  res.send('🚀 SkillBridge backend is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);

app.use('/uploads', express.static('uploads'));
app.use('/api/messages', messageRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reviews", reviewRoutes);

server.listen(PORT, async () => {
  socketHandler(io);
  await connectToDatabase();
  console.log(`🟢 Server running with Socket.IO at http://localhost:${PORT}`);
});
