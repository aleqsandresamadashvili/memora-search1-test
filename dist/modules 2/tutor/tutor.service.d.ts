export declare class TutorService {
    step1(userId: string, data: {
        firstName: string;
        lastName: string;
        phone: string;
        dob: string;
    }): Promise<{
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
        readonly smsCode: string;
    }>;
    verifyPhone(userId: string, code: string): Promise<{
        readonly ok: false;
    } | {
        readonly ok: true;
    }>;
    step2(userId: string, data: {
        subjects: {
            subjectId: string;
            hourlyPrice: number;
        }[];
        offersStudentToTutor: boolean;
        offersTutorToStudent: boolean;
        offersOnline: boolean;
        travelCity?: string;
        neighborhoods?: string[];
    }): Promise<{
        readonly ok: true;
    }>;
}
//# sourceMappingURL=tutor.service.d.ts.map