import React from 'react';
import { QUALIFIED_NOTICE_DATA } from '../data/buildStages';
import { OrdinalNavbar } from '../components/OrdinalNavbar';

interface QualifiedNoticeViewProps {
  onNavigate: (path: string) => void;
}

export const QualifiedNoticeView: React.FC<QualifiedNoticeViewProps> = ({ onNavigate }) => {
  const { eyebrow, headline, description, expectedPublication, currentStage, allStages } = QUALIFIED_NOTICE_DATA;

  return (
    <div className="ordinal-app">
      <OrdinalNavbar currentPath="/qualified" onNavigate={onNavigate} />

      <div className="ticker-band">
        <div className="ticker-track">
          <span>QUALIFIED VOLUME ENGINE · INSTITUTIONAL TELEMETRY FILTER · REMOVING WASH TRADES & CIRCULAR ROUTING</span>
          <span>QUALIFIED VOLUME ENGINE · INSTITUTIONAL TELEMETRY FILTER · REMOVING WASH TRADES & CIRCULAR ROUTING</span>
        </div>
      </div>

      <main className="wrap" style={{ maxWidth: '920px', margin: '40px auto 80px', padding: '0 24px' }}>
        <div className="kicker">{eyebrow || 'Telemetry Specification'}</div>
        <h1 className="headline" style={{ fontSize: 'clamp(2.2rem, 4.8vw, 3.4rem)', margin: '14px 0 16px' }}>
          {headline}
        </h1>
        <p className="dek" style={{ fontSize: '1.2rem', maxWidth: '760px', marginBottom: '32px' }}>
          {description}
        </p>

        {/* Status Strip */}
        <div className="ledger" style={{ marginBottom: '40px' }}>
          <div className="ledger-cell">
            <div className="ledger-num" style={{ fontSize: '1.8rem' }}>{currentStage}</div>
            <div className="ledger-label">Current Pipeline Phase</div>
          </div>
          <div className="ledger-cell">
            <div className="ledger-num">{expectedPublication}</div>
            <div className="ledger-label">Target General Availability</div>
          </div>
          <div className="ledger-cell">
            <div className="ledger-num">0%</div>
            <div className="ledger-label">Wash Trading Tolerance</div>
          </div>
        </div>

        {/* Development Stages */}
        <section style={{ border: '1px solid var(--ink)', padding: '28px', background: 'var(--paper)', marginBottom: '36px' }}>
          <div className="aside-title">Development & Verification Roadmap</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            {allStages.map((stageName, idx) => {
              const currentStageIndex = allStages.indexOf(currentStage);
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div
                  key={stageName}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderLeft: isCurrent ? '4px solid var(--crimson)' : isPast ? '4px solid var(--brass)' : '4px solid var(--rule)',
                    background: isCurrent ? 'var(--paper-dim)' : 'transparent'
                  }}
                >
                  <div>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-soft)' }}>
                      STAGE 0{idx + 1} ·
                    </span>{' '}
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{stageName}</span>
                  </div>
                  <span
                    className="badge"
                    style={{
                      color: isCurrent ? 'var(--crimson)' : isPast ? 'var(--brass)' : 'var(--ink-soft)',
                      background: isCurrent ? 'var(--crimson-soft)' : isPast ? 'var(--brass-soft)' : 'transparent'
                    }}
                  >
                    {isPast ? 'COMPLETE' : isCurrent ? 'IN PROGRESS' : 'QUEUED'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Methodology explanation */}
        <section style={{ background: 'var(--paper-dim)', padding: '24px', borderLeft: '4px solid var(--brass)' }}>
          <div className="aside-title" style={{ color: 'var(--brass)' }}>Why Qualified Volume Matters</div>
          <p style={{ fontSize: '0.96rem', lineHeight: '1.7', margin: 0, color: 'var(--ink)' }}>
            Raw volume on decentralized exchanges is vulnerable to self-dealing and automated circular loops.
            Ordinal filters all transaction graph telemetry through cluster-detection algorithms to isolate genuine commercial demand from subsidized liquidity farming.
          </p>
        </section>
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
