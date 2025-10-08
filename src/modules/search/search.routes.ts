import { Router } from 'express';
import { SearchController } from './search.controller.js';

const router = Router();

// Public routes - no authentication required
router.get('/subjects', SearchController.getSubjects);
router.get('/tutors', SearchController.searchTutors);
router.get('/tutors/:tutorId', SearchController.getTutorDetails);
router.get('/suggestions', SearchController.getSearchSuggestions);

export default router;
