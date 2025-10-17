import { z } from 'zod';
import { SearchService } from './search.service';
const service = new SearchService();
const searchSchema = z.object({
    query: z.string().optional(),
    subjectIds: z.array(z.string()).optional(),
    minPrice: z.number().int().positive().optional(),
    maxPrice: z.number().int().positive().optional(),
    lessonType: z.enum(['STUDENT_TO_TUTOR', 'TUTOR_TO_STUDENT', 'ONLINE']).optional(),
    countryCode: z.string().length(2).default('GE'),
    sortBy: z.enum(['recommended', 'highest_rated', 'most_demanded', 'price_asc', 'price_desc', 'newest']).default('recommended'),
    cursor: z.string().optional(),
    limit: z.number().int().min(1).max(50).default(20),
});
export const searchTutors = async (req, res) => {
    const parse = searchSchema.safeParse({ ...req.query, ...req.body });
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    try {
        const result = await service.searchTutors(parse.data);
        res.json(result);
    }
    catch (e) {
        res.status(400).json({ error: e.message || 'Search failed' });
    }
};
export const getSubjects = async (req, res) => {
    const countryCode = req.query.countryCode || 'GE';
    try {
        const subjects = await service.getSubjects(countryCode);
        res.json({ subjects });
    }
    catch (e) {
        res.status(400).json({ error: e.message || 'Failed to fetch subjects' });
    }
};
//# sourceMappingURL=search.controller.js.map