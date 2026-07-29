import { Injectable } from '@nestjs/common';

@Injectable()
export class IngestService {
  // 1. Fetch Github telemetries
  async fetchGithubSignals(githubUrl: string) {
    if (!githubUrl) return { commits: 0, contributors: 0, stars: 0 };
    
    // Parse owner and repo from URL
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return { commits: 0, contributors: 0, stars: 0 };
    
    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, '');

    try {
      const headers: Record<string, string> = {
        'User-Agent': 'ORDO-Backend-Ingest',
      };
      if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      }

      // Fetch repo details
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, { headers });
      if (!repoRes.ok) return { commits: 0, contributors: 0, stars: 0 };
      const repoData = await repoRes.json();

      return {
        commits: Math.floor(Math.random() * 50) + 10, // Mock commits frequency for demo/compliance
        contributors: Math.floor(Math.random() * 5) + 2,
        stars: repoData.stargazers_count || 0,
      };
    } catch (e) {
      console.error(`Failed to fetch GitHub stats for ${owner}/${cleanRepo}:`, e.message);
      return { commits: 0, contributors: 0, stars: 0 };
    }
  }

  // 2. Fetch Onchain telemetries (Mock database queries for RPC metadata/events)
  async fetchOnchainSignals(contractAddresses: string[], chains: string[]) {
    return {
      txCount30d: Math.floor(Math.random() * 2000) + 150,
      activeWallets30d: Math.floor(Math.random() * 300) + 25,
      tvl: Math.floor(Math.random() * 100000),
    };
  }
}
