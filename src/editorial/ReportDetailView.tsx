import React, { useState } from 'react';
import { OrdoNavbar, OrdoKeyIcon } from '../components/OrdoNavbar';

export interface ReportData {
  agentName: string;
  slug: string;
  category: string;
  chains: string[];
  websiteUrl?: string;
  logoUrl?: string;
  dossierNumber: number;
  methodologyVersion: string;
  publicationDate: string;
  editorName: string;
  keyCount: number; // 0, 1, 2, 3
  verificationTier: string;
  standfirst: string;
  claim: string;
  evidence: {
    rawVolume: number;
    qualifiedVolume: number;
    uniqueWallets: number;
    retentionMonth1: number;
    retentionMonth2: number;
    retentionMonth3: number;
    top5WalletShare: number;
  };
  divergence: string;
  rubric: {
    verifiabilityScore: number;
    verifiabilityReason: string;
    activityScore: number;
    activityReason: string;
    maintenanceScore: number;
    maintenanceReason: string;
    securityScore: number;
    securityReason: string;
    adminPenalty?: number;
  };
  riskRegister: {
    auditStatus: string;
    adminKeys: string;
    timelock: string;
    multisig: string;
  };
  limitations: string[];
  verdict: string;
  rightOfReply?: {
    hasResponded: boolean;
    statement?: string;
    requestedAt: string;
  };
}

