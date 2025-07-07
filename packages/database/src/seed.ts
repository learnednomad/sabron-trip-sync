import { prisma } from './index';
import { faker } from '@faker-js/faker';

async function seed() {
  // Clean existing data
  await prisma.user.deleteMany();
  await prisma.itinerary.deleteMany();

  // Create users
  const users = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          username: faker.internet.userName(),
          phoneNumber: faker.phone.number(),
          phoneVerified: faker.datatype.boolean(),
          emailVerified: faker.datatype.boolean(),
          isActive: true,
          lastActiveAt: faker.date.recent(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
          profile: {
            create: {
              firstName: faker.person.firstName(),
              lastName: faker.person.lastName(),
              nationality: faker.location.countryCode(),
              languages: [faker.location.countryCode().toLowerCase()],
            },
          },
          preferences: {
            create: {
              language: 'en',
              currency: 'USD',
              timezone: 'UTC',
              dateFormat: 'MM/DD/YYYY',
              timeFormat: '12h',
              measurementUnit: 'metric',
              theme: 'system',
            },
          },
        },
      })
    )
  );

  // Create itineraries
  await Promise.all(
    users.map((user) =>
      prisma.itinerary.create({
        data: {
          userId: user.id,
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          destinations: [
            {
              name: faker.location.city(),
              country: faker.location.country(),
              coordinates: {
                lat: parseFloat(faker.location.latitude().toString()),
                lng: parseFloat(faker.location.longitude().toString()),
              },
              timezone: 'UTC',
            },
          ],
          startDate: faker.date.soon(),
          endDate: faker.date.future(),
          duration: faker.number.int({ min: 1, max: 14 }),
          status: 'draft',
          visibility: 'private',
          tags: faker.lorem.words(3).split(' '),
          budget: {
            total: { amount: faker.number.float({ min: 100, max: 10000 }), currency: 'USD' },
          },
        },
      })
    )
  );

  console.log('Database seeded successfully');
}

seed()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
