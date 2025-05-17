import { config } from 'dotenv';

// Load environment variables based on the NODE_ENV (e.g., development or production)
config({
  path: `.env.${process.env.NODE_ENV || 'development'}.local`
});


export const { 
  PORT,
  JWT_SECRET,
 JWT_EXPERIES_IN, 
} = process.env;