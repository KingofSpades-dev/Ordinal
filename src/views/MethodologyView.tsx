import React from 'react';
import { OrdinalNavbar } from '../components/OrdinalNavbar';

interface MethodologyViewProps {
  onNavigate?: (path: string) => void;
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({ onNavigate }) => {
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

  return (
    <div className="ordinal-app">
      <OrdinalNavbar currentPath="/methodology" onNavigate={navigateTo} />

      {/* Ticker Band */}
      <div className="ticker-band">
        <div className="ticker-track">
          <span>ORDINAL AUDIT RUBRIC · FOUR WEIGHTED CRITERIA · ROLLING EVALUATION · ZERO PAID PLACEMENT</span>
          <span>ORDINAL AUDIT RUBRIC · FOUR WEIGHTED CRITERIA · ROLLING EVALUATION · ZERO PAID PLACEMENT</span>
        </div>
      </div>

      <main id="page-method">
        <div className="wrap page-head">
          <div className="kicker">Audit Rubric & Standards</div>
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

          <div style={{ marginTop: '48px', borderTop: '1px solid var(--rule)', paddingTop: '32px' }}>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.4rem', margin: '0 0 16px 0' }}>
              Key Awards Tier System
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ border: '1px solid var(--rule)', padding: '20px', background: 'var(--paper-dim)' }}>
                <div style={{ color: 'var(--brass)', fontSize: '1.4rem', marginBottom: '8px' }}>★★★</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Three Keys: Benchmark Grade
                </div>
                <p style={{ fontSize: '0.88rem', lineHeight: '1.6', margin: 0, color: 'var(--ink-soft)' }}>
                  A category-defining agent with flawless public disclosures, multichain verified telemetry, audited multisig custody, and verified public repository.
                </p>
              </div>

              <div style={{ border: '1px solid var(--rule)', padding: '20px', background: 'var(--paper-dim)' }}>
                <div style={{ color: 'var(--brass)', fontSize: '1.4rem', marginBottom: '8px' }}>★★☆</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Two Keys: Exemplary
                </div>
                <p style={{ fontSize: '0.88rem', lineHeight: '1.6', margin: 0, color: 'var(--ink-soft)' }}>
                  Exemplary execution, high telemetry consistency, public smart contracts, and active incident mitigation protocols.
                </p>
              </div>

              <div style={{ border: '1px solid var(--rule)', padding: '20px', background: 'var(--paper-dim)' }}>
                <div style={{ color: 'var(--brass)', fontSize: '1.4rem', marginBottom: '8px' }}>★☆☆</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                  One Key: Notable
                </div>
                <p style={{ fontSize: '0.88rem', lineHeight: '1.6', margin: 0, color: 'var(--ink-soft)' }}>
                  Notable on-chain utility with baseline transparency and verifiable wallet transaction graphs.
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '48px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn-dark" onClick={() => navigateTo('/rankings')}>
              View Full Leaderboard
            </button>
            <button className="btn" style={{ color: 'var(--ink)', borderColor: 'var(--ink)' }} onClick={() => navigateTo('/apply')}>
              Submit an Agent for Evaluation
            </button>
          </div>
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
