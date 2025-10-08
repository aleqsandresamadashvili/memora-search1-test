import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create countries
  const georgia = await prisma.country.upsert({
    where: { code: 'GE' },
    update: {},
    create: {
      code: 'GE',
      name: 'Georgia',
      currency: 'GEL',
      timezone: 'Asia/Tbilisi',
    },
  });

  const usa = await prisma.country.upsert({
    where: { code: 'US' },
    update: {},
    create: {
      code: 'US',
      name: 'United States',
      currency: 'USD',
      timezone: 'America/New_York',
    },
  });

  console.log('✅ Countries created');

  // Create subject categories
  const mathematics = await prisma.subjectCategory.upsert({
    where: { id: 'math-cat-ge' },
    update: {},
    create: {
      id: 'math-cat-ge',
      name: 'Mathematics',
      countryId: georgia.id,
    },
  });

  const languages = await prisma.subjectCategory.upsert({
    where: { id: 'lang-cat-ge' },
    update: {},
    create: {
      id: 'lang-cat-ge',
      name: 'Languages',
      countryId: georgia.id,
    },
  });

  const sciences = await prisma.subjectCategory.upsert({
    where: { id: 'sci-cat-ge' },
    update: {},
    create: {
      id: 'sci-cat-ge',
      name: 'Sciences',
      countryId: georgia.id,
    },
  });

  console.log('✅ Subject categories created');

  // Create subjects
  const subjects = [
    { name: 'Basic Mathematics (Grades 1-5)', categoryId: mathematics.id },
    { name: 'Algebra', categoryId: mathematics.id },
    { name: 'Geometry', categoryId: mathematics.id },
    { name: 'Calculus', categoryId: mathematics.id },
    { name: 'Statistics', categoryId: mathematics.id },
    { name: 'Georgian Language', categoryId: languages.id },
    { name: 'English Language', categoryId: languages.id },
    { name: 'Russian Language', categoryId: languages.id },
    { name: 'French Language', categoryId: languages.id },
    { name: 'German Language', categoryId: languages.id },
    { name: 'Physics', categoryId: sciences.id },
    { name: 'Chemistry', categoryId: sciences.id },
    { name: 'Biology', categoryId: sciences.id },
    { name: 'Computer Science', categoryId: sciences.id },
  ];

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { 
        name_categoryId: {
          name: subject.name,
          categoryId: subject.categoryId,
        }
      },
      update: {},
      create: subject,
    });
  }

  console.log('✅ Subjects created');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@memora.com' },
    update: {},
    create: {
      email: 'admin@memora.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      role: 'ADMIN',
      emailVerified: true,
      firstName: 'Admin',
      lastName: 'User',
      countryId: georgia.id,
    },
  });

  console.log('✅ Admin user created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
