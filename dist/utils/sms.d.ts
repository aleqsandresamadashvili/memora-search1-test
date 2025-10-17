declare class SMSService {
    private client;
    constructor();
    sendVerificationSMS(phone: string, code: string): Promise<void>;
}
export declare const smsService: SMSService;
export {};
//# sourceMappingURL=sms.d.ts.map