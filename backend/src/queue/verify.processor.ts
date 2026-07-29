import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ethers } from 'ethers';
import { PrismaService } from '../prisma/prisma.service';

@Processor('verify')
export class VerifyProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
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

    const errors: string[] = [];

    // 1. Verify Website & Docs resolve (HTTP Check)
    try {
      const webRes = await fetch(agent.website);
      if (!webRes.ok) errors.push(`Website returned status ${webRes.status}`);
    } catch (e) {
      errors.push(`Website failed to resolve: ${e.message}`);
    }

    try {
      const docsRes = await fetch(agent.docsUrl);
      if (!docsRes.ok) errors.push(`Docs URL returned status ${docsRes.status}`);
    } catch (e) {
      errors.push(`Docs URL failed to resolve: ${e.message}`);
    }

    // 2. Verify Contract Addresses are deployed contracts (not EOAs) on mainnet
    const provider = new ethers.JsonRpcProvider('https://cloudflare-eth.com');

    const addresses = agent.contractAddresses.split(',').map(a => a.trim());
    for (const addr of addresses) {
      if (addr.startsWith('0x') && addr.length === 42) {
        try {
          const bytecode = await provider.getCode(addr);
          if (!bytecode || bytecode === '0x') {
            errors.push(`Address ${addr} is an EOA or has no deployed code.`);
          }
        } catch (e) {
          console.warn(`RPC check failed for ${addr}:`, e.message);
        }
      }
    }

    // 3. Update agent pipeline state based on verification results
    if (errors.length > 0) {
      await this.prisma.agent.update({
        where: { id: agentId },
        data: {
          status: 'rejected_invalid',
        },
      });
      console.log(`Agent ${agent.name} verification failed:`, errors.join('; '));
    } else {
      await this.prisma.agent.update({
        where: { id: agentId },
        data: {
          status: 'queued',
        },
      });
      console.log(`Agent ${agent.name} verification passed and queued.`);
    }
  }
}
