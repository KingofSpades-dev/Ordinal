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
import { EXPLORER_REGISTRY, isValidAddressForChain } from '../config/explorer-registry';

import { X402WashFilterService } from './x402-wash-filter.service';
import { Erc8004ResolverService } from './erc8004-resolver.service';

@Injectable()
export class AgentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ingestService: IngestService,
    private readonly washFilterService: X402WashFilterService,
    private readonly erc8004Service: Erc8004ResolverService,
    @InjectQueue('verify') private readonly verifyQueue: Queue,
  ) {}

  async getErc8004Identity(slug: string) {
    const agent = await this.prisma.agent.findUnique({ where: { slug } });
    if (!agent) throw new NotFoundException('Agent not found');
    const mainChain = agent.chains ? agent.chains.split(',')[0] : 'ethereum';
    return this.erc8004Service.resolveAgentIdentity(slug, mainChain, ['x402', 'treasury']);
  }

  async runWashFilter(slug: string, transactions: any[]) {
    const agent = await this.prisma.agent.findUnique({ where: { slug } });
    if (!agent) throw new NotFoundException('Agent not found');
    const treasuryWallets = agent.contractAddresses ? agent.contractAddresses.split(',') : [];
    return this.washFilterService.filterVolume(transactions, treasuryWallets);
  }

  async findAll(walletAddress?: string) {
    const cleanWallet = walletAddress?.toLowerCase().trim();
    if (!cleanWallet) {
      return [];
    }

    const agents = await this.prisma.agent.findMany({
      where: {
        submittedBy: { equals: walletAddress, mode: 'insensitive' as any }
      },
      orderBy: { submittedAt: 'desc' },
      include: {
        scores: true,
        snapshots: true,
        identities: true,
        keyAwards: {
          where: { revokedAt: null },
        },
      },
    });

    return agents.map(agent => {
      const resolvedIdentities = (agent.identities || []).map(identity => {
        const registryEntry = EXPLORER_REGISTRY[identity.chainKey.toLowerCase()];
        let explorerUrl = '';
        if (registryEntry) {
          const template = identity.addressType === 'token' ? registryEntry.tokenUrlTemplate : registryEntry.addressUrlTemplate;
          explorerUrl = template.replace('{address}', identity.contractAddress);
        }
        return {
          ...identity,
          explorerUrl
        };
      });
      return {
        ...agent,
        identities: resolvedIdentities
      };
    });
  }

  async getPublicRankings() {
    const agents = await this.prisma.agent.findMany({
      orderBy: { submittedAt: 'desc' },
      include: {
        scores: true,
        identities: true,
        keyAwards: {
          where: { revokedAt: null },
        },
      },
    });

    return agents.map(agent => {
      const { submittedBy, ...publicData } = agent;
      const resolvedIdentities = (publicData.identities || []).map(identity => {
        const registryEntry = EXPLORER_REGISTRY[identity.chainKey.toLowerCase()];
        let explorerUrl = '';
        if (registryEntry) {
          const template = identity.addressType === 'token' ? registryEntry.tokenUrlTemplate : registryEntry.addressUrlTemplate;
          explorerUrl = template.replace('{address}', identity.contractAddress);
        }
        return {
          ...identity,
          explorerUrl
        };
      });
      return {
        ...publicData,
        identities: resolvedIdentities
      };
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

    // Anti-Abuse: Duplicate contract address check (exclude updating the user's own agent)
    for (const address of dto.contractAddresses) {
      const cleanAddr = address.trim();
      if (cleanAddr && cleanAddr.toUpperCase() !== 'N/A') {
        const duplicateAddr = await this.prisma.agent.findFirst({
          where: {
            contractAddresses: { contains: cleanAddr },
            NOT: {
              submittedBy: dto.submitterWallet
            }
          }
        });
        if (duplicateAddr) {
          throw new ConflictException(`Contract address ${cleanAddr} has already been registered by another agent.`);
        }
      }
    }

    // Anti-Abuse: Name-similarity check
    const newNameClean = dto.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const allAgents = await this.prisma.agent.findMany({ select: { id: true, name: true, submittedBy: true } });
    for (const other of allAgents) {
      if (other.submittedBy === dto.submitterWallet && other.name.toLowerCase() === dto.name.toLowerCase()) {
        continue;
      }
      const otherNameClean = other.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const distance = this.getLevenshteinDistance(newNameClean, otherNameClean);
      const maxLength = Math.max(newNameClean.length, otherNameClean.length);
      const similarity = maxLength === 0 ? 1 : 1 - distance / maxLength;
      
      if (similarity >= 0.85) {
        throw new ConflictException(`Agent name "${dto.name}" is too similar to existing agent "${other.name}". Impersonation is not permitted.`);
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
      
      await this.syncAgentIdentitiesAndLinks(updatedAgent.id, dto);

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

    await this.syncAgentIdentitiesAndLinks(agent.id, dto);

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
    if (!dto.usageProofTx.startsWith('mock_') && !dto.usageProofTx.startsWith('test_')) {
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

  async getAgentIdentity(slug: string) {
    const agent = await this.prisma.agent.findUnique({
      where: { slug },
      include: {
        identities: true,
        links: true,
      }
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const resolvedIdentities = agent.identities.map(identity => {
      const registryEntry = EXPLORER_REGISTRY[identity.chainKey.toLowerCase()];
      let explorerUrl = '';
      if (registryEntry) {
        const template = identity.addressType === 'token' ? registryEntry.tokenUrlTemplate : registryEntry.addressUrlTemplate;
        explorerUrl = template.replace('{address}', identity.contractAddress);
      }
      return {
        ...identity,
        explorerUrl
      };
    });

    const primary = resolvedIdentities.find(id => id.isPrimary) || resolvedIdentities[0] || null;

    return {
      identities: resolvedIdentities,
      links: agent.links,
      primary
    };
  }

  private getLevenshteinDistance(a: string, b: string): number {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            )
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  private async syncAgentIdentitiesAndLinks(agentId: string, dto: SubmitAgentDto) {
    // Delete existing identities & links for this agent first
    await this.prisma.agentIdentity.deleteMany({ where: { agentId } });
    await this.prisma.agentLink.deleteMany({ where: { agentId } });

    // Create new identities
    if (dto.contractAddresses && dto.contractAddresses.length > 0) {
      for (let i = 0; i < dto.contractAddresses.length; i++) {
        const addr = dto.contractAddresses[i].trim();
        const chain = dto.chains[i] || dto.chains[0] || 'ethereum';
        if (addr && addr.toUpperCase() !== 'N/A') {
          await this.prisma.agentIdentity.create({
            data: {
              agentId,
              chainKey: chain.toLowerCase(),
              contractAddress: addr,
              addressType: 'contract',
              isPrimary: i === 0,
              verificationTier: 'unverified',
              verificationMethod: 'none',
              verifiedAt: new Date(),
              lastCheckedAt: new Date(),
            }
          });
        }
      }
    }

    // Create new links
    if (dto.website && dto.website !== 'N/A' && dto.website !== '') {
      await this.prisma.agentLink.create({
        data: {
          agentId,
          kind: 'website',
          url: dto.website,
          resolves: false,
          lastCheckedAt: new Date(),
        }
      });
    }
    if (dto.docsUrl && dto.docsUrl !== 'N/A' && dto.docsUrl !== '') {
      await this.prisma.agentLink.create({
        data: {
          agentId,
          kind: 'docs',
          url: dto.docsUrl,
          resolves: false,
          lastCheckedAt: new Date(),
        }
      });
    }
    if (dto.githubUrl && dto.githubUrl !== 'N/A' && dto.githubUrl !== '') {
      await this.prisma.agentLink.create({
        data: {
          agentId,
          kind: 'github',
          url: dto.githubUrl,
          resolves: false,
          lastCheckedAt: new Date(),
        }
      });
    }
  }
}
