import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Controller('badge')
export class BadgeController {
  constructor(private readonly prisma: PrismaService) { }

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

    let scoreNum = 0;
    if (agent && agent.scores && agent.scores.length > 0) {
      try {
        const parsed = JSON.parse(agent.scores[0].hardSignalScores);
        const ghWeight = typeof parsed.githubWeight === 'number' ? parsed.githubWeight : 0.5;
        const ocWeight = typeof parsed.onchainWeight === 'number' ? parsed.onchainWeight : 0.5;
        scoreNum = Math.round((parsed.githubScore * ghWeight) + (parsed.onchainScore * ocWeight));
      } catch (e) {
        console.error('Failed to parse score JSON:', e);
      }
    }

    const awardDate = activeAward ? activeAward.awardedAt : (agent ? (agent.launchDate || agent.updatedAt) : new Date());
    const formattedDate = new Date(awardDate).toUTCString();
    const certId = `ORDO-AGT-${new Date(awardDate).toISOString().slice(0, 10).replace(/-/g, '')}-${agentId.slice(0, 5).toUpperCase()}`;

    const displayName = name;
    const displayCategory = agent ? agent.category.split('&')[0].trim() : 'Unknown';
    const displayChains = agent ? agent.chains.toUpperCase() : 'N/A';

    let svg = '';

    const isQueueHeld = agent && agent.processAfter && new Date() < new Date(agent.processAfter);

    const starsCount = isQueueHeld ? 0 : (scoreNum >= 90 ? 3 : scoreNum >= 70 ? 2 : scoreNum >= 40 ? 1 : 0);
    const starLabel = starsCount === 3 ? "THREE STARS — EXCEPTIONAL" : starsCount === 2 ? "TWO STARS — EXCELLENT" : starsCount === 1 ? "ONE STAR — NOTABLE" : "UNRATED";
    const filledStars = '★ '.repeat(starsCount);
    const emptyStars = '☆ '.repeat(3 - starsCount);
    const keys = (filledStars + emptyStars).trim();
    const finalScore = isQueueHeld ? 0 : scoreNum;

