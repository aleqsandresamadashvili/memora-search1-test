import type { Request, Response } from 'express';
export declare const loginLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare function login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=login.d.ts.map