import { config } from 'dotenv';

config({
  path: `.env.${process.env.NODE_ENV || 'development'}.local`
});


export const { 
  PORT,
  JWT_SECRET,
 JWT_EXPERIES_IN, 
} = process.env;
