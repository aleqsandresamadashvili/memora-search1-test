import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SearchFilters {
  query?: string;
  subjectIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  lessonType?: 'STUDENT_TO_TUTOR' | 'TUTOR_TO_STUDENT' | 'ONLINE';
  countryCode?: string;
  sortBy?: 'recommended' | 'highest_rated' | 'most_demanded' | 'price_asc' | 'price_desc' | 'newest';
  cursor?: string;
  limit?: number;
}

export class SearchService {
  async searchTutors(filters: SearchFilters) {
    const {
      query,
      subjectIds = [],
      minPrice,
      maxPrice,
      lessonType,
      countryCode = 'GE',
      sortBy = 'recommended',
      cursor,
      limit = 20,
    } = filters;

    const country = await prisma.country.findUnique({ where: { code: countryCode } });
    if (!country) throw new Error('Invalid country');

    // Build where clause
    const where: any = {
      user: { countryId: country.id },
      isApproved: true,
    };

    // Subject filter
    if (subjectIds.length > 0) {
      where.subjects = { some: { subjectId: { in: subjectIds } } };
    }

    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.subjects = {
        ...where.subjects,
        some: {
          ...(subjectIds.length > 0 && { subjectId: { in: subjectIds } }),
          hourlyPrice: {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          },
        },
      };
    }

    // Lesson type filter
    if (lessonType) {
      switch (lessonType) {
        case 'STUDENT_TO_TUTOR':
          where.offersStudentToTutor = true;
          break;
        case 'TUTOR_TO_STUDENT':
          where.offersTutorToStudent = true;
          break;
        case 'ONLINE':
          where.offersOnline = true;
          break;
      }
    }

    // Text search
    if (query) {
      where.OR = [
        { user: { firstName: { contains: query, mode: 'insensitive' } } },
        { user: { lastName: { contains: query, mode: 'insensitive' } } },
        { bio: { contains: query, mode: 'insensitive' } },
        { subjects: { some: { subject: { name: { contains: query, mode: 'insensitive' } } } } },
      ];
    }

    // Sorting
    let orderBy: any = {};
    switch (sortBy) {
      case 'highest_rated':
        orderBy = { ratings: { _count: 'desc' } };
        break;
      case 'most_demanded':
        orderBy = { bookings: { _count: 'desc' } };
        break;
      case 'price_asc':
        orderBy = { subjects: { _min: { hourlyPrice: 'asc' } } };
        break;
      case 'price_desc':
        orderBy = { subjects: { _min: { hourlyPrice: 'desc' } } };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      default: // recommended
        orderBy = [
          { verifiedTrusted: 'desc' },
          { ratings: { _count: 'desc' } },
          { createdAt: 'desc' },
        ];
    }

    // Cursor pagination
    const cursorClause = cursor ? { id: { lt: cursor } } : {};

    const tutors = await prisma.tutorProfile.findMany({
      where: { ...where, ...cursorClause },
      include: {
        user: { select: { firstName: true, lastName: true, isPhoneVerified: true } },
        subjects: {
          include: { subject: { select: { name: true, category: { select: { name: true } } } } },
        },
        ratings: { select: { score: true } },
        bookings: { select: { id: true } },
      },
      orderBy,
      take: limit + 1,
    });

    const hasMore = tutors.length > limit;
    const results = hasMore ? tutors.slice(0, limit) : tutors;

    // Transform results
    const transformed = results.map((tutor) => {
      const avgRating = tutor.ratings.length > 0
        ? tutor.ratings.reduce((sum, r) => sum + r.score, 0) / tutor.ratings.length
        : 0;

      const minPrice = tutor.subjects.length > 0
        ? Math.min(...tutor.subjects.map(s => s.hourlyPrice))
        : 0;

      const teachingHours = tutor.bookings.length; // Simplified

      return {
        id: tutor.id,
        firstName: tutor.user.firstName,
        lastName: tutor.user.lastName?.charAt(0), // Show only initial
        bio: tutor.bio,
        avgRating,
        ratingCount: tutor.ratings.length,
        minPrice,
        teachingHours,
        verifiedTrusted: tutor.verifiedTrusted,
        pinnedComment: tutor.pinnedComment,
        subjects: tutor.subjects.map(s => ({
          name: s.subject.name,
          category: s.subject.category.name,
          price: s.hourlyPrice,
        })),
        lessonFormats: {
          studentToTutor: tutor.offersStudentToTutor,
          tutorToStudent: tutor.offersTutorToStudent,
          online: tutor.offersOnline,
        },
        yearsExperience: tutor.yearsExperience,
        introVideoUrl: tutor.introVideoUrl,
      };
    });

    return {
      tutors: transformed,
      hasMore,
      nextCursor: hasMore ? results[results.length - 1]?.id : null,
    };
  }

  async getSubjects(countryCode = 'GE') {
    const country = await prisma.country.findUnique({ where: { code: countryCode } });
    if (!country) throw new Error('Invalid country');

    return prisma.subjectCategory.findMany({
      where: { countryId: country.id },
      include: {
        subjects: { select: { id: true, name: true } },
      },
    });
  }
}
