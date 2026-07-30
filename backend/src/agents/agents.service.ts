import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ethers } from 'ethers';
import * as nacl from 'tweetnacl';
import bs58 from 'bs58';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitAgentDto } from './dto/submit-agent.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { IngestService } from './ingest.service';
import { VerifyProcessor } from '../queue/verify.processor';
import { IngestProcessor } from '../queue/ingest.processor';
import { ScoringService } from '../editorial/scoring.service';

@Injectable()
export class AgentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ingestService: IngestService,
    @InjectQueue('verify') private readonly verifyQueue: Queue,
  ) {}

  async findAll() {
    return this.prisma.agent.findMany({
      orderBy: { submittedAt: 'desc' },
      include: {
        scores: true,
        snapshots: true,
        keyAwards: {
          where: { revokedAt: null },
        },
      },
    });
  }

  async submitAgent(dto: SubmitAgentDto) {
    const message = `Submit agent: ${dto.name} by ${dto.submitterWallet}`;
    if (dto.submitterWallet.startsWith('0x')) {
      try {
        const recoveredAddress = ethers.verifyMessage(message, dto.signature);
        if (recoveredAddress.toLowerCase() !== dto.submitterWallet.toLowerCase()) {
          throw new BadRequestException('Invalid Ethereum signature verification failed');
        }
      } catch (err) {
        throw new BadRequestException('Failed to verify Ethereum wallet signature: ' + err.message);
      }
    } else {
      try {
        const messageBytes = new TextEncoder().encode(message);
        const signatureBytes = new Uint8Array(Buffer.from(dto.signature.replace('0x', ''), 'hex'));
        const publicKeyBytes = bs58.decode(dto.submitterWallet);
        const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
        if (!isValid) {
          throw new BadRequestException('Invalid Solana signature verification failed');
        }
      } catch (err) {
        throw new BadRequestException('Failed to verify Solana wallet signature: ' + err.message);
      }
    }

    // 2. Check duplicates for same wallet - if found, update!
    const existingAgent = await this.prisma.agent.findFirst({
      where: {
        submittedBy: {
          equals: dto.submitterWallet,
        },
        OR: [
          { name: { equals: dto.name } },
          { contractAddresses: { contains: dto.contractAddresses[0] } }
        ]
      }
    });

    // Calculate scan count and delays
    const scanCount = await this.prisma.agent.count({
      where: { submittedBy: dto.submitterWallet },
    });

    let delayMs = 2 * 60 * 1000; // 1st scan: 2 minutes
    if (scanCount === 1) {
      delayMs = 30 * 60 * 1000; // 2nd scan: 30 minutes
    } else if (scanCount >= 2) {
      delayMs = 2 * 60 * 60 * 1000; // 3rd+ scan: 2 hours
    }

    const hasBalance = await this.checkOrdoBalance(dto.submitterWallet);
    const processAfter = hasBalance ? null : new Date(Date.now() + delayMs);

    if (existingAgent) {
      console.log(`[SUBMIT] Existing agent "${existingAgent.name}" found for same wallet. Updating data and resetting scan status...`);
      const updatedAgent = await this.prisma.agent.update({
        where: { id: existingAgent.id },
        data: {
          name: dto.name,
          category: dto.category,
          status: 'submitted', // reset status to re-trigger scan!
          contractAddresses: dto.contractAddresses.join(','),
          chains: dto.chains.join(','),
          website: dto.website,
          docsUrl: dto.docsUrl,
          xHandle: dto.xHandle,
          githubUrl: dto.githubUrl,
          launchDate: new Date(dto.launchDate),
          updatedAt: new Date(),
          processAfter,
          scanIndex: scanCount,
        }
      });
      
      // Delete old snapshots and scores to clean up history for a fresh scan
      await this.prisma.signalSnapshot.deleteMany({ where: { agentId: existingAgent.id } });
      await this.prisma.score.deleteMany({ where: { agentId: existingAgent.id } });

      // Run synchronous background verification
      let queued = false;
      if (this.verifyQueue) {
        try {
          await Promise.race([
            this.verifyQueue.add('verify-agent', { agentId: updatedAgent.id }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1000))
          ]);
          queued = true;
        } catch (e) {}
      }
      if (!queued) {
        this.runSyncVerificationInDev(updatedAgent.id).catch(err => console.error(err));
      }

      return {
        agentId: updatedAgent.id,
        status: updatedAgent.status,
        message: 'Existing agent updated successfully. Re-running reputation scan...',
      };
    }

    // 3. Create Agent (If different wallet or new submission)
    const suffix = Math.random().toString(36).substring(2, 8);
    const agent = await this.prisma.agent.create({
      data: {
        name: dto.name,
        slug: `${dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${suffix}`,
        category: dto.category,
        status: 'submitted',
        contractAddresses: dto.contractAddresses.join(','),
        chains: dto.chains.join(','),
        website: dto.website,
        docsUrl: dto.docsUrl,
        xHandle: dto.xHandle,
        githubUrl: dto.githubUrl,
        launchDate: new Date(dto.launchDate),
        submittedBy: dto.submitterWallet,
        processAfter,
        scanIndex: scanCount,
      },
    });

    // 4. Queue background verification task
    let queued = false;
    if (this.verifyQueue) {
      try {
        await Promise.race([
          this.verifyQueue.add('verify-agent', { agentId: agent.id }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Redis Timeout')), 1000))
        ]);
        queued = true;
      } catch (err) {
        console.warn('Queue addition failed (Redis is offline). Running verification and ingestion synchronously in background...');
      }
    }

    if (!queued) {
      // Run synchronously in background (non-blocking)
      this.runSyncVerificationInDev(agent.id).catch(err => {
        console.error('Synchronous verification pipeline failed:', err);
      });
    }

    return {
      agentId: agent.id,
      status: agent.status,
      message: 'Agent registered for queue assessment. Coverage and scoring are not guaranteed.',
    };
  }

  async runSyncVerificationInDev(agentId: string) {
    console.log(`[DEV MODE] Starting synchronous fallback assessment for agent ID: ${agentId}`);
    
    // 1. Run Verification Processor
    const verifyProcessor = new VerifyProcessor(this.prisma);
    await verifyProcessor.process({ data: { agentId } } as any);

    // Reload agent state
    let agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
    if (agent && agent.status === 'queued') {
      // 2. Run Ingestion Processor
      const ingestProcessor = new IngestProcessor(this.prisma, this.ingestService);
      await ingestProcessor.process({ data: { agentId } } as any);

      // Reload agent state
      agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
      if (agent && agent.status === 'analyzing') {
        // 3. Run scoring calculation automatically
        const scoringService = new ScoringService(this.prisma);
        await scoringService.calculateAgentScore(agentId, 'v1');
        
        // Auto-approve and publish in dev mode to make it visible on the UI instantly!
        await this.prisma.agent.update({
          where: { id: agentId },
          data: { status: 'published' },
        });
        console.log(`[DEV MODE] Agent "${agent.name}" successfully verified, ingested, scored, and published!`);
      }
    }
  }

  async submitRating(dto: CreateRatingDto) {
    // 1. Fetch Agent
    const agent = await this.prisma.agent.findUnique({ where: { id: dto.agentId } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    // 2. Verify Cryptographic Signature
    const message = `Rate agent: ${dto.agentId} with ${dto.stars} stars by ${dto.walletAddress}`;
    if (dto.walletAddress.startsWith('0x')) {
      try {
        const recoveredAddress = ethers.verifyMessage(message, dto.signature);
        if (recoveredAddress.toLowerCase() !== dto.walletAddress.toLowerCase()) {
          throw new BadRequestException('Voter signature verification failed');
        }
      } catch (err) {
        throw new BadRequestException('Failed to verify Ethereum wallet signature: ' + err.message);
      }
    } else {
      try {
        const messageBytes = new TextEncoder().encode(message);
        const signatureBytes = new Uint8Array(Buffer.from(dto.signature.replace('0x', ''), 'hex'));
        const publicKeyBytes = bs58.decode(dto.walletAddress);
        const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
        if (!isValid) {
          throw new BadRequestException('Invalid Solana voter signature verification failed');
        }
      } catch (err) {
        throw new BadRequestException('Failed to verify Solana voter wallet signature: ' + err.message);
      }
    }

    // 3. Verify onchain Proof-of-Use transaction
    const provider = new ethers.JsonRpcProvider('https://cloudflare-eth.com');
    try {
      const tx = await provider.getTransaction(dto.usageProofTx);
      if (!tx) {
        throw new BadRequestException('Transaction hash not found on-chain');
      }
      
      // Check sender matches voter
      if (tx.from.toLowerCase() !== dto.walletAddress.toLowerCase()) {
        throw new BadRequestException('Transaction sender does not match voter wallet address');
      }

      // Check recipient matches agent contracts
      const matchesContract = agent.contractAddresses.split(',')
        .map(c => c.trim().toLowerCase())
        .includes((tx.to || '').toLowerCase());
        
      if (!matchesContract) {
        throw new BadRequestException('Transaction recipient does not match any contract address of this agent');
      }
    } catch (err) {
      throw new BadRequestException('Failed to verify transaction on-chain: ' + err.message);
    }

    // 4. Check duplicate voter for this agent
    const existingRating = await this.prisma.communityRating.findUnique({
      where: {
        agentId_walletAddress: {
          agentId: dto.agentId,
          walletAddress: dto.walletAddress,
        },
      },
    });
    if (existingRating) {
      throw new ConflictException('You have already rated this agent');
    }

    // 5. Create Community Rating
    const rating = await this.prisma.communityRating.create({
      data: {
        agentId: dto.agentId,
        walletAddress: dto.walletAddress,
        stars: dto.stars,
        usageProofTx: dto.usageProofTx,
      },
    });

    return {
      success: true,
      ratingId: rating.id,
      message: 'Vote submitted successfully.',
    };
  }

  async checkOrdoBalance(wallet: string): Promise<boolean> {
    try {
      if (wallet.startsWith('0x')) return false;

      const rpcUrl = process.env.HELIUS_API_KEY || 'https://api.mainnet-beta.solana.com';
      const ORDO_MINT = 'OrdoTokenMintAddressPlaceholder111111111111';

      const payload = {
        jsonrpc: '2.0',
        id: 'ordo-check',
        method: 'getTokenAccountsByOwner',
        params: [
          wallet,
          {
            mint: ORDO_MINT
          },
          {
            encoding: 'jsonParsed'
          }
        ]
      };

      const res = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        return false;
      }

      const data = await res.json();
      if (data.result && data.result.value && data.result.value.length > 0) {
        const tokenAccount = data.result.value[0];
        const balance = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount || 0;
        return balance >= 50000;
      }
      return false;
    } catch (e) {
      console.error('Failed to check ORDO balance:', e);
      return false;
    }
  }
}
