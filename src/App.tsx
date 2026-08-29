import { useState, useMemo, useEffect } from 'react';
import { COMPLETE_AGENT_DATABASE, getFullAgentDatabase, fetchLiveAgentDatabase, type AgentEntity } from './data/agentDatabase';
import { OrdinalNavbar } from './components/OrdinalNavbar';
import { AgentAvatar } from './components/AgentAvatar';

export default function App({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [selectedAgent, setSelectedAgent] = useState<AgentEntity | null>(null);
  const [allAgents, setAllAgents] = useState<AgentEntity[]>(() => getFullAgentDatabase());

  useEffect(() => {
    fetchLiveAgentDatabase().then((liveList) => {
      if (liveList && liveList.length > 0) {
        setAllAgents(liveList);
      }
    });

    const handleDbUpdate = () => {
      fetchLiveAgentDatabase().then((liveList) => {
        setAllAgents(liveList);
      });
    };
    window.addEventListener('ordinal_db_updated', handleDbUpdate);
    return () => window.removeEventListener('ordinal_db_updated', handleDbUpdate);
  }, []);

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
    const total = allAgents.length;
    const watchlist = allAgents.filter(a => a.status === 'watchlist').length;
    const verified = allAgents.filter(a => a.status === 'verified').length;
    const totalWallets = allAgents.reduce((sum, a) => sum + a.activeWallets30d, 0);
    const uniqueChains = new Set(allAgents.map(a => a.chain)).size;
    const revokedRate = Math.round((watchlist / total) * 100);

    return {
      total,
      watchlist,
      verified,
      totalWallets,
      uniqueChains,
      revokedRate
    };
  }, [allAgents]);

  return (
    <div className="ordinal-app">
      {/* Masthead */}
      <OrdinalNavbar currentPath="/" onNavigate={navigateTo} />

      {/* Ticker Band */}
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

      {/* Primary Editorial Cover Story (The Index) */}
      <main id="page-home">
        <section className="hero-full-bleed">
          <div className="hero-backdrop-dial">
            <img
              src="/hero-image.png"
              alt="Ordinal Autonomous Consensus Instrument"
              className="hero-dial-img"
            />
          </div>

          <div className="wrap hero-editorial-wrap">
            <div className="hero-editorial-content">
              <div className="kicker">The Web3 AI Agent Index</div>
              <h1 className="headline">
                Who do you trust <br /><em>when the trader</em>
                <br />
                is a machine?
              </h1>
              <p className="dek">
                Thousands of autonomous agents now hold wallets, execute trades, and manage treasuries with no one watching. Ordinal built the index that grades them anyway.
              </p>
            </div>

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
          </div>
        </section>

        <section className="wrap">
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
            <button className="btn-dark" onClick={() => navigateTo('/rankings')}>
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
              <button className="btn solid" onClick={() => navigateTo('/methodology')}>
                Read the methodology
              </button>
              <button className="btn" onClick={() => navigateTo('/apply')}>
                Submit an agent
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="modal-backdrop" onClick={() => setSelectedAgent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedAgent(null)}>✕</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '10px 0' }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem' }}>
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', gap: '12px', flexWrap: 'wrap' }}>
              {selectedAgent.website ? (
                <a
                  href={selectedAgent.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ color: 'var(--ink)', borderColor: 'var(--ink)' }}
                >
                  Official Website
                </a>
              ) : (
                <button
                  className="btn"
                  style={{ color: 'var(--ink)', borderColor: 'var(--ink)' }}
                  onClick={() => navigateTo('/rankings')}
                >
                  Leaderboard
                </button>
              )}
              <button className="btn-dark" onClick={() => setSelectedAgent(null)}>
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
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
