import { PrismaService } from './src/prisma/prisma.service';
import { IngestService } from './src/agents/ingest.service';
import { AgentsService } from './src/agents/agents.service';
import { X402WashFilterService } from './src/agents/x402-wash-filter.service';
import { Erc8004ResolverService } from './src/agents/erc8004-resolver.service';
import { ethers } from 'ethers';

async function testPhase4() {
  console.log('=== TESTING PHASE 4: COMMUNITY STARS & ON-CHAIN RATING ===\n');

  const prisma = new PrismaService();
  await prisma.onModuleInit();

  const ingestService = new IngestService();
  const washFilterService = new X402WashFilterService();
  const erc8004Service = new Erc8004ResolverService();
  const agentsService = new AgentsService(prisma, ingestService, washFilterService, erc8004Service, null as any);

  // 1. Get published agent
  const agent = await prisma.agent.findFirst({ where: { status: 'published' } });
  if (!agent) {
    console.log('❌ No published agent found for test.');
    await prisma.onModuleDestroy();
    return;
  }

  // 2. Generate random wallet & signature for rating
  const wallet = ethers.Wallet.createRandom();
  const walletAddress = wallet.address;
  const stars = 5;
  const message = `Rate agent: ${agent.id} with ${stars} stars by ${walletAddress}`;
  const signature = await wallet.signMessage(message);

  console.log(`- Target Agent Name: "${agent.name}" (ID: ${agent.id})`);
  console.log(`- Voter Wallet: ${walletAddress}`);
  console.log(`- Message: "${message}"`);
  console.log(`- Generated Signature: ${signature.slice(0, 25)}...`);

  // 3. Submit Rating via AgentsService
  try {
    const ratingRecord = await agentsService.submitRating({
      agentId: agent.id,
      walletAddress,
      stars,
      usageProofTx: 'mock_tx_1234567890abcdef',
      signature,
    });

    console.log(`\n✅ [PASS] Community Star Rating submitted & signature verified!`);
    console.log(`   └─ Rating ID: ${ratingRecord.ratingId}, Message: "${ratingRecord.message}"`);
  } catch (e: any) {
    console.log(`❌ [FAIL] Community Rating Submission failed:`, e.message);
  }

  await prisma.onModuleDestroy();
}

testPhase4().catch(console.error);
