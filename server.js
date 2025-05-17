// server.js
import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { PORT } from './config/env.js';
import { connectToDatabase } from './config/db.js';


config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js'; 

const app = express();


app.use(cors({
  origin: 'http://127.0.0.1:5500', 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('🚀 SkillBridge backend is running!');
});


app.use('/api/auth', authRoutes);    
app.use('/api/users', userRoutes);    


app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`🟢 Server running at http://localhost:${PORT}`);
});