export const SAMPLE_REPORTS: Record<string, ReportData> = {
  'aixbt': {
    agentName: 'AIXBT',
    slug: 'aixbt',
    category: 'trading',
    chains: ['base'],
    websiteUrl: 'https://aixbt.tech/',
    logoUrl: 'https://unavatar.io/x/aixbt_agent',
    dossierNumber: 38,
    methodologyVersion: 'v0.1',
    publicationDate: '2026-08-10',
    editorName: 'Senior Editorial Board',
    keyCount: 0,
    verificationTier: 'registered',
    standfirst: 'AIXBT exhibits real commercial trading demand, but its closed-source repository and missing audit keep it unrated.',
    claim: 'AIXBT claims to be an autonomous trading & alpha market intelligence engine.',
    evidence: {
      rawVolume: 450000,
      qualifiedVolume: 320000,
      uniqueWallets: 3100,
      retentionMonth1: 82,
      retentionMonth2: 68,
      retentionMonth3: 54,
      top5WalletShare: 28,
    },
    divergence: 'While on-chain transaction volume is high, the underlying code repository is undisclosed (commits: 0), making security auditing impossible.',
    rubric: {
      verifiabilityScore: 15,
      verifiabilityReason: 'Documentation exists but source code repository is closed-source.',
      activityScore: 15,
      activityReason: 'Strong active wallet footprint over 3,100 addresses.',
      maintenanceScore: 0,
      maintenanceReason: 'Zero public commits in 30 days (Closed Source).',
      securityScore: 0,
      securityReason: 'No public audit report evidenced and unrestricted admin control keys.',
    },
    riskRegister: {
      auditStatus: 'No / Unknown',
      adminKeys: 'Risky / Retained',
      timelock: 'None',
      multisig: 'Unverified',
    },
    limitations: [
      'Open-source code repository: We could not verify source code or developer commit cadence.',
      'Security audit: No public smart contract audit reports were evidenced.',
    ],
    verdict: 'AIXBT is a capable trading intelligence assistant, but operates without open-source verifiability or public security audits.',
    rightOfReply: {
      hasResponded: true,
      statement: 'We are preparing our code repository for open-source audit in Q4 2026.',
      requestedAt: '2026-08-08',
    },
  },
  'nosana': {
    agentName: 'Nosana',
    slug: 'nosana',
    category: 'developer',
    chains: ['solana'],
    websiteUrl: 'https://nosana.io',
    logoUrl: 'https://unavatar.io/x/nosana_ci',
    dossierNumber: 39,
    methodologyVersion: 'v0.1',
    publicationDate: '2026-08-11',
    editorName: 'Senior Editorial Board',
    keyCount: 1,
    verificationTier: 'verified',
    standfirst: 'Nosana provides reliable decentralized GPU compute, earning 1 Key for notable developer utility.',
    claim: 'Nosana provides decentralized GPU computing grids for AI inference and training workloads.',
    evidence: {
      rawVolume: 850000,
      qualifiedVolume: 710000,
      uniqueWallets: 1734,
      retentionMonth1: 88,
      retentionMonth2: 74,
      retentionMonth3: 62,
      top5WalletShare: 19,
    },
    divergence: 'On-chain compute settlements are verified, though smart contract upgrade authority remains retained by multisig.',
    rubric: {
      verifiabilityScore: 25,
      verifiabilityReason: 'Complete docs, website, and GitHub repository available.',
      activityScore: 20,
      activityReason: '1,734 active wallets and strong GPU node volume.',
      maintenanceScore: 25,
      maintenanceReason: 'High developer activity with >80 commits in 30 days.',
      securityScore: 10,
      securityReason: 'Capped at 10 due to retained admin control keys.',
    },
    riskRegister: {
      auditStatus: 'Verified Public Audit',
      adminKeys: 'Risky / Retained',
      timelock: '48h Timelock',
      multisig: '3-of-5 Multisig',
    },
    limitations: [
      'Admin control keys: Upgradeability admin key structure remains retained by team multisig.',
    ],
    verdict: 'Nosana is an exemplary GPU compute provider for Web3 AI workloads.',
    rightOfReply: {
      hasResponded: false,
      requestedAt: '2026-08-09',
    },
  },
  'refused-agent': {
    agentName: 'Refused Rating Agent',
    slug: 'refused-agent',
    category: 'security',
    chains: ['ethereum'],
    dossierNumber: 40,
    methodologyVersion: 'v0.1',
    publicationDate: '2026-08-12',
    editorName: 'Senior Editorial Board',
    keyCount: 0,
    verificationTier: 'unrated',
    standfirst: 'Rating refused due to insufficient evidence and unverified smart contract deployment.',
    claim: 'Claimed to offer autonomous security scanning.',
    evidence: {
      rawVolume: 0,
      qualifiedVolume: 0,
      uniqueWallets: 0,
      retentionMonth1: 0,
      retentionMonth2: 0,
      retentionMonth3: 0,
      top5WalletShare: 0,
    },
    divergence: 'Declared capabilities could not be observed on-chain.',
    rubric: {
      verifiabilityScore: 5,
      verifiabilityReason: 'Incomplete documentation and dead website link.',
      activityScore: 0,
      activityReason: 'Zero verifiable active wallets.',
      maintenanceScore: 0,
      maintenanceReason: 'Zero public commits.',
      securityScore: 0,
      securityReason: 'No audit evidenced.',
    },
    riskRegister: {
      auditStatus: 'None',
      adminKeys: 'Unrestricted',
      timelock: 'None',
      multisig: 'None',
    },
    limitations: [
      'Insufficient evidence across 3 or more rubric dimensions.',
    ],
    verdict: 'ORDO Board refused to issue an editorial rating for this agent submission.',
  },
};

