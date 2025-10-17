import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticateToken } from '../../middleware/auth.js';
const router = Router();
// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/request-phone-verification', AuthController.requestPhoneVerification);
router.post('/verify-phone', AuthController.verifyPhone);
// Protected routes
router.get('/profile', authenticateToken, AuthController.getProfile);
export default router;
//# sourceMappingURL=auth.routes.js.map