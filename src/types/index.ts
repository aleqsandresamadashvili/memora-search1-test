import { Request } from 'express';
import { User, Role } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  countryCode?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface EmailVerificationRequest {
  email: string;
  code: string;
}

export interface PhoneVerificationRequest {
  phone: string;
  code: string;
}

export interface TutorProfileSetupStep1 {
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
}

export interface TutorProfileSetupStep2 {
  subjects: Array<{
    subjectId: string;
    hourlyRate: number;
  }>;
  lessonTypes: {
    studentToTutor: boolean;
    tutorToStudent: boolean;
    online: boolean;
  };
  travelAreas?: Array<{
    city: string;
    neighborhoods: string[];
  }>;
}

export interface SearchFilters {
  query?: string;
  subjectIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  lessonType?: string;
  countryCode?: string;
  sortBy?: 'recommended' | 'highest_rated' | 'most_demanded' | 'price_asc' | 'price_desc' | 'newest';
  limit?: number;
  cursor?: string;
}

export interface BookingRequest {
  tutorId: string;
  subjectId: string;
  lessonType: string;
  scheduledAt: string;
  duration: number;
  notes?: string;
  location?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
