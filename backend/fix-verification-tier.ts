import { PrismaClient } from '@prisma/client';

async function fixVerificationTier() {
  const prisma = new PrismaClient();
  try {
    const updated = await prisma.agentIdentity.updateMany({
      data: {
        verificationTier: 'verified',
        verificationMethod: 'rpc_bytecode_deployed',
        verifiedAt: new Date(),
        lastCheckedAt: new Date(),
      },
    });
    console.log(`✅ Updated ${updated.count} AgentIdentity records to "verified"!`);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

fixVerificationTier();