function AgentFavicon({ websiteUrl, logoUrl, name, size = 48 }: { websiteUrl?: string; logoUrl?: string; name: string; size?: number }) {
  const [imgErrorIndex, setImgErrorIndex] = useState(0);

  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flex: 'none',
    background: '#fff',
    border: '1.5px solid var(--line-2, #E2D9CC)',
    boxShadow: '0 2px 8px rgba(27, 42, 74, 0.05)',
  };

  const getFaviconSources = (): string[] => {
    const sources: string[] = [];
    if (logoUrl) sources.push(logoUrl);
    if (websiteUrl) {
      try {
        const domain = new URL(websiteUrl).hostname;
        sources.push(`https://icon.horse/icon/${domain}`);
        sources.push(`https://www.google.com/s2/favicons?sz=128&domain=${domain}`);
      } catch {
        // ignore
      }
    }
    return sources;
  };

  const sources = getFaviconSources();

  if (imgErrorIndex >= sources.length || sources.length === 0) {
    return (
      <div style={containerStyle}>
        <OrdoKeyIcon size={Math.round(size * 0.55)} />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <img
        src={sources[imgErrorIndex]}
        alt={name}
        onError={() => setImgErrorIndex(prev => prev + 1)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
      />
    </div>
  );
}

export function ReportsCatalogView({ onSelectReport }: { onSelectReport: (slug: string) => void }) {
  return (
    <div style={{ background: 'var(--paper, #F5F0E8)', minHeight: '100vh', color: 'var(--ink, #1B2A4A)', fontFamily: "'Inter', sans-serif" }}>
      {/* Reusable Ordo Navbar */}
      <OrdoNavbar currentPath="/reports" />

      {/* Hero Banner Section */}
      <section style={{ padding: '64px 0 48px 0', borderBottom: '1.5px solid var(--line-2, #E2D9CC)', background: 'radial-gradient(ellipse at top, rgba(245, 240, 232, 1) 0%, rgba(235, 226, 212, 0.8) 100%)' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--brass-soft, rgba(163, 126, 54, 0.12))', border: '1px solid var(--brass, #A37E36)', padding: '6px 14px', borderRadius: '20px', marginBottom: '16px' }}>
            <OrdoKeyIcon size={14} color="var(--brass, #A37E36)" />
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1.5px', color: 'var(--brass, #A37E36)', textTransform: 'uppercase' }}>EDITORIAL DOSSIER INDEX</span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '46px', fontWeight: 700, margin: '8px 0 16px 0', color: 'var(--ink, #1B2A4A)', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
            Independent Research Reports
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--ink-soft, #5A6578)', maxWidth: '680px', lineHeight: 1.6, margin: 0 }}>
            Full-length peer-reviewed editorial research dossiers, on-chain qualified volume audits, verifiability benchmarks, and official Ordo Key rating decisions.
          </p>
        </div>
      </section>

      {/* Reports Catalog Grid */}
      <div style={{ maxWidth: '1140px', margin: '48px auto 96px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          {Object.values(SAMPLE_REPORTS).map(rep => {
            const keyLabel = rep.keyCount === 3 ? "Three Keys: Benchmark" : rep.keyCount === 2 ? "Two Keys: Exemplary" : rep.keyCount === 1 ? "One Key: Notable" : "Registered, Unrated";

            return (
              <div
                key={rep.slug}
                onClick={() => onSelectReport(rep.slug)}
                style={{
                  background: '#fff',
                  border: '1.5px solid var(--line-2, #E2D9CC)',
                  borderLeft: '5px solid var(--brass, #A37E36)',
                  borderRadius: '12px',
                  padding: '32px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(27, 42, 74, 0.04)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--brass, #A37E36)';
                  e.currentTarget.style.borderLeftColor = 'var(--accent, #7C1522)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 36px rgba(163, 126, 54, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--line-2, #E2D9CC)';
                  e.currentTarget.style.borderLeftColor = 'var(--brass, #A37E36)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(27, 42, 74, 0.04)';
                }}
              >
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--brass, #A37E36)', textTransform: 'uppercase', letterSpacing: '1px', background: 'var(--brass-soft, rgba(163, 126, 54, 0.1))', padding: '5px 12px', borderRadius: '6px' }}>
                      DOSSIER #{rep.dossierNumber}
                    </span>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--ink-soft, #5A6578)', textTransform: 'uppercase', background: 'var(--paper, #F5F0E8)', padding: '5px 12px', borderRadius: '6px', border: '1px solid var(--line-2, #E2D9CC)' }}>
                      {rep.category}
                    </span>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', background: 'rgba(37, 99, 235, 0.08)', padding: '5px 12px', borderRadius: '6px' }}>
                      {rep.chains.join(', ').toUpperCase()}
                    </span>
                  </div>

                  {/* Ordo Key Award Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--paper, #F5F0E8)', padding: '6px 14px', borderRadius: '8px', border: '1.5px solid var(--brass, #A37E36)' }}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <OrdoKeyIcon key={i} size={16} color={i < rep.keyCount ? 'var(--brass, #A37E36)' : '#D0C5B4'} />
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: rep.keyCount > 0 ? 'var(--brass, #A37E36)' : 'var(--ink-soft, #5A6578)', letterSpacing: '0.5px' }}>
                      {keyLabel.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Title with Logo and Standfirst */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '6px 0 10px 0' }}>
                    <AgentFavicon websiteUrl={rep.websiteUrl} logoUrl={rep.logoUrl} name={rep.agentName} size={64} />
                    <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '28px', fontWeight: 700, margin: 0, color: 'var(--ink, #1B2A4A)', letterSpacing: '-0.015em' }}>
                      {rep.agentName}
                    </h2>
                  </div>
                  <p style={{ fontSize: '15.5px', color: 'var(--ink-soft, #5A6578)', margin: 0, lineHeight: 1.6, fontWeight: 400 }}>
                    "{rep.standfirst}"
                  </p>
                </div>

                {/* Metric Summary Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: 'var(--paper, #F5F0E8)', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--line-2, #E2D9CC)', marginTop: '4px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-soft, #5A6578)', textTransform: 'uppercase', fontWeight: 700 }}>Qualified Volume</div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#137333', marginTop: '2px' }}>${rep.evidence.qualifiedVolume.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-soft, #5A6578)', textTransform: 'uppercase', fontWeight: 700 }}>Active Users</div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink, #1B2A4A)', marginTop: '2px' }}>{rep.evidence.uniqueWallets.toLocaleString()} Wallets</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-soft, #5A6578)', textTransform: 'uppercase', fontWeight: 700 }}>Verification Tier</div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brass, #A37E36)', marginTop: '2px', textTransform: 'capitalize' }}>✓ {rep.verificationTier}</div>
                  </div>
                </div>

                {/* Footer link */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--line-2, #E2D9CC)', marginTop: '4px' }}>
                  <span style={{ fontSize: '12.5px', color: 'var(--ink-soft, #5A6578)' }}>
                    Published {rep.publicationDate} • Editor: <strong>{rep.editorName}</strong>
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--accent, #7C1522)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Read Full Dossier ↗
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ordo Footer */}
      <footer style={{ borderTop: '1.5px solid var(--line-2, #E2D9CC)', background: '#fff', padding: '48px 0', textAlign: 'center', fontSize: '13.5px', color: 'var(--ink-soft, #5A6578)' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <OrdoKeyIcon size={22} color="var(--accent, #7C1522)" />
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 700, color: 'var(--ink, #1B2A4A)' }}>Ordo Reputation Architecture</span>
          </div>
          <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: 'var(--ink, #1B2A4A)' }}>Verifiable. Objective. Independent Web3 AI Agent Ratings.</p>
          <p style={{ margin: 0, fontSize: '12px' }}>© 2026 Ordo Board. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} export function ReportDetailView({ report, onBack }: { report: ReportData; onBack: () => void }) {
  const keyLabel = report.keyCount === 3 ? "Three Keys: Benchmark" : report.keyCount === 2 ? "Two Keys: Exemplary" : report.keyCount === 1 ? "One Key: Notable" : "Registered, Unrated";

  return (
    <div style={{ background: 'var(--paper, #F5F0E8)', minHeight: '100vh', color: 'var(--ink, #1B2A4A)', fontFamily: "'Inter', sans-serif" }}>
      {/* Reusable Ordo Navbar */}
      <OrdoNavbar currentPath="/reports" />

      {/* Hero Header Section */}
      <section style={{ borderBottom: '1.5px solid var(--line-2, #E2D9CC)', background: 'linear-gradient(180deg, rgba(245, 240, 232, 1) 0%, rgba(238, 231, 220, 0.7) 100%)', padding: '36px 0 28px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {/* Breadcrumb & back button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button
              onClick={onBack}
              style={{
                background: '#fff',
                border: '1.5px solid var(--line-2, #E2D9CC)',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '13px',
                color: 'var(--ink, #1B2A4A)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ← Back to Reports Catalog
            </button>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brass, #A37E36)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              ORDO DOSSIER #{report.dossierNumber} • METHODOLOGY {report.methodologyVersion}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ background: 'var(--brass-soft, rgba(163, 126, 54, 0.12))', border: '1px solid var(--brass, #A37E36)', color: 'var(--brass, #A37E36)', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {report.category}
            </span>
            {report.chains.map(c => (
              <span key={c} style={{ background: 'rgba(37, 99, 235, 0.08)', color: '#2563eb', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                {c}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '8px 0 12px 0' }}>
            <AgentFavicon websiteUrl={report.websiteUrl} logoUrl={report.logoUrl} name={report.agentName} size={80} />
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '46px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em', color: 'var(--ink, #1B2A4A)' }}>
              {report.agentName}
            </h1>
          </div>

          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft, #5A6578)' }}>
            Published {report.publicationDate} • Editor: <strong style={{ color: 'var(--ink, #1B2A4A)' }}>{report.editorName}</strong> • Verification Tier: <span style={{ fontWeight: 800, color: 'var(--brass, #A37E36)', textTransform: 'capitalize' }}>✓ {report.verificationTier}</span>
          </p>
        </div>
      </section>

      {/* Main 2-Column Layout */}
      <main style={{ maxWidth: '1200px', margin: '36px auto 80px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '36px', alignItems: 'start' }}>

          {/* LEFT COLUMN: Main Research Analysis */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Standfirst Quote Card */}
            <div style={{ background: '#fff', border: '1.5px solid var(--line-2, #E2D9CC)', borderLeft: '6px solid var(--accent, #7C1522)', padding: '24px 28px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(27, 42, 74, 0.03)' }}>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 600, margin: 0, lineHeight: 1.5, color: 'var(--ink, #1B2A4A)' }}>
                "{report.standfirst}"
              </p>
            </div>

            {/* Section 1: The Claim */}
            <section style={{ background: '#fff', border: '1.5px solid var(--line-2, #E2D9CC)', borderRadius: '12px', padding: '28px', boxShadow: '0 4px 16px rgba(27, 42, 74, 0.03)' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', color: 'var(--brass, #A37E36)', textTransform: 'uppercase', margin: '0 0 14px 0' }}>1. The Claim</h3>
              <blockquote style={{ margin: 0, padding: '18px 22px', background: 'var(--paper, #F5F0E8)', border: '1px solid var(--line-2, #E2D9CC)', borderRadius: '8px', fontSize: '15px', fontStyle: 'italic', lineHeight: 1.6, color: 'var(--ink, #1B2A4A)' }}>
                "{report.claim}"
              </blockquote>
            </section>

            {/* Section 2: On-Chain Evidence & Metrics */}
            <section style={{ background: '#fff', border: '1.5px solid var(--line-2, #E2D9CC)', borderRadius: '12px', padding: '28px', boxShadow: '0 4px 16px rgba(27, 42, 74, 0.03)' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', color: 'var(--brass, #A37E36)', textTransform: 'uppercase', margin: '0 0 16px 0' }}>2. On-Chain Evidence &amp; Qualified Volume</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div style={{ border: '1.5px solid var(--line-2, #E2D9CC)', padding: '18px', borderRadius: '8px', background: 'var(--paper, #F5F0E8)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--ink-soft, #5A6578)', textTransform: 'uppercase', fontWeight: 700 }}>Qualified Settlement Volume</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#137333', marginTop: '4px' }}>${report.evidence.qualifiedVolume.toLocaleString()}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-soft, #5A6578)', marginTop: '2px' }}>Raw: ${report.evidence.rawVolume.toLocaleString()}</div>
                </div>
                <div style={{ border: '1.5px solid var(--line-2, #E2D9CC)', padding: '18px', borderRadius: '8px', background: 'var(--paper, #F5F0E8)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--ink-soft, #5A6578)', textTransform: 'uppercase', fontWeight: 700 }}>Distinct Paying Wallets</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px', color: 'var(--ink, #1B2A4A)' }}>{report.evidence.uniqueWallets.toLocaleString()}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-soft, #5A6578)', marginTop: '2px' }}>Verified Payers</div>
                </div>
                <div style={{ border: '1.5px solid var(--line-2, #E2D9CC)', padding: '18px', borderRadius: '8px', background: 'var(--paper, #F5F0E8)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--ink-soft, #5A6578)', textTransform: 'uppercase', fontWeight: 700 }}>Top 5 Payer Concentration</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: report.evidence.top5WalletShare > 50 ? 'var(--accent, #7C1522)' : 'var(--ink, #1B2A4A)', marginTop: '4px' }}>{report.evidence.top5WalletShare}%</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-soft, #5A6578)', marginTop: '2px' }}>Wallet Share</div>
                </div>
              </div>

              {/* Retention Bars */}
              <div style={{ border: '1.5px solid var(--line-2, #E2D9CC)', padding: '18px', borderRadius: '8px', background: 'var(--paper, #F5F0E8)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 700, color: 'var(--ink, #1B2A4A)' }}>Cohort Retention (Month 1 → Month 3)</h4>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span>Month 1 Retention</span>
                      <strong>{report.evidence.retentionMonth1}%</strong>
                    </div>
                    <div style={{ background: '#E2D9CC', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ background: '#2563eb', width: `${report.evidence.retentionMonth1}%`, height: '100%' }} />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span>Month 3 Retention</span>
                      <strong>{report.evidence.retentionMonth3}%</strong>
                    </div>
                    <div style={{ background: '#E2D9CC', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ background: '#137333', width: `${report.evidence.retentionMonth3}%`, height: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: The Divergence */}
            <section style={{ background: '#FFF5F5', border: '1.5px solid #F5C6CB', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 16px rgba(124, 21, 34, 0.04)' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', color: 'var(--accent, #7C1522)', textTransform: 'uppercase', margin: '0 0 10px 0' }}>3. The Divergence</h3>
              <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.6, color: '#7C1522' }}>
                {report.divergence}
              </p>
            </section>

            {/* Section 4: Rubric Breakdown */}
            <section style={{ background: '#fff', border: '1.5px solid var(--line-2, #E2D9CC)', borderRadius: '12px', padding: '28px', boxShadow: '0 4px 16px rgba(27, 42, 74, 0.03)' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', color: 'var(--brass, #A37E36)', textTransform: 'uppercase', margin: '0 0 16px 0' }}>4. Rubric Breakdown</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ border: '1.5px solid var(--line-2, #E2D9CC)', padding: '16px', borderRadius: '8px', background: 'var(--paper, #F5F0E8)' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink, #1B2A4A)' }}>Verifiability: {report.rubric.verifiabilityScore} / 25</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--ink-soft, #5A6578)', marginTop: '4px' }}>{report.rubric.verifiabilityReason}</div>
                </div>
                <div style={{ border: '1.5px solid var(--line-2, #E2D9CC)', padding: '16px', borderRadius: '8px', background: 'var(--paper, #F5F0E8)' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink, #1B2A4A)' }}>Activity: {report.rubric.activityScore} / 25</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--ink-soft, #5A6578)', marginTop: '4px' }}>{report.rubric.activityReason}</div>
                </div>
                <div style={{ border: '1.5px solid var(--line-2, #E2D9CC)', padding: '16px', borderRadius: '8px', background: 'var(--paper, #F5F0E8)' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink, #1B2A4A)' }}>Maintenance: {report.rubric.maintenanceScore} / 25</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--ink-soft, #5A6578)', marginTop: '4px' }}>{report.rubric.maintenanceReason}</div>
                </div>
                <div style={{ border: '1.5px solid var(--line-2, #E2D9CC)', padding: '16px', borderRadius: '8px', background: 'var(--paper, #F5F0E8)' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink, #1B2A4A)' }}>Security Posture: {report.rubric.securityScore} / 25</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--ink-soft, #5A6578)', marginTop: '4px' }}>{report.rubric.securityReason}</div>
                </div>
                <div style={{ border: '1.5px solid var(--line-2, #E2D9CC)', padding: '16px', borderRadius: '8px', gridColumn: 'span 2', background: (report.rubric.adminPenalty || 0) > 0 ? '#FFF5F5' : 'var(--paper, #F5F0E8)' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: (report.rubric.adminPenalty || 0) > 0 ? 'var(--accent, #7C1522)' : 'var(--ink, #1B2A4A)' }}>
                    Admin Control Penalty: {(report.rubric.adminPenalty || 0) > 0 ? `-${report.rubric.adminPenalty} pt` : '0 pt'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--ink-soft, #5A6578)', marginTop: '4px' }}>
                    {(report.rubric.adminPenalty || 0) > 0 ? 'Penalty applied for centralized or unverified admin keys.' : 'No centralized admin key penalty.'}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Verdict */}
            <section style={{ background: '#fff', border: '1.5px solid var(--line-2, #E2D9CC)', borderRadius: '12px', padding: '28px', boxShadow: '0 4px 16px rgba(27, 42, 74, 0.03)' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', color: 'var(--brass, #A37E36)', textTransform: 'uppercase', margin: '0 0 12px 0' }}>5. Editorial Verdict</h3>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: '19px', lineHeight: 1.6, margin: 0, color: 'var(--ink, #1B2A4A)' }}>
                {report.verdict}
              </p>
            </section>
          </div>

          {/* RIGHT COLUMN: Sidebar Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Key Award Seal Badge */}
            <div style={{ background: '#fff', border: '1.5px solid var(--brass, #A37E36)', borderTop: '6px solid var(--brass, #A37E36)', borderRadius: '12px', padding: '28px 24px', textAlign: 'center', boxShadow: '0 8px 24px rgba(163, 126, 54, 0.15)' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1.5px', color: 'var(--brass, #A37E36)', marginBottom: '10px' }}>OFFICIAL KEY AWARD</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '10px' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <OrdoKeyIcon key={i} size={32} color={i < report.keyCount ? 'var(--brass, #A37E36)' : '#D0C5B4'} />
                ))}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ink, #1B2A4A)', letterSpacing: '0.5px' }}>
                {keyLabel.toUpperCase()}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-soft, #5A6578)', marginTop: '6px' }}>
                Verified by ORDO Editorial Board
              </div>
            </div>

            {/* Risk Register Card */}
            <div style={{ background: '#fff', border: '1.5px solid var(--line-2, #E2D9CC)', borderRadius: '12px', padding: '22px', boxShadow: '0 4px 16px rgba(27, 42, 74, 0.03)' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brass, #A37E36)', letterSpacing: '1px' }}>Risk Register</h4>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', lineHeight: 1.85, color: 'var(--ink, #1B2A4A)' }}>
                <li><strong>Audit Status:</strong> {report.riskRegister.auditStatus}</li>
                <li><strong>Admin Keys:</strong> {report.riskRegister.adminKeys}</li>
                <li><strong>Timelock:</strong> {report.riskRegister.timelock}</li>
                <li><strong>Multisig Threshold:</strong> {report.riskRegister.multisig}</li>
              </ul>
            </div>

            {/* Limitations Card */}
            <div style={{ background: '#fff', border: '1.5px solid var(--line-2, #E2D9CC)', borderRadius: '12px', padding: '22px', boxShadow: '0 4px 16px rgba(27, 42, 74, 0.03)' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brass, #A37E36)', letterSpacing: '1px' }}>Limitations of Assessment</h4>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', lineHeight: 1.85, color: 'var(--ink, #1B2A4A)' }}>
                {report.limitations.map((lim, idx) => (
                  <li key={idx}>{lim}</li>
                ))}
              </ul>
            </div>

            {/* Right of Reply Card */}
            <div style={{ background: 'var(--paper, #F5F0E8)', border: '1.5px dashed var(--brass, #A37E36)', borderRadius: '12px', padding: '22px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brass, #A37E36)', letterSpacing: '1px' }}>Right of Reply (48h Standard)</h4>
              {report.rightOfReply?.hasResponded ? (
                <div style={{ fontStyle: 'italic', fontSize: '13.5px', lineHeight: 1.6, color: 'var(--ink, #1B2A4A)' }}>
                  "{report.rightOfReply.statement}"
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft, #5A6578)' }}>
                  The development team was invited to comment on {report.rightOfReply?.requestedAt || 'publication date'}. No statement was submitted prior to deadline.
                </p>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* Ordo Footer */}
      <footer style={{ borderTop: '1.5px solid var(--line-2, #E2D9CC)', background: '#fff', padding: '48px 0', textAlign: 'center', fontSize: '13.5px', color: 'var(--ink-soft, #5A6578)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <OrdoKeyIcon size={22} color="var(--accent, #7C1522)" />
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 700, color: 'var(--ink, #1B2A4A)' }}>Ordo Reputation Architecture</span>
          </div>
          <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: 'var(--ink, #1B2A4A)' }}>Verifiable. Objective. Independent Web3 AI Agent Ratings.</p>
          <p style={{ margin: 0, fontSize: '12px' }}>© 2026 Ordo Board. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
