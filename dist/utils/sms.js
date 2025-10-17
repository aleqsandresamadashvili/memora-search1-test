import twilio from 'twilio';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';
class SMSService {
    client = null;
    constructor() {
        if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_ACCOUNT_SID.startsWith('AC')) {
            this.client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
        }
    }
    async sendVerificationSMS(phone, code) {
        if (!this.client) {
            console.log(`SMS verification code for ${phone}: ${code}`);
            return; // In development, just log the code
        }
        try {
            await this.client.messages.create({
                body: `Your Memora verification code is: ${code}. This code will expire in 15 minutes.`,
                from: TWILIO_PHONE_NUMBER,
                to: phone,
            });
        }
        catch (error) {
            console.error('Error sending SMS:', error);
            throw new Error('Failed to send verification SMS');
        }
    }
}
export const smsService = new SMSService();
//# sourceMappingURL=sms.js.map