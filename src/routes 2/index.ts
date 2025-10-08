import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import tutorRoutes from '../modules/tutor/tutor.routes';
import searchRoutes from '../modules/search/search.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tutors', tutorRoutes);
router.use('/search', searchRoutes);

export default router;
