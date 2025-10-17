import { Router } from 'express';
import { TutorController } from './tutor.controller.js';
import { authenticateToken, requireRole } from '../../middleware/auth.js';
const router = Router();
// All routes require authentication
router.use(authenticateToken);
// Tutor-specific routes
router.post('/setup-step1', requireRole(['TUTOR']), TutorController.setupProfileStep1);
router.post('/setup-step2', requireRole(['TUTOR']), TutorController.setupProfileStep2);
router.get('/profile', requireRole(['TUTOR']), TutorController.getProfile);
router.put('/profile', requireRole(['TUTOR']), TutorController.updateProfile);
export default router;
//# sourceMappingURL=tutor.routes.js.map