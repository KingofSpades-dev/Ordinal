import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScoringService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateAgentScore(agentId: string, methodologyVersion = 'v1') {
    const agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    console.log(`\n==================================================`);
    console.log(`[SCAN PIPELINE - STEP 3] Starting Score Calculation for Agent: "${agent.name}"`);
    console.log(`- Category: ${agent.category}`);
    console.log(`==================================================`);

    // 1. Fetch latest telemetry signals
    const snapshots = await this.prisma.signalSnapshot.findMany({
      where: { agentId },
      orderBy: { collectedAt: 'desc' },
    });

    // 1. Calculate Verifiability Dimension (0–25 points)
    const hasDocs = agent.docsUrl && agent.docsUrl !== '' && agent.docsUrl.toUpperCase() !== 'N/A';
    const hasWebsite = agent.website && agent.website !== '' && agent.website.toUpperCase() !== 'N/A';
    const hasGithub = agent.githubUrl && agent.githubUrl !== '' && agent.githubUrl.toUpperCase() !== 'N/A';

    let verifiabilityScore = 0;
    if (hasDocs) verifiabilityScore += 10;
    if (hasWebsite) verifiabilityScore += 5;
    if (hasGithub) verifiabilityScore += 10;
    const verifiabilityEvidenced = hasDocs || hasWebsite || hasGithub;

    // 2. Calculate Activity Dimension (0–25 points)
    // Try both active_wallets_30d and unique_addresses_30d
    const activitySnapshot = snapshots.find(s => s.signalKey === 'active_wallets_30d' || s.signalKey === 'unique_addresses_30d');
    const tvlSnapshot = snapshots.find(s => s.signalKey === 'tvl');
    
    const activityEvidenced = activitySnapshot !== undefined || tvlSnapshot !== undefined;
    const uniqueAddresses = activitySnapshot ? activitySnapshot.value : 0;
    const tvlVal = tvlSnapshot ? tvlSnapshot.value : 0;

    const userFootprintScore = activitySnapshot ? Math.min(15, (uniqueAddresses / 5000) * 15) : 0;
    const tvlScore = tvlSnapshot ? Math.min(10, (tvlVal / 500) * 10) : 0;

    const activityScore = userFootprintScore + tvlScore;

    // 3. Calculate Maintenance Dimension (0–25 points)
    const commitsSnapshot = snapshots.find(s => s.signalKey === 'github_commits_30d');
    const maintenanceEvidenced = commitsSnapshot !== undefined;
    const commitsCount = commitsSnapshot ? commitsSnapshot.value : 0;
    // Normalized: 80 commits in 30 days gives full 25 points (Industry Standard for active maintenance)
    const maintenanceScore = maintenanceEvidenced ? Math.min(25, (commitsCount / 80) * 25) : 0;

    // 4. Calculate Security Posture Dimension (0–25 points)
    const auditSnapshot = snapshots.find(s => s.signalKey === 'audit_exists');
    const adminKeysSnapshot = snapshots.find(s => s.signalKey === 'admin_keys_safe');
    const securityEvidenced = auditSnapshot !== undefined || adminKeysSnapshot !== undefined;
    
    const auditVal = auditSnapshot ? auditSnapshot.value : 0; // 1 = exists, 0 = none
    const adminKeysVal = adminKeysSnapshot ? adminKeysSnapshot.value : 0; // 1 = safe, 0 = risky

    // Task 1.3 Guardrail: If no public audit or risky admin keys, cap security score at 10 max
    const rawSecurityScore = (auditVal * 15) + (adminKeysVal * 10);
    const securityScore = (auditVal === 0 || adminKeysVal === 0) ? Math.min(10, rawSecurityScore) : rawSecurityScore;

    // Evaluate Insufficient Evidence (if 2 or more dimensions are not evidenced)
    const unevidencedCount = [verifiabilityEvidenced, activityEvidenced, maintenanceEvidenced, securityEvidenced].filter(e => !e).length;
    const insufficientEvidence = unevidencedCount >= 2;

    // Apply Admin Key Centralization Risk Penalty (Standard Process Quality Review constraint)
    const adminPenalty = adminKeysVal === 0 ? 5 : 0;
    const rawScore = verifiabilityScore + activityScore + maintenanceScore + securityScore;
    const finalScore = Math.max(0, rawScore - adminPenalty);

    let confidence = 1.0;
    let keysCount = 0;
    let keyLabel = '';
    let keyDesc = '';

    if (insufficientEvidence) {
      confidence = 0.0;
      keysCount = 0;
      keyLabel = 'Registered, unrated';
      keyDesc = 'Insufficient evidence to produce an ORDO Key rating.';
    } else {
      // Task 1.3 Michelin Standards: 3 Keys >= 90, 2 Keys >= 80, 1 Key >= 65, Registered < 65
      // Guardrail Constraint: If no audit or risky admin keys, max allowed keys is 1
      const maxKeysBySecurity = (auditVal === 0 || adminKeysVal === 0) ? 1 : 3;
      const computedKeys = finalScore >= 90 ? 3 : finalScore >= 80 ? 2 : finalScore >= 65 ? 1 : 0;
      keysCount = Math.min(computedKeys, maxKeysBySecurity);

      keyLabel = keysCount === 3 ? "Three Keys: Benchmark" : keysCount === 2 ? "Two Keys: Exemplary" : keysCount === 1 ? "One Key: Notable" : "Registered, unrated";
      keyDesc = keysCount === 3 ? "A category-defining agent. The benchmark against which others are measured." : keysCount === 2 ? "Exemplary agent execution and verifiable security posture." : keysCount === 1 ? "A notable agent with verified utility and baseline posture." : "Registered agent in ORDO directory; unrated or below key award threshold.";
    }

    console.log(`[SCAN PIPELINE - STEP 3] Michelin Rubric v0.1 Calculation for "${agent.name}":`);
    console.log(`- Verifiability: ${verifiabilityScore} (Evidenced: ${verifiabilityEvidenced})`);
    console.log(`- Activity: ${activityScore} (Evidenced: ${activityEvidenced})`);
    console.log(`- Maintenance: ${maintenanceScore} (Evidenced: ${maintenanceEvidenced})`);
    console.log(`- Security: ${securityScore} (Evidenced: ${securityEvidenced})`);
    console.log(`- Admin Control Penalty: -${adminPenalty}`);
    console.log(`- Final Score: ${finalScore} / 100 (Keys Awarded: ${keysCount})`);

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
      keysCount,
      keyLabel,
      keyDesc,
      // Legacy aliases for backwards compatibility
      starsCount: keysCount,
      starLabel: keyLabel,
      starDesc: keyDesc,
    };

    const score = await this.prisma.score.create({
      data: {
        agentId,
        methodologyVersion: '0.1',
        hardSignalScores: JSON.stringify(hardSignalScores),
        editorialScore: 0.0,
        confidence,
      },
    });

    return score;
  }
}
