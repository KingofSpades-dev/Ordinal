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
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="350" height="100" viewBox="0 0 350 100">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#14171A" />
            <stop offset="100%" stop-color="#0B0D0F" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E2C17C" />
            <stop offset="50%" stop-color="#C5A880" />
            <stop offset="100%" stop-color="#9E7A44" />
          </linearGradient>
        </defs>

        <rect width="350" height="100" rx="12" fill="url(#bgGrad)" stroke="#7C1522" stroke-width="2"/>
        <rect x="6" y="6" width="338" height="88" rx="8" fill="none" stroke="url(#goldGrad)" stroke-width="0.75" stroke-opacity="0.5"/>

        <g transform="translate(20, 26)">
          <circle cx="24" cy="24" r="22" fill="#7C1522" fill-opacity="0.15" stroke="url(#goldGrad)" stroke-width="1.5"/>
          <circle cx="24" cy="24" r="14" fill="none" stroke="url(#goldGrad)" stroke-width="1" stroke-dasharray="2 2"/>
          <svg x="12" y="12" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#goldGrad)" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v20M2 12h20" />
          </svg>
        </g>

        <text x="80" y="32" font-family="'Inter', -apple-system, sans-serif" font-size="9" font-weight="800" fill="url(#goldGrad)" letter-spacing="1.5">ORDO PROTOCOL ASSESSMENT</text>
        <text x="80" y="54" font-family="'Inter', -apple-system, sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">${name}</text>
        <text x="80" y="78" font-family="'Inter', -apple-system, sans-serif" font-size="18" fill="url(#goldGrad)">${keys}</text>
        <text x="326" y="78" font-family="'Inter', -apple-system, sans-serif" font-size="9" font-weight="700" fill="#E2C17C" text-anchor="end" letter-spacing="0.5">VERIFIED</text>
      </svg>`;
    } else {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="350" height="100" viewBox="0 0 350 100">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#14171A" />
            <stop offset="100%" stop-color="#0B0D0F" />
          </linearGradient>
          <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#94A3B8" />
            <stop offset="100%" stop-color="#475569" />
          </linearGradient>
        </defs>

        <rect width="350" height="100" rx="12" fill="url(#bgGrad)" stroke="#475569" stroke-width="2"/>
        <rect x="6" y="6" width="338" height="88" rx="8" fill="none" stroke="url(#silverGrad)" stroke-width="0.75" stroke-opacity="0.3"/>

        <g transform="translate(20, 26)">
          <circle cx="24" cy="24" r="22" fill="#475569" fill-opacity="0.1" stroke="url(#silverGrad)" stroke-width="1.5"/>
          <svg x="12" y="12" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#silverGrad)" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v20M2 12h20" />
          </svg>
        </g>

        <text x="80" y="32" font-family="'Inter', -apple-system, sans-serif" font-size="9" font-weight="800" fill="url(#silverGrad)" letter-spacing="1.5">ORDO PROTOCOL ASSESSMENT</text>
        <text x="80" y="54" font-family="'Inter', -apple-system, sans-serif" font-size="14" font-weight="700" fill="#94A3B8">${name}</text>
        <text x="80" y="78" font-family="'Inter', -apple-system, sans-serif" font-size="11" font-style="italic" fill="#E11D48">Unrated or Revoked</text>
        <text x="326" y="78" font-family="'Inter', -apple-system, sans-serif" font-size="9" font-weight="700" fill="#94A3B8" text-anchor="end" letter-spacing="0.5">UNVERIFIED</text>
      </svg>`;
    }

    return res.status(200).send(svg);
  }
}
