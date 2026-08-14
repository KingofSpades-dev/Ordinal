import React, { useState } from 'react';
import { BUILD_LOG_ENTRIES, type LogEntryType } from '../data/buildLogData';
import { OrdoNavbar } from '../components/OrdoNavbar';

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
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--paper-bg, #FAF6EE)',
        color: 'var(--ink, #1B2A4A)',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1200px',
          height: '500px',
          background: 'radial-gradient(circle at 50% 10%, rgba(99, 29, 36, 0.06) 0%, rgba(163, 126, 54, 0.03) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <OrdoNavbar onNavigate={onNavigate} currentPath="/log" />

        <main style={{ maxWidth: '840px', margin: '32px auto 80px auto', padding: '0 24px' }}>
          {/* Back Link */}
          <div style={{ marginBottom: '20px' }}>
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
                padding: 0
              }}
            >
              ← Return to Institutional Record
            </button>
          </div>

          {/* Header */}
          <header style={{ marginBottom: '28px' }}>
            <div
              style={{
                fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2px',
                color: 'var(--brass, #A37E36)',
                textTransform: 'uppercase',
                marginBottom: '10px'
              }}
            >
              PUBLIC BUILD LOG
            </div>
            <h1
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: '36px',
                fontWeight: 700,
                color: 'var(--burgundy, #631D24)',
                margin: '0 0 12px 0',
                letterSpacing: '-0.5px'
              }}
            >
              Chronological Change Register
            </h1>
            <p
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: '16.5px',
                lineHeight: 1.6,
                color: 'var(--ink, #1B2A4A)',
                margin: 0
              }}
            >
              An append-only record of system deployments, recalibrations, and structural corrections.
            </p>
          </header>

          {/* Unified Institutional Metrics Strip */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid var(--line-2, #E2D9CC)',
              borderRadius: '10px',
              padding: '20px 28px',
              boxShadow: '0 4px 20px rgba(27, 42, 74, 0.03)',
              marginBottom: '28px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1.2fr',
              gap: '24px',
              alignItems: 'center',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            <div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--ink-soft, #7A869A)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                Total Deployed Entries
              </div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--burgundy, #631D24)', fontFamily: 'Georgia, serif', marginTop: '2px' }}>
                {totalEntries}
              </div>
            </div>

            <div style={{ borderLeft: '1px solid var(--line-2, #E2D9CC)', paddingLeft: '24px' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--ink-soft, #7A869A)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                Logged Corrections
              </div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#B91C1C', fontFamily: 'Georgia, serif', marginTop: '2px' }}>
                {correctionCount}
              </div>
            </div>

            <div style={{ borderLeft: '1px solid var(--line-2, #E2D9CC)', paddingLeft: '24px' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--ink-soft, #7A869A)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                Register Policy
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brass, #A37E36)', marginTop: '6px' }}>
                Append-Only & Transparent
              </div>
            </div>
          </div>

          {/* Unified Timeline Container */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid var(--line-2, #E2D9CC)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 6px 28px rgba(27, 42, 74, 0.04)'
            }}
          >
            {/* Embedded Toolbar (Filter Pills + Search Bar) */}
            <div
              style={{
                padding: '18px 28px',
                background: 'var(--paper-bg, #FAF6EE)',
                borderBottom: '1px solid var(--line-2, #E2D9CC)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              {/* Category Filter Pills */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {(
                  [
                    { id: 'all', label: 'All Log Entries' },
                    { id: 'feature', label: 'Features' },
                    { id: 'correction', label: 'Corrections & Reversals' }
                  ] as const
                ).map((tab) => {
                  const isActive = filterType === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setFilterType(tab.id as any)}
                      style={{
                        background: isActive ? 'var(--burgundy, #631D24)' : '#FFFFFF',
                        color: isActive ? '#FFFFFF' : 'var(--ink-soft, #5A6578)',
                        border: isActive ? '1px solid var(--burgundy, #631D24)' : '1px solid #E2D9CC',
                        borderRadius: '6px',
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: isActive ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isActive ? '0 2px 6px rgba(99, 29, 36, 0.2)' : 'none'
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div style={{ position: 'relative', width: '220px' }}>
                <input
                  type="text"
                  placeholder="Search change log..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #E2D9CC',
                    fontSize: '12px',
                    outline: 'none',
                    background: '#FFFFFF',
                    color: 'var(--ink, #1B2A4A)',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                />
              </div>
            </div>

            {/* Change Log Entries */}
            <div style={{ padding: '36px 36px 36px 48px' }}>
              {filteredEntries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-soft, #7A869A)', fontFamily: 'Georgia, serif' }}>
                  No change log entries match your filter criteria.
                </div>
              ) : (
                <div style={{ position: 'relative', paddingLeft: '24px' }}>
                  {/* Continuous Vertical Timeline Line */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      bottom: '8px',
                      left: '5px',
                      width: '2px',
                      background: 'var(--line-2, #E2D9CC)'
                    }}
                  />

                  {filteredEntries.map((entry, index) => {
                    const isCorrection = entry.type === 'correction' || entry.type === 'reversal';

                    return (
                      <div
                        key={entry.id}
                        style={{
                          position: 'relative',
                          marginBottom: index < filteredEntries.length - 1 ? '24px' : 0,
                          paddingBottom: index < filteredEntries.length - 1 ? '24px' : 0,
                          borderBottom: index < filteredEntries.length - 1 ? '1px dashed #F3ECE2' : 'none'
                        }}
                      >
                        {/* Timeline Node Dot */}
                        <div
                          style={{
                            position: 'absolute',
                            left: '-24px',
                            top: '4px',
                            transform: 'translateX(-50%)',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: isCorrection ? '#B91C1C' : 'var(--burgundy, #631D24)',
                            border: '3px solid #FFFFFF',
                            boxShadow: isCorrection ? '0 0 0 1px #FCA5A5' : '0 0 0 1px var(--line-2, #E2D9CC)'
                          }}
                        />

                        {/* Top Line (Date + Type Badge) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <span
                            style={{
                              fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                              fontSize: '12px',
                              fontWeight: 700,
                              color: 'var(--brass, #A37E36)'
                            }}
                          >
                            {entry.date}
                          </span>

                          {isCorrection ? (
                            <span
                              style={{
                                fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                                fontSize: '10px',
                                fontWeight: 700,
                                color: '#B91C1C',
                                background: '#FEE2E2',
                                border: '1px solid #FCA5A5',
                                padding: '1.5px 7px',
                                borderRadius: '4px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.8px'
                              }}
                            >
                              {entry.type}
                            </span>
                          ) : (
                            <span
                              style={{
                                fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                                fontSize: '10px',
                                fontWeight: 700,
                                color: 'var(--burgundy, #631D24)',
                                background: 'rgba(99, 29, 36, 0.07)',
                                border: '1px solid rgba(99, 29, 36, 0.15)',
                                padding: '1.5px 7px',
                                borderRadius: '4px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.8px'
                              }}
                            >
                              DEPLOYMENT
                            </span>
                          )}
                        </div>

                        {/* Description Sentence */}
                        <div
                          style={{
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            fontSize: '14.5px',
                            lineHeight: 1.6,
                            color: 'var(--ink, #1B2A4A)',
                            fontWeight: 450
                          }}
                        >
                          {entry.summary}

                          {entry.link && (
                            <span style={{ marginLeft: '10px', display: 'inline-block' }}>
                              <button
                                onClick={() => onNavigate(entry.link!)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--burgundy, #631D24)',
                                  fontSize: '13px',
                                  fontFamily: 'system-ui, -apple-system, sans-serif',
                                  fontWeight: 600,
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                  padding: 0
                                }}
                              >
                                [{entry.linkText || 'Inspect Link'}]
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
