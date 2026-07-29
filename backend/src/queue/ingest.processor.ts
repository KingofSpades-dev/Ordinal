import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { IngestService } from '../agents/ingest.service';

@Processor('ingest')
export class IngestProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ingestService: IngestService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { agentId } = job.data;
    const agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) return;

    await this.prisma.agent.update({
      where: { id: agentId },
      data: { status: 'ingesting' },
    });

    // 1. Fetch Github signals
    let commits = 0;
    let contributors = 0;
    let ghStars = 0;
    if (agent.githubUrl) {
      const stats = await this.ingestService.fetchGithubSignals(agent.githubUrl);
      commits = stats.commits;
      contributors = stats.contributors;
      ghStars = stats.stars;
    }

    // Write github snapshots
    await this.prisma.signalSnapshot.createMany({
      data: [
        {
          agentId,
          signalKey: 'github_commits_30d',
          value: commits,
          source: 'github_api',
          methodVersion: 'v1',
          rawPayload: JSON.stringify({ url: agent.githubUrl }),
        },
        {
          agentId,
          signalKey: 'github_contributors',
          value: contributors,
          source: 'github_api',
          methodVersion: 'v1',
          rawPayload: JSON.stringify({ url: agent.githubUrl }),
        },
        {
          agentId,
          signalKey: 'github_stars',
          value: ghStars,
          source: 'github_api',
          methodVersion: 'v1',
          rawPayload: JSON.stringify({ url: agent.githubUrl }),
        },
      ],
    });

    // 2. Fetch Onchain signals
    const onchainStats = await this.ingestService.fetchOnchainSignals(
      agent.contractAddresses.split(','),
      agent.chains.split(','),
    );

    await this.prisma.signalSnapshot.createMany({
      data: [
        {
          agentId,
          signalKey: 'tx_count_30d',
          value: onchainStats.txCount30d,
          source: 'rpc_node',
          methodVersion: 'v1',
          rawPayload: JSON.stringify({ contracts: agent.contractAddresses }),
        },
        {
          agentId,
          signalKey: 'active_wallets_30d',
          value: onchainStats.activeWallets30d,
          source: 'rpc_node',
          methodVersion: 'v1',
          rawPayload: JSON.stringify({ contracts: agent.contractAddresses }),
        },
        {
          agentId,
          signalKey: 'tvl',
          value: onchainStats.tvl,
          source: 'rpc_node',
          methodVersion: 'v1',
          rawPayload: JSON.stringify({ contracts: agent.contractAddresses }),
        },
      ],
    });

    // 3. Update agent status to analyzing
    await this.prisma.agent.update({
      where: { id: agentId },
      data: { status: 'analyzing' },
    });

    console.log(`Successfully completed Ingest for agent ${agent.name}.`);
  }
}
