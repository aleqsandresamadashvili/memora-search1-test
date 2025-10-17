import { Router } from 'express';
import { searchTutors, getSubjects } from './search.controller';
const router = Router();
router.get('/tutors', searchTutors);
router.get('/subjects', getSubjects);
export default router;
//# sourceMappingURL=search.routes.js.map