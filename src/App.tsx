import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

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

function App() {
  const chains = [
    ['Ethereum', '#627EEA', 'Ξ'],
    ['Solana', '#14F195', '◎'],
    ['Base', '#0052FF', 'B'],
    ['Arbitrum', '#28A0F0', 'A'],
    ['Polygon', '#8247E5', 'P'],
    ['Optimism', '#FF0420', 'O'],
    ['BNB Chain', '#F0B90B', 'B'],
    ['Avalanche', '#E84142', 'A'],
    ['Sui', '#4DA2FF', 'S'],
    ['Aptos', '#06F7C7', 'A'],
    ['TON', '#0098EA', 'T'],
    ['Berachain', '#845A2B', 'B']
  ];

  const agents = [
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
          <span className="dot">✦</span><span>New security investigation — read now</span>
          
          <span className="dot">✦</span><span>Independent editorial rankings</span>
          <span className="dot">✦</span><span>Methodology published in full</span>
          <span className="dot">✦</span><span>Verdicts you cannot buy</span>
          <span className="dot">✦</span><span>Every Dossier disclosed &amp; dated</span>
          <span className="dot">✦</span><span>Coverage across 12 chains</span>
          <span className="dot">✦</span><span>New security investigation — read now</span>
        </div>
      </div>

      {/* Nav */}
      <nav>
        <div className="wrap nav-inner">
          <div className="brand">
            <svg className="brand-mark" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18.5" stroke="#16161A" strokeWidth="1.4" />
              <path d="M20 2v36M2 20h36" stroke="#16161A" strokeWidth="1" />
              <path d="M20 8 L22.2 17.8 L32 20 L22.2 22.2 L20 32 L17.8 22.2 L8 20 L17.8 17.8 Z" fill="#B08321" />
            </svg>
            <span className="brand-name">M<b>eridian</b></span>
          </div>
          <div className="nav-links">
            <a href="#rankings">Rankings</a>
            <a href="#categories">Categories</a>
            <a href="#stack">How it works</a>
            <a href="#editorial">Editorial</a>
            <a href="#holders">Holders</a>
          </div>
          <a href="#" className="nav-cta">Browse the Guide</a>
        </div>
      </nav>

      {/* Hero */}
      <header>
        <div className="wrap">
          <Reveal>
            <span className="hero-badge">
              <span className="pill">The Guide</span>
              Like Michelin for restaurants, or QS for universities — for Web3 AI agents
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="hero">The definitive rankings for <em>Web3 AI agents.</em></h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="hero-sub">
              Hundreds of agents launch every month. Most directories list them; influencers promote whoever pays.
              Meridian is the editorial authority that separates the <b>genuinely useful</b> from the marketing —
              through rigorous review, transparent scoring, and verdicts no project can purchase.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="hero-actions">
              <a href="#rankings" className="btn-primary">Explore the rankings</a>
              <a href="#stack" className="btn-ghost">How every Dossier is built <span>→</span></a>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div className="hero-meta">
              <div className="stat"><div className="n mono">4</div><div className="l">Curated categories</div></div>
              <div className="stat"><div className="n mono">12</div><div className="l">Chains covered</div></div>
              <div className="stat"><div className="n mono">162</div><div className="l">Dossiers published</div></div>
              <div className="stat"><div className="n mono">0</div><div className="l">Paid placements</div></div>
            </div>
          </Reveal>
        </div>
      </header>

      {/* Marquee Band (Chains) */}
      <div className="marquee-band">
        <div className="marquee-label">Agents we cover, listed across</div>
        <div className="marquee">
          <div className="marquee-track" id="chainTrack">
            {extendedChains.map(([name, color, symbol], idx) => (
              <a key={`chain-${idx}`} className="chip" href="#">
                <span 
                  className="glyph" 
                  style={{ 
                    background: `${color}1A`, 
                    color: color, 
                    fontFamily: "'IBM Plex Mono', monospace", 
                    fontWeight: 600, 
                    fontSize: '13px' 
                  }}
                >
                  {symbol}
                </span>
                <span className="name">{name}</span>
              </a>
            ))}
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
              <p>Authority is earned by being undeniably right about a small thing first. Four categories, each rated against evidence — not hype, not follower counts.</p>
            </div>
          </Reveal>
          <div className="cats">
            <Reveal delay={50}>
              <div className="cat">
                <div className="num">01 — Flagship</div>
                <h3>Security &amp; Wallet Intelligence</h3>
                <p>Agents that catch exploits, flag malicious contracts, and protect funds. Rated on detection accuracy, false-positive rates, and audited response record.</p>
                <div className="foot"><span className="cnt">38 <span>Dossiers</span></span><span className="tag">Testable</span></div>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="cat">
                <div className="num">02</div>
                <h3>Infrastructure &amp; Developer</h3>
                <p>Tooling, frameworks, and agent rails. Judged on real integration adoption, commit history, documentation quality, and uptime — signals that are hard to fake.</p>
                <div className="foot"><span className="cnt">51 <span>Dossiers</span></span><span className="tag">Verifiable</span></div>
              </div>
            </Reveal>
            <Reveal delay={250}>
              <div className="cat">
                <div className="num">03</div>
                <h3>Research &amp; Analysis</h3>
                <p>Agents that surface signal from on-chain noise. Assessed on accuracy of calls, transparency of method, and consistency across market conditions.</p>
                <div className="foot"><span className="cnt">29 <span>Dossiers</span></span><span className="tag">Reviewed</span></div>
              </div>
            </Reveal>
            <Reveal delay={350}>
              <div className="cat">
                <div className="num">04</div>
                <h3>Trading Agents</h3>
                <p>Rated strictly on independently measured, multi-period, risk-adjusted performance — never self-reported returns. Framed as risk assessment, not advice.</p>
                <div className="foot"><span className="cnt">44 <span>Dossiers</span></span><span className="tag">On-chain verified</span></div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Marquee Band (Agents) */}
      <div className="marquee-band tight">
        <div className="marquee-label">Recently profiled</div>
        <div className="marquee rev">
          <div className="marquee-track" id="agentTrack">
            {extendedAgents.map(([name, sub, color], idx) => (
              <a key={`agent-${idx}`} className="chip agent" href="#">
                <span className="glyph" style={{ background: color }}>{name[0]}</span>
                <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                  <span className="name">{name}</span>
                  <span className="sub">{sub}</span>
                </span>
              </a>
            ))}
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
              <p>Every agent gets a <b style={{ color: 'var(--ink)', fontWeight: 600 }}>Meridian Dossier</b> — a full profile, scored review, and generated visual record. Our editorial verdict sits apart from community sentiment: always side by side, never blended.</p>
            </div>
          </Reveal>
          <div className="rating-wrap">
            <Reveal delay={100}>
              <div className="stars-legend">
                <div className="star-row">
                  <div className="star-marks">
                    <svg viewBox="0 0 24 24" fill="#B08321"><path d="M12 2l2.6 7.1L22 9.3l-5.5 4.5L18.6 22 12 17.6 5.4 22l2.1-8.2L2 9.3l7.4-.2z"/></svg>
                  </div>
                  <div className="txt"><h4>One Star — Notable</h4><p>A capable agent worth knowing in its category. Solid execution, real utility.</p></div>
                </div>
                <div className="star-row">
                  <div className="star-marks">
                    <svg viewBox="0 0 24 24" fill="#B08321"><path d="M12 2l2.6 7.1L22 9.3l-5.5 4.5L18.6 22 12 17.6 5.4 22l2.1-8.2L2 9.3l7.4-.2z"/></svg>
                    <svg viewBox="0 0 24 24" fill="#B08321"><path d="M12 2l2.6 7.1L22 9.3l-5.5 4.5L18.6 22 12 17.6 5.4 22l2.1-8.2L2 9.3l7.4-.2z"/></svg>
                  </div>
                  <div className="txt"><h4>Two Stars — Excellent</h4><p>Among the best in its category. Worth going out of your way to use.</p></div>
                </div>
                <div className="star-row">
                  <div className="star-marks">
                    <svg viewBox="0 0 24 24" fill="#B08321"><path d="M12 2l2.6 7.1L22 9.3l-5.5 4.5L18.6 22 12 17.6 5.4 22l2.1-8.2L2 9.3l7.4-.2z"/></svg>
                    <svg viewBox="0 0 24 24" fill="#B08321"><path d="M12 2l2.6 7.1L22 9.3l-5.5 4.5L18.6 22 12 17.6 5.4 22l2.1-8.2L2 9.3l7.4-.2z"/></svg>
                    <svg viewBox="0 0 24 24" fill="#B08321"><path d="M12 2l2.6 7.1L22 9.3l-5.5 4.5L18.6 22 12 17.6 5.4 22l2.1-8.2L2 9.3l7.4-.2z"/></svg>
                  </div>
                  <div className="txt"><h4>Three Stars — Exceptional</h4><p>A category-defining agent. The standard others are measured against.</p></div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={250}>
              <div className="verdict-card">
                <div className="vc-top">
                  <div className="vc-logo">S</div>
                  <div className="meta">
                    <div className="nm">Sentinel AI</div>
                    <div className="cat-l">Security &amp; Wallet Intelligence</div>
                  </div>
                  <div className="vc-score"><div className="big mono">92</div><div className="of">/ 100</div></div>
                </div>
                <div className="vc-dossier">
                  <span className="dref">MERIDIAN DOSSIER №038</span>
                  <span className="dai"><span className="dot-live"></span>AI-assisted · editor-verified</span>
                </div>
                <div className="vc-body">
                  <div className="vc-line"><span className="k">Detection accuracy</span><span className="v"><div className="vc-bar"><i style={{ width: '94%' }}></i></div></span></div>
                  <div className="vc-line"><span className="k">False positives</span><span className="v"><div className="vc-bar"><i style={{ width: '88%' }}></i></div></span></div>
                  <div className="vc-line"><span className="k">Audit &amp; response</span><span className="v"><div className="vc-bar"><i style={{ width: '90%' }}></i></div></span></div>
                </div>
                <div className="vc-split">
                  <span className="tag">Editorial verdict · ★★★</span>
                  <div className="community-stars">
                    <span className="tag">Community</span>
                    <span className="cs">
                      <svg viewBox="0 0 24 24" fill="#B08321"><path d="M12 2l2.6 7.1L22 9.3l-5.5 4.5L18.6 22 12 17.6 5.4 22l2.1-8.2L2 9.3l7.4-.2z"/></svg>
                      <svg viewBox="0 0 24 24" fill="#B08321"><path d="M12 2l2.6 7.1L22 9.3l-5.5 4.5L18.6 22 12 17.6 5.4 22l2.1-8.2L2 9.3l7.4-.2z"/></svg>
                      <svg viewBox="0 0 24 24" fill="#B08321"><path d="M12 2l2.6 7.1L22 9.3l-5.5 4.5L18.6 22 12 17.6 5.4 22l2.1-8.2L2 9.3l7.4-.2z"/></svg>
                      <svg viewBox="0 0 24 24" fill="#B08321"><path d="M12 2l2.6 7.1L22 9.3l-5.5 4.5L18.6 22 12 17.6 5.4 22l2.1-8.2L2 9.3l7.4-.2z"/></svg>
                      <svg viewBox="0 0 24 24" fill="#D7D9DF"><path d="M12 2l2.6 7.1L22 9.3l-5.5 4.5L18.6 22 12 17.6 5.4 22l2.1-8.2L2 9.3l7.4-.2z"/></svg>
                    </span>
                    <span className="csv">4.2</span>
                  </div>
                </div>
              </div>
            </Reveal>
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
              <p>Each Meridian Dossier is assembled by a combined AI stack, then verified by a human editor before it earns a star. No single model does the whole job — we pair each to what it does best.</p>
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
                <p>Produces every agent's visual profile — cover imagery, product stills, and diagram plates — for a consistent, editorial-grade Dossier.</p>
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
              <p>The fastest way to earn authority in a low-trust industry is to be auditable. Here is how a Meridian rating is built.</p>
            </div>
          </Reveal>
          <div className="method-grid">
            <Reveal delay={50}>
              <div className="method-cell">
                <div className="idx">01</div>
                <h4>A hard signal spine</h4>
                <p>Audits, on-chain activity, uptime, integration counts, commit history — reproducible facts anyone can verify. No opinion enters here.</p>
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
              <h3>The agent that claimed 300% returns — and the wallets that tell a different story.</h3>
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
              <h3>Building an audited agent in public — a conversation.</h3>
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
              <p>Holding the token unlocks access and status — the things worth paying for. It does not, and cannot, move an editorial ranking.</p>
            </div>
          </Reveal>
          <div className="holder">
            <div className="holder-list">
              <Reveal delay={50} className="hl-row">
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#16161A" strokeWidth="1.6">
                    <path d="M4 7h16M4 12h16M4 17h10"/>
                  </svg>
                </div>
                <div>
                  <h4>Full Dossiers, first</h4>
                  <p>Complete reviews and investigations before they reach the public feed.</p>
                </div>
              </Reveal>
              <Reveal delay={120} className="hl-row">
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#16161A" strokeWidth="1.6">
                    <path d="M3 3v18h18"/>
                    <path d="M7 14l3-4 3 3 5-7"/>
                  </svg>
                </div>
                <div>
                  <h4>Advanced analytics &amp; on-chain data</h4>
                  <p>The full data layer behind every score, explorable.</p>
                </div>
              </Reveal>
              <Reveal delay={190} className="hl-row">
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#16161A" strokeWidth="1.6">
                    <path d="M8 3H5a2 2 0 00-2 2v3m0 8v3a2 2 0 002 2h3m8 0h3a2 2 0 002-2v-3m0-8V5a2 2 0 00-2-2h-3"/>
                  </svg>
                </div>
                <div>
                  <h4>API access</h4>
                  <p>Query rankings and Dossiers programmatically for your own tools.</p>
                </div>
              </Reveal>
              <Reveal delay={260} className="hl-row">
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="#B08321">
                    <path d="M12 2l2.6 7.1L22 9.3l-5.5 4.5L18.6 22 12 17.6 5.4 22l2.1-8.2L2 9.3l7.4-.2z"/>
                  </svg>
                </div>
                <div>
                  <h4>Community Stars &amp; holder badge</h4>
                  <p>Rate agents you can prove you've used on-chain — one holder, one vote. Shown separately from the editorial verdict.</p>
                </div>
              </Reveal>
            </div>
            <Reveal delay={300} className="holder-note">
              <div className="eyebrow">Why the wall exists</div>
              <h3>Community sentiment and editorial verdict live side by side — never merged.</h3>
              <p>Holders give stars to agents they've genuinely used. That signal is shown as <b>Community Stars</b>, next to — never inside — our independent rating. When the two diverge, that's our most interesting story.</p>
              <div className="fine">
                ONE HOLDER · ONE VOTE — NOT ONE TOKEN · ONE VOTE<br />
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
            <p>Find the agents worth your funds — and skip the ones that aren't.</p>
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
                <svg className="brand-mark" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="18.5" stroke="#16161A" strokeWidth="1.4" />
                  <path d="M20 2v36M2 20h36" stroke="#16161A" strokeWidth="1" />
                  <path d="M20 8 L22.2 17.8 L32 20 L22.2 22.2 L20 32 L17.8 22.2 L8 20 L17.8 17.8 Z" fill="#B08321" />
                </svg>
                <span className="brand-name">M<b>eridian</b></span>
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
            <p>© 2026 Meridian</p>
            <p>Independent · Unbuyable · Dated</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
