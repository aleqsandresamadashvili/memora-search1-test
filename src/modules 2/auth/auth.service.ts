import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export class AuthService {
  async registerUser(params: {
    email: string;
    password: string;
    role: Role;
    countryCode: string;
  }) {
    const { email, password, role, countryCode } = params;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { alreadyExists: true } as const;
    }

    const country = await prisma.country.findUnique({ where: { code: countryCode } });
    if (!country) {
      throw new Error('Invalid country');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
        countryId: country.id,
        ...(role === 'TUTOR' ? { tutorProfile: { create: {} } } : { studentProfile: { create: {} } }),
      },
    });

    const code = randomUUID().slice(0, 6).toUpperCase();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);
    await prisma.emailVerification.create({
      data: { userId: user.id, code, expiresAt },
    });

    return { user, verificationCode: code } as const;
  }

  async verifyEmail(params: { email: string; code: string }) {
    const { email, code } = params;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { ok: false } as const;

    const ver = await prisma.emailVerification.findFirst({
      where: { userId: user.id, usedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    if (!ver) return { ok: false } as const;
    if (ver.code !== code || ver.expiresAt < new Date()) return { ok: false } as const;

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { isEmailVerified: true } }),
      prisma.emailVerification.update({ where: { id: ver.id }, data: { usedAt: new Date() } }),
    ]);

    return { ok: true } as const;
  }
}
