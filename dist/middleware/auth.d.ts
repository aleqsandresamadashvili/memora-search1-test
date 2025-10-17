import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
export declare const authenticateToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireRole: (roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requireEmailVerification: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requireTutorProfile: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map