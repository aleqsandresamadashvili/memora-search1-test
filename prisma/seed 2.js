import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const ge = await prisma.country.upsert({
        where: { code: 'GE' },
        update: {},
        create: { code: 'GE', name: 'Georgia', currency: 'GEL', timeZone: 'Asia/Tbilisi' },
    });
    const categories = [
        { name: 'Mathematics', subjects: ['General Mathematics', 'SAT Math', 'Math for Grades 1–5'] },
        { name: 'Georgian', subjects: ['General Georgian', 'University Entrance Georgian'] },
        { name: 'English', subjects: ['General English', 'IELTS', 'TOEFL'] },
    ];
    for (const c of categories) {
        const cat = await prisma.subjectCategory.upsert({
            where: { countryId_name: { countryId: ge.id, name: c.name } },
            update: {},
            create: { countryId: ge.id, name: c.name },
        });
        for (const s of c.subjects) {
            await prisma.subject.upsert({
                where: { countryId_name: { countryId: ge.id, name: s } },
                update: {},
                create: { countryId: ge.id, categoryId: cat.id, name: s },
            });
        }
    }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
//# sourceMappingURL=seed%202.js.map