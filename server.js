// server.js
import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { PORT } from './config/env.js';
import { connectToDatabase } from './config/db.js';

// Load environment variables
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js'; // <-- Add your user management routes

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Test route
app.get('/', (req, res) => {
  res.send('🚀 SkillBridge backend is running!');
});

// Routes
app.use('/api/auth', authRoutes);    
app.use('/api/users', userRoutes);    

// Start server
app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`🟢 Server running at http://localhost:${PORT}`);
});
