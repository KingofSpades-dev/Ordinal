import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

function AgentLogo({ name }: { name: string }) {
  return <span style={{ fontSize: '12px', fontWeight: 600 }}>{name[0]}</span>;
}

function App() {
  const [stats, setStats] = useState<any>(null);
  const [agentsList, setAgentsList] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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

      {/* Nav */}
      <nav>
        <div className="wrap nav-inner">
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
          <div className="nav-right">
            <div className="nav-links">
              <a href="#">Home</a>
              <a href="#">About</a>
              <a href="#rankings">Ratings</a>
              <a href="#method">Methodology</a>
              <a href="https://github.com/KingofSpades-dev/Ordo" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
            <a 
              href="/ratingagents" 
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/ratingagents');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="nav-cta"
            >
              Launch App ↗
            </a>
          </div>
        </div>
      </nav>

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
              <div className="stat"><div className="n mono">{stats?.totalDossiers !== undefined ? stats.totalDossiers : '162'}</div><div className="l">Dossiers published</div></div>
              <div className="stat"><div className="n mono">{stats ? (stats.totalThreeKeyAwards + stats.totalTwoKeyAwards + stats.totalOneKeyAwards) : '2'}</div><div className="l">Key awards</div></div>
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
              {extendedAgents.map(([name, sub, color], idx) => (
                <div key={`agent-${idx}`} className="chip agent">
                  <span className="glyph" style={{ color: color }}>
                    <AgentLogo name={name} />
                  </span>
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

          {/* Dynamic Rankings Grid */}
          <div style={{ marginTop: '30px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {agentsList.map((agent) => {
                const scoreObj = agent.scores && agent.scores.length > 0 
                  ? JSON.parse(agent.scores[0].hardSignalScores)
                  : null;
                const starsCount = scoreObj ? scoreObj.starsCount : 0;
                const finalScore = scoreObj 
                  ? (typeof scoreObj.finalScore === 'number' 
                      ? Math.round(agent.scores[0].editorialScore + scoreObj.finalScore)
                      : Math.round(agent.scores[0].editorialScore + (scoreObj.verifiabilityScore + scoreObj.activityScore + scoreObj.maintenanceScore + scoreObj.securityScore - (scoreObj.adminPenalty || 0))))
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
                        <div className="vc-logo" style={{ textTransform: 'uppercase', fontWeight: 800 }}>{agent.name[0]}</div>
                        <div className="meta">
                          <div className="nm" style={{ fontSize: '18px', fontWeight: 700 }}>{agent.name}</div>
                          <div className="cat-l" style={{ textTransform: 'capitalize' }}>{agent.category} · {agent.chains.toUpperCase()}</div>
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
                        {agent.selectionRationale || 'Autonomous AI agent.'}
                      </div>
                    </div>
                    <div className="vc-split" style={{ marginTop: '16px', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                      <span className="tag" style={{ color: 'var(--brass)', fontWeight: 700 }}>
                        {isUnrated ? 'Registered, not rated' : `Verdict · ${'★'.repeat(starsCount)}${'☆'.repeat(3 - starsCount)}`}
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
            <div className="sec-head">
              <span className="eyebrow">How every Dossier is built</span>
              <h2>Multiple frontier models. One rigorous result.</h2>
              <p>Each Ordo Dossier is assembled by a combined AI stack, then verified by a human editor before it earns a star. No single model does the whole job. Instead, we pair each to what it does best.</p>
            </div>
          </Reveal>
          <div className="stack-grid">
            <Reveal delay={50}>
              <div className="scell">
                <span className="badge">Analysis &amp; report</span>
                <h4>Fable 5</h4>
                <div className="role">// automated Dossier drafting</div>
                <p>Reads the agent's docs, contracts, and on-chain footprint, then drafts the structured review and scores each criterion against our published rubric.</p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="scell">
                <span className="badge">Visual record</span>
                <h4>Nano Banana</h4>
                <div className="role">// generated imagery</div>
                <p>Produces every agent's visual profile, including cover imagery, product stills, and diagram plates, for a consistent, editorial-grade Dossier.</p>
              </div>
            </Reveal>
            <Reveal delay={250}>
              <div className="scell">
                <span className="badge">Real-time signal</span>
                <h4>Grok</h4>
                <div className="role">// live X &amp; social</div>
                <p>Tracks each agent's activity on X and across community channels in real time, surfacing momentum, warnings, and sentiment as it happens.</p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={350}>
            <p className="stack-note">Drafted by AI · <b>verified by a human editor</b> · no automated star is published unreviewed</p>
          </Reveal>
        </div>
      </section>

      {/* Methodology */}
      <section className="method" id="method">
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <span className="eyebrow">Trust over popularity</span>
              <h2>Every score is reproducible, and public.</h2>
              <p>The fastest way to earn authority in a low-trust industry is to be auditable. Here is how an Ordo rating is built.</p>
            </div>
          </Reveal>
          <div className="method-grid">
            <Reveal delay={50}>
              <div className="method-cell">
                <div className="idx">01</div>
                <h4>A hard signal spine</h4>
                <p>Audits, on-chain activity, uptime, integration counts, commit history: reproducible facts anyone can verify. No opinion enters here.</p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="method-cell">
                <div className="idx">02</div>
                <h4>A named editorial layer</h4>
                <p>Editors assign judgment on top of the data, with disclosed conflicts and a firewall between anyone who talks to a project and anyone who scores it.</p>
              </div>
            </Reveal>
            <Reveal delay={250}>
              <div className="method-cell">
                <div className="idx">03</div>
                <h4>A versioned changelog</h4>
                <p>Exact weights, exact sources, and a public record every time the method changes. When we can't rate something yet, we say so.</p>
              </div>
            </Reveal>
          </div>
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
                  {dossier ? dossier.body : `Selection Rationale: ${selectedAgent.selectionRationale}`}
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
    </>
  )
}

export default App
