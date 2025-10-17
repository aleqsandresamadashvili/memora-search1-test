import { Role } from '@prisma/client';
export declare class AuthService {
    registerUser(params: {
        email: string;
        password: string;
        role: Role;
        countryCode: string;
    }): Promise<{
        readonly alreadyExists: true;
        user?: never;
        readonly verificationCode?: never;
    } | {
        readonly user: {
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            emailVerified: boolean;
            emailVerificationCode: string | null;
            phone: string | null;
            phoneVerified: boolean;
            phoneVerificationCode: string | null;
            firstName: string | null;
            lastName: string | null;
            dob: Date | null;
            countryId: string | null;
            profileImage: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        readonly verificationCode: string;
        readonly alreadyExists?: never;
    }>;
    verifyEmail(params: {
        email: string;
        code: string;
    }): Promise<{
        readonly ok: false;
    } | {
        readonly ok: true;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map