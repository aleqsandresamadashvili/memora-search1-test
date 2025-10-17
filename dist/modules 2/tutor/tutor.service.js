import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class TutorService {
    async step1(userId, data) {
        const dob = new Date(data.dob);
        const user = await prisma.user.update({
            where: { id: userId },
            data: { firstName: data.firstName, lastName: data.lastName, phone: data.phone, dob },
        });
        // Generate SMS code stub
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000);
        await prisma.user.update({ where: { id: userId }, data: { phoneVerificationCode: code, phoneVerificationExpiresAt: expires } });
        return { user, smsCode: code };
    }
    async verifyPhone(userId, code) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.phoneVerificationCode || !user.phoneVerificationExpiresAt)
            return { ok: false };
        if (user.phoneVerificationCode !== code || user.phoneVerificationExpiresAt < new Date())
            return { ok: false };
        await prisma.user.update({ where: { id: userId }, data: { isPhoneVerified: true, phoneVerificationCode: null, phoneVerificationExpiresAt: null } });
        return { ok: true };
    }
    async step2(userId, data) {
        const tutor = await prisma.tutorProfile.findUnique({ where: { userId } });
        if (!tutor)
            throw new Error('Tutor profile not found');
        if (data.subjects.length === 0 || data.subjects.length > 5)
            throw new Error('Select 1 to 5 subjects');
        await prisma.$transaction(async (tx) => {
            await tx.tutorProfile.update({
                where: { id: tutor.id },
                data: {
                    offersStudentToTutor: data.offersStudentToTutor,
                    offersTutorToStudent: data.offersTutorToStudent,
                    offersOnline: data.offersOnline,
                },
            });
            // Upsert tutor subjects
            await tx.tutorSubject.deleteMany({ where: { tutorId: tutor.id } });
            for (const s of data.subjects) {
                await tx.tutorSubject.create({ data: { tutorId: tutor.id, subjectId: s.subjectId, hourlyPrice: s.hourlyPrice } });
            }
            // Travel area if tutor-to-student
            if (data.offersTutorToStudent) {
                if (!data.travelCity || !data.neighborhoods || data.neighborhoods.length === 0) {
                    throw new Error('City and neighborhoods required for tutor-to-student');
                }
                await tx.tutorTravelArea.upsert({
                    where: { tutorId: tutor.id },
                    update: { city: data.travelCity, neighborhoods: data.neighborhoods },
                    create: { tutorId: tutor.id, city: data.travelCity, neighborhoods: data.neighborhoods },
                });
            }
            else {
                await tx.tutorTravelArea.deleteMany({ where: { tutorId: tutor.id } });
            }
        });
        return { ok: true };
    }
}
//# sourceMappingURL=tutor.service.js.map