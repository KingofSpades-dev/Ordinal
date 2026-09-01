import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BUILD_LOG_ENTRIES, type LogEntryType } from '../data/buildLogData';
import { OrdinalNavbar } from '../components/OrdinalNavbar';
import { CountUpNumber } from '../components/CountUpNumber';

interface BuildLogViewProps {
  onNavigate: (path: string) => void;
}

export const BuildLogView: React.FC<BuildLogViewProps> = ({ onNavigate }) => {
  const [filterType, setFilterType] = useState<'all' | LogEntryType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = BUILD_LOG_ENTRIES.filter((entry) => {
    const matchesType =
      filterType === 'all'
        ? true
        : filterType === 'correction'
          ? entry.type === 'correction' || entry.type === 'reversal'
          : entry.type === filterType;

    const matchesSearch =
      entry.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.date.includes(searchQuery);

    return matchesType && matchesSearch;
  });

  const totalEntries = BUILD_LOG_ENTRIES.length;
  const correctionCount = BUILD_LOG_ENTRIES.filter((e) => e.type === 'correction' || e.type === 'reversal').length;

  return (
    <div className="ordinal-app">
      <OrdinalNavbar currentPath="/log" onNavigate={onNavigate} />

      <div className="ticker-band">
        <div className="ticker-track">
          <span>PUBLIC BUILD LOG · APPEND-ONLY AUDIT TRAIL · DEPLOYMENTS & SYSTEM RECALIBRATIONS</span>
          <span>PUBLIC BUILD LOG · APPEND-ONLY AUDIT TRAIL · DEPLOYMENTS & SYSTEM RECALIBRATIONS</span>
        </div>
      </div>

      <main className="wrap" style={{ maxWidth: '920px', margin: '40px auto 80px', padding: '0 24px' }}>

        <div className="kicker">Public Build Log</div>
        <motion.h1
          className="headline"
          style={{ fontSize: 'clamp(2.2rem, 4.8vw, 3.4rem)', margin: '14px 0 16px' }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Chronological Change Register
        </motion.h1>
        <p className="dek" style={{ fontSize: '1.15rem', maxWidth: '720px', marginBottom: '32px' }}>
          An append-only, public record of system deployments, parameter recalibrations, and telemetry corrections.
        </p>

        {/* Ledger summary */}
        <div className="ledger" style={{ marginBottom: '36px' }}>
          <div className="ledger-cell">
            <div className="ledger-num">
              <CountUpNumber to={totalEntries} duration={1.8} />
            </div>
            <div className="ledger-label">Total Logged Deployments</div>
          </div>
          <div className="ledger-cell">
            <div className="ledger-num">
              <CountUpNumber to={correctionCount} duration={1.8} />
            </div>
            <div className="ledger-label">Published Corrections</div>
          </div>
          <div className="ledger-cell">
            <div className="ledger-num">
              <CountUpNumber to={100} suffix="%" duration={1.5} />
            </div>
            <div className="ledger-label">Audit Transparency</div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-row" style={{ marginBottom: '32px' }}>
          <div className="filter-row">
            <motion.button
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
              whileTap={{ scale: 0.95 }}
            >
              All Entries ({totalEntries})
            </motion.button>
            <motion.button
              className={`filter-btn ${filterType === 'feature' ? 'active' : ''}`}
              onClick={() => setFilterType('feature')}
              whileTap={{ scale: 0.95 }}
            >
              Deployments
            </motion.button>
            <motion.button
              className={`filter-btn ${filterType === 'correction' ? 'active' : ''}`}
              onClick={() => setFilterType('correction')}
              whileTap={{ scale: 0.95 }}
            >
              Corrections ({correctionCount})
            </motion.button>
          </div>

          <input
            type="text"
            className="search-input"
            placeholder="Search entries or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Entries list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredEntries.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.4) }}
              whileHover={{ x: 4, backgroundColor: 'rgba(0,0,0,0.02)' }}
              style={{
                border: '1px solid var(--rule)',
                borderLeft: entry.type === 'correction' ? '4px solid var(--crimson)' : '4px solid var(--brass)',
                padding: '20px 24px',
                background: 'var(--paper)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div style={{ flex: '1 1 500px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.72rem', color: 'var(--ink-soft)', fontWeight: 600 }}>
                    {entry.date}
                  </span>
                  <span
                    className="badge"
                    style={{
                      color: entry.type === 'correction' ? 'var(--crimson)' : 'var(--brass)',
                      background: entry.type === 'correction' ? 'var(--crimson-soft)' : 'var(--brass-soft)'
                    }}
                  >
                    {entry.type.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem', color: 'var(--ink-faint)' }}>
                    #{entry.id}
                  </span>
                </div>
                <div style={{ fontSize: '0.98rem', lineHeight: '1.6', color: 'var(--ink)' }}>
                  {entry.summary}
                </div>
              </div>

              {entry.link && (
                <motion.button
                  onClick={() => onNavigate(entry.link!)}
                  className="btn"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.72rem',
                    color: 'var(--ink)',
                    borderColor: 'var(--ink)',
                    flexShrink: 0
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {entry.linkText || 'View Reference →'}
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      </main>

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
