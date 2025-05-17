import { Router } from 'express';
import { getProfileByUserId, createProfile } from '../controllers/profile.controllers.js';

const router = Router();

router.post('/', createProfile);
router.get('/:userId', getProfileByUserId);

export default router;
