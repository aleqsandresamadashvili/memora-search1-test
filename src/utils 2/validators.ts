import { z } from 'zod';

export const emailSchema = z.string().email().max(255);
export const passwordSchema = z
  .string()
  .min(8)
  .max(64)
  .regex(/[A-Z]/, 'Must include uppercase letter')
  .regex(/[0-9]/, 'Must include a number')
  .regex(/[!@#$%^&*(),.?":{}|<>_\-]/, 'Must include a special character');

export const nameSchema = z
  .string()
  .min(2)
  .max(100)
  .regex(/^[\p{L} .'-]+$/u, 'Only letters and basic punctuation');

export const phoneSchema = z
  .string()
  .min(7)
  .max(20)
  .regex(/^\+?[0-9\s-]+$/, 'Invalid phone');

export const dobSchema = z
  .string()
  .refine((s) => !Number.isNaN(Date.parse(s)), 'Invalid date')
  .refine((s) => {
    const d = new Date(s);
    const now = new Date();
    const age = (now.getTime() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    return age >= 18;
  }, 'Must be at least 18');

export const captchaSchema = z.literal(true, {
  errorMap: () => ({ message: 'Captcha failed' }),
});

export const roleSchema = z.enum(['STUDENT', 'TUTOR']);

export const countryCodeSchema = z.string().length(2);
