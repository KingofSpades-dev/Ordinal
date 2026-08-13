import { PrismaClient } from '@prisma/client';

async function wipeDatabase() {
  console.log('🧹 Wiping all data from database without exception...');
  const prisma = new PrismaClient();

  try {
    await prisma.communityRating.deleteMany({});
    await prisma.keyAward.deleteMany({});
    await prisma.score.deleteMany({});
    await prisma.signalSnapshot.deleteMany({});
    await prisma.agentIdentity.deleteMany({});
    await prisma.agentLink.deleteMany({});
    await prisma.dossier.deleteMany({});
    await prisma.agent.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('✅ ALL DATABASE TABLES SUCCESSFULLY WIPED CLEAN (0 Records Remaining).');
  } catch (error) {
    console.error('❌ Error wiping database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

wipeDatabase();
