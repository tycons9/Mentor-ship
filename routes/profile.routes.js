import { Router } from 'express';
import { getProfileByUserId, createProfile } from '../controllers/profile.controllers.js';
import upload from '../middlewares/upload.js';
const router = Router();

router.post('/', upload.single('profile_image'), createProfile);
router.get('/:userId', getProfileByUserId);

export default router;
