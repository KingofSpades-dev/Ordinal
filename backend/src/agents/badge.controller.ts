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

    const agent = await this.prisma.agent.findUnique({
      where: { id: agentId },
      include: { scores: { orderBy: { computedAt: 'desc' } } },
    });
    const name = agent ? agent.name : 'Unknown Agent';

    let svg = '';

          const keys = '★ '.repeat(activeAward.keyCount) + '☆ '.repeat(5 - activeAward.keyCount);
      const starLabel = activeAward.keyCount === 3 ? "THREE STARS — EXCEPTIONAL" : activeAward.keyCount === 2 ? "TWO STARS — EXCELLENT" : activeAward.keyCount === 1 ? "ONE STAR — NOTABLE" : "UNRATED";
      const certId = `ORDO-AGT-${new Date(activeAward.awardedAt).toISOString().slice(0, 10).replace(/-/g, '')}-${agentId.slice(0, 5).toUpperCase()}`;
      const formattedDate = new Date(activeAward.awardedAt).toUTCString();

      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E2C17C" />
            <stop offset="50%" stop-color="#C5A880" />
            <stop offset="100%" stop-color="#9E7A44" />
          </linearGradient>
        </defs>

        <!-- Main Background Parchment -->
        <rect width="800" height="600" rx="20" fill="#FAF6F0" stroke="#7C1522" stroke-width="4"/>
        <rect x="15" y="15" width="770" height="570" fill="none" stroke="#7C1522" stroke-width="1.2"/>
        <rect x="20" y="20" width="760" height="560" fill="none" stroke="url(#goldGrad)" stroke-width="0.8" stroke-opacity="0.6"/>

        <!-- Flower Corner Ornaments -->
        <!-- Top Left -->
        <g transform="translate(45, 45)" fill="#7C1522">
          <circle cx="0" cy="0" r="4"/>
          <circle cx="-8" cy="0" r="3"/><circle cx="8" cy="0" r="3"/>
          <circle cx="0" cy="-8" r="3"/><circle cx="0" cy="8" r="3"/>
          <circle cx="-6" cy="-6" r="2.5"/><circle cx="6" cy="-6" r="2.5"/>
          <circle cx="-6" cy="6" r="2.5"/><circle cx="6" cy="6" r="2.5"/>
        </g>
        <!-- Top Right -->
        <g transform="translate(755, 45)" fill="#7C1522">
          <circle cx="0" cy="0" r="4"/>
          <circle cx="-8" cy="0" r="3"/><circle cx="8" cy="0" r="3"/>
          <circle cx="0" cy="-8" r="3"/><circle cx="0" cy="8" r="3"/>
          <circle cx="-6" cy="-6" r="2.5"/><circle cx="6" cy="-6" r="2.5"/>
          <circle cx="-6" cy="6" r="2.5"/><circle cx="6" cy="6" r="2.5"/>
        </g>
        <!-- Bottom Left -->
        <g transform="translate(45, 555)" fill="#7C1522">
          <circle cx="0" cy="0" r="4"/>
          <circle cx="-8" cy="0" r="3"/><circle cx="8" cy="0" r="3"/>
          <circle cx="0" cy="-8" r="3"/><circle cx="0" cy="8" r="3"/>
          <circle cx="-6" cy="-6" r="2.5"/><circle cx="6" cy="-6" r="2.5"/>
          <circle cx="-6" cy="6" r="2.5"/><circle cx="6" cy="6" r="2.5"/>
        </g>
        <!-- Bottom Right -->
        <g transform="translate(755, 555)" fill="#7C1522">
          <circle cx="0" cy="0" r="4"/>
          <circle cx="-8" cy="0" r="3"/><circle cx="8" cy="0" r="3"/>
          <circle cx="0" cy="-8" r="3"/><circle cx="0" cy="8" r="3"/>
          <circle cx="-6" cy="-6" r="2.5"/><circle cx="6" cy="-6" r="2.5"/>
          <circle cx="-6" cy="6" r="2.5"/><circle cx="6" cy="6" r="2.5"/>
        </g>

        <!-- Certificate ID -->
        <text x="730" y="56" font-family="'Inter', sans-serif" font-size="7" font-weight="900" fill="#9E7A44" text-anchor="end" letter-spacing="1">CERTIFICATE ID</text>
        <text x="730" y="70" font-family="'Inter', sans-serif" font-size="9" font-weight="800" fill="#7C1522" text-anchor="end">${certId}</text>

        <!-- Top Header Logo (Flower Key) -->
        <g transform="translate(400, 52)" fill="#7C1522">
          <circle cx="0" cy="-14" r="6"/>
          <circle cx="-10" cy="-14" r="4"/><circle cx="10" cy="-14" r="4"/>
          <circle cx="0" cy="-24" r="4"/><circle cx="0" cy="-4" r="4"/>
          <circle cx="-7" cy="-21" r="3"/><circle cx="7" cy="-21" r="3"/>
          <circle cx="-7" cy="-7" r="3"/><circle cx="7" cy="-7" r="3"/>
          <rect x="-2.5" y="0" width="5" height="28" rx="1"/>
          <rect x="2.5" y="10" width="7" height="3.5"/>
          <rect x="2.5" y="18" width="7" height="3.5"/>
        </g>

        <text x="400" y="102" font-family="'Georgia', serif" font-size="18" font-weight="700" fill="#7C1522" text-anchor="middle" letter-spacing="1">Ordo</text>
        <text x="400" y="152" font-family="'Georgia', serif" font-size="44" font-weight="700" fill="#1C1F24" text-anchor="middle" letter-spacing="4">CERTIFICATE</text>
        <text x="400" y="176" font-family="'Inter', sans-serif" font-size="10.5" font-weight="900" fill="#7C1522" text-anchor="middle" letter-spacing="3.5">OF AGENT EXCELLENCE</text>
        
        <line x1="260" y1="192" x2="540" y2="192" stroke="#C5A880" stroke-width="1.2"/>
        <circle cx="400" cy="192" r="3.5" fill="#7C1522"/>

        <text x="400" y="222" font-family="'Inter', sans-serif" font-size="9" font-weight="800" fill="#9E7A44" text-anchor="middle" letter-spacing="2">THIS CERTIFIES THAT</text>
        <text x="400" y="272" font-family="'Georgia', serif" font-size="38" font-weight="700" fill="#7C1522" text-anchor="middle">${name}</text>

        <!-- Published Pill Badge -->
        <rect x="325" y="290" width="150" height="22" rx="11" fill="#7C1522" fill-opacity="0.08"/>
        <text x="400" y="304" font-family="'Inter', sans-serif" font-size="9" font-weight="900" fill="#7C1522" text-anchor="middle" letter-spacing="1.5">PUBLISHED AGENT</text>

        <text x="400" y="336" font-family="'Inter', sans-serif" font-size="10.5" fill="#475569" text-anchor="middle">has been evaluated by Ordo's methodology and verified to meet</text>
        <text x="400" y="352" font-family="'Inter', sans-serif" font-size="10.5" fill="#475569" text-anchor="middle">the highest standards of performance, security, and transparency.</text>

        <!-- Evaluation Box -->
        <rect x="220" y="380" width="360" height="76" rx="10" fill="#FAF6F0" stroke="#E2C17C" stroke-width="1.2"/>
        <line x1="335" y1="392" x2="335" y2="444" stroke="#E2C17C" stroke-width="1"/>

        <!-- Score -->
        <text x="277" y="402" font-family="'Inter', sans-serif" font-size="8.5" font-weight="900" fill="#9E7A44" text-anchor="middle" letter-spacing="1">ORDO SCORE</text>
        <text x="277" y="432" font-family="'Inter', sans-serif" font-size="28" font-weight="800" fill="#7C1522" text-anchor="middle">${Math.round(agent.scores && agent.scores.length > 0 ? JSON.parse(agent.scores[0].hardSignalScores).githubScore * 0.5 + JSON.parse(agent.scores[0].hardSignalScores).onchainScore * 0.5 : 0)}</text>
        <text x="277" y="445" font-family="'Inter', sans-serif" font-size="8.5" font-weight="700" fill="#94A3B8" text-anchor="middle">/ 100</text>

        <!-- Star Rating -->
        <text x="460" y="402" font-family="'Inter', sans-serif" font-size="8.5" font-weight="900" fill="#9E7A44" text-anchor="middle" letter-spacing="1">OVERALL RATING</text>
        <text x="460" y="428" font-family="'Inter', sans-serif" font-size="22" fill="#7C1522" text-anchor="middle" letter-spacing="4">${keys}</text>
        <text x="460" y="443" font-family="'Inter', sans-serif" font-size="8.5" font-weight="800" fill="#7C1522" text-anchor="middle" letter-spacing="0.5">${starLabel}</text>

        <!-- Red Wax-style Stamp on the Right -->
        <g transform="translate(655, 412)">
          <path d="M 0,-38 Q -9,-38 -11,-35 Q -20,-38 -24,-31 Q -31,-31 -31,-24 Q -38,-20 -35,-11 Q -38,-9 -38,0 Q -38,9 -35,11 Q -31,20 -31,24 Q -24,31 -20,31 Q -11,35 -9,38 Q 0,38 9,38 Q 11,35 20,31 Q 24,31 31,24 Q 31,20 38,11 Q 41,9 41,0 Q 41,-9 38,-11 Q 31,-20 31,-24 Q 24,-31 20,-31 Q 11,-35 9,-38 Z" fill="#7C1522"/>
          <circle cx="0" cy="0" r="30" fill="none" stroke="#FAF6F0" stroke-width="1.2" stroke-dasharray="2 2"/>
          <text x="0" y="-18" font-family="'Inter', sans-serif" font-size="7" font-weight="900" fill="#FAF6F0" text-anchor="middle" letter-spacing="1">ORDO</text>
          
          <!-- Key icon in stamp -->
          <g transform="translate(0, -6) scale(0.6)" fill="#FAF6F0">
            <circle cx="0" cy="0" r="6"/>
            <rect x="-2" y="6" width="4" height="16" rx="1"/>
            <rect x="2" y="10" width="4" height="2"/>
            <rect x="2" y="14" width="4" height="2"/>
          </g>
          <text x="0" y="24" font-family="'Inter', sans-serif" font-size="7" font-weight="900" fill="#FAF6F0" text-anchor="middle" letter-spacing="1">VERIFIED</text>
        </g>

        <!-- Three Metadata Items Row -->
        <!-- Category -->
        <g transform="translate(180, 480)">
          <circle cx="16" cy="16" r="14" fill="#7C1522" fill-opacity="0.08"/>
          <svg x="8" y="8" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C1522" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v20M2 12h20"/>
          </svg>
          <text x="38" y="14" font-family="'Inter', sans-serif" font-size="8" font-weight="800" fill="#9E7A44" letter-spacing="1">CATEGORY</text>
          <text x="38" y="26" font-family="'Inter', sans-serif" font-size="10.5" font-weight="800" fill="#1C1F24">${agent.category.split('&')[0].trim()}</text>
        </g>
        <!-- Chain -->
        <g transform="translate(390, 480)">
          <circle cx="16" cy="16" r="14" fill="#7C1522" fill-opacity="0.08"/>
          <svg x="8" y="8" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C1522" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/><polygon points="2 17 12 22 22 17"/><polygon points="2 12 12 17 22 12"/>
          </svg>
          <text x="38" y="14" font-family="'Inter', sans-serif" font-size="8" font-weight="800" fill="#9E7A44" letter-spacing="1">CHAIN</text>
          <text x="38" y="26" font-family="'Inter', sans-serif" font-size="10.5" font-weight="800" fill="#1C1F24">${agent.chains.toUpperCase()}</text>
        </g>
        <!-- Date -->
        <g transform="translate(560, 480)">
          <circle cx="16" cy="16" r="14" fill="#7C1522" fill-opacity="0.08"/>
          <svg x="8" y="8" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C1522" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <text x="38" y="14" font-family="'Inter', sans-serif" font-size="8" font-weight="800" fill="#9E7A44" letter-spacing="1">VERIFIED ON</text>
          <text x="38" y="26" font-family="'Inter', sans-serif" font-size="9.5" font-weight="800" fill="#1C1F24">${formattedDate.slice(5, 25)} GMT</text>
        </g>

        <!-- Footer signatures and metadata -->
        <line x1="80" y1="540" x2="720" y2="540" stroke="#E2C17C" stroke-width="0.8"/>
        <line x1="380" y1="548" x2="420" y2="548" stroke="#7C1522" stroke-width="1.5"/>
        <circle cx="400" cy="548" r="2.5" fill="#9E7A44"/>

        <!-- Signature -->
        <text x="140" y="558" font-family="'Georgia', serif" font-style="italic" font-size="18" fill="#7C1522">Ordo Labs</text>
        <text x="140" y="572" font-family="'Inter', sans-serif" font-size="8" font-weight="900" fill="#94A3B8" letter-spacing="1">EDITORIAL BOARD</text>

        <!-- Bottom Center Note -->
        <text x="400" y="562" font-family="'Inter', sans-serif" font-size="8" fill="#94A3B8" text-anchor="middle">This certificate confirms that the agent has passed</text>
        <text x="400" y="572" font-family="'Inter', sans-serif" font-size="8" fill="#94A3B8" text-anchor="middle">Ordo's comprehensive evaluation process.</text>

        <!-- Authentication Box -->
        <rect x="580" y="548" width="140" height="34" rx="6" fill="none" stroke="#E2C17C" stroke-width="1"/>
        <text x="590" y="561" font-family="'Inter', sans-serif" font-size="7" font-weight="900" fill="#9E7A44" letter-spacing="0.5">AUTHENTICATION STATUS</text>
        <text x="590" y="574" font-family="'Inter', sans-serif" font-size="9" font-weight="900" fill="#7C1522" letter-spacing="0.5">ORDO VERIFIED</text>
        
        <text x="400" y="594" font-family="'Inter', sans-serif" font-size="8" font-weight="900" fill="#7C1522" text-anchor="middle" letter-spacing="1.5">ORDO -- THE STANDARD FOR WEB3 AI AGENTS</text>
      </svg>`;

      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#94A3B8" />
            <stop offset="100%" stop-color="#475569" />
          </linearGradient>
        </defs>

        <!-- Main Background Parchment -->
        <rect width="800" height="600" rx="20" fill="#FAF6F0" stroke="#475569" stroke-width="4"/>
        <rect x="15" y="15" width="770" height="570" fill="none" stroke="#475569" stroke-width="1.2"/>
        <rect x="20" y="20" width="760" height="560" fill="none" stroke="url(#silverGrad)" stroke-width="0.8" stroke-opacity="0.4"/>

        <!-- Flower Corner Ornaments -->
        <g transform="translate(45, 45)" fill="#475569">
          <circle cx="0" cy="0" r="4"/><circle cx="-8" cy="0" r="3"/><circle cx="8" cy="0" r="3"/><circle cx="0" cy="-8" r="3"/><circle cx="0" cy="8" r="3"/>
        </g>
        <g transform="translate(755, 45)" fill="#475569">
          <circle cx="0" cy="0" r="4"/><circle cx="-8" cy="0" r="3"/><circle cx="8" cy="0" r="3"/><circle cx="0" cy="-8" r="3"/><circle cx="0" cy="8" r="3"/>
        </g>
        <g transform="translate(45, 555)" fill="#475569">
          <circle cx="0" cy="0" r="4"/><circle cx="-8" cy="0" r="3"/><circle cx="8" cy="0" r="3"/><circle cx="0" cy="-8" r="3"/><circle cx="0" cy="8" r="3"/>
        </g>
        <g transform="translate(755, 555)" fill="#475569">
          <circle cx="0" cy="0" r="4"/><circle cx="-8" cy="0" r="3"/><circle cx="8" cy="0" r="3"/><circle cx="0" cy="-8" r="3"/><circle cx="0" cy="8" r="3"/>
        </g>

        <!-- Top Header Logo (Flower Key Grey) -->
        <g transform="translate(400, 52)" fill="#475569">
          <circle cx="0" cy="-14" r="6"/>
          <circle cx="-10" cy="-14" r="4"/><circle cx="10" cy="-14" r="4"/>
          <rect x="-2.5" y="0" width="5" height="28" rx="1"/>
        </g>

        <text x="400" y="102" font-family="'Georgia', serif" font-size="18" font-weight="700" fill="#475569" text-anchor="middle" letter-spacing="1">Ordo</text>
        <text x="400" y="152" font-family="'Georgia', serif" font-size="44" font-weight="700" fill="#475569" text-anchor="middle" letter-spacing="4">UNVERIFIED</text>
        <text x="400" y="176" font-family="'Inter', sans-serif" font-size="10.5" font-weight="900" fill="#E11D48" text-anchor="middle" letter-spacing="3.5">REPORT / DOSSIER RECORD</text>
        
        <line x1="260" y1="192" x2="540" y2="192" stroke="#94A3B8" stroke-width="1.2"/>
        <circle cx="400" cy="192" r="3.5" fill="#475569"/>

        <text x="400" y="222" font-family="'Inter', sans-serif" font-size="9" font-weight="800" fill="#475569" text-anchor="middle" letter-spacing="2">THIS CONCERNS THE AGENT</text>
        <text x="400" y="272" font-family="'Georgia', serif" font-size="38" font-weight="700" fill="#475569" text-anchor="middle">${name}</text>

        <rect x="315" y="290" width="170" height="22" rx="11" fill="#E11D48" fill-opacity="0.08"/>
        <text x="400" y="304" font-family="'Inter', sans-serif" font-size="9" font-weight="900" fill="#E11D48" text-anchor="middle" letter-spacing="1.5">ASSESSMENT INACTIVE</text>

        <text x="400" y="336" font-family="'Inter', sans-serif" font-size="10.5" fill="#64748B" text-anchor="middle">This agent does not hold an active Ordo Key. It either failed to meet</text>
        <text x="400" y="352" font-family="'Inter', sans-serif" font-size="10.5" fill="#64748B" text-anchor="middle">the scoring threshold or its certification status has expired/been revoked.</text>

        <!-- Right Side: Certificate Grey Stamp -->
        <g transform="translate(655, 412)">
          <path d="M 0,-38 Q -9,-38 -11,-35 Q -20,-38 -24,-31 Q -31,-31 -31,-24 Q -38,-20 -35,-11 Q -38,-9 -38,0 Q -38,9 -35,11 Q -31,20 -31,24 Q -24,31 -20,31 Q -11,35 -9,38 Q 0,38 9,38 Z" fill="#475569"/>
          <circle cx="0" cy="0" r="30" fill="none" stroke="#FAF6F0" stroke-width="1.2" stroke-dasharray="2 2"/>
          <text x="0" y="-18" font-family="'Inter', sans-serif" font-size="7" font-weight="900" fill="#FAF6F0" text-anchor="middle" letter-spacing="0.5">ORDO</text>
          <text x="0" y="6" font-family="'Inter', sans-serif" font-size="14" fill="#E11D48" text-anchor="middle">☆☆☆</text>
          <text x="0" y="24" font-family="'Inter', sans-serif" font-size="7" font-weight="900" fill="#FAF6F0" text-anchor="middle" letter-spacing="0.5">UNRATED</text>
        </g>

        <!-- Info details -->
        <g transform="translate(260, 410)">
          <text x="0" y="14" font-family="'Inter', sans-serif" font-size="9.5" font-weight="800" fill="#475569">STATUS: UNVERIFIED / EXPIRED</text>
          <text x="0" y="30" font-family="'Inter', sans-serif" font-size="11" font-style="italic" fill="#E11D48">Evaluation score fell below Ordo standards.</text>
        </g>

        <!-- Footer signatures and metadata -->
        <line x1="80" y1="540" x2="720" y2="540" stroke="#94A3B8" stroke-width="0.8"/>
        
        <text x="140" y="558" font-family="'Georgia', serif" font-style="italic" font-size="18" fill="#475569">Ordo Labs</text>
        <text x="140" y="572" font-family="'Inter', sans-serif" font-size="8" font-weight="900" fill="#94A3B8" letter-spacing="1">REGISTRY OFFICE</text>

        <rect x="580" y="548" width="140" height="34" rx="6" fill="none" stroke="#94A3B8" stroke-width="1"/>
        <text x="590" y="561" font-family="'Inter', sans-serif" font-size="7" font-weight="900" fill="#475569" letter-spacing="0.5">AUTHENTICATION STATUS</text>
        <text x="590" y="574" font-family="'Inter', sans-serif" font-size="9" font-weight="900" fill="#E11D48" letter-spacing="0.5">UNVERIFIED</text>
      </svg>`;

    return res.status(200).send(svg);
  }
}
