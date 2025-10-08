import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { step1, verifyPhone, step2 } from './tutor.controller';

const router = Router();

router.post('/setup/step1', requireAuth, step1);
router.post('/verify-phone', requireAuth, verifyPhone);
router.post('/setup/step2', requireAuth, step2);

export default router;
