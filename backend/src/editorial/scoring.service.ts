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

    const finalScore = (githubScore * githubWeight) + (onchainScore * onchainWeight);

    // 4. Save to Score table
    const hardSignalScores = {
      githubScore,
      onchainScore,
      githubWeight,
      onchainWeight,
      commitsVal,
      txVal,
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
