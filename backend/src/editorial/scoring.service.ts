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

    // Extract github and onchain metric values
    const commitsSnapshot = snapshots.find(s => s.signalKey === 'github_commits_30d');
    const txSnapshot = snapshots.find(s => s.signalKey === 'tx_count_30d');

    const commitsVal = commitsSnapshot ? commitsSnapshot.value : 0;
    const txVal = txSnapshot ? txSnapshot.value : 0;

    // 2. Dynamic weights based on Category
    let githubWeight = 0.5;
    let onchainWeight = 0.5;

    if (agent.category.toLowerCase() === 'developer' || agent.category.toLowerCase() === 'infrastructure') {
      githubWeight = 0.7;
      onchainWeight = 0.3;
    } else if (agent.category.toLowerCase() === 'trading') {
      githubWeight = 0.2;
      onchainWeight = 0.8;
    }

    // 3. Compute Normalized Score (0 - 100)
    // Commits: full score (100) at 60 commits (max weight contributions)
    const githubScore = Math.min((commitsVal / 60) * 100, 100);
    // Transactions: full score (100) at 1500 txs
    const onchainScore = Math.min((txVal / 1500) * 100, 100);

    console.log(`[SCAN PIPELINE - STEP 3] Evaluating weights:`);
    console.log(`- GitHub Weight: ${githubWeight}, Normalized GitHub Score: ${githubScore}`);
    console.log(`- On-chain Weight: ${onchainWeight}, Normalized On-chain Score: ${onchainScore}`);
    
    const finalScore = (githubScore * githubWeight) + (onchainScore * onchainWeight);
    console.log(`- Calculated Final Weighted Score: ${finalScore} / 100`);

    const starsCount = finalScore >= 90 ? 3 : finalScore >= 70 ? 2 : finalScore >= 40 ? 1 : 0;
    const starLabel = starsCount === 3 ? "Three Stars: Exceptional" : starsCount === 2 ? "Two Stars: Excellent" : starsCount === 1 ? "One Star: Notable" : "Unrated";
    const starDesc = starsCount === 3 ? "A category-defining agent. The standard others are measured against." : starsCount === 2 ? "Among the best in its category. Worth going out of your way to use." : starsCount === 1 ? "A capable agent worth knowing in its category. Solid execution, real utility." : "Below Ordo rating threshold.";

    // 4. Save to Score table
    const hardSignalScores = {
      githubScore,
      onchainScore,
      githubWeight,
      onchainWeight,
      commitsVal,
      txVal,
      starsCount,
      starLabel,
      starDesc,
    };

    const score = await this.prisma.score.create({
      data: {
        agentId,
        methodologyVersion,
        hardSignalScores: JSON.stringify(hardSignalScores),
        editorialScore: 0.0, // Managed by editor override in EditorialService
        confidence: 1.0,
      },
    });

    return score;
  }
}