    if (starsCount >= 1 && agent) {

      svg = `<svg width="1000" height="750" viewBox="0 0 1000 750" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          /* Certificate Stylesheet */
          svg { font-family: Arial, sans-serif; }
        </style>
        <!-- Background Parchment -->
        <rect width="1000" height="750" fill="#FAF6F0"/>

        <!-- Outer Frame -->
        <rect x="25" y="25" width="950" height="700" rx="12" stroke="#7C1522" stroke-width="4"/>
        <rect x="40" y="40" width="920" height="670" rx="8" stroke="#A61D2D" stroke-width="1.5"/>
        <rect x="45" y="45" width="910" height="660" rx="6" stroke="#E2C17C" stroke-width="0.75" stroke-opacity="0.6"/>

        <!-- Decorative Corners -->
        <g fill="#7C1522">
          <!-- Top Left -->
          <g transform="translate(60, 60)">
            <circle cx="0" cy="0" r="5"/>
            <circle cx="0" cy="-10" r="3"/><circle cx="0" cy="10" r="3"/>
            <circle cx="-10" cy="0" r="3"/><circle cx="10" cy="0" r="3"/>
            <circle cx="-7" cy="-7" r="3"/><circle cx="7" cy="-7" r="3"/>
            <circle cx="-7" cy="7" r="3"/><circle cx="7" cy="7" r="3"/>
          </g>
          <!-- Top Right -->
          <g transform="translate(940, 60)">
            <circle cx="0" cy="0" r="5"/>
            <circle cx="0" cy="-10" r="3"/><circle cx="0" cy="10" r="3"/>
            <circle cx="-10" cy="0" r="3"/><circle cx="10" cy="0" r="3"/>
            <circle cx="-7" cy="-7" r="3"/><circle cx="7" cy="-7" r="3"/>
            <circle cx="-7" cy="7" r="3"/><circle cx="7" cy="7" r="3"/>
          </g>
          <!-- Bottom Left -->
          <g transform="translate(60, 690)">
            <circle cx="0" cy="0" r="5"/>
            <circle cx="0" cy="-10" r="3"/><circle cx="0" cy="10" r="3"/>
            <circle cx="-10" cy="0" r="3"/><circle cx="10" cy="0" r="3"/>
            <circle cx="-7" cy="-7" r="3"/><circle cx="7" cy="-7" r="3"/>
            <circle cx="-7" cy="7" r="3"/><circle cx="7" cy="7" r="3"/>
          </g>
          <!-- Bottom Right -->
          <g transform="translate(940, 690)">
            <circle cx="0" cy="0" r="5"/>
            <circle cx="0" cy="-10" r="3"/><circle cx="0" cy="10" r="3"/>
            <circle cx="-10" cy="0" r="3"/><circle cx="10" cy="0" r="3"/>
            <circle cx="-7" cy="-7" r="3"/><circle cx="7" cy="-7" r="3"/>
            <circle cx="-7" cy="7" r="3"/><circle cx="7" cy="7" r="3"/>
          </g>
        </g>

        <!-- Certificate ID -->
        <text x="910" y="66" font-family="Arial, sans-serif" font-size="8" font-weight="900" fill="#9E7A44" text-anchor="end" letter-spacing="1">CERTIFICATE ID</text>
        <text x="910" y="80" font-family="Arial, sans-serif" font-size="10" font-weight="800" fill="#7C1522" text-anchor="end">${certId}</text>

        <!-- Top Header Logo (Flower Key from favicon.svg next to Ordo text) - Key Enlarged 2x -->
        <g transform="translate(390, 25)">
          <!-- Key from favicon.svg, scaled to 1.1 -->
          <g transform="scale(1.1)">
            <mask id="hole-verified">
              <rect width="100%" height="100%" fill="white" />
              <circle cx="50" cy="36" r="3.5" fill="black" />
            </mask>
            <g fill="#7C1522" mask="url(#hole-verified)">
              <g transform="translate(50, 36)">
                <circle cx="0" cy="0" r="9" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(0)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(30)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(60)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(90)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(120)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(150)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(180)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(210)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(240)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(270)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(300)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(330)" />
              </g>
              <rect x="47" y="36" width="6" height="46" rx="1.5" />
              <path d="M 53 62 h 12 v 6 h -6 v 4 h 6 v 6 h -12 Z" />
            </g>
          </g>
          <!-- Text Ordo next to the key -->
          <text x="100" y="58" font-family="Georgia, serif" font-size="38" font-weight="700" fill="#7C1522" letter-spacing="0.5">Ordo</text>
        </g>

        <!-- Certificate Titles -->
        <text x="500" y="175" text-anchor="middle" font-family="Georgia, serif" font-size="48" font-weight="700" fill="#4A4F57" letter-spacing="4">CERTIFICATE</text>
        <text x="500" y="198" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="900" fill="#A61D2D" letter-spacing="6">OF AGENT EXCELLENCE</text>
        
        <line x1="320" y1="215" x2="470" y2="215" stroke="#C5A880" stroke-width="1.2"/>
        <line x1="530" y1="215" x2="680" y2="215" stroke="#C5A880" stroke-width="1.2"/>
        <circle cx="500" cy="215" r="3.5" fill="#7C1522"/>

        <!-- Certifies Text -->
        <text x="500" y="248" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="900" fill="#9E7A44" letter-spacing="2">THIS CERTIFIES THAT</text>

        <!-- Agent Name -->
        <text x="500" y="302" text-anchor="middle" font-family="Georgia, serif" font-size="34" font-weight="700" fill="#7C1522">${name}</text>

        <!-- Published Pill Badge -->
        <rect x="425" y="322" width="150" height="22" rx="11" fill="#7C1522" fill-opacity="0.08"/>
        <text x="500" y="336" text-anchor="middle" font-family="Arial, sans-serif" font-size="9.5" font-weight="900" fill="#7C1522" letter-spacing="1.5">PUBLISHED AGENT</text>

        <!-- Description -->
        <text x="500" y="378" text-anchor="middle" font-family="Arial, sans-serif" font-size="11.5" fill="#475569">has been evaluated by Ordo's methodology and verified to meet</text>
        <text x="500" y="394" text-anchor="middle" font-family="Arial, sans-serif" font-size="11.5" fill="#475569">the highest standards of performance, security, and transparency.</text>

        <!-- Score Box -->
        <rect x="250" y="430" width="380" height="92" rx="12" fill="#FAF6F0" stroke="#E2C17C" stroke-width="1.2"/>
        <line x1="370" y1="442" x2="370" y2="510" stroke="#E2C17C" stroke-width="1"/>

        <!-- Score Details -->
        <text x="310" y="452" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#9E7A44" text-anchor="middle" letter-spacing="1">ORDO SCORE</text>
        <text x="310" y="488" font-family="Georgia, serif" font-size="34" font-weight="700" fill="#A61D2D" text-anchor="middle">${finalScore}</text>
        <text x="310" y="508" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="#4A4F57" text-anchor="middle">/ 100</text>

        <!-- Rating Details -->
        <text x="500" y="452" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#9E7A44" text-anchor="middle" letter-spacing="1">OVERALL RATING</text>
        <text x="500" y="482" font-family="Arial, sans-serif" font-size="24" fill="#7C1522" text-anchor="middle" letter-spacing="4">${keys}</text>
        <text x="500" y="504" font-family="Arial, sans-serif" font-size="9" font-weight="900" fill="#7C1522" text-anchor="middle" letter-spacing="0.5">${starLabel}</text>

        <!-- Red Wax Seal Stamp (Enlarged with favicon.svg inside) -->
        <g transform="translate(740, 476) scale(1.4)">
          <path d="M 0,-38 Q -9,-38 -11,-35 Q -20,-38 -24,-31 Q -31,-31 -31,-24 Q -38,-20 -35,-11 Q -38,-9 -38,0 Q -38,9 -35,11 Q -31,20 -31,24 Q -24,31 -20,31 Q -11,35 -9,38 Q 0,38 9,38 Q 11,35 20,31 Q 24,31 31,24 Q 31,20 38,11 Q 41,9 41,0 Q 41,-9 38,-11 Q 31,-20 31,-24 Q 24,-31 20,-31 Q 11,-35 9,-38 Z" fill="#7C1522"/>
          <circle cx="0" cy="0" r="30" fill="none" stroke="#FAF6F0" stroke-width="1.2" stroke-dasharray="2 2"/>
          <text x="0" y="-20" font-family="Arial, sans-serif" font-size="6.5" font-weight="900" fill="#FAF6F0" text-anchor="middle" letter-spacing="0.7">ORDO</text>
          
          <!-- Flower Key from favicon.svg, scaled and centered inside stamp -->
          <g transform="translate(-20, -18) scale(0.4)" fill="#FAF6F0">
            <mask id="hole-stamp-verified">
              <rect width="100%" height="100%" fill="white" />
              <circle cx="50" cy="36" r="3.5" fill="black" />
            </mask>
            <g fill="#FAF6F0" mask="url(#hole-stamp-verified)">
              <g transform="translate(50, 36)">
                <circle cx="0" cy="0" r="9" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(0)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(30)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(60)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(90)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(120)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(150)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(180)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(210)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(240)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(270)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(300)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(330)" />
              </g>
              <rect x="47" y="36" width="6" height="46" rx="1.5" />
              <path d="M 53 62 h 12 v 6 h -6 v 4 h 6 v 6 h -12 Z" />
            </g>
          </g>
          <text x="0" y="24" font-family="Arial, sans-serif" font-size="6.5" font-weight="900" fill="#FAF6F0" text-anchor="middle" letter-spacing="0.7">VERIFIED</text>
        </g>
        
        <!-- Bottom Columns -->
        <!-- Category -->
        <g transform="translate(140, 560)">
          <circle cx="16" cy="16" r="14" fill="#7C1522" fill-opacity="0.08"/>
          <svg x="8" y="8" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C1522" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v20M2 12h20"/>
          </svg>
          <text x="38" y="14" font-family="Arial, sans-serif" font-size="8" font-weight="800" fill="#9E7A44" letter-spacing="1">CATEGORY</text>
          <text x="38" y="28" font-family="Arial, sans-serif" font-size="11.5" font-weight="800" fill="#1C1F24">${agent.category.split('&')[0].trim()}</text>
        </g>
        <!-- Chain -->
        <g transform="translate(390, 560)">
          <circle cx="16" cy="16" r="14" fill="#7C1522" fill-opacity="0.08"/>
          <svg x="8" y="8" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C1522" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/><polygon points="2 17 12 22 22 17"/><polygon points="2 12 12 17 22 12"/>
          </svg>
          <text x="38" y="14" font-family="Arial, sans-serif" font-size="8" font-weight="800" fill="#9E7A44" letter-spacing="1">CHAIN</text>
          <text x="38" y="28" font-family="Arial, sans-serif" font-size="11.5" font-weight="800" fill="#1C1F24">${agent.chains.toUpperCase()}</text>
        </g>
        <!-- Verified On / Status -->
        <g transform="translate(620, 560)">
          <circle cx="16" cy="16" r="14" fill="#7C1522" fill-opacity="0.08"/>
          <svg x="8" y="8" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C1522" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <text x="38" y="14" font-family="Arial, sans-serif" font-size="8" font-weight="800" fill="#9E7A44" letter-spacing="1">VERIFIED ON</text>
          <text x="38" y="28" font-family="Arial, sans-serif" font-size="10" font-weight="800" fill="#1C1F24">${formattedDate.slice(5, 25)} GMT</text>
        </g>

        <!-- Footer signatures -->
        <line x1="120" y1="630" x2="880" y2="630" stroke="#E2C17C" stroke-width="0.8"/>
        <line x1="480" y1="638" x2="520" y2="638" stroke="#7C1522" stroke-width="1.5"/>
        <circle cx="500" cy="638" r="2.5" fill="#9E7A44"/>

        <!-- Signature -->
        <text x="140" y="652" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#7C1522">Ordo Labs</text>
        <text x="140" y="666" font-family="Arial, sans-serif" font-size="8" font-weight="900" fill="#94A3B8" letter-spacing="1">EDITORIAL BOARD</text>

        <!-- Center Note -->
        <text x="500" y="654" font-family="Arial, sans-serif" font-size="8" fill="#94A3B8" text-anchor="middle">This certificate confirms that the agent has passed</text>
        <text x="500" y="664" font-family="Arial, sans-serif" font-size="8" fill="#94A3B8" text-anchor="middle">Ordo's comprehensive evaluation process.</text>

        <!-- Authentication Box -->
        <rect x="740" y="640" width="140" height="34" rx="6" fill="none" stroke="#E2C17C" stroke-width="1"/>
        <text x="750" y="651" font-family="Arial, sans-serif" font-size="7" font-weight="900" fill="#9E7A44" letter-spacing="0.5">AUTHENTICATION STATUS</text>
        <text x="750" y="664" font-family="Arial, sans-serif" font-size="9" font-weight="900" fill="#7C1522" letter-spacing="0.5">ORDO VERIFIED</text>
        
        <text x="500" y="700" font-family="Arial, sans-serif" font-size="9" font-weight="900" fill="#7C1522" text-anchor="middle" letter-spacing="1.5">ORDO -- THE STANDARD FOR WEB3 AI AGENTS</text>
      </svg>`;
    } else {
      svg = `<svg width="1000" height="750" viewBox="0 0 1000 750" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          /* Certificate Stylesheet */
          svg { font-family: Arial, sans-serif; }
        </style>
        <!-- Background Parchment -->
        <rect width="1000" height="750" fill="#FAF6F0"/>

        <!-- Outer Frame -->
        <rect x="25" y="25" width="950" height="700" rx="12" stroke="#475569" stroke-width="4"/>
        <rect x="40" y="40" width="920" height="670" rx="8" stroke="#94A3B8" stroke-width="1.5"/>
        <rect x="45" y="45" width="910" height="660" rx="6" stroke="#94A3B8" stroke-width="0.75" stroke-opacity="0.4"/>

        <!-- Decorative Corners -->
        <g fill="#475569">
          <!-- Top Left -->
          <g transform="translate(60, 60)">
            <circle cx="0" cy="0" r="5"/>
            <circle cx="0" cy="-10" r="3"/><circle cx="0" cy="10" r="3"/>
            <circle cx="-10" cy="0" r="3"/><circle cx="10" cy="0" r="3"/>
            <circle cx="-7" cy="-7" r="3"/><circle cx="7" cy="-7" r="3"/>
            <circle cx="-7" cy="7" r="3"/><circle cx="7" cy="7" r="3"/>
          </g>
          <!-- Top Right -->
          <g transform="translate(940, 60)">
            <circle cx="0" cy="0" r="5"/>
            <circle cx="0" cy="-10" r="3"/><circle cx="0" cy="10" r="3"/>
            <circle cx="-10" cy="0" r="3"/><circle cx="10" cy="0" r="3"/>
            <circle cx="-7" cy="-7" r="3"/><circle cx="7" cy="-7" r="3"/>
            <circle cx="-7" cy="7" r="3"/><circle cx="7" cy="7" r="3"/>
          </g>
          <!-- Bottom Left -->
          <g transform="translate(60, 690)">
            <circle cx="0" cy="0" r="5"/>
            <circle cx="0" cy="-10" r="3"/><circle cx="0" cy="10" r="3"/>
            <circle cx="-10" cy="0" r="3"/><circle cx="10" cy="0" r="3"/>
            <circle cx="-7" cy="-7" r="3"/><circle cx="7" cy="-7" r="3"/>
            <circle cx="-7" cy="7" r="3"/><circle cx="7" cy="7" r="3"/>
          </g>
          <!-- Bottom Right -->
          <g transform="translate(940, 690)">
            <circle cx="0" cy="0" r="5"/>
            <circle cx="0" cy="-10" r="3"/><circle cx="0" cy="10" r="3"/>
            <circle cx="-10" cy="0" r="3"/><circle cx="10" cy="0" r="3"/>
            <circle cx="-7" cy="-7" r="3"/><circle cx="7" cy="-7" r="3"/>
            <circle cx="-7" cy="7" r="3"/><circle cx="7" cy="7" r="3"/>
          </g>
        </g>

        <!-- Certificate ID -->
        <text x="910" y="66" font-family="Arial, sans-serif" font-size="8" font-weight="900" fill="#94A3B8" text-anchor="end" letter-spacing="1">CERTIFICATE ID</text>
        <text x="910" y="80" font-family="Arial, sans-serif" font-size="10" font-weight="800" fill="#475569" text-anchor="end">${certId}</text>

        <!-- Top Header Logo (Flower Key Grey from favicon.svg next to Ordo text) - Key Enlarged 2x -->
        <g transform="translate(390, 25)">
          <!-- Key from favicon.svg, scaled to 1.1 -->
          <g transform="scale(1.1)">
            <mask id="hole-unverified">
              <rect width="100%" height="100%" fill="white" />
              <circle cx="50" cy="36" r="3.5" fill="black" />
            </mask>
            <g fill="#475569" mask="url(#hole-unverified)">
              <g transform="translate(50, 36)">
                <circle cx="0" cy="0" r="9" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(0)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(30)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(60)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(90)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(120)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(150)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(180)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(210)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(240)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(270)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(300)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(330)" />
              </g>
              <rect x="47" y="36" width="6" height="46" rx="1.5" />
              <path d="M 53 62 h 12 v 6 h -6 v 4 h 6 v 6 h -12 Z" />
            </g>
          </g>
          <!-- Text Ordo next to the key -->
          <text x="100" y="58" font-family="Georgia, serif" font-size="38" font-weight="700" fill="#475569" letter-spacing="0.5">Ordo</text>
        </g>

        <!-- Certificate Titles -->
        <text x="500" y="175" text-anchor="middle" font-family="Georgia, serif" font-size="48" font-weight="700" fill="#475569" letter-spacing="4">UNVERIFIED</text>
        <text x="500" y="198" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="900" fill="#E11D48" letter-spacing="6">REPORT / DOSSIER RECORD</text>
        
        <line x1="320" y1="215" x2="470" y2="215" stroke="#94A3B8" stroke-width="1.2"/>
        <line x1="530" y1="215" x2="680" y2="215" stroke="#94A3B8" stroke-width="1.2"/>
        <circle cx="500" cy="215" r="3.5" fill="#475569"/>

        <!-- Certifies Text -->
        <text x="500" y="248" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="900" fill="#64748B" letter-spacing="2">THIS CONCERNS THE AGENT</text>

        <!-- Agent Name -->
        <text x="500" y="302" text-anchor="middle" font-family="Georgia, serif" font-size="34" font-weight="700" fill="#475569">${displayName}</text>

        <!-- Published Pill Badge -->
        <rect x="415" y="322" width="170" height="22" rx="11" fill="#E11D48" fill-opacity="0.08"/>
        <text x="500" y="336" text-anchor="middle" font-family="Arial, sans-serif" font-size="9.5" font-weight="900" fill="#E11D48" letter-spacing="1.5">ASSESSMENT INACTIVE</text>

        <!-- Description -->
        <text x="500" y="378" text-anchor="middle" font-family="Arial, sans-serif" font-size="11.5" fill="#64748B">This agent does not hold an active Ordo Key. It either failed to meet</text>
        <text x="500" y="394" text-anchor="middle" font-family="Arial, sans-serif" font-size="11.5" fill="#64748B">the scoring threshold or its certification status has expired/been revoked.</text>

        <!-- Score Box -->
        <rect x="250" y="430" width="380" height="92" rx="12" fill="#FAF6F0" stroke="#94A3B8" stroke-width="1.2"/>
        <line x1="370" y1="442" x2="370" y2="510" stroke="#94A3B8" stroke-width="1"/>

        <!-- Score Details -->
        <text x="310" y="452" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#64748B" text-anchor="middle" letter-spacing="1">ORDO SCORE</text>
        <text x="310" y="488" font-family="Georgia, serif" font-size="34" font-weight="700" fill="#475569" text-anchor="middle">${finalScore}</text>
        <text x="310" y="508" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="#64748B" text-anchor="middle">/ 100</text>

        <!-- Rating Details -->
        <text x="500" y="452" font-family="Arial, sans-serif" font-size="8.5" font-weight="900" fill="#64748B" text-anchor="middle" letter-spacing="1">OVERALL RATING</text>
        <text x="500" y="482" font-family="Arial, sans-serif" font-size="24" fill="#E11D48" text-anchor="middle" letter-spacing="4">☆☆☆</text>
        <text x="500" y="504" font-family="Arial, sans-serif" font-size="9" font-weight="900" fill="#E11D48" text-anchor="middle" letter-spacing="0.5">UNRATED</text>

        <!-- Grey Wax Seal Stamp (Enlarged with favicon.svg inside) -->
        <g transform="translate(740, 476) scale(1.4)">
          <path d="M 0,-38 Q -9,-38 -11,-35 Q -20,-38 -24,-31 Q -31,-31 -31,-24 Q -38,-20 -35,-11 Q -38,-9 -38,0 Q -38,9 -35,11 Q -31,20 -31,24 Q -24,31 -20,31 Q -11,35 -9,38 Q 0,38 9,38 Q 11,35 20,31 Q 24,31 31,24 Q 31,20 38,11 Q 41,9 41,0 Q 41,-9 38,-11 Q 31,-20 31,-24 Q 24,-31 20,-31 Q 11,-35 9,-38 Z" fill="#475569"/>
          <circle cx="0" cy="0" r="30" fill="none" stroke="#FAF6F0" stroke-width="1.2" stroke-dasharray="2 2"/>
          <text x="0" y="-20" font-family="Arial, sans-serif" font-size="6.5" font-weight="900" fill="#FAF6F0" text-anchor="middle" letter-spacing="0.7">ORDO</text>
          
          <!-- Flower Key from favicon.svg, scaled and centered inside stamp -->
          <g transform="translate(-20, -18) scale(0.4)" fill="#FAF6F0">
            <mask id="hole-stamp-unverified">
              <rect width="100%" height="100%" fill="white" />
              <circle cx="50" cy="36" r="3.5" fill="black" />
            </mask>
            <g fill="#FAF6F0" mask="url(#hole-stamp-unverified)">
              <g transform="translate(50, 36)">
                <circle cx="0" cy="0" r="9" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(0)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(30)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(60)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(90)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(120)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(150)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(180)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(210)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(240)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(270)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(300)" />
                <rect x="-3" y="-24" width="6" height="12" rx="3" transform="rotate(330)" />
              </g>
              <rect x="47" y="36" width="6" height="46" rx="1.5" />
              <path d="M 53 62 h 12 v 6 h -6 v 4 h 6 v 6 h -12 Z" />
            </g>
          </g>
          <text x="0" y="24" font-family="Arial, sans-serif" font-size="6.5" font-weight="900" fill="#FAF6F0" text-anchor="middle" letter-spacing="0.7">UNRATED</text>
        </g>

        <!-- Bottom Columns -->
        <!-- Category -->
        <g transform="translate(140, 560)">
          <circle cx="16" cy="16" r="14" fill="#475569" fill-opacity="0.08"/>
          <svg x="8" y="8" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v20M2 12h20"/>
          </svg>
          <text x="38" y="14" font-family="Arial, sans-serif" font-size="8" font-weight="800" fill="#64748B" letter-spacing="1">CATEGORY</text>
          <text x="38" y="28" font-family="Arial, sans-serif" font-size="11.5" font-weight="800" fill="#475569">${displayCategory}</text>
        </g>
        <!-- Chain -->
        <g transform="translate(390, 560)">
          <circle cx="16" cy="16" r="14" fill="#475569" fill-opacity="0.08"/>
          <svg x="8" y="8" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/><polygon points="2 17 12 22 22 17"/><polygon points="2 12 12 17 22 12"/>
          </svg>
          <text x="38" y="14" font-family="Arial, sans-serif" font-size="8" font-weight="800" fill="#64748B" letter-spacing="1">CHAIN</text>
          <text x="38" y="28" font-family="Arial, sans-serif" font-size="11.5" font-weight="800" fill="#475569">${displayChains}</text>
        </g>
        <!-- Verified On / Status -->
        <g transform="translate(620, 560)">
          <circle cx="16" cy="16" r="14" fill="#475569" fill-opacity="0.08"/>
          <svg x="8" y="8" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <text x="38" y="14" font-family="Arial, sans-serif" font-size="8" font-weight="800" fill="#64748B" letter-spacing="1">VERIFIED ON</text>
          <text x="38" y="28" font-family="Arial, sans-serif" font-size="10" font-weight="800" fill="#475569">${formattedDate.slice(5, 25)} GMT</text>
        </g>

        <!-- Footer signatures -->
        <line x1="120" y1="630" x2="880" y2="630" stroke="#94A3B8" stroke-width="0.8"/>
        <line x1="480" y1="638" x2="520" y2="638" stroke="#475569" stroke-width="1.5"/>
        <circle cx="500" cy="638" r="2.5" fill="#64748B"/>

        <!-- Signature -->
        <text x="140" y="652" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#475569">Ordo Labs</text>
        <text x="140" y="666" font-family="Arial, sans-serif" font-size="8" font-weight="900" fill="#94A3B8" letter-spacing="1">REGISTRY OFFICE</text>

        <!-- Center Note -->
        <text x="500" y="654" font-family="Arial, sans-serif" font-size="8" fill="#94A3B8" text-anchor="middle">This certificate confirms that the agent has passed</text>
        <text x="500" y="664" font-family="Arial, sans-serif" font-size="8" fill="#94A3B8" text-anchor="middle">Ordo's comprehensive evaluation process.</text>

        <!-- Authentication Box -->
        <rect x="740" y="640" width="140" height="34" rx="6" fill="none" stroke="#94A3B8" stroke-width="1"/>
        <text x="750" y="651" font-family="Arial, sans-serif" font-size="7" font-weight="900" fill="#64748B" letter-spacing="0.5">AUTHENTICATION STATUS</text>
        <text x="750" y="664" font-family="Arial, sans-serif" font-size="9" font-weight="900" fill="#E11D48" letter-spacing="0.5">UNVERIFIED</text>
        
        <text x="500" y="700" font-family="Arial, sans-serif" font-size="9" font-weight="900" fill="#475569" text-anchor="middle" letter-spacing="1.5">ORDO -- THE STANDARD FOR WEB3 AI AGENTS</text>
      </svg>`;
    }

    return res.status(200).send(svg);
  }
}
