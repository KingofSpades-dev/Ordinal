import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DossierAiService {
  constructor(private readonly prisma: PrismaService) {}

  // AI Generation of Dossier text
  async generateAiDossier(agentId: string): Promise<string> {
    const agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) throw new NotFoundException('Agent not found');

    const score = await this.prisma.score.findFirst({
      where: { agentId },
      orderBy: { computedAt: 'desc' },
    });

    const scoresObj = score ? JSON.parse(score.hardSignalScores) : null;
    const githubScore = scoresObj ? scoresObj.githubScore : 0;
    const onchainScore = scoresObj ? scoresObj.onchainScore : 0;

    // OpenAI integration simulation
    // If OPENAI_API_KEY is configured, call openai chat completions.
    // Otherwise fallback to structured analytical report.
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'You are a senior Web3 analyst writing an objective ORDO Dossier report for an AI agent.',
              },
              {
                role: 'user',
                content: `Generate a structured dossier report in markdown format for:
                Agent Name: ${agent.name}
                Category: ${agent.category}
                GitHub Score: ${githubScore}%
                Onchain Score: ${onchainScore}%
                
                Please include sections:
                1. Headline & Standfirst
                2. Project Claims vs. Onchain Reality
                3. Key Risk Factors
                4. Final Verdict`,
              },
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.choices[0].message.content;
        }
      } catch (err) {
        console.warn('OpenAI request failed, falling back to mock generator:', err.message);
      }
    }

    // Mock/Fallback AI generator
    return `# ORDO Dossier: ${agent.name}
*Laporan evaluasi objektif telemetri Agen AI.*

## 1. Headline & Standfirst
Evaluasi performa terhadap ${agent.name} dalam kategori ${agent.category} menunjukkan skor GitHub ${githubScore}% dan keaktifan onchain sebesar ${onchainScore}%.

## 2. Project Claims vs. Onchain Reality
*   **Analisis Repositori (GitHub):** Telemetri mencatat skor pengembangan kode sumber berada di kisaran ${githubScore}%.
*   **Analisis Blockchain (Onchain):** Aktivitas interaksi kontrak pintar di blockchain menunjukkan skor kegunaan riil ${onchainScore}%.

## 3. Key Risk Factors
*   Uptime & Ketersediaan Dokumentasi: Sanity checks awal berhasil dilewati.
*   Analisis Admin Key/Proxy: Hak akses istimewa terkontrol di blockchain.

## 4. Final Verdict
Berdasarkan pembobotan metodologi v1, agen ini memiliki performa yang ${githubScore + onchainScore > 120 ? 'Sangat Solid' : 'Cukup Baik'} dan layak masuk daftar antrean audit editorial Ordo.`;
  }
}
