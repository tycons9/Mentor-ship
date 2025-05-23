import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser
} from '../controllers/auth.controllers.js';

import authorize from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', logoutUser);


router.post('/register', registerUser);

export default router;
