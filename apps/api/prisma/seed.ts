import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Starting database seed...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const user = await prisma.user.upsert({
    where: {
      email: 'demo@stays.local',
    },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@stays.local',
      passwordHash,
    },
  });

  const stays = [
    {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'The Forest Retreat',
      description:
        'A peaceful retreat surrounded by greenery, ideal for a relaxing getaway.',
      city: 'Coorg',
      state: 'Karnataka',
      latitude: 12.3375,
      longitude: 75.8069,
      pricePerNight: 4500,
      maxGuests: 4,
      rating: 4.7,
      metadata: {
        amenities: ['WiFi', 'Parking', 'Breakfast'],
        type: 'Retreat',
      },
    },
    {
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Mountain View Cottage',
      description:
        'A comfortable cottage offering beautiful mountain views and a quiet stay.',
      city: 'Manali',
      state: 'Himachal Pradesh',
      latitude: 32.2432,
      longitude: 77.1892,
      pricePerNight: 5500,
      maxGuests: 5,
      rating: 4.8,
      metadata: {
        amenities: ['WiFi', 'Mountain View', 'Parking'],
        type: 'Cottage',
      },
    },
    {
      id: '33333333-3333-4333-8333-333333333333',
      name: 'Beachside Escape',
      description:
        'A relaxing stay close to the beach with a peaceful coastal atmosphere.',
      city: 'Goa',
      state: 'Goa',
      latitude: 15.4909,
      longitude: 73.8278,
      pricePerNight: 6000,
      maxGuests: 4,
      rating: 4.6,
      metadata: {
        amenities: ['WiFi', 'Beach Access', 'Breakfast'],
        type: 'Villa',
      },
    },
    {
      id: '44444444-4444-4444-8444-444444444444',
      name: 'City Heritage Stay',
      description:
        'A comfortable heritage-inspired stay located close to major city attractions.',
      city: 'Jaipur',
      state: 'Rajasthan',
      latitude: 26.9124,
      longitude: 75.7873,
      pricePerNight: 3500,
      maxGuests: 3,
      rating: 4.5,
      metadata: {
        amenities: ['WiFi', 'Breakfast', 'AC'],
        type: 'Heritage',
      },
    },
  ];

  for (const stay of stays) {
    await prisma.stay.upsert({
      where: {
        id: stay.id,
      },
      update: {
        description: stay.description,
        city: stay.city,
        state: stay.state,
        latitude: stay.latitude,
        longitude: stay.longitude,
        pricePerNight: stay.pricePerNight,
        maxGuests: stay.maxGuests,
        rating: stay.rating,
        metadata: stay.metadata,
      },
      create: {
        id: stay.id,
        name: stay.name,
        description: stay.description,
        city: stay.city,
        state: stay.state,
        latitude: stay.latitude,
        longitude: stay.longitude,
        pricePerNight: stay.pricePerNight,
        maxGuests: stay.maxGuests,
        rating: stay.rating,
        metadata: stay.metadata,
      },
    });
  }

  console.log(`✅ Seeded user: ${user.email}`);
  console.log(`✅ Seeded stays: ${stays.length}`);
  console.log('🌱 Database seed completed.');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
