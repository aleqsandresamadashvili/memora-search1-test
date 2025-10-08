import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthUtils } from '../../utils/auth.js';
import { emailService } from '../../utils/email.js';
import { smsService } from '../../utils/sms.js';
import { RegisterRequest, LoginRequest, EmailVerificationRequest, PhoneVerificationRequest, ApiResponse } from '../../types/index.js';

const prisma = new PrismaClient();

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, role, firstName, lastName, countryCode }: RegisterRequest = req.body;

      // Validate input
      if (!email || !password || !role) {
        res.status(400).json({
          success: false,
          error: 'Email, password, and role are required'
        });
        return;
      }

      if (!AuthUtils.validateEmail(email)) {
        res.status(400).json({
          success: false,
          error: 'Invalid email format'
        });
        return;
      }

      const passwordValidation = AuthUtils.validatePassword(password);
      if (!passwordValidation.isValid) {
        res.status(400).json({
          success: false,
          error: 'Password validation failed',
          details: passwordValidation.errors
        });
        return;
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'User already exists',
          code: 'USER_EXISTS'
        });
        return;
      }

      // Get country
      let countryId: string | undefined;
      if (countryCode) {
        const country = await prisma.country.findUnique({
          where: { code: countryCode }
        });
        countryId = country?.id;
      }

      // Hash password
      const hashedPassword = await AuthUtils.hashPassword(password);

      // Generate verification code
      const verificationCode = AuthUtils.generateVerificationCode();

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          firstName,
          lastName,
          countryId,
          emailVerificationCode: verificationCode,
        }
      });

      // Store verification code
      await prisma.emailVerification.upsert({
        where: { email },
        update: {
          code: verificationCode,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        },
        create: {
          email,
          code: verificationCode,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        }
      });

      // Send verification email
      try {
        await emailService.sendVerificationEmail(email, verificationCode);
      } catch (error) {
        console.error('Failed to send verification email:', error);
        // Continue with registration even if email fails
      }

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email for verification code.',
        data: {
          userId: user.id,
          email: user.email,
          role: user.role,
          code: verificationCode, // For development - remove in production
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
        return;
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          tutorProfile: true,
          country: true,
        }
      });

      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
        return;
      }

      // Check password
      const isPasswordValid = await AuthUtils.comparePassword(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
        return;
      }

      // Generate token
      const token = AuthUtils.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
            country: user.country,
            tutorProfile: user.tutorProfile,
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email, code }: EmailVerificationRequest = req.body;

      if (!email || !code) {
        res.status(400).json({
          success: false,
          error: 'Email and verification code are required'
        });
        return;
      }

      // Find verification record
      const verification = await prisma.emailVerification.findUnique({
        where: { email }
      });

      if (!verification) {
        res.status(404).json({
          success: false,
          error: 'No verification code found for this email'
        });
        return;
      }

      if (verification.expiresAt < new Date()) {
        res.status(400).json({
          success: false,
          error: 'Verification code has expired'
        });
        return;
      }

      if (verification.code !== code) {
        res.status(400).json({
          success: false,
          error: 'Invalid verification code'
        });
        return;
      }

      // Update user
      const user = await prisma.user.update({
        where: { email },
        data: {
          emailVerified: true,
          emailVerificationCode: null,
        },
        include: {
          country: true,
        }
      });

      // Delete verification record
      await prisma.emailVerification.delete({
        where: { email }
      });

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(email, user.firstName || 'User');
      } catch (error) {
        console.error('Failed to send welcome email:', error);
      }

      res.json({
        success: true,
        message: 'Email verified successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            emailVerified: user.emailVerified,
            country: user.country,
          }
        }
      });

    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async requestPhoneVerification(req: Request, res: Response): Promise<void> {
    try {
      const { phone } = req.body;

      if (!phone) {
        res.status(400).json({
          success: false,
          error: 'Phone number is required'
        });
        return;
      }

      if (!AuthUtils.validatePhone(phone)) {
        res.status(400).json({
          success: false,
          error: 'Invalid phone number format'
        });
        return;
      }

      // Generate verification code
      const verificationCode = AuthUtils.generateVerificationCode();

      // Store verification code
      await prisma.phoneVerification.upsert({
        where: { phone },
        update: {
          code: verificationCode,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        },
        create: {
          phone,
          code: verificationCode,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        }
      });

      // Send SMS
      try {
        await smsService.sendVerificationSMS(phone, verificationCode);
      } catch (error) {
        console.error('Failed to send SMS:', error);
        // Continue with verification even if SMS fails
      }

      res.json({
        success: true,
        message: 'Verification code sent to your phone',
        data: {
          code: verificationCode, // For development - remove in production
        }
      });

    } catch (error) {
      console.error('Phone verification request error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async verifyPhone(req: Request, res: Response): Promise<void> {
    try {
      const { phone, code }: PhoneVerificationRequest = req.body;

      if (!phone || !code) {
        res.status(400).json({
          success: false,
          error: 'Phone number and verification code are required'
        });
        return;
      }

      // Find verification record
      const verification = await prisma.phoneVerification.findUnique({
        where: { phone }
      });

      if (!verification) {
        res.status(404).json({
          success: false,
          error: 'No verification code found for this phone number'
        });
        return;
      }

      if (verification.expiresAt < new Date()) {
        res.status(400).json({
          success: false,
          error: 'Verification code has expired'
        });
        return;
      }

      if (verification.code !== code) {
        res.status(400).json({
          success: false,
          error: 'Invalid verification code'
        });
        return;
      }

      // Update user
      const user = await prisma.user.update({
        where: { phone },
        data: {
          phoneVerified: true,
          phoneVerificationCode: null,
        }
      });

      // Delete verification record
      await prisma.phoneVerification.delete({
        where: { phone }
      });

      res.json({
        success: true,
        message: 'Phone number verified successfully',
        data: {
          user: {
            id: user.id,
            phone: user.phone,
            phoneVerified: user.phoneVerified,
          }
        }
      });

    } catch (error) {
      console.error('Phone verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            dob: user.dob,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
            country: user.country,
            tutorProfile: user.tutorProfile,
            createdAt: user.createdAt,
          }
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
