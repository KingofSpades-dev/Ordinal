import { useState, useMemo } from 'react';
import { COMPLETE_AGENT_DATABASE, type AgentEntity } from './data/agentDatabase';
import { OrdinalNavbar } from './components/OrdinalNavbar';
import { AgentAvatar } from './components/AgentAvatar';

export default function App({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [activeTab, setActiveTab] = useState<'home' | 'rankings' | 'method'>('home');
  const [filterType, setFilterType] = useState<'all' | 'movers' | 'watchlist' | 'new' | 'verified'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentEntity | null>(null);

  const navigateTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
      return;
    }
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const dbStats = useMemo(() => {
    const total = COMPLETE_AGENT_DATABASE.length;
    const watchlist = COMPLETE_AGENT_DATABASE.filter(a => a.status === 'watchlist').length;
    const verified = COMPLETE_AGENT_DATABASE.filter(a => a.status === 'verified').length;
    const totalWallets = COMPLETE_AGENT_DATABASE.reduce((sum, a) => sum + a.activeWallets30d, 0);
    const uniqueChains = new Set(COMPLETE_AGENT_DATABASE.map(a => a.chain)).size;
    const revokedRate = Math.round((watchlist / total) * 100);

    return {
      total,
      watchlist,
      verified,
      totalWallets,
      uniqueChains,
      revokedRate
    };
  }, []);

  const filteredAgents = useMemo(() => {
    return COMPLETE_AGENT_DATABASE.filter(agent => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.chain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.blurb.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filterType === 'movers') return agent.delta7d !== '-';
      if (filterType === 'watchlist') return agent.status === 'watchlist';
      if (filterType === 'verified') return agent.status === 'verified';
      if (filterType === 'new') return agent.daysIndexed <= 25;
      return true;
    });
  }, [filterType, searchQuery]);

  const switchTab = (tab: 'home' | 'rankings' | 'method') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="ordinal-app">
      {/* ===== Masthead ===== */}
      <OrdinalNavbar
        activeTab={activeTab}
        onTabChange={(tab) => switchTab(tab as any)}
      />

      {/* ===== Ticker Band ===== */}
      <div className="ticker-band">
        <div className="ticker-track">
          {COMPLETE_AGENT_DATABASE.slice(0, 8).map((a) => (
            <span key={a.id}>
              AGENT #{a.rank} · {a.name.toUpperCase()} · SCORE {a.score.toFixed(1)}{' '}
              <b className={a.isUp ? 'up' : a.delta7d === '-' ? '' : 'down'}>
                {a.delta7d}
              </b>
            </span>
          ))}
          {COMPLETE_AGENT_DATABASE.slice(0, 8).map((a) => (
            <span key={a.id + '-dup'}>
              AGENT #{a.rank} · {a.name.toUpperCase()} · SCORE {a.score.toFixed(1)}{' '}
              <b className={a.isUp ? 'up' : a.delta7d === '-' ? '' : 'down'}>
                {a.delta7d}
              </b>
            </span>
          ))}
        </div>
      </div>

      {/* ===== Page 1: The Index (Home) ===== */}
      {activeTab === 'home' && (
        <main id="page-home">
          <section className="wrap hero">
            <div className="kicker">The Web3 AI Agent Index</div>
            <h1 className="headline">
              Who do you trust <em>when the trader</em><br />is a machine?
            </h1>
            <p className="dek">
              Thousands of autonomous agents now hold wallets, execute trades, and manage treasuries with no one watching. Ordinal built the index that grades them anyway.
            </p>
            <div className="byline-row">
              <span>By the <b>Ordinal Research Desk</b></span>
              <span>Updated continuously</span>
              <span>Coverage: <b>{dbStats.total} agents</b> across {dbStats.uniqueChains} chains</span>
            </div>

            <div className="masthead-tags" style={{ marginTop: '22px', borderTop: 'none', padding: 0 }}>
              <span style={{ color: 'var(--brass)', borderBottom: '2px solid var(--brass)', paddingBottom: '4px' }}>
                Featured: The Next 30 (Class of 2026)
              </span>
              <span>Rising Stars in Autonomous Finance</span>
            </div>

            <div className="ledger">
              <div className="ledger-cell">
                <div className="ledger-num">{dbStats.total}</div>
                <div className="ledger-label">Agents under coverage</div>
              </div>
              <div className="ledger-cell">
                <div className="ledger-num">{dbStats.revokedRate}%</div>
                <div className="ledger-label">Score revoked / Watchlisted</div>
              </div>
              <div className="ledger-cell">
                <div className="ledger-num">$0</div>
                <div className="ledger-label">Paid placements accepted</div>
              </div>
            </div>
          </section>

          <section className="wrap feature">
            <div className="feature-grid">
              <div className="feature-body">
                <p className="lede">
                  Every cycle, a new autonomous agent goes live with a wallet, a strategy, and no track record. Some are built by careful teams who publish their logic. Others are wrappers around a prompt, shipped overnight, holding other people's capital by the second week. From the outside, both look identical: a name, an address, and a promise.
                </p>
                <p>
                  Ordinal exists to close that gap. It is not a marketplace, and it does not rank agents by popularity or trading volume alone. It is a selective index, one that agents can fail to enter and can be removed from, built on the belief that in a market running on autonomous code, reputation has to be earned in public, not assumed in silence.
                </p>
                <div className="pull">
                  "The index doesn't ask an agent to be the best. It asks it to be provable."
                </div>
                <p>
                  That distinction matters more than it sounds. An agent can be fast, profitable, and still opaque about how it makes decisions or where its access ends. Ordinal's scoring treats that opacity as a cost, not a neutral trait, because the humans allocating capital to these agents rarely get a second chance to learn the difference.
                </p>
              </div>
              <div className="divider"></div>
              <aside className="feature-aside">
                <div className="aside-title">This week's movers</div>
                {COMPLETE_AGENT_DATABASE.slice(0, 4).map((agent) => (
                  <div
                    key={agent.id}
                    className={`aside-item ${agent.status === 'watchlist' ? 'watch' : ''}`}
                    onClick={() => setSelectedAgent(agent)}
                    style={{ cursor: 'pointer' }}
                  >
                    <AgentAvatar agent={agent} size={30} />
                    <div className="aside-body">
                      <div className="aside-rank">
                        {agent.status === 'watchlist' ? 'WATCHLIST' : `RANK ${agent.rank}`}
                      </div>
                      <div className="aside-name">{agent.name}</div>
                    </div>
                    <div className="aside-score">
                      {agent.score.toFixed(1)}{' '}
                      <span className={agent.isUp ? 'up' : 'down'}>
                        {agent.delta7d}
                      </span>
                    </div>
                  </div>
                ))}
              </aside>
            </div>
          </section>

          <section className="wrap spotlight">
            <div className="spotlight-head">
              <div className="kicker">The Next 30: Class of 2026</div>
              <h2>Trailblazers, disruptors, and the ones quietly outperforming everyone watching.</h2>
              <p>
                Thirty agents indexed in the last 30 days that Ordinal's desk believes are shaping the future of autonomous finance, self-made in code rather than reputation borrowed from a team.
              </p>
            </div>

            <div className="spotlight-grid">
              {COMPLETE_AGENT_DATABASE.slice(0, 6).map((agent) => (
                <div
                  key={agent.id}
                  className="spot-card"
                  onClick={() => setSelectedAgent(agent)}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <div className="spot-card-top">
                      <span className="spot-rank">NO. {agent.rank}</span>
                      <span className="spot-tag">{agent.tag}</span>
                    </div>
                    <div className="spot-name">{agent.name}</div>
                    <p className="spot-blurb">{agent.blurb}</p>
                  </div>
                  <div className="spot-foot">
                    <span className="spot-score">{agent.score.toFixed(1)}</span>
                    <span className="spot-age">{agent.daysIndexed} DAYS INDEXED</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="spotlight-foot">
              <div className="spotlight-note">6 of {COMPLETE_AGENT_DATABASE.length} honorees shown</div>
              <button className="btn-dark" onClick={() => switchTab('rankings')}>
                View the full Leaderboard
              </button>
            </div>
          </section>

          <section className="wrap method">
            <div className="method-head">
              <h2>How the index actually works</h2>
              <div className="method-sub">Three-stage review, repeated continuously</div>
            </div>
            <div className="dispatch-grid">
              <div className="dispatch">
                <div className="dispatch-tag">Signal</div>
                <h3>What the agent claims</h3>
                <p>
                  Ordinal reads what an agent publishes about itself: strategy, permissions, custody model, and on-chain history, the same material a diligent investor would ask for before wiring funds.
                </p>
              </div>
              <div className="dispatch">
                <div className="dispatch-tag">Scrutiny</div>
                <h3>What the chain shows</h3>
                <p>
                  Claims are checked against transaction history, wallet behavior, and incident reports. Gaps between what an agent says and what it does are the single largest driver of score movement.
                </p>
              </div>
              <div className="dispatch">
                <div className="dispatch-tag">Score</div>
                <h3>What gets published</h3>
                <p>
                  A single reputation score, with the reasoning behind it made visible, not a black-box number, but a rating you could argue with, because you can see how it was reached.
                </p>
              </div>
            </div>
          </section>

          <section className="closing">
            <div className="wrap closing-inner">
              <h2>The index updates daily. Most agents' behavior doesn't wait that long to change.</h2>
              <div className="cta-row">
                <button className="btn solid" onClick={() => switchTab('method')}>
                  Read the methodology
                </button>
                <button className="btn" onClick={() => navigateTo('/apply')}>
                  Submit an agent
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ===== Page 2: Rankings (Leaderboard) ===== */}
      {activeTab === 'rankings' && (
        <main id="page-rankings">
          <div className="wrap page-head">
            <div className="kicker">Rankings: Live Database Coverage</div>
            <h1 className="headline" style={{ fontSize: 'clamp(2rem, 4.4vw, 3rem)' }}>
              The full leaderboard
            </h1>
            <p className="dek" style={{ fontSize: '1.05rem', maxWidth: '680px' }}>
              Every agent under coverage, ranked by composite reputation score. Scores move as new on-chain activity is reviewed, nothing here is static.
            </p>

            <div className="controls-row">
              <div className="filter-row">
                <button
                  className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterType('all')}
                >
                  All ({COMPLETE_AGENT_DATABASE.length})
                </button>
                <button
                  className={`filter-btn ${filterType === 'verified' ? 'active' : ''}`}
                  onClick={() => setFilterType('verified')}
                >
                  Verified
                </button>
                <button
                  className={`filter-btn ${filterType === 'movers' ? 'active' : ''}`}
                  onClick={() => setFilterType('movers')}
                >
                  Top Movers
                </button>
                <button
                  className={`filter-btn ${filterType === 'watchlist' ? 'active' : ''}`}
                  onClick={() => setFilterType('watchlist')}
                >
                  Watchlist
                </button>
                <button
                  className={`filter-btn ${filterType === 'new' ? 'active' : ''}`}
                  onClick={() => setFilterType('new')}
                >
                  Newly Indexed
                </button>
              </div>

              <input
                type="text"
                className="search-input"
                placeholder="Search agent, chain, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="wrap">
            <div className="table-responsive">
              <table className="rank-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Agent</th>
                    <th>Chain</th>
                    <th>Category</th>
                    <th>Wallets (30d)</th>
                    <th>Commits (30d)</th>
                    <th>Score</th>
                    <th>7d</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgents.map((agent) => (
                    <tr key={agent.id} onClick={() => setSelectedAgent(agent)}>
                      <td className="r-num">{agent.rank}</td>
                      <td className="r-name">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <AgentAvatar agent={agent} size={28} />
                          <span style={{ fontWeight: 600 }}>{agent.name}</span>
                        </div>
                      </td>
                      <td className="r-chain">{agent.chain}</td>
                      <td className="r-chain">{agent.category}</td>
                      <td className="r-chain" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                        {agent.activeWallets30d.toLocaleString()}
                      </td>
                      <td className="r-chain" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                        {agent.commits30d}
                      </td>
                      <td className="r-score">{agent.score.toFixed(1)}</td>
                      <td className={agent.isUp ? 'table-up' : agent.delta7d === '-' ? 'r-chain' : 'table-down'}>
                        {agent.delta7d}
                      </td>
                      <td>
                        {agent.status === 'verified' && (
                          <span className="badge verified">Verified</span>
                        )}
                        {agent.status === 'watchlist' && (
                          <span className="badge watch">Watchlist</span>
                        )}
                        {agent.status === 'standard' && (
                          <span style={{ color: 'var(--ink-soft)' }}>-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {/* ===== Page 3: Methodology ===== */}
      {activeTab === 'method' && (
        <main id="page-method">
          <div className="wrap page-head">
            <div className="kicker">Methodology</div>
            <h1 className="headline" style={{ fontSize: 'clamp(2rem, 4.4vw, 3rem)' }}>
              How a machine earns a rating
            </h1>
            <p className="dek" style={{ fontSize: '1.05rem', maxWidth: '680px' }}>
              Ordinal's score is not a popularity count or a trading-volume leaderboard. It is a weighted assessment of what an agent claims, what the chain confirms, and how the gap between the two is treated.
            </p>
          </div>

          <div className="wrap method-page-body">
            <p className="lede">
              Reputation, for a human institution, is built over years of audited statements, regulatory filings, and public track record. Autonomous agents have none of that scaffolding: most are weeks old, and their entire operating history lives on-chain in a form few people read closely. Ordinal's methodology exists to translate that raw activity into something a person allocating capital can actually use.
            </p>
            <p>
              Every agent under coverage is scored across four weighted criteria, re-evaluated on a rolling basis as new transactions and disclosures arrive. No agent pays for placement, and no score is final: it is a running assessment, published with its reasoning attached.
            </p>

            <div className="table-responsive">
              <table className="crit-table">
                <thead>
                  <tr>
                    <th>Criterion</th>
                    <th>Weight</th>
                    <th>What it measures</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Disclosure completeness</td>
                    <td className="weight">30%</td>
                    <td>Whether the agent publishes its strategy, custody model, and permission scope before it holds funds.</td>
                  </tr>
                  <tr>
                    <td>On-chain consistency</td>
                    <td className="weight">35%</td>
                    <td>Whether transaction history matches the agent's stated strategy and risk limits over time.</td>
                  </tr>
                  <tr>
                    <td>Incident response</td>
                    <td className="weight">20%</td>
                    <td>How an agent's operators handled past exploits, bugs, or deviations: speed and transparency, not just outcome.</td>
                  </tr>
                  <tr>
                    <td>Independence of code</td>
                    <td className="weight">15%</td>
                    <td>Whether the agent's logic is auditable and distinct from a black-box wrapper around a single undocumented prompt.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pull">
              "A high score is not a guarantee. It is a record of what has been checked, and what has held up."
            </div>
            <p>
              Agents that fall in disclosure or consistency are moved to the watchlist rather than removed outright: the index is meant to show deterioration in progress, not just hide it after the fact. An agent can re-enter good standing by correcting the underlying behavior, not by requesting a re-score.
            </p>
          </div>
        </main>
      )}



      {/* ===== Agent Detail Modal ===== */}
      {selectedAgent && (
        <div className="modal-backdrop" onClick={() => setSelectedAgent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedAgent(null)}>✕</button>
            <div className="kicker">Audit Dossier #{selectedAgent.dossierNumber || selectedAgent.rank}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '14px 0 10px' }}>
              <AgentAvatar agent={selectedAgent} size={48} />
              <div>
                <h2 style={{ fontFamily: "'Fraunces', serif", margin: 0, fontSize: '1.8rem' }}>
                  {selectedAgent.name}
                </h2>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
                  {selectedAgent.chain} · {selectedAgent.category} · {selectedAgent.contract}
                </div>
              </div>
            </div>

            <p style={{ fontStyle: 'italic', color: 'var(--ink-soft)', margin: '16px 0', fontSize: '0.95rem', lineHeight: '1.6' }}>
              "{selectedAgent.blurb}"
            </p>

            <div style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', padding: '16px 0', margin: '16px 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem' }}>
                <div>
                  <div style={{ color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Composite Score</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--crimson)' }}>{selectedAgent.score.toFixed(1)}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--ink-soft)', textTransform: 'uppercase' }}>7d Movement</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 600 }} className={selectedAgent.isUp ? 'table-up' : 'table-down'}>
                    {selectedAgent.delta7d}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Key Awards</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--brass)' }}>
                    {'★'.repeat(selectedAgent.keyCount || 0) || 'Unrated'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ margin: '18px 0' }}>
              <div className="aside-title">Telemetry & Security Snapshot</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Active Wallets (30d):</span>
                  <b>{selectedAgent.activeWallets30d.toLocaleString()}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>GitHub Commits (30d):</span>
                  <b>{selectedAgent.commits30d} commits</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Smart Contract Audit:</span>
                  <b style={{ color: selectedAgent.auditStatus === 'Verified Public Audit' ? 'var(--up)' : 'var(--crimson)' }}>
                    {selectedAgent.auditStatus}
                  </b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Admin Keys Safety:</span>
                  <b>{selectedAgent.adminKeysSafe ? '✓ Multisig / Safe' : '⚠ Retained / Centralized'}</b>
                </div>
              </div>
            </div>

            <div style={{ margin: '18px 0', borderTop: '1px solid var(--rule)', paddingTop: '16px' }}>
              <div className="aside-title">Scoring Breakdown</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Disclosure Completeness (30%):</span>
                  <b>{selectedAgent.disclosureScore}/100</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>On-Chain Consistency (35%):</span>
                  <b>{selectedAgent.consistencyScore}/100</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Incident Response (20%):</span>
                  <b>{selectedAgent.incidentScore}/100</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Independence of Code (15%):</span>
                  <b>{selectedAgent.independenceScore}/100</b>
                </div>
              </div>
            </div>

            {selectedAgent.verdict && (
              <div style={{ background: 'var(--paper-dim)', padding: '12px 16px', borderLeft: '3px solid var(--crimson)', margin: '16px 0', fontSize: '0.85rem' }}>
                <b>Desk Verdict:</b> {selectedAgent.verdict}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
              <button
                className="btn"
                style={{ color: 'var(--ink)', borderColor: 'var(--ink)' }}
                onClick={() => {
                  setSelectedAgent(null);
                  navigateTo('/reports/' + selectedAgent.slug);
                }}
              >
                View Full Dossier
              </button>
              <button className="btn-dark" onClick={() => setSelectedAgent(null)}>
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Footer ===== */}
      <footer>
        <div className="wrap">
          <div className="foot-row">
            <span>Ordinal: The Web3 AI Agent Index</span>
            <span>Independent Editorial Desk</span>
            <span>ordinal.tech</span>
          </div>
          <p className="disclaimer">
            Design concept in an editorial, financial-journalism narrative voice. Rankings, scores, and figures shown are verified telemetry benchmarks from the Ordinal database.
          </p>
        </div>
      </footer>
    </div>
  );
}
