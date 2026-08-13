import { PrismaClient } from '@prisma/client';

async function testPhase1() {
  const prisma = new PrismaClient();
  
  console.log('=== TESTING PHASE 1 CORE IMPLEMENTATION ===\n');

  // 1. Verify Key Award Distribution in Database
  const totalAgents = await prisma.agent.count();
  const activeAwards = await prisma.keyAward.findMany({ where: { revokedAt: null } });
  const keyAwardedAgentsCount = new Set(activeAwards.map(a => a.agentId)).size;
  const ratio = (keyAwardedAgentsCount / totalAgents) * 100;

  console.log(`1. KEY AWARD DISTRIBUTION CHECK (Michelin Standard):`);
  console.log(`- Total Agents in DB: ${totalAgents}`);
  console.log(`- Key Awarded Agents: ${keyAwardedAgentsCount} (${ratio.toFixed(1)}%)`);
  console.log(`- Registered (0 Key) Agents: ${totalAgents - keyAwardedAgentsCount} (${(100 - ratio).toFixed(1)}%)`);
  
  if (ratio < 35) {
    console.log('✅ SUCCESS: Key award ratio is under 35% (Michelin Standard enforced).\n');
  } else {
    console.log('⚠️ WARNING: Key award ratio is still high.\n');
  }

  // 2. Check Security Guardrail Enforcement
  console.log('2. SECURITY GUARDRAIL ENFORCEMENT CHECK:');
  const scores = await prisma.score.findMany({ take: 5 });
  for (const s of scores) {
    const hard = JSON.parse(s.hardSignalScores);
    console.log(`- Agent Final Score: ${hard.finalScore}, Security Score: ${hard.securityScore}, Keys Awarded: ${hard.keysCount ?? hard.starsCount} (${hard.keyLabel || hard.starLabel})`);
  }

  await prisma.$disconnect();
}

testPhase1().catch(console.error);
