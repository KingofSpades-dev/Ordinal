import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { OrdoNavbar } from './components/OrdoNavbar'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '');

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (ref.current) {
              ref.current.classList.add('visible');
            }
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}



const OrdoKeyIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    style={{ width: `${size}px`, height: `${size}px`, color: 'var(--accent)' }}
  >
    <g transform="translate(50, 38)">
      {Array.from({ length: 12 }).map((_, i) => (
        <rect
          key={i}
          x="-3"
          y="-24"
          width="6"
          height="12"
          rx="3"
          transform={`rotate(${i * 30})`}
        />
      ))}
      <circle cx="0" cy="0" r="9" />
      <circle cx="0" cy="0" r="3.5" fill="var(--paper, #F5F0E8)" />
    </g>
    <rect x="47" y="38" width="6" height="42" rx="1.5" />
    <path d="M 53 62 h 12 v 6 h -6 v 4 h 6 v 6 h -12 Z" />
  </svg>
);

function AgentFavicon({ websiteUrl, name, size = 48, className = '' }: { websiteUrl?: string; name: string; size?: number; className?: string }) {
  const [imgError, setImgError] = useState(false);

  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flex: 'none',
    textTransform: 'uppercase'
  };

  const renderFallback = () => {
    return (
      <div
        className={className}
        style={{
          ...containerStyle,
          background: 'var(--paper)',
          border: '1.5px solid var(--line-2)'
        }}
      >
        <OrdoKeyIcon size={Math.round(size * 0.6)} />
      </div>
    );
  };

  if (!websiteUrl || imgError) {
    return renderFallback();
  }

  try {
    const url = new URL(websiteUrl);
    const domain = url.hostname;
    const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}&default=404`;

    return (
      <div
        className={className}
        style={{
          ...containerStyle,
          background: 'transparent'
        }}
      >
        <img
          src={faviconUrl}
          alt={`${name} favicon`}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
    );
  } catch (e) {
    return renderFallback();
  }
}

const MODEL_DETAILS: Record<string, {
  name: string;
  badge: string;
  role: string;
  iconClass: string;
  iconSvg: ReactNode;
  summary: string;
  features: Array<{
    title: string;
    desc: string;
    iconSvg: ReactNode;
  }>;
}> = {
  claude: {
    name: "Claude Fable 5",
    badge: "Analysis & Report",
    role: "// automated Dossier drafting",
    iconClass: "claude",
    iconSvg: (
      <img src="/logos/claude.jpg" alt="Claude Fable 5" style={{ width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover' }} />
    ),
    summary: "Reads the agent's docs, contracts, and on-chain footprint, then drafts the structured review and scores each criterion against our published rubric.",
    features: [
      {
        title: "Document Intelligence",
        desc: "Deep contextual extraction across whitepapers, technical documentation, API specifications, and architecture diagrams to map out core capabilities and operational boundaries.",
        iconSvg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b05446" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
      },
      {
        title: "Contract & Code Reading",
        desc: "Automated static and dynamic inspection of deployed smart contract bytecodes, GitHub repositories, admin permissions, and proxy upgrade patterns to verify immutable trust.",
        iconSvg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b05446" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
      },
      {
        title: "On-chain Footprint Analysis",
        desc: "Continuous monitoring of live wallet interactions, TVL trends, transaction velocity, liquidity routing, and cross-protocol dependencies directly from blockchain ledgers.",
        iconSvg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b05446" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
      },
      {
        title: "Structured Report Drafting",
        desc: "Synthesizing multi-source empirical data into standardized Dossier evaluations, systematically scoring each criterion against our published editorial rubric.",
        iconSvg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b05446" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
      }
    ]
  },
  nano: {
    name: "Nano Banana",
    badge: "Visual Record",
    role: "// generated imagery",
    iconClass: "nano",
    iconSvg: (
      <img src="/logos/nano.jpg" alt="Nano Banana" style={{ width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover' }} />
    ),
    summary: "Produces every agent's visual profile, including cover imagery, product stills, and diagram plates, for a consistent, editorial-grade dossier.",
    features: [
      {
        title: "Cover Imagery",
        desc: "High-resolution thematic editorial cover artwork tailored specifically to reflect each AI agent's domain identity and publication aesthetic.",
        iconSvg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e5b938" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
      },
      {
        title: "Product Stills",
        desc: "Studio-grade visual captures showcasing agent user interfaces (UI), terminal consoles, dashboard layouts, and interactive workflow previews.",
        iconSvg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e5b938" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
      },
      {
        title: "Diagram Plates",
        desc: "Vector-quality architectural blueprints rendering sequence flows, data pipelines, and complex multi-agent network interactions with precision.",
        iconSvg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e5b938" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
      },
      {
        title: "Visual Consistency",
        desc: "Strict enforcement of brand identity guidelines, harmonious color palettes, and editorial typography across all Dossier visual assets.",
        iconSvg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e5b938" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a7 7 0 1 0 7 7" /></svg>
      }
    ]
  },
  grok: {
    name: "Grok",
    badge: "Real-Time Signal",
    role: "// live X & social",
    iconClass: "grok",
    iconSvg: (
      <img src="/logos/grok.png" alt="Grok" style={{ width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover', background: '#000' }} />
    ),
    summary: "Tracks each agent's activity on X and across community channels in real time, surfacing momentum, warnings, and sentiment as it happens.",
    features: [
      {
        title: "Live X Monitoring",
        desc: "Continuous 24/7 web socket monitoring of X (Twitter) feeds, developer updates, official announcements, and community discussions.",
        iconSvg: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        )
      },
      {
        title: "Sentiment Analysis",
        desc: "Natural language processing (NLP) to parse public trust scores, community perception, developer engagement, and tone velocity surrounding agent listings.",
        iconSvg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111418" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
      },
      {
        title: "Momentum Detection",
        desc: "Early identification of organic virality spikes, transaction volume surges, community growth trends, and developer activity acceleration.",
        iconSvg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111418" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
      },
      {
        title: "Risk Alerts",
        desc: "Immediate automated warnings for sudden sentiment drops, key contributor changes, potential smart contract exploits, or anomaly events.",
        iconSvg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111418" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
      }
    ]
  }
};

function App() {
  const [stats, setStats] = useState<any>(null);
  const [agentsList, setAgentsList] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [activeModelModal, setActiveModelModal] = useState<typeof MODEL_DETAILS['claude'] | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const statsRes = await fetch(`${API_URL}/api/v1/editorial/stats`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        const agentsRes = await fetch(`${API_URL}/api/v1/agents/public-rankings`);
        if (agentsRes.ok) {
          const agentsData = await agentsRes.json();
          setAgentsList(agentsData);
        }
      } catch (err) {
        console.error('Failed to load home page data:', err);
      }
    }
    loadData();
  }, []);

  const chains = [
    ['', '#14F195', '◎', '/chains/solana.svg'],
    ['Polygon', '#8247E5', 'P', '/chains/polygon.svg'],
    ['', '#0052FF', 'B', '/chains/base.svg'],
    ['Optimism', '#FF0420', 'O', '/chains/optimism.svg'],
    ['', '#28A0F0', 'A', '/chains/arbitrum.svg'],
    ['BNB Chain', '#F0B90B', 'B', '/chains/bnb.svg'],
    ['', '#627EEA', 'Ξ', '/chains/ethereum.svg'],
    ['Avalanche', '#E84142', 'A', '/chains/avalanche.svg'],
    ['', '#4DA2FF', 'S', '/chains/sui.svg'],
    ['', '#06F7C7', 'A', '/chains/aptos.svg'],
    ['TON', '#0098EA', 'T', '/chains/ton.svg'],
    ['', '#845A2B', 'B', '/chains/berachain.svg']
  ];

  // Map real agents from database, fall back to placeholders if empty
  const agents = agentsList.length > 0
    ? agentsList.map(a => [a.name, a.category.slice(0, 3).toUpperCase(), '#1B2A4A', a])
    : [
      ['Sentinel AI', 'SEC', '#1B2A4A'],
      ['Nexus', 'INF', '#2B3A22'],
      ['Oracle Prime', 'RES', '#3A2438'],
      ['Vault Guard', 'SEC', '#14343A'],
      ['DevForge', 'INF', '#3A2E14'],
      ['AlphaScope', 'RES', '#233A3A'],
      ['Helm', 'TRD', '#3A1E1E'],
      ['Beacon', 'SEC', '#1E2A3A'],
      ['Cortex', 'INF', '#2A1E3A'],
      ['Ledger Eye', 'RES', '#3A331E'],
      ['Momentum', 'TRD', '#1E3A2E'],
      ['Warden', 'SEC', '#33223A']
    ];

  // For infinite scroll, double the arrays
  const extendedChains = [...chains, ...chains];
  const extendedAgents = [...agents, ...agents];

  return (
    <>
      {/* Ticker */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track" id="tickerTrack">
          <span className="dot">✦</span><span>Independent editorial rankings</span>
          <span className="dot">✦</span><span>Methodology published in full</span>
          <span className="dot">✦</span><span>Verdicts you cannot buy</span>
          <span className="dot">✦</span><span>Every Dossier disclosed &amp; dated</span>
          <span className="dot">✦</span><span>Coverage across 12 chains</span>
          <span className="dot">✦</span><span>New security investigation: read now</span>

          <span className="dot">✦</span><span>Independent editorial rankings</span>
          <span className="dot">✦</span><span>Methodology published in full</span>
          <span className="dot">✦</span><span>Verdicts you cannot buy</span>
          <span className="dot">✦</span><span>Every Dossier disclosed &amp; dated</span>
          <span className="dot">✦</span><span>Coverage across 12 chains</span>
          <span className="dot">✦</span><span>New security investigation: read now</span>
        </div>
      </div>

      {/* Reusable Ordo Navbar */}
      <OrdoNavbar currentPath="/" />

      {/* Hero */}
      <header className="hero-section">
        <div className="wrap hero-container">
          <div className="hero-bg-wrapper">
            <img src="/hero_transparent.png" alt="Ordo Illustration" className="hero-bg-img" />
          </div>
          <div className="hero-left">
            <Reveal delay={100}>
              <h1 className="hero">The Standard for Web3 AI Agents</h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="hero-sub">
                We evaluate AI agents with objective, on-chain data and transparent methodology.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="hero-actions">
                <a href="#rankings" className="btn-primary">Explore Ratings</a>
                <a href="#method" className="btn-secondary">Read Methodology</a>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="wrap">
          <Reveal delay={400}>
            <div className="hero-meta">
              <div className="stat"><div className="n mono">{stats?.categories ? Object.keys(stats.categories).length : 4}</div><div className="l">Curated categories</div></div>
              <div className="stat"><div className="n mono">12</div><div className="l">Chains covered</div></div>
              <div className="stat"><div className="n mono">{stats?.totalDossiers !== undefined ? stats.totalDossiers : 0}</div><div className="l">Dossiers published</div></div>
              <div className="stat"><div className="n mono">{stats?.totalKeyAwardsSum !== undefined ? stats.totalKeyAwardsSum : (stats ? (stats.totalThreeKeyAwards + stats.totalTwoKeyAwards + stats.totalOneKeyAwards) : 0)}</div><div className="l">Key awards</div></div>
            </div>
          </Reveal>
        </div>
      </header>

      {/* Marquee Band (Chains) */}
      <div className="marquee-band">
        <div className="wrap">
          <div className="marquee-label">Agents we cover, listed across</div>
          <div className="marquee">
            <div className="marquee-track" id="chainTrack">
              {extendedChains.map(([name, color, _symbol, logoPath], idx) => {
                const isOnlyLogo = !name || name.trim() === '';
                return (
                  <div key={`chain-${idx}`} className="chip">
                    <span
                      className="glyph"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0px',
                        width: isOnlyLogo ? 'auto' : '50px',
                        height: '50px'
                      }}
                    >
                      <img src={logoPath} alt={name} style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
                    </span>
                    {!isOnlyLogo && <span className="name" style={{ color: color }}>{name}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section id="categories">
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <span className="eyebrow">The scope · Version I</span>
              <h2>We start narrow, and go deep.</h2>
              <p>Authority is earned by being undeniably right about a small thing first. Four categories, each rated against evidence, not hype or follower counts.</p>
            </div>
          </Reveal>
          <div className="cats">
            <Reveal delay={50}>
              <div className="cat">
                <div className="num">01 / Flagship</div>
                <h3>Security &amp; Wallet Intelligence</h3>
                <p>Agents that catch exploits, flag malicious contracts, and protect funds. Rated on detection accuracy, false-positive rates, and audited response record.</p>
                <div className="foot"><span className="cnt">{stats?.categories?.security !== undefined ? stats.categories.security : '38'} <span>Dossiers</span></span><span className="tag">Testable</span></div>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="cat">
                <div className="num">02</div>
                <h3>Infrastructure &amp; Developer</h3>
                <p>Tooling, frameworks, and agent rails. Judged on real integration adoption, commit history, documentation quality, and uptime. These signals are hard to fake.</p>
                <div className="foot"><span className="cnt">{stats?.categories?.developer !== undefined ? stats.categories.developer : '51'} <span>Dossiers</span></span><span className="tag">Verifiable</span></div>
              </div>
            </Reveal>
            <Reveal delay={250}>
              <div className="cat">
                <div className="num">03</div>
                <h3>Research &amp; Analysis</h3>
                <p>Agents that surface signal from on-chain noise. Assessed on accuracy of calls, transparency of method, and consistency across market conditions.</p>
                <div className="foot"><span className="cnt">{stats?.categories?.research !== undefined ? stats.categories.research : '29'} <span>Dossiers</span></span><span className="tag">Reviewed</span></div>
              </div>
            </Reveal>
            <Reveal delay={350}>
              <div className="cat">
                <div className="num">04</div>
                <h3>Trading Agents</h3>
                <p>Rated strictly on independently measured, multi-period, risk-adjusted performance, rather than self-reported returns. Framed as risk assessment, not advice.</p>
                <div className="foot"><span className="cnt">{stats?.categories?.trading !== undefined ? stats.categories.trading : '44'} <span>Dossiers</span></span><span className="tag">On-chain verified</span></div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Marquee Band (Agents) */}
      <div className="marquee-band tight">
        <div className="wrap">
          <div className="marquee-label">Recently profiled</div>
          <div className="marquee rev">
            <div className="marquee-track" id="agentTrack">
              {extendedAgents.map(([name, sub, _, agentRaw], idx) => (
                <div key={`agent-${idx}`} className="chip agent">
                  <AgentFavicon websiteUrl={agentRaw?.website} name={name} size={50} className="glyph" />
                  <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                    <span className="name">{name}</span>
                    <span className="sub">{sub}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rankings */}
      <section id="rankings">
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <span className="eyebrow">The Dossier · The rating</span>
              <h2>One to three stars. Earned, never sold.</h2>
              <p>Every agent gets a <b style={{ color: 'var(--ink)', fontWeight: 600 }}>Ordo Dossier</b>, which includes a full profile, scored review, and generated visual record. Our editorial verdict sits apart from community sentiment: always side by side, never blended.</p>
            </div>
          </Reveal>

          <div className="stars-legend" style={{ marginBottom: '24px' }}>
            <Reveal delay={50}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div className="star-row">
                  <div className="txt"><h4>★☆☆ Notable</h4><p style={{ fontSize: '12px' }}>A capable agent worth knowing in its category. Solid execution.</p></div>
                </div>
                <div className="star-row">
                  <div className="txt"><h4>★★☆ Excellent</h4><p style={{ fontSize: '12px' }}>Among the best in its category. Worth going out of your way to use.</p></div>
                </div>
                <div className="star-row">
                  <div className="txt"><h4>★★★ Exceptional</h4><p style={{ fontSize: '12px' }}>A category-defining agent. The standard others are measured against.</p></div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Dynamic Rankings Grid - Sorted by Score Descending */}
          <div style={{ marginTop: '30px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {[...agentsList].sort((a, b) => {
                const getScore = (ag: any) => {
                  const scoreObj = ag.scores && ag.scores.length > 0
                    ? JSON.parse(ag.scores[0].hardSignalScores)
                    : null;
                  const editorialScore = ag.scores?.[0]?.editorialScore ?? 0;
                  return scoreObj
                    ? (typeof scoreObj.finalScore === 'number'
                      ? Math.round(editorialScore + scoreObj.finalScore)
                      : Math.round(editorialScore + (scoreObj.verifiabilityScore + scoreObj.activityScore + scoreObj.maintenanceScore + scoreObj.securityScore - (scoreObj.adminPenalty || 0))))
                    : 0;
                };
                return getScore(b) - getScore(a);
              }).map((agent) => {
                const scoreObj = agent.scores && agent.scores.length > 0
                  ? JSON.parse(agent.scores[0].hardSignalScores)
                  : null;
                const starsCount = scoreObj ? scoreObj.starsCount : 0;
                const editorialScore = agent.scores?.[0]?.editorialScore ?? 0;
                const finalScore = scoreObj
                  ? (typeof scoreObj.finalScore === 'number'
                    ? Math.round(editorialScore + scoreObj.finalScore)
                    : Math.round(editorialScore + (scoreObj.verifiabilityScore + scoreObj.activityScore + scoreObj.maintenanceScore + scoreObj.securityScore - (scoreObj.adminPenalty || 0))))
                  : 0;
                const isUnrated = scoreObj?.insufficientEvidence;

                return (
                  <div
                    key={agent.id}
                    className="verdict-card"
                    style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s, border-color 0.2s' }}
                    onClick={() => setSelectedAgent(agent)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = 'var(--brass)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--line-2)';
                    }}
                  >
                    <div>
                      <div className="vc-top">
                        <AgentFavicon websiteUrl={agent.website} name={agent.name} size={48} className="vc-logo" />
                        <div className="meta">
                          <div className="nm" style={{ fontSize: '18px', fontWeight: 700 }}>{agent.name}</div>
                          <div className="cat-l" style={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '3px' }}>
                            <span>{agent.category}</span>
                            <span style={{ color: 'var(--line)' }}>|</span>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'var(--paper)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              color: 'var(--ink)'
                            }}>
                              {agent.chains.toUpperCase()}
                            </span>
                            {(() => {
                              const primaryIdentity = agent.identities?.find((id: any) => id.isPrimary) || agent.identities?.[0] || null;
                              if (!primaryIdentity) return null;
                              const verificationTier = primaryIdentity.verificationTier || 'unverified';
                              return (
                                <>

                                  <span
                                    style={{
                                      fontSize: '10px',
                                      fontWeight: 700,
                                      textTransform: 'uppercase',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      background: verificationTier === 'ownership_verified'
                                        ? 'var(--brass-soft)'
                                        : verificationTier === 'verified'
                                          ? '#e2ece9'
                                          : '#fdeded',
                                      color: verificationTier === 'ownership_verified'
                                        ? 'var(--brass)'
                                        : verificationTier === 'verified'
                                          ? '#2d6a4f'
                                          : '#d32f2f',
                                      border: `1px solid ${verificationTier === 'ownership_verified'
                                        ? 'var(--brass)'
                                        : verificationTier === 'verified'
                                          ? '#2d6a4f'
                                          : '#d32f2f'
                                        }`
                                    }}
                                  >
                                    {verificationTier === 'ownership_verified' ? '✓ OWNER VERIFIED' : verificationTier === 'verified' ? '✓ VERIFIED' : 'UNVERIFIED'}
                                  </span>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                        <div className="vc-score">
                          {isUnrated ? (
                            <div className="of" style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, color: 'var(--ink-soft)' }}>UNRATED</div>
                          ) : (
                            <>
                              <div className="big mono">{finalScore}</div>
                              <div className="of">/ 100</div>
                            </>
                          )}
                        </div>
                      </div>
                      <div style={{
                        padding: '16px 26px 0 26px',
                        fontSize: '13.5px',
                        color: 'var(--ink-soft)',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minHeight: '40px'
                      }}>
                        {agent.selectionRationale || (agent.dossiers?.[0]?.title) || (agent.keyRationale) || `${agent.name} is an autonomous ${agent.category} agent monitored on-chain on ${agent.chains.toUpperCase()}.`}
                      </div>
                    </div>
                    <div className="vc-split" style={{ marginTop: '16px', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                      <span className="tag" style={{ color: 'var(--brass)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {isUnrated ? (
                          'Registered, not rated'
                        ) : starsCount === 0 ? (
                          'Verdict · Unverified'
                        ) : (
                          <>
                            Verdict · <span style={{ fontSize: '26px', lineHeight: 1, verticalAlign: 'middle', marginTop: '-4px', letterSpacing: '-1px' }}>{'★'.repeat(starsCount)}{'☆'.repeat(3 - starsCount)}</span>
                          </>
                        )}
                      </span>
                      <span style={{ fontSize: '11px', textDecoration: 'underline', color: 'var(--brass)', fontWeight: 700 }}>View Dossier →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section id="stack" className="stack">
        <div className="wrap">
          <Reveal>
            <div className="stack-top-header">
              <div className="sec-head">
                <span className="eyebrow">How every Dossier is built</span>
                <h2>Multiple frontier models. One rigorous result.</h2>
                <p>Each Ordo Dossier is assembled by a combined AI stack, then verified by a human editor before it earns a star. No single model does the whole job. Instead, we pair each to what it does best.</p>
              </div>
              <div className="stack-badge-container">
                <div className="star-seal">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                </div>
                <div className="human-verified-card">
                  <div className="human-verified-header">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d96253" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                    <span className="human-verified-title">HUMAN VERIFIED</span>
                  </div>
                  <div className="human-verified-body">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(247,243,235,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', flexShrink: 0 }}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="human-verified-text">No automated star is published unreviewed.</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
          <div className="stack-grid">
            <Reveal delay={50}>
              <div className="scell">
                <div>
                  <span className="badge">Analysis &amp; Report</span>
                  <div className="scell-header-row">
                    <div className="scell-logo-box claude">
                      <img src="/logos/claude.jpg" alt="Claude Fable 5" style={{ width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover' }} />
                    </div>
                    <div className="scell-title-meta">
                      <h4>Claude Fable 5</h4>
                      <div className="role">// automated Dossier drafting</div>
                    </div>
                  </div>
                  <p className="scell-desc">Reads the agent's docs, contracts, and on-chain footprint, then drafts the structured review and scores each criterion against our published rubric.</p>
                  <ul className="scell-features">
                    <li>
                      <span className="feature-icon claude">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                      </span>
                      Document Intelligence
                    </li>
                    <li>
                      <span className="feature-icon claude">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                      </span>
                      Contract &amp; Code Reading
                    </li>
                    <li>
                      <span className="feature-icon claude">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                      </span>
                      On-chain Footprint Analysis
                    </li>
                    <li>
                      <span className="feature-icon claude">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </span>
                      Structured Report Drafting
                    </li>
                  </ul>
                </div>
                <div className="scell-footer" onClick={() => setActiveModelModal(MODEL_DETAILS.claude)}>
                  <span className="view-role">VIEW ROLE</span>
                  <button className="arrow-btn" aria-label="View role">→</button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="scell">
                <div>
                  <span className="badge">Visual Record</span>
                  <div className="scell-header-row">
                    <div className="scell-logo-box nano">
                      <img src="/logos/nano.jpg" alt="Nano Banana" style={{ width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover' }} />
                    </div>
                    <div className="scell-title-meta">
                      <h4>Nano Banana</h4>
                      <div className="role">// generated imagery</div>
                    </div>
                  </div>
                  <p className="scell-desc">Produces every agent's visual profile, including cover imagery, product stills, and diagram plates, for a consistent, editorial-grade dossier.</p>
                  <ul className="scell-features">
                    <li>
                      <span className="feature-icon nano">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                      </span>
                      Cover Imagery
                    </li>
                    <li>
                      <span className="feature-icon nano">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                      </span>
                      Product Stills
                    </li>
                    <li>
                      <span className="feature-icon nano">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                      </span>
                      Diagram Plates
                    </li>
                    <li>
                      <span className="feature-icon nano">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a7 7 0 1 0 7 7" /></svg>
                      </span>
                      Visual Consistency
                    </li>
                  </ul>
                </div>
                <div className="scell-footer" onClick={() => setActiveModelModal(MODEL_DETAILS.nano)}>
                  <span className="view-role">VIEW ROLE</span>
                  <button className="arrow-btn" aria-label="View role">→</button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={250}>
              <div className="scell">
                <div>
                  <span className="badge">Real-time Signal</span>
                  <div className="scell-header-row">
                    <div className="scell-logo-box grok">
                      <img src="/logos/grok.png" alt="Grok" style={{ width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover', background: '#000' }} />
                    </div>
                    <div className="scell-title-meta">
                      <h4>Grok</h4>
                      <div className="role">// live X &amp; social</div>
                    </div>
                  </div>
                  <p className="scell-desc">Tracks each agent's activity on X and across community channels in real time, surfacing momentum, warnings, and sentiment as it happens.</p>
                  <ul className="scell-features">
                    <li>
                      <span className="feature-icon grok">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </span>
                      Live X Monitoring
                    </li>
                    <li>
                      <span className="feature-icon grok">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                      </span>
                      Sentiment Analysis
                    </li>
                    <li>
                      <span className="feature-icon grok">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                      </span>
                      Momentum Detection
                    </li>
                    <li>
                      <span className="feature-icon grok">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                      </span>
                      Risk Alerts
                    </li>
                  </ul>
                </div>
                <div className="scell-footer" onClick={() => setActiveModelModal(MODEL_DETAILS.grok)}>
                  <span className="view-role">VIEW ROLE</span>
                  <button className="arrow-btn" aria-label="View role">→</button>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={350}>
            <p className="stack-note">DRAFTED BY AI · <b>VERIFIED BY A HUMAN EDITOR</b> · NO AUTOMATED STAR IS PUBLISHED UNREVIEWED</p>
          </Reveal>
        </div>
      </section>

      {/* Methodology */}
      <section className="method" id="method" style={{ padding: '80px 0', background: 'var(--paper-2, #FAF6F0)' }}>
        <div className="wrap" style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 24px' }}>
          {/* Top Row: Title & Badge Illustration */}
          <Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', marginBottom: '56px' }}>
              <div>
                <span className="eyebrow" style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '2px', color: 'var(--brass, #A37E36)', textTransform: 'uppercase' }}>
                  Trust over popularity
                </span>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '42px', fontWeight: 700, margin: '12px 0 16px 0', color: 'var(--ink, #1B2A4A)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  Every score is reproducible, and public.
                </h2>
                <p style={{ fontSize: '17px', color: 'var(--ink-soft, #5A6578)', lineHeight: 1.6, margin: 0, maxWidth: '520px' }}>
                  The fastest way to earn authority in a low-trust industry is to be auditable. Here is how an Ordo rating is built.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                  src="/images/methodology-badge.png"
                  alt="Ordo Score 92/100 Methodology Audit Seal"
                  style={{
                    maxHeight: '320px',
                    width: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 12px 28px rgba(27, 42, 74, 0.08))',
                    borderRadius: '16px'
                  }}
                />
              </div>
            </div>
          </Reveal>

          {/* Bottom Row: Steps Roadmap Diagram */}
          <Reveal delay={150}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src="/images/methodology-steps.png"
                alt="Ordo Rating Steps Roadmap Diagram: Step 1 Hard Signal Spine, Step 2 Named Editorial Layer, Step 3 Versioned Changelog"
                style={{
                  width: '100%',
                  maxWidth: '960px',
                  height: 'auto',
                  borderRadius: '16px',
                  display: 'block'
                }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Editorial */}
      <section id="editorial">
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <span className="eyebrow">The publication</span>
              <h2>A technology desk, not a directory.</h2>
              <p>Reviews, deep dives, and investigations. The work that turns a ranking into an institution people cite.</p>
            </div>
          </Reveal>
          <div className="ed-grid">
            <Reveal delay={50} className="ed lead">
              <span className="kind">Investigation</span>
              <h3>The agent that claimed 300% returns, and the wallets that tell a different story.</h3>
              <span className="date">Jul 18, 2026 · 14 min read</span>
            </Reveal>
            <Reveal delay={120} className="ed">
              <span className="kind">Technical deep dive</span>
              <h3>How the top security agents actually detect a drain, benchmarked.</h3>
              <span className="date">Jul 15, 2026</span>
            </Reveal>
            <Reveal delay={190} className="ed">
              <span className="kind">Comparative review</span>
              <h3>Six developer-agent frameworks, tested on the same workload.</h3>
              <span className="date">Jul 11, 2026</span>
            </Reveal>
            <Reveal delay={260} className="ed">
              <span className="kind">Weekly report</span>
              <h3>Ecosystem brief: 40 launches, 3 worth your attention.</h3>
              <span className="date">Jul 09, 2026</span>
            </Reveal>
            <Reveal delay={330} className="ed">
              <span className="kind">Founder interview</span>
              <h3>Building an audited agent in public: a conversation.</h3>
              <span className="date">Jul 04, 2026</span>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Holders */}
      <section id="holders" className="method">
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <span className="eyebrow">For $MRD holders</span>
              <h2>Real benefits. No influence over the verdict.</h2>
              <p>Holding the token unlocks access and status, which are the things worth paying for. It does not, and cannot, move an editorial ranking.</p>
            </div>
          </Reveal>
          <div className="holder">
            <div className="holder-list">
              <Reveal delay={50} className="hl-row">
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.6">
                    <path d="M4 7h16M4 12h16M4 17h10" />
                  </svg>
                </div>
                <div>
                  <h4>Full Dossiers, first</h4>
                  <p>Complete reviews and investigations before they reach the public feed.</p>
                </div>
              </Reveal>
              <Reveal delay={120} className="hl-row">
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.6">
                    <path d="M3 3v18h18" />
                    <path d="M7 14l3-4 3 3 5-7" />
                  </svg>
                </div>
                <div>
                  <h4>Advanced analytics &amp; on-chain data</h4>
                  <p>The full data layer behind every score, explorable.</p>
                </div>
              </Reveal>
              <Reveal delay={190} className="hl-row">
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.6">
                    <path d="M8 3H5a2 2 0 00-2 2v3m0 8v3a2 2 0 002 2h3m8 0h3a2 2 0 002-2v-3m0-8V5a2 2 0 00-2-2h-3" />
                  </svg>
                </div>
                <div>
                  <h4>API access</h4>
                  <p>Query rankings and Dossiers programmatically for your own tools.</p>
                </div>
              </Reveal>
              <Reveal delay={260} className="hl-row">
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="var(--brass)">
                    <path d="M12 2l2.6 7.1L22 9.3l-5.5 4.5L18.6 22 12 17.6 5.4 22l2.1-8.2L2 9.3l7.4-.2z" />
                  </svg>
                </div>
                <div>
                  <h4>Community Stars &amp; holder badge</h4>
                  <p>Rate agents you can prove you've used on-chain under a one holder, one vote system. Shown separately from the editorial verdict.</p>
                </div>
              </Reveal>
            </div>
            <Reveal delay={300} className="holder-note">
              <div className="eyebrow">Why the wall exists</div>
              <h3>Community sentiment and editorial verdict live side by side, and are never merged.</h3>
              <p>Holders give stars to agents they've genuinely used. That signal is shown as <b>Community Stars</b>, next to, and never inside, our independent rating. When the two diverge, that's our most interesting story.</p>
              <div className="fine">
                ONE HOLDER · ONE VOTE / NOT ONE TOKEN · ONE VOTE<br />
                STARS REQUIRE PROOF OF ON-CHAIN USE<br />
                THE TOKEN GRANTS ACCESS, NEVER RANKING POWER
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <Reveal>
        <div className="cta-band">
          <div className="wrap">
            <h2>The guide the industry <em>trusts.</em></h2>
            <p>Find the agents worth your funds, and skip the ones that aren't.</p>
            <a href="#rankings" className="btn-primary">Browse the rankings</a>
          </div>
        </div>
      </Reveal>

      {/* Footer */}
      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div className="foot-brand">
              <div className="brand">
                <svg className="brand-mark" viewBox="0 0 100 100" fill="currentColor">
                  <g transform="translate(50, 38)">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <rect
                        key={i}
                        x="-3"
                        y="-24"
                        width="6"
                        height="12"
                        rx="3"
                        transform={`rotate(${i * 30})`}
                      />
                    ))}
                    <circle cx="0" cy="0" r="9" />
                    <circle cx="0" cy="0" r="3.5" fill="var(--paper, #F5F0E8)" />
                  </g>
                  <rect x="47" y="38" width="6" height="42" rx="1.5" />
                  <path d="M 53 62 h 12 v 6 h -6 v 4 h 6 v 6 h -12 Z" />
                </svg>
                <span className="brand-name">O<b>rdo</b></span>
              </div>
              <p>The independent editorial authority for Web3 AI agents. Rankings you can trust, methodology you can read.</p>
            </div>
            <div className="foot-cols">
              <div className="foot-col">
                <h5>Rankings</h5>
                <a href="#">Security</a><a href="#">Infrastructure</a><a href="#">Research</a><a href="#">Trading</a>
              </div>
              <div className="foot-col">
                <h5>Publication</h5>
                <a href="#">Dossiers</a><a href="#">Investigations</a><a href="#">Weekly report</a><a href="#">Interviews</a>
              </div>
              <div className="foot-col">
                <h5>The Guide</h5>
                <a href="#">Methodology</a><a href="#">Editorial standards</a><a href="#">Holder benefits</a><a href="#">Submit an agent</a>
              </div>
            </div>
          </div>
          <div className="foot-bottom">
            <p>© 2026 Ordo</p>
            <p>Independent · Unbuyable · Dated</p>
          </div>
        </div>
      </footer>

      {/* Dossier Detail Modal */}
      {selectedAgent && (() => {
        const scoreObj = selectedAgent.scores && selectedAgent.scores.length > 0
          ? JSON.parse(selectedAgent.scores[0].hardSignalScores)
          : null;
        const starsCount = scoreObj ? scoreObj.starsCount : 0;
        const isUnrated = scoreObj?.insufficientEvidence;

        const dossier = selectedAgent.dossiers && selectedAgent.dossiers.length > 0
          ? selectedAgent.dossiers[0]
          : null;

        // Auto-generate limitations text if not explicitly stored
        const limitationsList = [];
        if (!selectedAgent.githubUrl || selectedAgent.githubUrl === 'N/A' || selectedAgent.githubUrl === '') {
          limitationsList.push("Open-source code repository: We could not verify the source code, developer commits, or contributor distribution.");
        }
        if (!selectedAgent.docsUrl || selectedAgent.docsUrl === 'N/A' || selectedAgent.docsUrl === '') {
          limitationsList.push("Developer integration docs: Missing integration instructions or public API schemas.");
        }
        const activeWalletsSnapshot = selectedAgent.snapshots?.find((s: any) => s.signalKey === 'active_wallets_30d');
        if (!activeWalletsSnapshot) {
          limitationsList.push("On-chain user telemetry: Unique interacting address counts could not be verified.");
        }
        const auditSnapshot = selectedAgent.snapshots?.find((s: any) => s.signalKey === 'audit_exists');
        if (!auditSnapshot || auditSnapshot.value === 0) {
          limitationsList.push("Security audits: No public smart contract audit reports were evidenced.");
        }
        const adminKeysSnapshot = selectedAgent.snapshots?.find((s: any) => s.signalKey === 'admin_keys_safe');
        if (!adminKeysSnapshot || adminKeysSnapshot.value === 0) {
          limitationsList.push("Admin control keys: Upgradeability admin key structure remains undisclosed or unrestricted.");
        }

        return (
          <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(27, 42, 74, 0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }} onClick={() => setSelectedAgent(null)}>
            <div className="modal-container" style={{
              backgroundColor: '#fff',
              border: '2px solid var(--ink)',
              borderRadius: '16px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '40px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              position: 'relative',
              color: 'var(--ink)'
            }} onClick={(e) => e.stopPropagation()}>

              <button style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '32px',
                cursor: 'pointer',
                color: 'var(--ink-soft)'
              }} onClick={() => setSelectedAgent(null)}>×</button>

              <div style={{ marginBottom: '24px' }}>
                <span className="eyebrow" style={{ textTransform: 'uppercase' }}>ORDO DOSSIER №{dossier ? dossier.dossierNumber : 'SEED'}</span>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '36px', color: 'var(--ink)', margin: '8px 0 4px 0' }}>{selectedAgent.name}</h2>
                <p style={{ color: 'var(--ink-soft)', textTransform: 'uppercase', fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>
                  {selectedAgent.category} · {selectedAgent.chains.toUpperCase()} · Methodology v0.1
                </p>
              </div>

              {/* Identity Details Block */}
              {(() => {
                const primaryIdentity = selectedAgent.identities?.find((id: any) => id.isPrimary) || selectedAgent.identities?.[0] || null;
                if (!primaryIdentity) return null;
                // const contractAddress = primaryIdentity.contractAddress || '';
                const verificationTier = primaryIdentity.verificationTier || 'unverified';
                // const explorerUrl = primaryIdentity.explorerUrl || '';
                const lastCheckedAt = primaryIdentity.lastCheckedAt || selectedAgent.updatedAt;
                const formattedCheckedDate = lastCheckedAt ? new Date(lastCheckedAt).toLocaleDateString() : '';

                return (
                  <div style={{
                    background: 'var(--paper)',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px' }}>Verification Status:</span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            background: verificationTier === 'ownership_verified'
                              ? 'var(--brass-soft)'
                              : verificationTier === 'verified'
                                ? '#e2ece9'
                                : '#fdeded',
                            color: verificationTier === 'ownership_verified'
                              ? 'var(--brass)'
                              : verificationTier === 'verified'
                                ? '#2d6a4f'
                                : '#d32f2f',
                            border: `1px solid ${verificationTier === 'ownership_verified'
                              ? 'var(--brass)'
                              : verificationTier === 'verified'
                                ? '#2d6a4f'
                                : '#d32f2f'
                              }`
                          }}
                        >
                          {verificationTier === 'ownership_verified' ? '✓ OWNER VERIFIED' : verificationTier === 'verified' ? '✓ VERIFIED' : 'UNVERIFIED'}
                        </span>
                      </div>
                      {formattedCheckedDate && (
                        <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>
                          Last checked: {formattedCheckedDate}
                        </div>
                      )}
                    </div>

                    {/* <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid var(--line-2)', paddingTop: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '13.5px', color: 'var(--ink-soft)' }}>Contract Address:</span>
                      {explorerUrl ? (
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            color: 'var(--brass)',
                            textDecoration: 'underline',
                            fontWeight: 600,
                            wordBreak: 'break-all'
                          }}
                        >
                          {contractAddress}
                        </a>
                      ) : (
                        <span style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--ink)', wordBreak: 'break-all' }}>
                          {contractAddress}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(contractAddress);
                          const target = e.currentTarget;
                          const originalHTML = target.innerHTML;
                          target.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                          setTimeout(() => {
                            target.innerHTML = originalHTML;
                          }, 1500);
                        }}
                        style={{
                          background: 'none',
                          cursor: 'pointer',
                          padding: '6px',
                          color: 'var(--brass)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#fff',
                          border: '1px solid var(--line)',
                          borderRadius: '4px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--paper)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                        title="Copy Address"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      </button>
                    </div> */}
                  </div>
                );
              })()}

              {/* Score section */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                borderTop: '1px solid var(--line)',
                borderBottom: '1px solid var(--line)',
                padding: '24px 0',
                marginBottom: '24px'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 12px 0' }}>Verdict Rating</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--brass)' }}>
                      {isUnrated ? 'Registered' : '★'.repeat(starsCount) + '☆'.repeat(3 - starsCount)}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)' }}>
                      {scoreObj?.starLabel || 'Registered, not rated'}
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '8px' }}>
                    {scoreObj?.starDesc || 'Insufficient evidence to compute rating.'}
                  </p>
                </div>

                <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0' }}>Rubric v0.1 Breakdown</h4>
                  {!isUnrated && scoreObj ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Verifiability (Docs, Web, Git)</span>
                        <b>{scoreObj.verifiabilityScore} / 25</b>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Activity (Unique Wallets)</span>
                        <b>{Math.round(scoreObj.activityScore)} / 25</b>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Maintenance (GitHub Commits)</span>
                        <b>{Math.round(scoreObj.maintenanceScore)} / 25</b>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Security Posture (Audit, Keys)</span>
                        <b>{scoreObj.securityScore} / 25</b>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: (scoreObj.adminPenalty || 0) > 0 ? '#A61D2D' : 'inherit' }}>
                        <span style={{ fontWeight: (scoreObj.adminPenalty || 0) > 0 ? 600 : 400 }}>Admin Control Penalty</span>
                        <b>{(scoreObj.adminPenalty || 0) > 0 ? `-${scoreObj.adminPenalty} pt` : '0 pt'}</b>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
                      No rating breakdown available due to insufficient data.
                    </p>
                  )}
                </div>
              </div>

              {/* Dossier Body */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', marginBottom: '12px' }}>
                  {dossier ? dossier.title : 'Cohort Selection Overview'}
                </h3>
                <p style={{ lineHeight: 1.6, color: 'var(--ink-soft)', whiteSpace: 'pre-wrap' }}>
                  {dossier ? dossier.body : (selectedAgent.selectionRationale || selectedAgent.keyRationale || `${selectedAgent.name} is an autonomous agent operating under the ${selectedAgent.category} category, monitored on-chain on ${selectedAgent.chains.toUpperCase()} for verifiability, telemetry, and security posture.`)}
                </p>
                {dossier && (
                  <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    backgroundColor: 'var(--paper)',
                    borderLeft: '4px solid var(--brass)',
                    borderRadius: '4px'
                  }}>
                    <h5 style={{ textTransform: 'uppercase', fontSize: '11px', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>Official Verdict</h5>
                    <p style={{ margin: 0, fontStyle: 'italic', fontSize: '14px' }}>{dossier.verdict}</p>
                  </div>
                )}
              </div>

              {/* Official Links Section */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ margin: '0 0 12px 0' }}>Verified Resources</h4>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  {selectedAgent.website && selectedAgent.website !== 'N/A' && selectedAgent.website !== '' && (
                    <a
                      href={selectedAgent.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '10px 16px',
                        border: '1px solid var(--line)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--brass)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'var(--paper)',
                        transition: 'opacity 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      <span>Website ↗</span>
                    </a>
                  )}
                  {selectedAgent.docsUrl && selectedAgent.docsUrl !== 'N/A' && selectedAgent.docsUrl !== '' && (
                    <a
                      href={selectedAgent.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '10px 16px',
                        border: '1px solid var(--line)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--brass)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'var(--paper)',
                        transition: 'opacity 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      <span>Documentation ↗</span>
                    </a>
                  )}
                  {selectedAgent.githubUrl && selectedAgent.githubUrl !== 'N/A' && selectedAgent.githubUrl !== '' && (
                    <a
                      href={selectedAgent.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '10px 16px',
                        border: '1px solid var(--line)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--brass)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'var(--paper)',
                        transition: 'opacity 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                      <span>GitHub ↗</span>
                    </a>
                  )}
                  {selectedAgent.xHandle && selectedAgent.xHandle !== 'N/A' && selectedAgent.xHandle !== '' && (
                    <a
                      href={`https://x.com/${selectedAgent.xHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '10px 16px',
                        border: '1px solid var(--line)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--brass)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'var(--paper)',
                        transition: 'opacity 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span>X (Twitter) ↗</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Telemetry Snapshots */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ margin: '0 0 12px 0' }}>Telemetry Evidence Store</h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '16px'
                }}>
                  <div style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>GitHub Commits (30d)</span>
                    <h3 style={{ margin: '4px 0 0 0', fontFamily: 'monospace' }}>
                      {scoreObj?.commitsVal !== undefined ? scoreObj.commitsVal : 'N/A'}
                    </h3>
                  </div>
                  <div style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>Unique Users (30d)</span>
                    <h3 style={{ margin: '4px 0 0 0', fontFamily: 'monospace' }}>
                      {scoreObj?.uniqueAddresses !== undefined ? scoreObj.uniqueAddresses.toLocaleString() : 'N/A'}
                    </h3>
                  </div>
                  <div style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>Security Audit</span>
                    <h3 style={{ margin: '4px 0 0 0', color: selectedAgent.snapshots?.find((s: any) => s.signalKey === 'audit_exists')?.value === 1 ? '#137333' : '#A61D2D' }}>
                      {selectedAgent.snapshots?.find((s: any) => s.signalKey === 'audit_exists')?.value === 1 ? 'Yes' : 'No / Unknown'}
                    </h3>
                  </div>
                  <div style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>Admin Control Keys</span>
                    <h3 style={{ margin: '4px 0 0 0', color: selectedAgent.snapshots?.find((s: any) => s.signalKey === 'admin_keys_safe')?.value === 1 ? '#137333' : '#A61D2D' }}>
                      {selectedAgent.snapshots?.find((s: any) => s.signalKey === 'admin_keys_safe')?.value === 1 ? 'Safe' : 'Risky / Retained'}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Limitations Section */}
              <div style={{
                padding: '20px',
                border: '1px solid #A61D2D',
                backgroundColor: 'rgba(166, 29, 45, 0.03)',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#A61D2D', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ⚠ Limitations of Assessment
                </h4>
                {limitationsList.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                    {limitationsList.map((lim, idx) => (
                      <li key={idx}>{lim}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)' }}>
                    No verifiability limitations identified for this agent profile.
                  </p>
                )}
              </div>

            </div>
          </div>
        );
      })()}

      {/* Model Detail Popup Modal */}
      {activeModelModal && (
        <div className="model-modal-overlay" onClick={() => setActiveModelModal(null)}>
          <div className="model-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="model-modal-close" onClick={() => setActiveModelModal(null)} aria-label="Close modal">×</button>
            <div className="model-modal-header">
              <div className={`scell-logo-box ${activeModelModal.iconClass}`}>
                {activeModelModal.iconSvg}
              </div>
              <div>
                <span className="badge">{activeModelModal.badge}</span>
                <h3>{activeModelModal.name}</h3>
                <div className="role">{activeModelModal.role}</div>
              </div>
            </div>
            <p className="model-modal-summary">{activeModelModal.summary}</p>
            <div className="model-modal-divider" />
            <h4 className="model-modal-section-title">Detailed Capability &amp; Role Breakdown</h4>
            <div className="model-modal-grid">
              {activeModelModal.features.map((feat, idx) => (
                <div key={idx} className="model-feature-card">
                  <div className="model-feature-header">
                    <span className="feature-icon">{feat.iconSvg}</span>
                    <h5>{feat.title}</h5>
                  </div>
                  <p>{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
