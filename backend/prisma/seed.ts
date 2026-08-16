import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Loopin V2 PostgreSQL database...');

  // 1. Starter Categories / Interests
  const interests = [
    { name: 'Canlı Müzik & Akustik', icon: '🎸' },
    { name: 'Doğa Yürüyüşü & Trekking', icon: '🌲' },
    { name: 'Kahve & Sohbet', icon: '☕' },
    { name: 'Fotoğrafçılık', icon: '📷' },
    { name: 'Teknoloji & Yazılım', icon: '💻' },
    { name: 'Yemek & Gastronomi', icon: '🍕' },
  ];

  for (const item of interests) {
    await prisma.interest.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });
  }

  // 2. Demo Host User (Selin Kaya)
  const passwordHash = await bcrypt.hash('Loopin2026!', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'selin@loopin.codapi.site' },
    update: {},
    create: {
      email: 'selin@loopin.codapi.site',
      passwordHash,
      role: 'USER',
      isVerified: true,
      isPro: true,
      profile: {
        create: {
          username: 'selinkaya',
          name: 'Selin Kaya',
          bio: 'Müzik, kahve ve hafta sonu kaçamakları tutkunu ☕🎸',
          city: 'İstanbul',
          district: 'Kadıköy',
          avatarUrl: '/assets/profile_avatar.png',
          trustScore: 98,
          badgeTitle: 'Süper Organizatör',
        },
      },
      creditWallet: {
        create: {
          balance: 45,
        },
      },
    },
  });

  // 3. Starter Events
  await prisma.event.createMany({
    data: [
      {
        hostId: demoUser.id,
        title: 'Kadıköy Akustik Kahve & Canlı Müzik',
        category: 'Canlı Müzik & Akustik',
        dateText: '24 Temmuz Cuma, 21:00',
        eventDate: new Date('2026-07-24T21:00:00Z'),
        location: 'Moda Sahil Cafe, Kadıköy',
        maxCapacity: 8,
        currentCapacity: 4,
        priceType: 'Herkes Kendi Öder',
        imageUrl: '/assets/event_coffee.png',
        description: 'Akustik gitar eşliğinde keyifli kahve ve müzik sohbeti. Kontenjan sınırlıdır.',
      },
      {
        hostId: demoUser.id,
        title: 'Belgrad Ormanı Doğa Yürüyüşü & Piknik',
        category: 'Doğa Yürüyüşü & Trekking',
        dateText: '26 Temmuz Pazar, 10:00',
        eventDate: new Date('2026-07-26T10:00:00Z'),
        location: 'Belgrad Ormanı Neşet Suyu, Sarıyer',
        maxCapacity: 12,
        currentCapacity: 7,
        priceType: 'Ücretsiz',
        imageUrl: '/assets/reel_nature.png',
        description: 'Doğa içinde 8 km hafif tempo yürüyüş ve ardından çimlerde mola.',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
