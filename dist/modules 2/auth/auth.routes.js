import { Router } from 'express';
import { register, verifyEmail } from './auth.controller';
import { login, loginLimiter } from './login';
const router = Router();
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', loginLimiter, login);
export default router;
//# sourceMappingURL=auth.routes.js.map