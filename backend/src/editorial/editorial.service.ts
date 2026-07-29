import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScoringService } from './scoring.service';
import { CreateDossierDto, AwardKeyDto, RevokeKeyDto } from './dto/editorial.dto';

@Injectable()
export class EditorialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scoringService: ScoringService,
  ) {}

  // 1. Create or update a Dossier Draft
  async createOrUpdateDossier(editorId: string, dto: CreateDossierDto) {
    const agent = await this.prisma.agent.findUnique({ where: { id: dto.agentId } });
    if (!agent) throw new NotFoundException('Agent not found');

    // Editorial Firewall: Block scoring/dossier adjustments if editor submitted it
    if (agent.submittedBy.toLowerCase() === editorId.toLowerCase()) {
      throw new ForbiddenException('Editorial Firewall: Conflict of interest detected. Submitter cannot edit dossier.');
    }

    // Update status to draft
    await this.prisma.agent.update({
      where: { id: dto.agentId },
      data: { status: 'draft' },
    });

    const editorExists = await this.prisma.user.findUnique({ where: { id: editorId } });

    // Check if dossier already exists
    const existing = await this.prisma.dossier.findFirst({
      where: { agentId: dto.agentId },
    });

    if (existing) {
      return this.prisma.dossier.update({
        where: { id: existing.id },
        data: {
          title: dto.title,
          body: dto.body,
          verdict: dto.verdict,
          editor: editorExists ? { connect: { id: editorId } } : undefined,
        },
      });
    } else {
      const count = await this.prisma.dossier.count();
      const nextDossierNumber = count + 1;

      return this.prisma.dossier.create({
        data: {
          agent: { connect: { id: dto.agentId } },
          dossierNumber: nextDossierNumber,
          title: dto.title,
          body: dto.body,
          verdict: dto.verdict,
          methodologyVersion: dto.methodologyVersion,
          editor: editorExists ? { connect: { id: editorId } } : undefined,
        },
      });
    }
  }

  // 2. Publish Dossier and transition agent state
  async publishDossier(editorId: string, agentId: string) {
    const agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) throw new NotFoundException('Agent not found');

    if (agent.submittedBy.toLowerCase() === editorId.toLowerCase()) {
      throw new ForbiddenException('Editorial Firewall: Submitter cannot approve and publish this agent.');
    }

    const dossier = await this.prisma.dossier.findFirst({
      where: { agentId },
    });
    if (!dossier) {
      throw new BadRequestException('Please draft a dossier before publishing');
    }

    // Recalculate official scores
    await this.scoringService.calculateAgentScore(agentId, dossier.methodologyVersion);

    // Update status to published
    await this.prisma.agent.update({
      where: { id: agentId },
      data: { status: 'published' },
    });

    await this.prisma.dossier.update({
      where: { id: dossier.id },
      data: {
        editorVerified: true,
        publishedAt: new Date(),
      },
    });

    return {
      success: true,
      message: `Dossier for ${agent.name} has been published successfully.`,
    };
  }

  // 3. Award Keys (Michelin Stars equivalent)
  async awardKeys(editorId: string, dto: AwardKeyDto) {
    const agent = await this.prisma.agent.findUnique({ where: { id: dto.agentId } });
    if (!agent) throw new NotFoundException('Agent not found');

    if (agent.status !== 'published') {
      throw new BadRequestException('Agent must be published before awarding keys');
    }

    const editorExists = await this.prisma.user.findUnique({ where: { id: editorId } });
    if (!editorExists) {
      throw new BadRequestException('Editor/User not found in database');
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + dto.expiresInDays);

    const award = await this.prisma.keyAward.create({
      data: {
        agent: { connect: { id: dto.agentId } },
        keyCount: dto.keyCount,
        expiresAt,
        methodologyVersion: 'v1',
        editor: { connect: { id: editorId } },
        rationale: dto.rationale,
      },
    });

    return award;
  }

  // 4. Revoke Keys (Kill-Switch)
  async revokeKeys(editorId: string, dto: RevokeKeyDto) {
    const activeAwards = await this.prisma.keyAward.findMany({
      where: {
        agentId: dto.agentId,
        revokedAt: null,
      },
    });

    if (activeAwards.length === 0) {
      throw new BadRequestException('No active awards found for this agent');
    }

    // Update all active key awards to revoked
    await this.prisma.keyAward.updateMany({
      where: {
        agentId: dto.agentId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
        revocationReason: dto.reason,
      },
    });

    // Update agent status back to archived/revoked
    await this.prisma.agent.update({
      where: { id: dto.agentId },
      data: { status: 'archived' },
    });

    return {
      success: true,
      message: 'All keys have been revoked and verification badge status set to revoked.',
    };
  }
}
