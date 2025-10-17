import jwt from 'jsonwebtoken';
export function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header)
        return res.status(401).json({ error: 'Unauthorized' });
    const token = header.replace('Bearer ', '');
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || '');
        req.user = payload;
        next();
    }
    catch (e) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}
//# sourceMappingURL=auth.js.map