import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PAKISTAN_CITIES_FULL } from '../../frontend/src/lib/citiesData';
import { ALL_CATEGORIES, ALL_100_SERVICES } from '../../frontend/src/lib/servicesData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SkillConnect Pakistan database...');

  // 1. Seed 399 Pakistani Cities
  console.log(`Seeding ${PAKISTAN_CITIES_FULL.length} Pakistani Cities...`);
  for (const city of PAKISTAN_CITIES_FULL) {
    const slug = city.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await prisma.city.upsert({
      where: { name: city.name },
      update: {
        district: city.district,
        division: city.division || city.district,
        province: city.province,
        latitude: city.latitude,
        longitude: city.longitude,
        isActive: city.isActive,
      },
      create: {
        name: city.name,
        district: city.district,
        division: city.division || city.district,
        province: city.province,
        latitude: city.latitude,
        longitude: city.longitude,
        isActive: city.isActive,
      },
    });
  }
  const cityCount = await prisma.city.count();
  console.log(`Database Cities Count: ${cityCount}`);

  // 2. Seed 10 Service Categories
  console.log(`Seeding ${ALL_CATEGORIES.length} Categories...`);
  for (const cat of ALL_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      },
    });
  }
  const categoryCount = await prisma.category.count();
  console.log(`Database Categories Count: ${categoryCount}`);

  // 3. Seed Admin User
  const adminPassword = await bcrypt.hash('AdminPass@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@skillconnect.pk' },
    update: {},
    create: {
      email: 'admin@skillconnect.pk',
      phone: '+923000000000',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          firstName: 'System',
          lastName: 'Administrator',
          city: 'Islamabad',
          address: 'Blue Area, Sector F-6, Islamabad',
        },
      },
      wallet: {
        create: {
          balance: 100000.0,
        },
      },
    },
  });
  console.log(`Admin user ready: ${admin.email}`);

  // 4. Seed Verified Service Provider
  const providerPassword = await bcrypt.hash('ProviderPass@123', 10);
  const providerUser = await prisma.user.upsert({
    where: { email: 'tariq.electrician@gmail.com' },
    update: {},
    create: {
      email: 'tariq.electrician@gmail.com',
      phone: '+923001234567',
      passwordHash: providerPassword,
      role: UserRole.PROVIDER,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          firstName: 'Tariq',
          lastName: 'Mehmood',
          city: 'Karachi',
          address: 'Gulshan-e-Iqbal Block 13D, Karachi',
          latitude: 24.918,
          longitude: 67.0971,
          bio: 'Licensed electrician with 12+ years experience in solar inverters, DB load balancing, and residential wiring.',
        },
      },
      providerProfile: {
        create: {
          cnicNumber: '42101-1234567-1',
          isVerified: true,
          hourlyRate: 1500.0,
          rating: 4.9,
          totalReviews: 84,
          serviceRadiusKm: 25.0,
        },
      },
      wallet: {
        create: {
          balance: 25000.0,
        },
      },
    },
    include: {
      providerProfile: true,
    },
  });

  const providerProfileId = providerUser.providerProfile?.id;

  // 5. Seed 134 Unique Services attached to database Categories
  if (providerProfileId) {
    console.log(`Seeding ${ALL_100_SERVICES.length} Unique Services...`);
    for (const srv of ALL_100_SERVICES) {
      const dbCat = await prisma.category.findUnique({
        where: { slug: srv.category.slug },
      });

      if (dbCat) {
        await prisma.service.upsert({
          where: { id: srv.id },
          update: {
            title: srv.title,
            description: srv.description,
            basePrice: srv.basePrice,
            durationMinutes: srv.durationMinutes,
            isAvailable: srv.isAvailable,
            categoryId: dbCat.id,
          },
          create: {
            id: srv.id,
            title: srv.title,
            description: srv.description,
            basePrice: srv.basePrice,
            durationMinutes: srv.durationMinutes,
            isAvailable: srv.isAvailable,
            providerId: providerProfileId,
            categoryId: dbCat.id,
          },
        });
      }
    }
  }

  const serviceCount = await prisma.service.count();
  console.log(`Database Unique Services Count: ${serviceCount}`);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
