import { z } from 'zod';
export declare const emailSchema: z.ZodString;
export declare const passwordSchema: z.ZodString;
export declare const nameSchema: z.ZodString;
export declare const phoneSchema: z.ZodString;
export declare const dobSchema: z.ZodString;
export declare const captchaSchema: z.ZodLiteral<z.core.util.Literal>;
export declare const roleSchema: z.ZodEnum<{
    STUDENT: "STUDENT";
    TUTOR: "TUTOR";
}>;
export declare const countryCodeSchema: z.ZodString;
//# sourceMappingURL=validators.d.ts.map