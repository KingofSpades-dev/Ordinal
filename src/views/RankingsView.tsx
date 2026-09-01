import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPLETE_AGENT_DATABASE, getFullAgentDatabase, fetchLiveAgentDatabase, type AgentEntity } from '../data/agentDatabase';
import { OrdinalNavbar } from '../components/OrdinalNavbar';
import { AgentAvatar } from '../components/AgentAvatar';
import { CountUpNumber } from '../components/CountUpNumber';

interface RankingsViewProps {
  onNavigate?: (path: string) => void;
}

export const RankingsView: React.FC<RankingsViewProps> = ({ onNavigate }) => {
  const [filterType, setFilterType] = useState<'under30' | 'all' | 'verified' | 'movers' | 'watchlist' | 'new'>('under30');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentEntity | null>(null);
  const [allAgents, setAllAgents] = useState<AgentEntity[]>(() => getFullAgentDatabase());

  useEffect(() => {
    // Fetch live backend PostgreSQL database
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

  const filteredAgents = useMemo(() => {
    const sorted = [...allAgents].sort((a, b) => b.score - a.score).map((agent, idx) => ({
      ...agent,
      rank: String(idx + 1).padStart(2, '0')
    }));

    return sorted.filter(agent => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.chain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.blurb.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filterType === 'under30') return parseInt(agent.rank, 10) <= 30;
      if (filterType === 'movers') return agent.delta7d !== '-';
      if (filterType === 'watchlist') return agent.status === 'watchlist';
      if (filterType === 'verified') return agent.status === 'verified';
      if (filterType === 'new') return agent.daysIndexed <= 25;
      return true;
    });
  }, [allAgents, filterType, searchQuery]);

  return (
    <div className="ordinal-app">
      <OrdinalNavbar currentPath="/rankings" onNavigate={navigateTo} />

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

      <main id="page-rankings">
        <div className="wrap page-head">
          <div className="kicker">Rankings: Live Database Coverage</div>
          <motion.h1
            className="headline"
            style={{ fontSize: 'clamp(2rem, 4.4vw, 3rem)' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            The Full Leaderboard
          </motion.h1>
          <p className="dek" style={{ fontSize: '1.05rem', maxWidth: '680px' }}>
            Every agent under coverage, ranked by composite reputation score. Scores move as new on-chain activity is reviewed, nothing here is static.
          </p>

          {/* The Under 30 Cohort Banner */}
          <motion.div
            style={{
              marginTop: '24px',
              padding: '18px 22px',
              background: 'var(--paper-dim)',
              border: '1px solid var(--ink)',
              borderLeft: '4px solid var(--brass)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brass)', fontWeight: 600, marginBottom: '4px' }}>
                Featured Index: The Under 30 (Class of 2026)
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: '1.5' }}>
                Thirty breakout autonomous agents shaping the future of autonomous finance and decentralized execution.
              </div>
            </div>
            <motion.button
              className="btn"
              style={{
                background: filterType === 'under30' ? 'var(--brass)' : 'transparent',
                borderColor: 'var(--brass)',
                color: filterType === 'under30' ? '#fff' : 'var(--ink)',
                fontSize: '0.72rem',
                padding: '8px 18px',
                fontWeight: 600
              }}
              onClick={() => setFilterType(filterType === 'under30' ? 'all' : 'under30')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {filterType === 'under30' ? 'Showing Top 30 Honorees' : 'Filter The Under 30'}
            </motion.button>
          </motion.div>

          <div className="controls-row">
            <div className="filter-row">
              <motion.button
                className={`filter-btn ${filterType === 'under30' ? 'active' : ''}`}
                style={{
                  borderColor: 'var(--brass)',
                  background: filterType === 'under30' ? 'var(--brass)' : 'transparent',
                  color: filterType === 'under30' ? '#fff' : 'var(--brass)',
                  fontWeight: 600
                }}
                onClick={() => setFilterType('under30')}
                whileTap={{ scale: 0.95 }}
              >
                ★ The Under 30
              </motion.button>
              <motion.button
                className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
                whileTap={{ scale: 0.95 }}
              >
                All ({allAgents.length})
              </motion.button>
              <motion.button
                className={`filter-btn ${filterType === 'verified' ? 'active' : ''}`}
                onClick={() => setFilterType('verified')}
                whileTap={{ scale: 0.95 }}
              >
                Verified
              </motion.button>
              <motion.button
                className={`filter-btn ${filterType === 'movers' ? 'active' : ''}`}
                onClick={() => setFilterType('movers')}
                whileTap={{ scale: 0.95 }}
              >
                Top Movers
              </motion.button>
              <motion.button
                className={`filter-btn ${filterType === 'watchlist' ? 'active' : ''}`}
                onClick={() => setFilterType('watchlist')}
                whileTap={{ scale: 0.95 }}
              >
                Watchlist
              </motion.button>
              <motion.button
                className={`filter-btn ${filterType === 'new' ? 'active' : ''}`}
                onClick={() => setFilterType('new')}
                whileTap={{ scale: 0.95 }}
              >
                Newly Indexed
              </motion.button>
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
                {filteredAgents.map((agent, index) => (
                  <motion.tr
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.4) }}
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.035)', x: 3 }}
                    style={{ cursor: 'pointer' }}
                  >
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
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Agent Detail Modal */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            className="modal-backdrop"
            onClick={() => setSelectedAgent(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            >
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
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--crimson)' }}>
                    <CountUpNumber to={selectedAgent.score} decimals={1} duration={1.5} />
                  </div>
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
                  <b><CountUpNumber to={selectedAgent.activeWallets30d} duration={1.8} /></b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>GitHub Commits (30d):</span>
                  <b><CountUpNumber to={selectedAgent.commits30d} suffix=" commits" duration={1.8} /></b>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.78rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Disclosure Completeness (30%):</span>
                    <b>{selectedAgent.disclosureScore}/100</b>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', background: 'var(--crimson)', borderRadius: '3px' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedAgent.disclosureScore}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>On-Chain Consistency (35%):</span>
                    <b>{selectedAgent.consistencyScore}/100</b>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', background: 'var(--brass)', borderRadius: '3px' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedAgent.consistencyScore}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Incident Response (20%):</span>
                    <b>{selectedAgent.incidentScore}/100</b>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', background: 'var(--up)', borderRadius: '3px' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedAgent.incidentScore}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Independence of Code (15%):</span>
                    <b>{selectedAgent.independenceScore}/100</b>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', background: 'var(--ink-soft)', borderRadius: '3px' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedAgent.independenceScore}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                    />
                  </div>
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
              ) : null}
              <motion.button
                className="btn-dark"
                onClick={() => setSelectedAgent(null)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      <footer>
        <div className="wrap">
          <div className="foot-row">
            <span>Ordinal: The Web3 AI Agent Index</span>
            <span>Independent Editorial Desk</span>
            <span>ordinal.tech</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
