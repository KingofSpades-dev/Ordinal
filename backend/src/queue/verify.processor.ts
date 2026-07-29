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

    console.log(`\n==================================================`);
    console.log(`[SCAN PIPELINE - STEP 1] Initializing verification for Agent: "${agent.name}"`);
    console.log(`- Contract: ${agent.contractAddresses}`);
    console.log(`- Chain: ${agent.chains}`);
    console.log(`- Website: ${agent.website}`);
    console.log(`- Docs: ${agent.docsUrl}`);
    console.log(`==================================================`);

    await this.prisma.agent.update({
      where: { id: agentId },
      data: { status: 'ingesting' },
    });

    const errors: string[] = [];

    // 1. Verify Website & Docs resolve (HTTP Check)
    console.log(`[SCAN PIPELINE - STEP 1] Running Website & Docs URL check...`);
    if (agent.website && agent.website.toUpperCase() !== 'N/A' && agent.website.toUpperCase() !== 'NONE') {
      try {
        const webRes = await fetch(agent.website);
        if (!webRes.ok) errors.push(`Website returned status ${webRes.status}`);
      } catch (e) {
        errors.push(`Website failed to resolve: ${e.message}`);
      }
    }

    if (agent.docsUrl && agent.docsUrl.toUpperCase() !== 'N/A' && agent.docsUrl.toUpperCase() !== 'NONE') {
      try {
        const docsRes = await fetch(agent.docsUrl);
        if (!docsRes.ok) errors.push(`Docs URL returned status ${docsRes.status}`);
      } catch (e) {
        errors.push(`Docs URL failed to resolve: ${e.message}`);
      }
    }

    // 2. Verify Contract Addresses are deployed contracts (not EOAs) on mainnet
    console.log(`[SCAN PIPELINE - STEP 1] Running Contract address deployment verification...`);
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
