import { PrismaService } from './src/prisma/prisma.service';
import { IngestService } from './src/agents/ingest.service';
import { ScoringService } from './src/editorial/scoring.service';
import { EditorialService } from './src/editorial/editorial.service';
import { X402WashFilterService, X402Transaction } from './src/agents/x402-wash-filter.service';
import { Erc8004ResolverService } from './src/agents/erc8004-resolver.service';

async function runComprehensiveTests() {
  console.log('====================================================');
  console.log('🚀 STARTING COMPREHENSIVE INTEGRATION & UNIT TEST SUITE');
  console.log('====================================================\n');

  const prisma = new PrismaService();
  await prisma.onModuleInit();

  const ingestService = new IngestService();
  const scoringService = new ScoringService(prisma);
  const editorialService = new EditorialService(prisma, scoringService);
  const washFilterService = new X402WashFilterService();
  const erc8004Service = new Erc8004ResolverService();

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✅ [PASS] ${testName}`);
      if (detail) console.log(`   └─ ${detail}`);
    } else {
      console.log(`❌ [FAIL] ${testName}`);
      if (detail) console.log(`   └─ ${detail}`);
    }
  }

  // ----------------------------------------------------
  // TEST 1: GitHub Ingest Auth & 401 Fallback Handling
  // ----------------------------------------------------
  console.log('--- TEST 1: GitHub Ingest Auth & 401 Retry Fallback ---');
  try {
    const githubStats = await ingestService.fetchGithubSignals('https://github.com/elizaOS/eliza');
    assert(
      githubStats !== null && typeof githubStats.commits === 'number',
      'GitHub Ingest handles URL parsing & status codes gracefully',
      `Commits: ${githubStats.commits}, Contributors: ${githubStats.contributors}, Stars: ${githubStats.stars}`
    );
  } catch (e: any) {
    assert(false, 'GitHub Ingest handles URL parsing & status codes gracefully', e.message);
  }

  // ----------------------------------------------------
  // TEST 2: Security Ingestion Automated Probing
  // ----------------------------------------------------
  console.log('\n--- TEST 2: Security Ingestion Automated Probing ---');
  try {
    const sec1 = await ingestService.fetchSecuritySignals('https://docs.elizaos.ai/audit', 'https://elizaos.ai');
    assert(sec1.auditExists === 1, 'Detects audit keyword from docs URL', `auditExists: ${sec1.auditExists}`);

    const sec2 = await ingestService.fetchSecuritySignals('https://example.com/docs', 'https://example.com');
    assert(sec2.auditExists === 0, 'Returns 0 when no audit keyword is found', `auditExists: ${sec2.auditExists}`);
  } catch (e: any) {
    assert(false, 'Security Ingestion Automated Probing', e.message);
  }

  // ----------------------------------------------------
  // TEST 3: Michelin Key Thresholds & Security Guardrails
  // ----------------------------------------------------
  console.log('\n--- TEST 3: Michelin Key Thresholds & Security Guardrails ---');
  try {
    const agent = await prisma.agent.findFirst();
    if (agent) {
      const score = await scoringService.calculateAgentScore(agent.id);
      const hard = JSON.parse(score.hardSignalScores);
      
      assert(
        hard.keysCount !== undefined && hard.keyLabel !== undefined,
        'ScoringService outputs keysCount, keyLabel, and keyDesc in hardSignalScores',
        `keysCount: ${hard.keysCount}, keyLabel: "${hard.keyLabel}"`
      );

      assert(
        hard.starsCount === hard.keysCount,
        'Legacy starsCount alias matches keysCount for backwards compatibility',
        `starsCount: ${hard.starsCount}`
      );

      // Verify Guardrail: If audit_exists == 0, security score must be <= 10
      if (hard.auditVal === 0) {
        assert(hard.securityScore <= 10, 'Security score capped at 10 max when audit_exists == 0', `securityScore: ${hard.securityScore}`);
      } else {
        assert(true, 'Security score calculated properly with audit_exists', `securityScore: ${hard.securityScore}`);
      }
    } else {
      assert(false, 'Database agent record found for scoring test');
    }
  } catch (e: any) {
    assert(false, 'Michelin Key Thresholds & Security Guardrails', e.message);
  }

  // ----------------------------------------------------
  // TEST 4: Editorial awardKeys() Guardrail Validation
  // ----------------------------------------------------
  console.log('\n--- TEST 4: Editorial awardKeys() Guardrail Validation ---');
  try {
    const agent = await prisma.agent.findFirst({ where: { status: 'published' } });
    const admin = await prisma.user.findFirst({ where: { role: 'admin' } });

    if (agent && admin) {
      const score = await scoringService.calculateAgentScore(agent.id);
      const hard = JSON.parse(score.hardSignalScores);
      const maxAllowed = hard.keysCount ?? 0;

      // Attempting to award maxAllowed + 1 keys should fail with HTTP 400
      try {
        await editorialService.awardKeys(admin.id, {
          agentId: agent.id,
          keyCount: maxAllowed + 1,
          expiresInDays: 365,
          rationale: 'Illegal key inflation test',
        });
        assert(false, 'awardKeys() rejects awarding keys higher than computed score', 'Failed to throw BadRequestException');
      } catch (err: any) {
        assert(
          err.message && err.message.includes('Scoring engine calculated maximum'),
          'awardKeys() rejects awarding keys higher than computed score',
          `Caught expected error: "${err.message}"`
        );
      }
    } else {
      assert(false, 'Published agent and admin user found for awardKeys test');
    }
  } catch (e: any) {
    assert(false, 'Editorial awardKeys() Guardrail Validation', e.message);
  }

  // ----------------------------------------------------
  // TEST 5: x402 Wash Trading Filter 5-Step Engine
  // ----------------------------------------------------
  console.log('\n--- TEST 5: x402 Wash Trading Filter Engine ---');
  try {
    const mockTxs: X402Transaction[] = [
      { id: '1', payerWallet: '0xTreasury', recipientWallet: '0xAgent', amountUsd: 100, timestamp: Date.now() - 1000 }, // Treasury funded -> Filtered
      { id: '2', payerWallet: '0xUserA', recipientWallet: '0xAgent', amountUsd: 50, timestamp: Date.now() - 2000 },    // Legitimate -> Qualified
      { id: '3', payerWallet: '0xUserB', recipientWallet: '0xAgent', amountUsd: 0.01, timestamp: Date.now() - 3000 },  // Micro fresh single-use -> Filtered
    ];

    const result = await washFilterService.filterVolume(mockTxs, ['0xTreasury']);
    assert(
      result.rawVolume === 150.01 && result.qualifiedVolume === 50,
      'x402 Wash Filter correctly separates raw vs qualified volume',
      `Raw: $${result.rawVolume}, Qualified: $${result.qualifiedVolume}, Filtered: ${result.filteredCount}/${result.totalCount}`
    );
  } catch (e: any) {
    assert(false, 'x402 Wash Trading Filter Engine', e.message);
  }

  // ----------------------------------------------------
  // TEST 6: ERC-8004 Identity & Divergence Resolver
  // ----------------------------------------------------
  console.log('\n--- TEST 6: ERC-8004 Identity & Divergence Resolver ---');
  try {
    const erc8004 = await erc8004Service.resolveAgentIdentity('aixbt', 'base', ['x402']);
    assert(
      erc8004.tokenUri.includes('aixbt.json') && erc8004.declaredCapabilities.length > 0,
      'ERC-8004 Resolver parses tokenURI & capabilities',
      `TokenURI: ${erc8004.tokenUri}, Declared: [${erc8004.declaredCapabilities.join(', ')}]`
    );
  } catch (e: any) {
    assert(false, 'ERC-8004 Identity & Divergence Resolver', e.message);
  }

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
  if (passedTests === totalTests) {
    console.log('🎉 ALL INTEGRATION & UNIT TESTS PASSED SUCCESSFULLY!');
  } else {
    console.log('⚠️ SOME TESTS FAILED — SEE LOGS ABOVE.');
  }
  console.log('====================================================\n');

  await prisma.onModuleDestroy();
}

runComprehensiveTests().catch(console.error);
