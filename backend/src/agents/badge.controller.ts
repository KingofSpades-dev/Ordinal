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
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="110" viewBox="0 0 380 110">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E2C17C" />
            <stop offset="50%" stop-color="#C5A880" />
            <stop offset="100%" stop-color="#9E7A44" />
          </linearGradient>
        </defs>

        <!-- Card Body (Ordo Web Parchment Palette) -->
        <rect width="380" height="110" rx="14" fill="#FAF6F0" stroke="#7C1522" stroke-width="2.5"/>
        <rect x="6" y="6" width="368" height="98" rx="10" fill="none" stroke="url(#goldGrad)" stroke-width="1.2"/>

        <!-- Left Logo Circle (Shield Feel) -->
        <g transform="translate(18, 31)">
          <circle cx="24" cy="24" r="22" fill="#7C1522" stroke="url(#goldGrad)" stroke-width="1.5"/>
          <svg x="12" y="12" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FAF6F0" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v20M2 12h20" />
          </svg>
        </g>

        <!-- Info Details -->
        <text x="78" y="36" font-family="'Inter', -apple-system, sans-serif" font-size="9.5" font-weight="900" fill="#7C1522" letter-spacing="1.5">ORDO PROTOCOL ASSESSMENT</text>
        <text x="78" y="58" font-family="'Inter', -apple-system, sans-serif" font-size="16" font-weight="800" fill="#1C1F24">${name}</text>
        
        <!-- Stars count in the text line -->
        <text x="78" y="82" font-family="'Inter', -apple-system, sans-serif" font-size="13" font-weight="600" fill="#9E7A44" letter-spacing="0.5">Rating: ${activeAward.keyCount} Star${activeAward.keyCount > 1 ? 's' : ''}</text>

        <!-- Right Side: Certificate Gold Stamp -->
        <g transform="translate(324, 55)">
          <circle cx="0" cy="0" r="34" fill="#7C1522" fill-opacity="0.03" stroke="url(#goldGrad)" stroke-width="2" stroke-dasharray="4 2"/>
          <circle cx="0" cy="0" r="30" fill="#FAF6F0" stroke="url(#goldGrad)" stroke-width="1"/>
          
          <text x="0" y="-12" font-family="'Inter', -apple-system, sans-serif" font-size="8" font-weight="900" fill="#9E7A44" text-anchor="middle" letter-spacing="0.5">ORDO</text>
          <text x="0" y="6" font-family="'Inter', -apple-system, sans-serif" font-size="14" fill="#7C1522" text-anchor="middle">${keys}</text>
          <text x="0" y="18" font-family="'Inter', -apple-system, sans-serif" font-size="7" font-weight="900" fill="#9E7A44" text-anchor="middle" letter-spacing="0.5">VERIFIED</text>
        </g>
      </svg>`;
    } else {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="110" viewBox="0 0 380 110">
        <defs>
          <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#94A3B8" />
            <stop offset="100%" stop-color="#475569" />
          </linearGradient>
        </defs>

        <!-- Card Body (Ordo Web Parchment Palette) -->
        <rect width="380" height="110" rx="14" fill="#FAF6F0" stroke="#475569" stroke-width="2.5"/>
        <rect x="6" y="6" width="368" height="98" rx="10" fill="none" stroke="url(#silverGrad)" stroke-width="1.2"/>

        <!-- Left Logo Circle (Grey Shield Feel) -->
        <g transform="translate(18, 31)">
          <circle cx="24" cy="24" r="22" fill="#475569" stroke="url(#silverGrad)" stroke-width="1.5"/>
          <svg x="12" y="12" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FAF6F0" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v20M2 12h20" />
          </svg>
        </g>

        <!-- Info Details -->
        <text x="78" y="36" font-family="'Inter', -apple-system, sans-serif" font-size="9.5" font-weight="900" fill="#475569" letter-spacing="1.5">ORDO PROTOCOL ASSESSMENT</text>
        <text x="78" y="58" font-family="'Inter', -apple-system, sans-serif" font-size="16" font-weight="800" fill="#475569">${name}</text>
        <text x="78" y="82" font-family="'Inter', -apple-system, sans-serif" font-size="12" font-style="italic" fill="#E11D48" font-weight="600">Keys: None or Revoked</text>

        <!-- Right Side: Certificate Grey Stamp -->
        <g transform="translate(324, 55)">
          <circle cx="0" cy="0" r="34" fill="#475569" fill-opacity="0.03" stroke="url(#silverGrad)" stroke-width="2" stroke-dasharray="4 2"/>
          <circle cx="0" cy="0" r="30" fill="#FAF6F0" stroke="url(#silverGrad)" stroke-width="1"/>
          
          <text x="0" y="-12" font-family="'Inter', -apple-system, sans-serif" font-size="8" font-weight="900" fill="#475569" text-anchor="middle" letter-spacing="0.5">ORDO</text>
          <text x="0" y="6" font-family="'Inter', -apple-system, sans-serif" font-size="14" fill="#E11D48" text-anchor="middle">☆☆☆</text>
          <text x="0" y="18" font-family="'Inter', -apple-system, sans-serif" font-size="7" font-weight="900" fill="#475569" text-anchor="middle" letter-spacing="0.5">REVOKED</text>
        </g>
      </svg>`;
    }

    return res.status(200).send(svg);
  }
}
