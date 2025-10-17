import { z } from 'zod';
import { AuthService } from './auth.service';
import { emailSchema, passwordSchema, roleSchema, captchaSchema, countryCodeSchema } from '../../utils/validators';
const service = new AuthService();
const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    role: roleSchema,
    captcha: captchaSchema,
    countryCode: countryCodeSchema,
});
export const register = async (req, res) => {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ error: parse.error.flatten() });
    }
    const { email, password, role, countryCode } = parse.data;
    const result = await service.registerUser({ email, password, role, countryCode });
    if ('alreadyExists' in result) {
        return res.status(409).json({ error: 'Account exists. Please login.' });
    }
    // TODO: integrate real email. For now, return code for testing.
    return res.status(201).json({ message: 'Registered. Verify email.', code: result.verificationCode });
};
const verifySchema = z.object({ email: emailSchema, code: z.string().min(4).max(12) });
export const verifyEmail = async (req, res) => {
    const parse = verifySchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const ok = await service.verifyEmail(parse.data);
    if (!ok.ok)
        return res.status(400).json({ error: 'Invalid or expired code' });
    return res.json({ message: 'Email verified' });
};
//# sourceMappingURL=auth.controller.js.map