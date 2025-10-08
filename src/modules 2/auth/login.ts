import type { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { emailSchema, passwordSchema } from '../../utils/validators';

const prisma = new PrismaClient();

export const loginLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  if (!user.isEmailVerified) return res.status(403).json({ error: 'Email not verified' });
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || '', { expiresIn: '7d' });
  return res.json({ token });
}
