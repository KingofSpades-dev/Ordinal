import React from 'react';
import { QUALIFIED_NOTICE_DATA } from '../data/buildStages';
import { OrdoNavbar } from '../components/OrdoNavbar';
import { PreviewBadge } from '../components/PreviewBadge';

interface QualifiedNoticeViewProps {
  onNavigate: (path: string) => void;
}

export const QualifiedNoticeView: React.FC<QualifiedNoticeViewProps> = ({ onNavigate }) => {
  const { eyebrow, headline, description, expectedPublication, currentStage, allStages } = QUALIFIED_NOTICE_DATA;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--paper-bg, #FAF6EE)',
        color: 'var(--ink, #1B2A4A)',
        fontFamily: '"Times New Roman", Times, serif',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* Background Ambient Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1200px',
          height: '600px',
          background: 'radial-gradient(circle at 50% 15%, rgba(99, 29, 36, 0.07) 0%, rgba(163, 126, 54, 0.04) 45%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <OrdoNavbar onNavigate={onNavigate} currentPath="/qualified" />

        <main style={{ maxWidth: '840px', margin: '32px auto 80px auto', padding: '0 24px' }}>
          {/* Back Link */}
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => onNavigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--burgundy, #631D24)',
                fontSize: '13px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: 0,
                transition: 'opacity 0.2s'
              }}
            >
              ← Return to Institutional Record
            </button>
          </div>

          {/* Main Notice Card */}
          <article
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid var(--line-2, #E2D9CC)',
              borderRadius: '12px',
              padding: '48px 44px',
              boxShadow: '0 8px 32px rgba(27, 42, 74, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)',
              position: 'relative'
            }}
          >
            {/* Top Tag & Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  color: 'var(--brass, #A37E36)',
                  textTransform: 'uppercase'
                }}
              >
                {eyebrow}
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--burgundy, #631D24)',
                  background: 'rgba(99, 29, 36, 0.06)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  border: '1px solid rgba(99, 29, 36, 0.15)'
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: 'var(--burgundy, #631D24)',
                    boxShadow: '0 0 0 3px rgba(99, 29, 36, 0.2)'
                  }}
                />
                Active Stage: {currentStage}
              </div>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: '40px',
                fontWeight: 700,
                lineHeight: 1.15,
                color: 'var(--burgundy, #631D24)',
                margin: '0 0 20px 0',
                letterSpacing: '-0.5px'
              }}
            >
              {headline}
            </h1>

            {/* Scope Paragraph */}
            <p
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: '18px',
                lineHeight: 1.65,
                color: 'var(--ink, #1B2A4A)',
                margin: '0 0 36px 0'
              }}
            >
              {description}
            </p>

            {/* Metadata Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                padding: '24px',
                background: 'var(--paper-bg, #FAF6EE)',
                borderRadius: '8px',
                border: '1px solid var(--line-2, #E2D9CC)',
                marginBottom: '36px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--brass, #A37E36)', marginBottom: '4px' }}>
                  Target Publication Window
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink, #1B2A4A)', fontFamily: 'Georgia, serif' }}>
                  {expectedPublication}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--brass, #A37E36)', marginBottom: '4px' }}>
                  Access Requirement
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink, #1B2A4A)' }}>
                  Public & Permissionless (No Wallet Approval)
                </div>
              </div>
            </div>

            {/* Development Pipeline Visual */}
            <div style={{ marginBottom: '40px' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  color: 'var(--ink-soft, #7A869A)',
                  marginBottom: '16px',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                Development Stage Progress
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {allStages.map((stage, idx) => {
                  const isCurrent = stage === currentStage;
                  const isPast = allStages.indexOf(stage) < allStages.indexOf(currentStage);

                  return (
                    <div
                      key={stage}
                      style={{
                        padding: '14px 12px',
                        borderRadius: '8px',
                        background: isCurrent
                          ? '#FFFFFF'
                          : isPast
                          ? 'rgba(163, 126, 54, 0.06)'
                          : 'rgba(0, 0, 0, 0.02)',
                        border: isCurrent
                          ? '1.5px solid var(--burgundy, #631D24)'
                          : isPast
                          ? '1px solid rgba(163, 126, 54, 0.3)'
                          : '1px dashed #E2D9CC',
                        boxShadow: isCurrent ? '0 4px 12px rgba(99, 29, 36, 0.1)' : 'none',
                        position: 'relative'
                      }}
                    >
                      <div
                        style={{
                          fontSize: '10px',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: isCurrent ? 'var(--burgundy, #631D24)' : isPast ? 'var(--brass, #A37E36)' : '#9CA3AF',
                          marginBottom: '6px'
                        }}
                      >
                        0{idx + 1}. {isPast ? 'COMPLETED' : isCurrent ? 'IN PROGRESS' : 'UPCOMING'}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: isCurrent ? 700 : 500,
                          color: isCurrent ? 'var(--burgundy, #631D24)' : isPast ? 'var(--ink, #1B2A4A)' : '#9CA3AF',
                          lineHeight: 1.35
                        }}
                      >
                        {stage}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teaser Interface Mockup Preview */}
            <div
              style={{
                border: '1.5px solid var(--line-2, #E2D9CC)',
                borderRadius: '10px',
                overflow: 'hidden',
                background: '#FAF6EE',
                marginBottom: '40px'
              }}
            >
              <div
                style={{
                  background: '#FFFFFF',
                  padding: '12px 18px',
                  borderBottom: '1px solid var(--line-2, #E2D9CC)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ink-soft, #7A869A)' }}>
                    qualified_volume_engine_v1.spec
                  </span>
                </div>
                <PreviewBadge />
              </div>

              {/* Structural Mockup Content (Strictly no fabricated numeric data) */}
              <div style={{ padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ background: '#FFF', padding: '16px', borderRadius: '6px', border: '1px solid #E2D9CC' }}>
                    <div style={{ fontSize: '10px', color: '#7A869A', fontWeight: 700, textTransform: 'uppercase' }}>Filter Standard</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--burgundy, #631D24)', marginTop: '4px', fontFamily: 'Georgia, serif' }}>Organic Liquidity v1</div>
                  </div>
                  <div style={{ background: '#FFF', padding: '16px', borderRadius: '6px', border: '1px solid #E2D9CC' }}>
                    <div style={{ fontSize: '10px', color: '#7A869A', fontWeight: 700, textTransform: 'uppercase' }}>Filtered Delta</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink, #1B2A4A)', marginTop: '4px', fontFamily: 'monospace' }}>—</div>
                  </div>
                  <div style={{ background: '#FFF', padding: '16px', borderRadius: '6px', border: '1px solid #E2D9CC' }}>
                    <div style={{ fontSize: '10px', color: '#7A869A', fontWeight: 700, textTransform: 'uppercase' }}>Verification Status</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brass, #A37E36)', marginTop: '6px' }}>PENDING RELEASE</div>
                  </div>
                </div>

                <div style={{ background: '#FFF', borderRadius: '6px', border: '1px solid #E2D9CC', padding: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft, #7A869A)', marginBottom: '10px', textTransform: 'uppercase' }}>
                    Evaluated Agent Telemetry Preview
                  </div>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--ink-soft, #5A6578)', lineHeight: 1.8 }}>
                    <div>[✓] Raw Volume Input Stream ............. [LISTENING]</div>
                    <div>[✓] Wash-Loop Filter Matrix ............. [CONFIGURED]</div>
                    <div>[▶] Cross-DEX Swap Verification ......... [IN_TESTING]</div>
                    <div>[ ] Organic Volume Settlement Output .... [PENDING]</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Principles Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '36px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <div style={{ padding: '20px', borderRadius: '8px', background: 'var(--paper-bg, #FAF6EE)', border: '1px solid #E2D9CC' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(163, 126, 54, 0.12)', border: '1px solid rgba(163, 126, 54, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brass, #A37E36)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 700, color: 'var(--burgundy, #631D24)', fontFamily: 'Georgia, serif' }}>
                  Organic Filtering
                </h4>
                <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5, color: 'var(--ink-soft, #5A6578)' }}>
                  Isolates genuine user transactions from synthetic volume spikes generated by automated bots.
                </p>
              </div>

              <div style={{ padding: '20px', borderRadius: '8px', background: 'var(--paper-bg, #FAF6EE)', border: '1px solid #E2D9CC' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(99, 29, 36, 0.08)', border: '1px solid rgba(99, 29, 36, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--burgundy, #631D24)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                    <line x1="3" y1="21" x2="21" y2="3" stroke="var(--burgundy, #631D24)" strokeWidth="2" />
                  </svg>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 700, color: 'var(--burgundy, #631D24)', fontFamily: 'Georgia, serif' }}>
                  Loop Swap Erasure
                </h4>
                <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5, color: 'var(--ink-soft, #5A6578)' }}>
                  Discounts self-referential wallet swaps designed to inflate DEX volume rankings artificially.
                </p>
              </div>

              <div style={{ padding: '20px', borderRadius: '8px', background: 'var(--paper-bg, #FAF6EE)', border: '1px solid #E2D9CC' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(27, 42, 74, 0.08)', border: '1px solid rgba(27, 42, 74, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink, #1B2A4A)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 700, color: 'var(--burgundy, #631D24)', fontFamily: 'Georgia, serif' }}>
                  Zero-Approval
                </h4>
                <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.5, color: 'var(--ink-soft, #5A6578)' }}>
                  Completely open and inspectable without requiring wallet signatures or token allowances.
                </p>
              </div>
            </div>

            {/* Footer Navigation */}
            <div style={{ textAlign: 'center', paddingTop: '16px', borderTop: '1px solid var(--line-2, #E2D9CC)' }}>
              <button
                onClick={() => onNavigate('/log')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--burgundy, #631D24)',
                  fontSize: '14px',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Inspect the Public Build Log & History →
              </button>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
};
