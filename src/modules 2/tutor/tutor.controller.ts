import type { Request, Response } from 'express';
import { z } from 'zod';
import { TutorService } from './tutor.service';
import { nameSchema, phoneSchema, dobSchema } from '../../utils/validators';

const service = new TutorService();

const step1Schema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  dob: dobSchema,
});

export const step1 = async (req: Request, res: Response) => {
  const parse = step1Schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const userId = (req as any).user?.sub as string | undefined;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const result = await service.step1(userId, { ...parse.data, dob: parse.data.dob });
  // Return SMS code for development
  res.json({ message: 'Step 1 saved. Verify phone.', code: result.smsCode });
};

const verifyPhoneSchema = z.object({ code: z.string().length(6) });

export const verifyPhone = async (req: Request, res: Response) => {
  const parse = verifyPhoneSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const userId = (req as any).user?.sub as string | undefined;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const ok = await service.verifyPhone(userId, parse.data.code);
  if (!ok.ok) return res.status(400).json({ error: 'Invalid or expired code' });
  res.json({ message: 'Phone verified' });
};

const step2Schema = z.object({
  subjects: z.array(z.object({ subjectId: z.string(), hourlyPrice: z.number().int().positive() })).min(1).max(5),
  offersStudentToTutor: z.boolean(),
  offersTutorToStudent: z.boolean(),
  offersOnline: z.boolean(),
  travelCity: z.string().optional(),
  neighborhoods: z.array(z.string()).optional(),
});

export const step2 = async (req: Request, res: Response) => {
  const parse = step2Schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const userId = (req as any).user?.sub as string | undefined;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await service.step2(userId, parse.data as any);
    res.json({ message: 'Step 2 saved' });
  } catch (e: any) {
    res.status(400).json({ error: e.message || 'Invalid data' });
  }
};
