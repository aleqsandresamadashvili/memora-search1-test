import nodemailer from 'nodemailer';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@memora.com';
class EmailService {
    transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });
    }
    async sendVerificationEmail(email, code) {
        const mailOptions = {
            from: FROM_EMAIL,
            to: email,
            subject: 'Verify Your Email - Memora',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Welcome to Memora!</h2>
          <p>Thank you for registering with Memora. Please verify your email address by entering the following code:</p>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #667eea; font-size: 32px; margin: 0;">${code}</h1>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't create an account with Memora, please ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">© 2024 Memora. All rights reserved.</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Error sending verification email:', error);
            throw new Error('Failed to send verification email');
        }
    }
    async sendWelcomeEmail(email, firstName) {
        const mailOptions = {
            from: FROM_EMAIL,
            to: email,
            subject: 'Welcome to Memora!',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Welcome to Memora, ${firstName}!</h2>
          <p>Your email has been successfully verified. You can now start using Memora to find the perfect tutor or start teaching.</p>
          <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="color: #667eea; margin-top: 0;">What's next?</h3>
            <ul>
              <li>Complete your profile setup</li>
              <li>Browse available tutors</li>
              <li>Book your first lesson</li>
            </ul>
          </div>
          <p>If you have any questions, feel free to contact our support team.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">© 2024 Memora. All rights reserved.</p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Error sending welcome email:', error);
            // Don't throw error for welcome email as it's not critical
        }
    }
}
export const emailService = new EmailService();
//# sourceMappingURL=email.js.map