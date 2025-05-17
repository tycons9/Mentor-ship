import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user.controllers.js';
import authorize from '../middlewares/auth.middleware.js';

console.log({ authorize, getUsers, getUserById, updateUser, deleteUser }); // Debug check

const router = express.Router();

router.get('/', authorize(['admin', 'mentor']), getUsers);
router.get('/:id', authorize(['admin', 'mentor']), getUserById);
router.put('/:id', authorize(['admin', 'mentor']), updateUser);
router.delete('/:id', authorize(['admin', 'mentor']), deleteUser);

export default router;
