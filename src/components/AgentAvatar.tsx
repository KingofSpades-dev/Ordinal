import React, { useState } from 'react';

interface AgentAvatarProps {
  agent: {
    name: string;
    avatar?: string;
    website?: string;
    slug?: string;
  };
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

// Curated high-res Web3 logos for established networks & agents
const KNOWN_AGENT_LOGOS: Record<string, string> = {
  'bittensor': 'https://assets.coingecko.com/coins/images/29854/standard/bittensor-logo-clean-200.png',
  'bittensor (tao)': 'https://assets.coingecko.com/coins/images/29854/standard/bittensor-logo-clean-200.png',
  'fetch-ai': 'https://assets.coingecko.com/coins/images/5681/standard/Fetch.jpg',
  'fetch.ai (fet)': 'https://assets.coingecko.com/coins/images/5681/standard/Fetch.jpg',
  'virtuals-protocol': 'https://assets.coingecko.com/coins/images/33077/standard/virtuals.png',
  'virtuals protocol': 'https://assets.coingecko.com/coins/images/33077/standard/virtuals.png',
  'autonolas': 'https://assets.coingecko.com/coins/images/31034/standard/olas.png',
  'autonolas (olas)': 'https://assets.coingecko.com/coins/images/31034/standard/olas.png',
  'nosana': 'https://assets.coingecko.com/coins/images/22564/standard/nosana.png',
  'nosana (nos)': 'https://assets.coingecko.com/coins/images/22564/standard/nosana.png',
  'zerebro': 'https://assets.coingecko.com/coins/images/51015/standard/zerebro.png',
  'aixbt': 'https://assets.coingecko.com/coins/images/51761/standard/aixbt.jpg',
  'elizaos': 'https://raw.githubusercontent.com/elizaOS/eliza/main/packages/client-twitter/assets/logo.png',
  'paal-ai': 'https://assets.coingecko.com/coins/images/30748/standard/Paal.png',
  'paal ai': 'https://assets.coingecko.com/coins/images/30748/standard/Paal.png',
  'chaingpt': 'https://assets.coingecko.com/coins/images/29729/standard/ChainGPT_Logo.png',
  'chaingpt (cgpt)': 'https://assets.coingecko.com/coins/images/29729/standard/ChainGPT_Logo.png',
  'truth-terminal': 'https://assets.coingecko.com/coins/images/50787/standard/goat.jpg',
  'truth terminal': 'https://assets.coingecko.com/coins/images/50787/standard/goat.jpg',
  'myshell': 'https://assets.coingecko.com/coins/images/34947/standard/myshell.png',
  'myshell (shell)': 'https://assets.coingecko.com/coins/images/34947/standard/myshell.png',
  'heurist': 'https://assets.coingecko.com/coins/images/38600/standard/heurist.jpg',
  'heurist (heu)': 'https://assets.coingecko.com/coins/images/38600/standard/heurist.jpg',
  'pippin-agent': 'https://assets.coingecko.com/coins/images/51493/standard/pippin.png',
  'pippin': 'https://assets.coingecko.com/coins/images/51493/standard/pippin.png',
  'griffain': 'https://assets.coingecko.com/coins/images/52077/standard/griffain.jpg',
  'almanak': 'https://assets.coingecko.com/coins/images/35000/standard/almanak.png',
  '0g-labs': 'https://assets.coingecko.com/coins/images/36000/standard/0g.png',
  'clawd': 'https://avatars.githubusercontent.com/u/190847983?v=4',
  'clawd (clawd.atg.eth)': 'https://avatars.githubusercontent.com/u/190847983?v=4',
};

// Domains known to be active and have verified web favicons
const VERIFIED_FAVICON_DOMAINS: string[] = [
  'clawdbotatg.eth.link',
  'cipherworks.ai',
  'aurelia.ai',
  'elizaos.ai',
  'promethia.finance',
  'bittensor.com',
  'virtuals.io',
  'fetch.ai',
  'freysa.ai',
  'nosana.io',
  'zerebro.org',
  'aixbt.tech',
  'olas.network',
  'paal.ai',
  'chaingpt.org',
  'myshell.ai',
  'heurist.ai',
  'theoriq.ai',
  'talus.network',
  'recall.network',
  'sentient.foundation',
  'bankr.bot',
  'chaoslabs.xyz',
  'almanak.co',
  'wayfinder.ai',
  'kiteai.io',
  '0g.ai',
  'naptha.ai',
  'agentzero.ai'
];

export const getFaviconUrl = (website?: string, agentName?: string, slug?: string): string | null => {
  const key = (slug || agentName || '').toLowerCase().trim();
  if (KNOWN_AGENT_LOGOS[key]) {
    return KNOWN_AGENT_LOGOS[key];
  }

  if (!website || website === 'N/A' || website === 'NONE' || website === '') return null;

  try {
    const cleanUrl = website.startsWith('http') ? website : `https://${website}`;
    const url = new URL(cleanUrl);
    const domain = url.hostname.replace(/^www\./, '').toLowerCase();
    
    // Only attempt favicon for verified online domains or unavatar with 404 fallback
    const isKnownDomain = VERIFIED_FAVICON_DOMAINS.some(d => domain.includes(d) || d.includes(domain));
    if (isKnownDomain) {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }

    // For other domains, use DuckDuckGo favicon service (which doesn't inject blue globes)
    return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
  } catch {
    return null;
  }
};

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agent,
  size = 28,
  className = '',
  style = {}
}) => {
  const [imgError, setImgError] = useState(false);
  const slug = (agent as any).slug || agent.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const faviconUrl = !imgError ? getFaviconUrl(agent.website, agent.name, slug) : null;
  const dimension = typeof size === 'number' ? `${size}px` : size;

  if (faviconUrl) {
    return (
      <span
        className={`aside-avatar ${className}`}
        style={{
          width: dimension,
          height: dimension,
          minWidth: dimension,
          minHeight: dimension,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#fff',
          border: '1px solid var(--rule)',
          padding: '2px',
          boxSizing: 'border-box',
          verticalAlign: 'middle',
          ...style
        }}
      >
        <img
          src={faviconUrl}
          alt={`${agent.name} logo`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '50%',
            display: 'block'
          }}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </span>
    );
  }

  // Beautiful editorial monogram badge for agents without an external logo
  return (
    <span
      className={`aside-avatar ${className}`}
      style={{
        width: dimension,
        height: dimension,
        minWidth: dimension,
        minHeight: dimension,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: '#0E0D0B',
        color: '#FAF9F6',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: typeof size === 'number' ? `${Math.max(10, Math.floor(size * 0.36))}px` : '0.75rem',
        fontWeight: 700,
        letterSpacing: '-0.5px',
        verticalAlign: 'middle',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)',
        ...style
      }}
    >
      {agent.avatar || agent.name.slice(0, 2).toUpperCase()}
    </span>
  );
};
