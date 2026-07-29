import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ethers } from 'ethers';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitAgentDto } from './dto/submit-agent.dto';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class AgentsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('verify') private readonly verifyQueue: Queue,
  ) {}

  async findAll() {
    return this.prisma.agent.findMany({
      orderBy: { submittedAt: 'desc' },
      include: {
        scores: true,
        keyAwards: {
          where: { revokedAt: null },
        },
      },
    });
  }

  async submitAgent(dto: SubmitAgentDto) {
    // 1. Verify Cryptographic Signature using ethers
    const message = `Submit agent: ${dto.name} by ${dto.submitterWallet}`;
    try {
      const recoveredAddress = ethers.verifyMessage(message, dto.signature);
      if (recoveredAddress.toLowerCase() !== dto.submitterWallet.toLowerCase()) {
        throw new BadRequestException('Invalid signature verification failed');
      }
    } catch (err) {
      throw new BadRequestException('Failed to verify wallet signature: ' + err.message);
    }

    // 2. Check duplicates
    const existingName = await this.prisma.agent.findFirst({
      where: {
        name: {
          equals: dto.name,
        },
      },
    });
    if (existingName) {
      throw new ConflictException('An agent with this name already exists');
    }

    // Check duplicate contract addresses
    const allAgents = await this.prisma.agent.findMany();
    for (const addr of dto.contractAddresses) {
      const isDuplicate = allAgents.some(a => 
        a.contractAddresses.split(',').map(c => c.trim().toLowerCase()).includes(addr.toLowerCase())
      );
      if (isDuplicate) {
        throw new ConflictException(`Contract address ${addr} is already registered`);
      }
    }

    // 3. Create Agent
    const agent = await this.prisma.agent.create({
      data: {
        name: dto.name,
        slug: dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
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
      },
    });

    // 4. Queue background verification task
    if (this.verifyQueue) {
      await this.verifyQueue.add('verify-agent', { agentId: agent.id });
    }

    return {
      agentId: agent.id,
      status: agent.status,
      message: 'Agent registered for queue assessment. Coverage and scoring are not guaranteed.',
    };
  }

  async submitRating(dto: CreateRatingDto) {
    // 1. Fetch Agent
    const agent = await this.prisma.agent.findUnique({ where: { id: dto.agentId } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    // 2. Verify Cryptographic Signature
    const message = `Rate agent: ${dto.agentId} with ${dto.stars} stars by ${dto.walletAddress}`;
    try {
      const recoveredAddress = ethers.verifyMessage(message, dto.signature);
      if (recoveredAddress.toLowerCase() !== dto.walletAddress.toLowerCase()) {
        throw new BadRequestException('Voter signature verification failed');
      }
    } catch (err) {
      throw new BadRequestException('Failed to verify wallet signature: ' + err.message);
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
}
