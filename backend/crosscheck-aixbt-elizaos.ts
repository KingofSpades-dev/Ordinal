import { PrismaClient } from '@prisma/client';
import { IngestService } from './src/agents/ingest.service';
import * as dotenv from 'dotenv';
dotenv.config();

async function crosscheck() {
  console.log('====================================================');
  console.log('🔍 LIVE CROSS-CHECK TEST: AIXBT & ElizaOS');
  console.log('   (Comparing Live RPC & GitHub Data vs Database)');
  console.log('====================================================\n');

  const prisma = new PrismaClient();
  const ingestService = new IngestService();

  const targetSlugs = ['aixbt', 'elizaos'];

  for (const slug of targetSlugs) {
    console.log(`----------------------------------------------------`);
    console.log(`📌 AGENT AUDIT: [${slug.toUpperCase()}]`);
    console.log(`----------------------------------------------------`);

    // 1. Fetch DB Record
    const dbAgent = await prisma.agent.findFirst({
      where: {
        OR: [
          { slug: { equals: slug, mode: 'insensitive' } },
          { name: { contains: slug, mode: 'insensitive' } }
        ]
      },
      include: {
        identities: true,
        links: true,
        snapshots: true,
        scores: { orderBy: { computedAt: 'desc' }, take: 1 }
      }
    });

    if (!dbAgent) {
      console.log(`⚠️ Agent "${slug}" not found in current Database.`);
      console.log(`   (Database is currently empty or agent was not yet registered/seeded).\n`);
      continue;
    }

    console.log(`\n[DATABASE RECORD]`);
    console.log(`- ID: ${dbAgent.id}`);
    console.log(`- Name: ${dbAgent.name}`);
    console.log(`- Status: ${dbAgent.status}`);
    console.log(`- Category: ${dbAgent.category}`);
    console.log(`- Contract Addresses: ${dbAgent.contractAddresses}`);
    console.log(`- Chains: ${dbAgent.chains}`);
    console.log(`- GitHub URL: ${dbAgent.githubUrl}`);
    console.log(`- Website: ${dbAgent.website}`);

    console.log(`\n[DB SNAPSHOTS]`);
    dbAgent.snapshots.forEach(s => {
      console.log(`  └─ ${s.signalKey}: ${s.value} (Source: ${s.source})`);
    });

    if (dbAgent.scores.length > 0) {
      const score = dbAgent.scores[0];
      console.log(`\n[DB SCORES]`);
      console.log(`  └─ Methodology: ${score.methodologyVersion}`);
      console.log(`  └─ HardSignalScores: ${score.hardSignalScores}`);
    }

    // 2. Fetch Live GitHub & RPC Telemetry
    console.log(`\n[LIVE TELEMETRY FETCH & PROBING]`);
    const contractAddrs = dbAgent.contractAddresses.split(',').map(c => c.trim());
    const chains = dbAgent.chains.split(',').map(c => c.trim());

    // Live GitHub Data
    let liveGithubData = { commits: 0, contributors: 0, stars: 0 };
    const targetGithubUrl = slug === 'elizaos' ? 'https://github.com/elizaOS/eliza' : dbAgent.githubUrl;
    if (targetGithubUrl && targetGithubUrl !== 'N/A') {
      try {
        console.log(`- Fetching live GitHub stats for: ${targetGithubUrl}`);
        liveGithubData = await ingestService.fetchGithubSignals(targetGithubUrl);
        console.log(`  ✅ Live GitHub Commits(30d): ${liveGithubData.commits}, Stars: ${liveGithubData.stars}, Contributors: ${liveGithubData.contributors}`);
      } catch (err) {
        console.log(`  ⚠️ GitHub Live fetch error: ${err.message}`);
      }
    } else {
      console.log(`  ℹ️ Closed-source / No GitHub URL provided.`);
    }

    // Live RPC Data
    let liveOnchainData = { txCount30d: 0, activeWallets30d: 0, tvl: 0 };
    if (contractAddrs.length > 0 && contractAddrs[0] !== 'N/A') {
      try {
        console.log(`- Fetching live RPC on-chain stats for CA: "${contractAddrs[0]}" on chain "${chains[0]}"...`);
        liveOnchainData = await ingestService.fetchOnchainSignals(contractAddrs, chains);
        console.log(`  ✅ Live On-Chain TxCount(30d): ${liveOnchainData.txCount30d}, ActiveWallets(30d): ${liveOnchainData.activeWallets30d}, TVL: ${liveOnchainData.tvl}`);
      } catch (err) {
        console.log(`  ⚠️ On-Chain RPC fetch error: ${err.message}`);
      }
    }

    // 3. Comparison Table
    console.log(`\n====================================================`);
    console.log(`📊 COMPARATIVE AUDIT TABLE: [${dbAgent.name}]`);
    console.log(`====================================================`);
    console.log(`Metric                     | DB Record          | Live Network Probe`);
    console.log(`---------------------------+--------------------+--------------------`);
    
    const dbWallets = dbAgent.snapshots.find(s => s.signalKey === 'active_wallets_30d')?.value ?? 0;
    const dbCommits = dbAgent.snapshots.find(s => s.signalKey === 'github_commits_30d')?.value ?? 0;
    const dbAudit = dbAgent.snapshots.find(s => s.signalKey === 'audit_exists')?.value ?? 0;

    console.log(`Active Wallets (30d)       | ${String(dbWallets).padEnd(18)} | ${String(liveOnchainData.activeWallets30d).padEnd(18)}`);
    console.log(`GitHub Commits (30d)       | ${String(dbCommits).padEnd(18)} | ${String(liveGithubData.commits).padEnd(18)}`);
    console.log(`Security Audit Exists      | ${String(dbAudit).padEnd(18)} | ${dbAgent.docsUrl?.toLowerCase().includes('audit') ? '1 (Found)' : '0 (Unverified)'}`);
    console.log(`----------------------------------------------------\n`);
  }

  await prisma.$disconnect();
}

crosscheck();
