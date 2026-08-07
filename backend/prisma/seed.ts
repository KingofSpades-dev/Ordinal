import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning database...');
  await prisma.keyAward.deleteMany();
  await prisma.dossier.deleteMany();
  await prisma.score.deleteMany();
  await prisma.signalSnapshot.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding admin user...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ordo.gg',
      name: 'System Admin',
      passwordHash: 'hashed_password_placeholder',
      role: 'admin',
    },
  });

  console.log('Defining seed cohort data...');
  const seedAgents = [
    {
      name: 'ElizaOS',
      slug: 'elizaos',
      category: 'developer',
      contractAddresses: 'DuMbhu7mvQvqQHGcnikDgb4XegXJRyhUBfdU22uELiZA',
      chains: 'solana',
      website: 'https://elizaos.com',
      docsUrl: 'https://elizaos.github.io/eliza/',
      githubUrl: 'https://github.com/elizaOS/eliza',
      launchDate: new Date('2025-11-20'),
      selectionRationale: 'De-facto open-source TypeScript framework for autonomous agents by ai16z.',
      snapshots: [
        { signalKey: 'active_wallets_30d', value: 1200 },
        { signalKey: 'github_commits_30d', value: 150 },
        { signalKey: 'audit_exists', value: 1 },
        { signalKey: 'admin_keys_safe', value: 1 }
      ],
      keyCount: 2,
      keyRationale: 'Exceptional open-source contributor breadth and developer adoption.',
      dossier: {
        dossierNumber: 38,
        title: 'The open-source framework defining autonomous agent rails',
        body: 'ElizaOS is a highly robust typescript framework for orchestrating agents. Telemetry shows over 150 commits in 30 days and 1,200 active wallets utilizing its tools. It represents the gold standard for developer onboarding.',
        verdict: 'Highly recommended developer framework for launching conversational AI agents.',
        methodologyVersion: '0.1'
      }
    },
    {
      name: 'Luna by Virtuals',
      slug: 'luna',
      category: 'trading',
      contractAddresses: '0x55cd6469f597452b5a7536e2cd98fde4c1247ee4',
      chains: 'base',
      website: 'https://luna.virtuals.io',
      docsUrl: 'https://docs.virtuals.io/',
      githubUrl: 'N/A',
      launchDate: new Date('2025-10-10'),
      selectionRationale: 'Autonomous streaming trading agent on Base network.',
      snapshots: [
        { signalKey: 'active_wallets_30d', value: 1500 },
        { signalKey: 'github_commits_30d', value: 0 },
        { signalKey: 'audit_exists', value: 0 },
        { signalKey: 'admin_keys_safe', value: 0 }
      ],
      keyCount: 0,
      dossier: {
        dossierNumber: 39,
        title: 'Centralized Admin Controls and Upgradeability Risk',
        body: 'Luna by Virtuals has over 1,500 active interacting addresses. Factual contract checks reveal that the token smart contract is fully upgradeable and remains controlled by the platform developer key, presenting a single point of failure if the developer key is compromised.',
        verdict: 'We advise caution when routing substantial funds due to platform upgradeability controls.',
        methodologyVersion: '0.1'
      }
    },
    {
      name: 'Numogram (GNON)',
      slug: 'gnon',
      category: 'research',
      contractAddresses: 'HeJUFDxfJSzYFUuHLxkMqCgytU31G6mjP4wKviwqpump',
      chains: 'solana',
      website: 'https://gnon.fun',
      docsUrl: 'N/A',
      githubUrl: 'N/A',
      launchDate: new Date('2025-10-15'),
      selectionRationale: 'Ingested to demonstrate insufficient evidence rating.',
      snapshots: [], // Insufficient evidence
      keyCount: 0,
      dossier: {
        dossierNumber: 40,
        title: 'Registered, not rated due to lack of verifiable telemetry',
        body: 'Numogram (GNON) exhibits social activity, but because its source code repository is closed-source (N/A) and it lacks official documentation (N/A), ORDO cannot verify its code maintenance or developer activity. Therefore, it is published as registered but not rated.',
        verdict: 'Registered, not rated.',
        methodologyVersion: '0.1'
      }
    },
    {
      name: 'Virtuals Protocol',
      slug: 'virtuals-protocol',
      category: 'developer',
      contractAddresses: '0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b',
      chains: 'base',
      website: 'https://virtuals.io',
      docsUrl: 'https://docs.virtuals.io/',
      githubUrl: 'https://github.com/virtuals-protocol',
      launchDate: new Date('2025-01-01'),
      selectionRationale: 'Established protocol for co-owning autonomous agents.',
      snapshots: [
        { signalKey: 'active_wallets_30d', value: 4200 },
        { signalKey: 'github_commits_30d', value: 55 },
        { signalKey: 'audit_exists', value: 1 },
        { signalKey: 'admin_keys_safe', value: 1 }
      ],
      keyCount: 2,
      keyRationale: 'Category leader in Web3 AI agent co-ownership framework and ecosystem growth.',
    },
    {
      name: 'Zerebro',
      slug: 'zerebro',
      category: 'trading',
      contractAddresses: '8x5VqN1j246h48aD72879h9i25n22t9tXb4sLeSo2Wn',
      chains: 'solana',
      website: 'https://zerebro.org',
      docsUrl: 'https://docs.zerebro.org/',
      githubUrl: 'https://github.com/blorm-network/ZerePy',
      launchDate: new Date('2025-11-01'),
      selectionRationale: 'Multi-chain creative output and trading AI agent.',
      snapshots: [
        { signalKey: 'active_wallets_30d', value: 850 },
        { signalKey: 'github_commits_30d', value: 30 },
        { signalKey: 'audit_exists', value: 0 },
        { signalKey: 'admin_keys_safe', value: 1 }
      ],
      keyCount: 1,
      keyRationale: 'First prominent autonomous creative agent deploying across multi-chain systems.',
    },
    {
      name: 'Pippin',
      slug: 'pippin',
      category: 'research',
      contractAddresses: 'Dfh5DzRgSvvCFDoYc2ciTkMrbDfRKybA4SoFbPmApump',
      chains: 'solana',
      website: 'https://pippin.love',
      docsUrl: 'https://pippin.love/',
      githubUrl: 'https://github.com/pippinlovesyou/pippin',
      launchDate: new Date('2025-12-25'),
      selectionRationale: 'Autonomous content and social-agent builder framework.',
      snapshots: [
        { signalKey: 'active_wallets_30d', value: 1050 },
        { signalKey: 'github_commits_30d', value: 20 },
        { signalKey: 'audit_exists', value: 0 },
        { signalKey: 'admin_keys_safe', value: 1 }
      ],
      keyCount: 1,
      keyRationale: 'Popular digital being framework with active community tool hooks.',
    },
    {
      name: 'Fartcoin',
      slug: 'fartcoin',
      category: 'research',
      contractAddresses: '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump',
      chains: 'solana',
      website: 'https://fartcoin.ai',
      docsUrl: 'N/A',
      githubUrl: 'N/A',
      launchDate: new Date('2025-10-18'),
      selectionRationale: 'Meme-research agent emerging from Truth Terminal system.',
      snapshots: [
        { signalKey: 'active_wallets_30d', value: 3100 },
        { signalKey: 'github_commits_30d', value: 0 },
        { signalKey: 'audit_exists', value: 0 },
        { signalKey: 'admin_keys_safe', value: 1 }
      ],
      keyCount: 1,
      keyRationale: 'Culturally significant early AI agent concept.',
    },
    {
      name: 'Spectral',
      slug: 'spectral',
      category: 'developer',
      contractAddresses: '0xadf7c35560035944e805d98ff17d58cde2449389',
      chains: 'ethereum',
      website: 'https://github.com/spectral-finance',
      docsUrl: 'https://docs.spectral.finance/',
      githubUrl: 'https://github.com/spectral-finance',
      launchDate: new Date('2025-05-10'),
      selectionRationale: 'Decentralized machine learning and agent execution framework.',
      snapshots: [
        { signalKey: 'active_wallets_30d', value: 650 },
        { signalKey: 'github_commits_30d', value: 38 },
        { signalKey: 'audit_exists', value: 1 },
        { signalKey: 'admin_keys_safe', value: 1 }
      ],
      keyCount: 2,
      keyRationale: 'Pioneering infrastructure for decentralized machine learning and agent synthesis.',
    },
    {
      name: 'Griffain',
      slug: 'griffain',
      category: 'developer',
      contractAddresses: 'KENJSUYLASHUMfHyy5o4Hp2FdNqZg1AsUPhfH2kYvEP',
      chains: 'solana',
      website: 'https://griffain.com',
      docsUrl: 'https://griffain.com',
      githubUrl: 'N/A',
      launchDate: new Date('2025-12-05'),
      selectionRationale: 'Agent engine for on-chain natural language trade routes.',
      snapshots: [
        { signalKey: 'active_wallets_30d', value: 480 },
        { signalKey: 'github_commits_30d', value: 0 },
        { signalKey: 'audit_exists', value: 0 },
        { signalKey: 'admin_keys_safe', value: 1 }
      ],
      keyCount: 1,
      keyRationale: 'Consistent natural language routing interface.',
    },
    {
      name: 'Clanker',
      slug: 'clanker',
      category: 'developer',
      contractAddresses: '0x1bc0c42215582d5A085795f4baDbaC3ff36d1Bcb',
      chains: 'base',
      website: 'https://clanker.world',
      docsUrl: 'https://clanker.world',
      githubUrl: 'https://github.com/clanker-devco',
      launchDate: new Date('2025-11-15'),
      selectionRationale: 'Social-deployed autonomous token creator agent on Base.',
      snapshots: [
        { signalKey: 'active_wallets_30d', value: 5200 },
        { signalKey: 'github_commits_30d', value: 65 },
        { signalKey: 'audit_exists', value: 1 },
        { signalKey: 'admin_keys_safe', value: 1 }
      ],
      keyCount: 2,
      keyRationale: 'Exceptional transactional activity and Farcaster platform integration.',
    },
    {
      name: 'FOREST',
      slug: 'forest',
      category: 'research',
      contractAddresses: 'BoAQa1P6sTqB2uG3X9hW5sPz4x6mE1j8mN9v7n5p9pump',
      chains: 'solana',
      website: 'https://forest.xyz',
      docsUrl: 'N/A',
      githubUrl: 'N/A',
      launchDate: new Date('2025-10-25'),
      selectionRationale: 'AI-run environmental charity and donation router agent.',
      snapshots: [
        { signalKey: 'active_wallets_30d', value: 220 },
        { signalKey: 'github_commits_30d', value: 0 },
        { signalKey: 'audit_exists', value: 0 },
        { signalKey: 'admin_keys_safe', value: 1 }
      ],
      keyCount: 1,
      keyRationale: 'Innovative donation automation routed directly to climate indexes.',
    },
    {
      name: 'ai16z',
      slug: 'ai16z',
      category: 'developer',
      contractAddresses: 'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC',
      chains: 'solana',
      website: 'https://ai16z.ai',
      docsUrl: 'https://ai16z.ai',
      githubUrl: 'https://github.com/ai16z/eliza',
      launchDate: new Date('2025-10-24'),
      selectionRationale: 'First prominent AI venture DAO agent on Solana.',
      snapshots: [
        { signalKey: 'active_wallets_30d', value: 450 },
        { signalKey: 'github_commits_30d', value: 90 },
        { signalKey: 'audit_exists', value: 0 },
        { signalKey: 'admin_keys_safe', value: 1 }
      ],
      keyCount: 1,
      keyRationale: 'Established the initial conceptual frame for AI DAO fund management.',
    }
  ];

  // ================= HARD CHECK: ENFORCE KEY AWARDS RULE =================
  for (const agentData of seedAgents) {
    if (agentData.keyCount >= 3) {
      throw new Error(`CRITICAL BUILD FAILURE: Enforced Key Awards check failed. Seed agent "${agentData.name}" has ${agentData.keyCount} Keys. v0.1 allows at most 2 Keys.`);
    }
  }
  console.log('Passed Enforced Key Awards check (No seed agent has >= 3 Keys).');

  for (const agentData of seedAgents) {
    console.log(`Seeding agent: ${agentData.name}`);
    const agent = await prisma.agent.create({
      data: {
        name: agentData.name,
        slug: agentData.slug,
        category: agentData.category,
        contractAddresses: agentData.contractAddresses,
        chains: agentData.chains,
        website: agentData.website,
        docsUrl: agentData.docsUrl,
        githubUrl: agentData.githubUrl,
        launchDate: agentData.launchDate,
        selectionRationale: agentData.selectionRationale,
        status: 'published', // seeded directly as published cohort
        submittedBy: 'system',
        submittedAt: new Date(),
      }
    });

    // 2. Create Signal Snapshots
    for (const snap of agentData.snapshots) {
      await prisma.signalSnapshot.create({
        data: {
          agentId: agent.id,
          signalKey: snap.signalKey,
          value: snap.value,
          source: 'seed_cohort_v1',
          methodVersion: '0.1',
          rawPayload: JSON.stringify(snap)
        }
      });
    }

    // 3. Compute score based on Rubric v0.1
    const hasDocs = agent.docsUrl && agent.docsUrl !== '' && agent.docsUrl.toUpperCase() !== 'N/A';
    const hasWebsite = agent.website && agent.website !== '' && agent.website.toUpperCase() !== 'N/A';
    const hasGithub = agent.githubUrl && agent.githubUrl !== '' && agent.githubUrl.toUpperCase() !== 'N/A';

    let verifiabilityScore = 0;
    if (hasDocs) verifiabilityScore += 10;
    if (hasWebsite) verifiabilityScore += 5;
    if (hasGithub) verifiabilityScore += 10;
    const verifiabilityEvidenced = hasDocs || hasWebsite || hasGithub;

    const activitySnapshot = agentData.snapshots.find(s => s.signalKey === 'active_wallets_30d');
    const tvlSnapshot = agentData.snapshots.find(s => s.signalKey === 'tvl');
    const activityEvidenced = activitySnapshot !== undefined || tvlSnapshot !== undefined;
    const uniqueAddresses = activitySnapshot ? activitySnapshot.value : 0;
    const tvlVal = tvlSnapshot ? tvlSnapshot.value : 0;

    const userFootprintScore = activitySnapshot ? Math.min(15, (uniqueAddresses / 5000) * 15) : 0;
    const tvlScore = tvlSnapshot ? Math.min(10, (tvlVal / 500) * 10) : 0;
    const activityScore = userFootprintScore + tvlScore;

    const commitsSnapshot = agentData.snapshots.find(s => s.signalKey === 'github_commits_30d');
    const maintenanceEvidenced = commitsSnapshot !== undefined;
    const commitsCount = commitsSnapshot ? commitsSnapshot.value : 0;
    const maintenanceScore = maintenanceEvidenced ? Math.min(25, (commitsCount / 80) * 25) : 0;

    const auditSnapshot = agentData.snapshots.find(s => s.signalKey === 'audit_exists');
    const adminKeysSnapshot = agentData.snapshots.find(s => s.signalKey === 'admin_keys_safe');
    const securityEvidenced = auditSnapshot !== undefined || adminKeysSnapshot !== undefined;
    
    const auditVal = auditSnapshot ? auditSnapshot.value : 0;
    const adminKeysVal = adminKeysSnapshot ? adminKeysSnapshot.value : 0;
    const securityScore = (auditVal * 15) + (adminKeysVal * 10);

    const unevidencedCount = [verifiabilityEvidenced, activityEvidenced, maintenanceEvidenced, securityEvidenced].filter(e => !e).length;
    const insufficientEvidence = unevidencedCount >= 2;

    const adminPenalty = adminKeysVal === 0 ? 5 : 0;
    const rawScore = verifiabilityScore + activityScore + maintenanceScore + securityScore;
    const finalScore = Math.max(0, rawScore - adminPenalty);
    
    let confidence = 1.0;
    let starsCount = 0;
    let starLabel = '';
    let starDesc = '';

    if (insufficientEvidence) {
      confidence = 0.0;
      starsCount = 0;
      starLabel = 'Registered, not rated';
      starDesc = 'Insufficient evidence to produce an ORDO rating.';
    } else {
      starsCount = finalScore >= 93 ? 3 : finalScore >= 75 ? 2 : finalScore >= 50 ? 1 : 0;
      starLabel = starsCount === 3 ? "Three Stars: Exceptional" : starsCount === 2 ? "Two Stars: Excellent" : starsCount === 1 ? "One Star: Notable" : "Unrated";
      starDesc = starsCount === 3 ? "A category-defining agent. The standard others are measured against." : starsCount === 2 ? "Among the best in its category. Worth going out of your way to use." : starsCount === 1 ? "A capable agent worth knowing in its category. Solid execution, real utility." : "Below Ordo rating threshold.";
    }

    const hardSignalScores = {
      verifiabilityScore,
      activityScore,
      maintenanceScore,
      securityScore,
      adminPenalty,
      finalScore,
      commitsVal: commitsCount,
      uniqueAddresses,
      insufficientEvidence,
      starsCount,
      starLabel,
      starDesc,
    };

    await prisma.score.create({
      data: {
        agentId: agent.id,
        methodologyVersion: '0.1',
        hardSignalScores: JSON.stringify(hardSignalScores),
        editorialScore: 0.0,
        confidence,
      }
    });

    // 4. Seeding Key Awards
    if (agentData.keyCount > 0) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 365);
      await prisma.keyAward.create({
        data: {
          agentId: agent.id,
          keyCount: agentData.keyCount,
          expiresAt,
          methodologyVersion: '0.1',
          editorId: admin.id,
          rationale: agentData.keyRationale || 'Category standard.'
        }
      });
    }

    // 5. Seeding Dossiers
    if (agentData.dossier) {
      await prisma.dossier.create({
        data: {
          agentId: agent.id,
          dossierNumber: agentData.dossier.dossierNumber,
          title: agentData.dossier.title,
          body: agentData.dossier.body,
          verdict: agentData.dossier.verdict,
          methodologyVersion: agentData.dossier.methodologyVersion,
          editorId: admin.id,
          editorVerified: true,
          publishedAt: new Date(),
        }
      });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
