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
      const rawToken = process.env.GITHUB_PAT || process.env.GITHUB_TOKEN;
      const token = rawToken ? rawToken.replace(/^["']|["']$/g, '').trim() : '';

      if (token) {
        headers['Authorization'] = token.startsWith('github_pat_') || token.startsWith('ghp_') ? `Bearer ${token}` : `token ${token}`;
      } else {
        console.warn(`[INGEST WARNING] Neither GITHUB_PAT nor GITHUB_TOKEN set in environment. GitHub API calls will be unauthenticated (60 req/hr limit).`);
      }

      // Fetch repo details
      let repoRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, { headers });
      if (repoRes.status === 401 && headers['Authorization']) {
        console.warn(`[GITHUB API] Token invalid/expired (401). Retrying unauthenticated for ${owner}/${cleanRepo}...`);
        delete headers['Authorization'];
        repoRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, { headers });
      }

      if (!repoRes.ok) {
        console.warn(`[GITHUB API] Fetch repo details for ${owner}/${cleanRepo} returned status: ${repoRes.status}`);
        return { commits: 0, contributors: 0, stars: 0 };
      }
      const repoData = await repoRes.json();

      // Fetch actual commits in the last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
      let commitsRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/commits?since=${thirtyDaysAgo}&per_page=100`, { headers });
      if (commitsRes.status === 401 && headers['Authorization']) {
        delete headers['Authorization'];
        commitsRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/commits?since=${thirtyDaysAgo}&per_page=100`, { headers });
      }

      let commitsCount = 0;
      if (commitsRes.ok) {
        const commitsData = await commitsRes.json();
        if (Array.isArray(commitsData)) {
          commitsCount = commitsData.length;
        }
      } else {
        console.warn(`[GITHUB API] Fetch commits for ${owner}/${cleanRepo} returned status: ${commitsRes.status}`);
      }

      // Fetch actual contributors
      let contributorsRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/contributors?per_page=50`, { headers });
      if (contributorsRes.status === 401 && headers['Authorization']) {
        delete headers['Authorization'];
        contributorsRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/contributors?per_page=50`, { headers });
      }
      let contributorsCount = 0;
      if (contributorsRes.ok) {
        const contributorsData = await contributorsRes.json();
        if (Array.isArray(contributorsData)) {
          contributorsCount = contributorsData.length;
        }
      } else {
        console.warn(`[GITHUB API] Fetch contributors for ${owner}/${cleanRepo} returned status: ${contributorsRes.status}`);
      }

      console.log(`[GITHUB API SUCCESS] ${owner}/${cleanRepo} -> Commits(30d): ${commitsCount}, Contributors: ${contributorsCount}, Stars: ${repoData.stargazers_count || 0}`);
      return {
        commits: commitsCount,
        contributors: contributorsCount,
        stars: repoData.stargazers_count || 0,
      };
    } catch (e) {
      console.error(`Failed to fetch GitHub stats for ${owner}/${cleanRepo}:`, e.message);
      return { commits: 0, contributors: 0, stars: 0 };
    }
  }

  // 1b. Automated Security Signals Discovery
  async fetchSecuritySignals(docsUrl?: string, websiteUrl?: string, githubUrl?: string) {
    let auditExists = 0;
    let adminKeysSafe = 0;

    const urlsToProbe = [docsUrl, websiteUrl, githubUrl].filter(Boolean) as string[];
    const auditKeywords = ['audit', 'certik', 'openzeppelin', 'halborn', 'trailofbits', 'ackee', 'code4rena', 'sherlock', 'quantstamp', 'veridise'];
    const safeKeyKeywords = ['renounced', 'timelock', 'multisig', 'immutable', 'no admin', 'decentralized governance'];

    for (const url of urlsToProbe) {
      const lower = url.toLowerCase();
      if (auditKeywords.some(kw => lower.includes(kw))) {
        auditExists = 1;
      }
      if (safeKeyKeywords.some(kw => lower.includes(kw))) {
        adminKeysSafe = 1;
      }
    }

    return {
      auditExists,
      adminKeysSafe,
    };
  }

  isValidAddress(address: string, chain: string): boolean {
    const cleanAddr = address.trim();
    if (!cleanAddr || cleanAddr.toUpperCase() === 'N/A' || cleanAddr.toUpperCase() === 'NONE') {
      return false;
    }

    const c = chain.toLowerCase();
    const evmChains = ['ethereum', 'polygon', 'base', 'optimism', 'arbitrum', 'bnb chain', 'bnbchain', 'avalanche', 'berachain'];

    if (evmChains.includes(c)) {
      return /^0x[0-9a-fA-F]{40}$/.test(cleanAddr);
    }
    if (c === 'solana') {
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(cleanAddr);
    }
    if (c === 'sui') {
      return /^0x[0-9a-fA-F]{64}$/.test(cleanAddr);
    }
    if (c === 'aptos') {
      return /^0x[0-9a-fA-F]{1,64}$/.test(cleanAddr);
    }
    if (c === 'ton') {
      return /^[a-zA-Z0-9_\-]{48}$/.test(cleanAddr) || /^-?[0-9]:[0-9a-fA-F]{64}$/.test(cleanAddr);
    }
    return cleanAddr.length >= 30;
  }

  async fetchOnchainSignals(contractAddresses: string[], chains: string[]) {
    const mainChain = chains.length > 0 ? chains[0] : 'ethereum';
    const rawAddress = contractAddresses.length > 0 ? contractAddresses[0].trim() : '';
    const isValid = this.isValidAddress(rawAddress, mainChain);

    let tvl = 0;
    let txCount30d = 0;
    let activeWallets30d = 0;

    if (!isValid) {
      console.log(`[INGEST] Address "${rawAddress}" is N/A or invalid format for chain "${mainChain}". Setting TVL and transaction counts to 0.`);
      return {
        txCount30d: 0,
        activeWallets30d: 0,
        tvl: 0,
      };
    }

    const rpcUrls: Record<string, string> = {
      base: 'https://mainnet.base.org',
      ethereum: 'https://cloudflare-eth.com',
      optimism: 'https://mainnet.optimism.io',
      arbitrum: 'https://arb1.arbitrum.io/rpc',
      solana: process.env.HELIUS_API_KEY || 'https://api.mainnet-beta.solana.com'
    };

    const mainChainLower = mainChain.toLowerCase();
    const rpcUrl = rpcUrls[mainChainLower] || rpcUrls.ethereum;

    if (mainChainLower === 'solana') {
      try {
        console.log(`[SOLANA RPC] Fetching real SOL balance for address: "${rawAddress}"`);
        const balanceRes = await fetch(rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getBalance',
            params: [rawAddress]
          })
        });

        if (balanceRes.ok) {
          const data = await balanceRes.json();
          if (data && data.result && typeof data.result.value === 'number') {
            tvl = data.result.value / 1_000_000_000;
            console.log(`[SOLANA RPC] Successfully fetched real balance: ${tvl} SOL`);
          }
        }

        console.log(`[SOLANA RPC] Fetching signatures to calculate real tx frequency for: "${rawAddress}"`);
        const sigRes = await fetch(rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getSignaturesForAddress',
            params: [rawAddress, { limit: 100 }]
          })
        });

        if (sigRes.ok) {
          const sigData = await sigRes.json();
          if (sigData && sigData.result && Array.isArray(sigData.result) && sigData.result.length > 0) {
            const count = sigData.result.length;
            const newest = sigData.result[0];
            const oldest = sigData.result[sigData.result.length - 1];

            if (newest.blockTime && oldest.blockTime && newest.blockTime > oldest.blockTime) {
              const dt = newest.blockTime - oldest.blockTime; // seconds
              const tps = count / dt;
              txCount30d = Math.round(tps * 30 * 24 * 3600);
            } else {
              txCount30d = count * 300; // fallback scaling
            }
            // Estimate unique users based on typical transaction-to-user ratio (e.g. 15%)
            activeWallets30d = Math.max(5, Math.round(txCount30d * 0.15));
            // Cap to realistic limits
            txCount30d = Math.min(150000, Math.max(10, txCount30d));
            activeWallets30d = Math.min(25000, Math.max(5, activeWallets30d));
            console.log(`[SOLANA RPC] Real-time Calculated -> TxCount: ${txCount30d}, ActiveWallets: ${activeWallets30d}`);
          }
        }
      } catch (err) {
        console.warn('[SOLANA RPC] Connection failed, using fallback:', err.message);
      }
    } else {
      // EVM Chain live logs analysis
      try {
        console.log(`[EVM RPC] Querying block number from: ${rpcUrl}`);
        const blockRes = await fetch(rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_blockNumber',
            params: []
          })
        });

        if (blockRes.ok) {
          const blockData = await blockRes.json();
          if (blockData && blockData.result) {
            const latestBlockHex = blockData.result;
            const latestBlock = parseInt(latestBlockHex, 16);
            const fromBlock = latestBlock - 500; // look back 500 blocks (approx 15-20 min)

            console.log(`[EVM RPC] Fetching Transfer logs for ${rawAddress} from block ${fromBlock} to ${latestBlock}`);
            const logsRes = await fetch(rpcUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_getLogs',
                params: [{
                  address: rawAddress,
                  fromBlock: '0x' + fromBlock.toString(16),
                  toBlock: latestBlockHex,
                  topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'] // ERC20 Transfer
                }]
              })
            });

            if (logsRes.ok) {
              const logsData = await logsRes.json();
              if (logsData && logsData.result && Array.isArray(logsData.result)) {
                const logsCount = logsData.result.length;
                // Base block time is 2s, Ethereum is 12s, Optimism/Arbitrum is <1s
                const blockTime = mainChainLower === 'ethereum' ? 12 : 2;
                const timePeriod = 500 * blockTime; // seconds

                const tps = logsCount / timePeriod;
                txCount30d = Math.round(tps * 30 * 24 * 3600);

                // Collect unique wallets from topics (topics[1] = from, topics[2] = to)
                const uniqueAddressesSet = new Set<string>();
                for (const log of logsData.result) {
                  if (log.topics && log.topics.length >= 3) {
                    uniqueAddressesSet.add(log.topics[1]);
                    uniqueAddressesSet.add(log.topics[2]);
                  }
                }
                // Scale up unique address count to 30 days based on ratio
                const rate = uniqueAddressesSet.size / logsCount || 0.3;
                activeWallets30d = Math.round(txCount30d * rate);

                // Cap to realistic limits
                txCount30d = Math.min(250000, Math.max(10, txCount30d));
                activeWallets30d = Math.min(35000, Math.max(5, activeWallets30d));
                console.log(`[EVM RPC] Real-time Calculated -> TxCount: ${txCount30d}, ActiveWallets: ${activeWallets30d}`);
              }
            }
          }
        }
      } catch (err) {
        console.warn(`[EVM RPC] Live query failed for ${mainChainLower}:`, err.message);
      }
    }

    return {
      txCount30d,
      activeWallets30d,
      tvl,
    };
  }
}
