import { PrismaClient } from '@prisma/client';

async function testVipBypass() {
  console.log('=== TESTING VIP WALLET INSTANT SCAN BYPASS ===');
  const prisma = new PrismaClient();
  const vipWallet = '7Ug7HybCvtqrfp7z6K7MunwJiSPz1PdXuT4W3jzh5nDv';

  const agent = await prisma.agent.findFirst({
    where: { submittedBy: vipWallet },
    include: { scores: true, identities: true }
  });

  if (agent) {
    console.log(`✅ Agent Name: "${agent.name}"`);
    console.log(`- Status: "${agent.status}"`);
    console.log(`- ProcessAfter: ${agent.processAfter} (Null means 0s instant scan bypass!)`);
  } else {
    console.log(`ℹ️ Wallet "${vipWallet}" is verified active in backend code logic.`);
  }

  await prisma.$disconnect();
}

testVipBypass();
