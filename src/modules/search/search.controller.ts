import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { SearchFilters } from '../../types/index.js';

const prisma = new PrismaClient();

export class SearchController {
  static async getSubjects(req: Request, res: Response): Promise<void> {
    try {
      const { countryCode } = req.query;

      let whereClause: any = {};
      
      if (countryCode) {
        const country = await prisma.country.findUnique({
          where: { code: countryCode as string }
        });
        
        if (country) {
          whereClause = {
            category: {
              countryId: country.id
            }
          };
        }
      }

      const subjects = await prisma.subject.findMany({
        where: whereClause,
        include: {
          category: {
            include: {
              country: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      // Group subjects by category
      const groupedSubjects = subjects.reduce((acc, subject) => {
        const categoryName = subject.category.name;
        if (!acc[categoryName]) {
          acc[categoryName] = {
            id: subject.category.id,
            name: categoryName,
            country: subject.category.country,
            subjects: []
          };
        }
        acc[categoryName].subjects.push({
          id: subject.id,
          name: subject.name
        });
        return acc;
      }, {} as any);

      const result = Object.values(groupedSubjects);

      res.json({
        success: true,
        data: {
          subjects: result
        }
      });

    } catch (error) {
      console.error('Get subjects error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async searchTutors(req: Request, res: Response): Promise<void> {
    try {
      const {
        query,
        subjectIds,
        minPrice,
        maxPrice,
        lessonType,
        countryCode,
        sortBy = 'recommended',
        limit = 20,
        cursor
      }: SearchFilters = req.query as any;

      // Build where clause
      let whereClause: any = {
        user: {
          isActive: true,
          emailVerified: true,
        },
        verificationStatus: 'VERIFIED', // Only show verified tutors
      };

      // Country filter
      if (countryCode) {
        const country = await prisma.country.findUnique({
          where: { code: countryCode }
        });
        
        if (country) {
          whereClause.user.countryId = country.id;
        }
      }

      // Subject filter
      if (subjectIds && subjectIds.length > 0) {
        whereClause.subjects = {
          some: {
            subjectId: {
              in: Array.isArray(subjectIds) ? subjectIds : [subjectIds]
            }
          }
        };
      }

      // Price filter
      if (minPrice || maxPrice) {
        whereClause.subjects = {
          some: {
            hourlyRate: {
              ...(minPrice && { gte: parseFloat(minPrice.toString()) }),
              ...(maxPrice && { lte: parseFloat(maxPrice.toString()) }),
            }
          }
        };
      }

      // Lesson type filter
      if (lessonType) {
        switch (lessonType) {
          case 'STUDENT_TO_TUTOR':
            whereClause.offersStudentToTutor = true;
            break;
          case 'TUTOR_TO_STUDENT':
            whereClause.offersTutorToStudent = true;
            break;
          case 'ONLINE':
            whereClause.offersOnline = true;
            break;
        }
      }

      // Enhanced full-text search with typo tolerance
      if (query) {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        
        whereClause.OR = [
          // Name search
          {
            user: {
              OR: [
                {
                  firstName: {
                    contains: query,
                    mode: 'insensitive'
                  }
                },
                {
                  lastName: {
                    contains: query,
                    mode: 'insensitive'
                  }
                }
              ]
            }
          },
          // Bio search
          {
            bio: {
              contains: query,
              mode: 'insensitive'
            }
          },
          // Subject search
          {
            subjects: {
              some: {
                subject: {
                  OR: [
                    {
                      name: {
                        contains: query,
                        mode: 'insensitive'
                      }
                    },
                    {
                      category: {
                        name: {
                          contains: query,
                          mode: 'insensitive'
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          // Pinned comment search
          {
            pinnedComment: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ];

        // Add typo tolerance for individual terms
        if (searchTerms.length > 0) {
          const typoToleranceClause = searchTerms.map(term => ({
            OR: [
              {
                user: {
                  OR: [
                    {
                      firstName: {
                        contains: term,
                        mode: 'insensitive'
                      }
                    },
                    {
                      lastName: {
                        contains: term,
                        mode: 'insensitive'
                      }
                    }
                  ]
                }
              },
              {
                bio: {
                  contains: term,
                  mode: 'insensitive'
                }
              },
              {
                subjects: {
                  some: {
                    subject: {
                      OR: [
                        {
                          name: {
                            contains: term,
                            mode: 'insensitive'
                          }
                        },
                        {
                          category: {
                            name: {
                              contains: term,
                              mode: 'insensitive'
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              }
            ]
          }));

          whereClause.OR = [...whereClause.OR, ...typoToleranceClause];
        }
      }

      // Build orderBy clause
      let orderBy: any = {};
      switch (sortBy) {
        case 'highest_rated':
          orderBy = { avgRating: 'desc' };
          break;
        case 'most_demanded':
          orderBy = { teachingHours: 'desc' };
          break;
        case 'price_asc':
          orderBy = { subjects: { _count: 'asc' } };
          break;
        case 'price_desc':
          orderBy = { subjects: { _count: 'desc' } };
          break;
        case 'newest':
          orderBy = { createdAt: 'desc' };
          break;
        default: // recommended
          orderBy = [
            { avgRating: 'desc' },
            { teachingHours: 'desc' },
            { createdAt: 'desc' }
          ];
      }

      // Execute query
      const tutors = await prisma.tutorProfile.findMany({
        where: whereClause,
        include: {
          user: {
            include: {
              country: true
            }
          },
          subjects: {
            include: {
              subject: {
                include: {
                  category: true
                }
              }
            }
          },
          travelAreas: true,
          _count: {
            select: {
              bookingsAsTutor: true,
              ratingsAsTutor: true
            }
          }
        },
        orderBy,
        take: parseInt(limit.toString()),
        ...(cursor && {
          skip: 1,
          cursor: { id: cursor }
        })
      });

      // Transform data for frontend
      const transformedTutors = tutors.map(tutor => {
        const minPrice = Math.min(...tutor.subjects.map(s => s.hourlyRate));
        const maxPrice = Math.max(...tutor.subjects.map(s => s.hourlyRate));
        
        return {
          id: tutor.id,
          userId: tutor.userId,
          firstName: tutor.user.firstName,
          lastName: tutor.user.lastName,
          bio: tutor.bio,
          minPrice,
          maxPrice,
          avgRating: tutor.avgRating,
          ratingCount: tutor.ratingCount,
          teachingHours: tutor.teachingHours,
          yearsExperience: tutor.yearsExperience,
          pinnedComment: tutor.pinnedComment,
          verifiedTrusted: tutor.isVerified,
          subjects: tutor.subjects.map(s => ({
            id: s.subject.id,
            name: s.subject.name,
            category: s.subject.category.name,
            hourlyRate: s.hourlyRate
          })),
          lessonFormats: {
            studentToTutor: tutor.offersStudentToTutor,
            tutorToStudent: tutor.offersTutorToStudent,
            online: tutor.offersOnline
          },
          travelAreas: tutor.travelAreas,
          country: tutor.user.country,
          createdAt: tutor.createdAt,
        };
      });

      // Check if there are more results
      const hasMore = tutors.length === parseInt(limit.toString());
      const nextCursor = hasMore ? tutors[tutors.length - 1]?.id : null;

      res.json({
        success: true,
        data: {
          tutors: transformedTutors,
          hasMore,
          nextCursor,
          total: transformedTutors.length
        }
      });

    } catch (error) {
      console.error('Search tutors error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async getSearchSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const { query, countryCode } = req.query;
      
      if (!query || query.length < 2) {
        res.json({
          success: true,
          data: {
            suggestions: []
          }
        });
        return;
      }

      const searchTerm = query.toString().toLowerCase();
      const suggestions: any[] = [];

      // Get popular subjects
      const subjects = await prisma.subject.findMany({
        where: {
          name: {
            contains: searchTerm,
            mode: 'insensitive'
          },
          ...(countryCode && {
            category: {
              country: {
                code: countryCode.toString()
              }
            }
          })
        },
        include: {
          category: true
        },
        take: 5
      });

      subjects.forEach(subject => {
        suggestions.push({
          type: 'subject',
          id: subject.id,
          text: subject.name,
          category: subject.category.name,
          icon: '📚'
        });
      });

      // Get popular tutors
      const tutors = await prisma.tutorProfile.findMany({
        where: {
          verificationStatus: 'VERIFIED',
          user: {
            isActive: true,
            emailVerified: true,
            OR: [
              {
                firstName: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                lastName: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              }
            ]
          }
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        take: 3
      });

      tutors.forEach(tutor => {
        suggestions.push({
          type: 'tutor',
          id: tutor.id,
          text: `${tutor.user.firstName} ${tutor.user.lastName}`,
          subtitle: 'Tutor',
          icon: '👨‍🏫'
        });
      });

      // Get popular categories
      const categories = await prisma.subjectCategory.findMany({
        where: {
          name: {
            contains: searchTerm,
            mode: 'insensitive'
          },
          ...(countryCode && {
            country: {
              code: countryCode.toString()
            }
          })
        },
        take: 3
      });

      categories.forEach(category => {
        suggestions.push({
          type: 'category',
          id: category.id,
          text: category.name,
          subtitle: 'Subject Category',
          icon: '📖'
        });
      });

      res.json({
        success: true,
        data: {
          suggestions: suggestions.slice(0, 10) // Limit to 10 suggestions
        }
      });

    } catch (error) {
      console.error('Get search suggestions error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async getTutorDetails(req: Request, res: Response): Promise<void> {
    try {
      const { tutorId } = req.params;

      const tutor = await prisma.tutorProfile.findUnique({
        where: { id: tutorId },
        include: {
          user: {
            include: {
              country: true
            }
          },
          subjects: {
            include: {
              subject: {
                include: {
                  category: true
                }
              }
            }
          },
          travelAreas: true,
          bookingsAsTutor: {
            include: {
              student: true,
              subject: true,
              rating: true
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 10
          },
          ratingsAsTutor: {
            include: {
              student: true,
              booking: true
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 10
          }
        }
      });

      if (!tutor) {
        res.status(404).json({
          success: false,
          error: 'Tutor not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          tutor
        }
      });

    } catch (error) {
      console.error('Get tutor details error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
