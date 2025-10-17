declare class EmailService {
    private transporter;
    constructor();
    sendVerificationEmail(email: string, code: string): Promise<void>;
    sendWelcomeEmail(email: string, firstName: string): Promise<void>;
}
export declare const emailService: EmailService;
export {};
//# sourceMappingURL=email.d.ts.map