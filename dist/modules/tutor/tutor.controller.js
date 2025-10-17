import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class TutorController {
    static async setupProfileStep1(req, res) {
        try {
            const user = req.user;
            const { firstName, lastName, phone, dob } = req.body;
            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
                return;
            }
            if (user.role !== 'TUTOR') {
                res.status(403).json({
                    success: false,
                    error: 'Only tutors can set up tutor profiles'
                });
                return;
            }
            // Validate input
            if (!firstName || !lastName || !phone || !dob) {
                res.status(400).json({
                    success: false,
                    error: 'First name, last name, phone, and date of birth are required'
                });
                return;
            }
            // Validate age (minimum 18)
            const birthDate = new Date(dob);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                res.status(400).json({
                    success: false,
                    error: 'You must be at least 18 years old to become a tutor'
                });
                return;
            }
            // Check if phone is already taken
            if (phone !== user.phone) {
                const existingUser = await prisma.user.findUnique({
                    where: { phone }
                });
                if (existingUser) {
                    res.status(409).json({
                        success: false,
                        error: 'Phone number is already registered'
                    });
                    return;
                }
            }
            // Update user profile
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                    firstName,
                    lastName,
                    phone,
                    dob: birthDate,
                }
            });
            res.json({
                success: true,
                message: 'Profile step 1 completed successfully',
                data: {
                    user: {
                        id: updatedUser.id,
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        phone: updatedUser.phone,
                        dob: updatedUser.dob,
                    }
                }
            });
        }
        catch (error) {
            console.error('Tutor profile step 1 error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    static async setupProfileStep2(req, res) {
        try {
            const user = req.user;
            const { subjects, lessonTypes, travelAreas } = req.body;
            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
                return;
            }
            if (user.role !== 'TUTOR') {
                res.status(403).json({
                    success: false,
                    error: 'Only tutors can set up tutor profiles'
                });
                return;
            }
            // Validate input
            if (!subjects || subjects.length === 0) {
                res.status(400).json({
                    success: false,
                    error: 'At least one subject is required'
                });
                return;
            }
            if (subjects.length > 5) {
                res.status(400).json({
                    success: false,
                    error: 'Maximum 5 subjects allowed'
                });
                return;
            }
            if (!lessonTypes || (!lessonTypes.studentToTutor && !lessonTypes.tutorToStudent && !lessonTypes.online)) {
                res.status(400).json({
                    success: false,
                    error: 'At least one lesson type must be selected'
                });
                return;
            }
            // Validate subjects exist
            const subjectIds = subjects.map(s => s.subjectId);
            const existingSubjects = await prisma.subject.findMany({
                where: { id: { in: subjectIds } }
            });
            if (existingSubjects.length !== subjects.length) {
                res.status(400).json({
                    success: false,
                    error: 'One or more subjects not found'
                });
                return;
            }
            // Validate hourly rates
            for (const subject of subjects) {
                if (subject.hourlyRate <= 0) {
                    res.status(400).json({
                        success: false,
                        error: 'Hourly rate must be greater than 0'
                    });
                    return;
                }
            }
            // Create or update tutor profile
            const tutorProfile = await prisma.tutorProfile.upsert({
                where: { userId: user.id },
                update: {
                    offersStudentToTutor: lessonTypes.studentToTutor,
                    offersTutorToStudent: lessonTypes.tutorToStudent,
                    offersOnline: lessonTypes.online,
                },
                create: {
                    userId: user.id,
                    offersStudentToTutor: lessonTypes.studentToTutor,
                    offersTutorToStudent: lessonTypes.tutorToStudent,
                    offersOnline: lessonTypes.online,
                }
            });
            // Clear existing subjects
            await prisma.tutorSubject.deleteMany({
                where: { tutorProfileId: tutorProfile.id }
            });
            // Add new subjects
            await prisma.tutorSubject.createMany({
                data: subjects.map(subject => ({
                    tutorProfileId: tutorProfile.id,
                    subjectId: subject.subjectId,
                    hourlyRate: subject.hourlyRate,
                }))
            });
            // Handle travel areas if tutor offers to travel to student
            if (lessonTypes.tutorToStudent && travelAreas && travelAreas.length > 0) {
                // Clear existing travel areas
                await prisma.tutorTravelArea.deleteMany({
                    where: { tutorProfileId: tutorProfile.id }
                });
                // Add new travel areas
                await prisma.tutorTravelArea.createMany({
                    data: travelAreas.map(area => ({
                        tutorProfileId: tutorProfile.id,
                        city: area.city,
                        neighborhoods: area.neighborhoods,
                    }))
                });
            }
            // Get updated profile with relations
            const updatedProfile = await prisma.tutorProfile.findUnique({
                where: { id: tutorProfile.id },
                include: {
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
                    user: {
                        include: {
                            country: true
                        }
                    }
                }
            });
            res.json({
                success: true,
                message: 'Tutor profile setup completed successfully',
                data: {
                    tutorProfile: updatedProfile
                }
            });
        }
        catch (error) {
            console.error('Tutor profile step 2 error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    static async getProfile(req, res) {
        try {
            const user = req.user;
            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
                return;
            }
            if (user.role !== 'TUTOR') {
                res.status(403).json({
                    success: false,
                    error: 'Only tutors can access tutor profiles'
                });
                return;
            }
            const tutorProfile = await prisma.tutorProfile.findUnique({
                where: { userId: user.id },
                include: {
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
                    user: {
                        include: {
                            country: true
                        }
                    }
                }
            });
            if (!tutorProfile) {
                res.status(404).json({
                    success: false,
                    error: 'Tutor profile not found'
                });
                return;
            }
            res.json({
                success: true,
                data: {
                    tutorProfile
                }
            });
        }
        catch (error) {
            console.error('Get tutor profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    static async updateProfile(req, res) {
        try {
            const user = req.user;
            const { bio, hourlyRate, yearsExperience, pinnedComment } = req.body;
            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
                return;
            }
            if (user.role !== 'TUTOR') {
                res.status(403).json({
                    success: false,
                    error: 'Only tutors can update tutor profiles'
                });
                return;
            }
            const tutorProfile = await prisma.tutorProfile.findUnique({
                where: { userId: user.id }
            });
            if (!tutorProfile) {
                res.status(404).json({
                    success: false,
                    error: 'Tutor profile not found'
                });
                return;
            }
            const updatedProfile = await prisma.tutorProfile.update({
                where: { id: tutorProfile.id },
                data: {
                    bio,
                    hourlyRate,
                    yearsExperience,
                    pinnedComment,
                },
                include: {
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
                    user: {
                        include: {
                            country: true
                        }
                    }
                }
            });
            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: {
                    tutorProfile: updatedProfile
                }
            });
        }
        catch (error) {
            console.error('Update tutor profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}
//# sourceMappingURL=tutor.controller.js.map