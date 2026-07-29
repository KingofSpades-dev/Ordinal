import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Controller('badge')
export class BadgeController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':agentId.svg')
  async getBadge(@Param('agentId') agentId: string, @Res() res: Response) {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-index=300'); // Short cache 5 mins

    // Fetch active unexpired keys
    const activeAward = await this.prisma.keyAward.findFirst({
      where: {
        agentId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        awardedAt: 'desc',
      },
    });

    const agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
    const name = agent ? agent.name : 'Unknown Agent';

    let svg = '';

    if (activeAward) {
      const keys = '★ '.repeat(activeAward.keyCount).trim();
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="96" viewBox="0 0 320 96">
        <rect width="320" height="96" rx="8" fill="#F5F0E8" stroke="#7C1522" stroke-width="2"/>
        <text x="24" y="32" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="#7C1522">VERIFIED BY ORDO</text>
        <text x="24" y="56" font-family="'Inter', sans-serif" font-size="16" font-weight="600" fill="#1C1F24">${name}</text>
        <text x="24" y="78" font-family="'Inter', sans-serif" font-size="18" fill="#A61D2D">${keys}</text>
      </svg>`;
    } else {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="96" viewBox="0 0 320 96">
        <rect width="320" height="96" rx="8" fill="#F5F0E8" stroke="#4A4F57" stroke-width="2"/>
        <text x="24" y="32" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="#4A4F57">UNVERIFIED AT ORDO</text>
        <text x="24" y="56" font-family="'Inter', sans-serif" font-size="16" font-weight="600" fill="#1C1F24">${name}</text>
        <text x="24" y="78" font-family="'Inter', sans-serif" font-size="12" fill="#7C1522">Keys: None or Revoked</text>
      </svg>`;
    }

    return res.status(200).send(svg);
  }
}
