import { JWTPayload } from '../types/index.js';
export declare class AuthUtils {
    static hashPassword(password: string): Promise<string>;
    static comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    static generateToken(payload: JWTPayload): string;
    static verifyToken(token: string): JWTPayload;
    static validatePassword(password: string): {
        isValid: boolean;
        errors: string[];
    };
    static validateEmail(email: string): boolean;
    static validatePhone(phone: string): boolean;
    static generateVerificationCode(): string;
    static generateRandomToken(): string;
}
//# sourceMappingURL=auth.d.ts.map