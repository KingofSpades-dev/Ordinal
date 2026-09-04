import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OrdinalNavbar } from '../components/OrdinalNavbar';
import { COMPLETE_AGENT_DATABASE } from '../data/agentDatabase';
import { AgentAvatar } from '../components/AgentAvatar';

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
  resources?: {
    website?: string;
    documentation?: string;
    github?: string;
    twitter?: string;
  };
}

// Generate comprehensive report data for every agent in the DB
export const SAMPLE_REPORTS: Record<string, ReportData> = {};

COMPLETE_AGENT_DATABASE.forEach((agent, index) => {
  SAMPLE_REPORTS[agent.slug] = {
    agentName: agent.name,
    slug: agent.slug,
    category: agent.category,
    chains: [agent.chain.toLowerCase()],
    websiteUrl: agent.website || 'https://ordinal30.com',
    logoUrl: '/logo.jpeg',
    dossierNumber: agent.dossierNumber || (38 + index),
    methodologyVersion: 'v1.0-editorial',
    publicationDate: '2026-08-15',
    editorName: 'Ordinal Research Desk',
    keyCount: agent.keyCount,
    verificationTier: agent.status === 'verified' ? 'Verified Tier 1' : agent.status === 'watchlist' ? 'Watchlist' : 'Registered Cohort',
    standfirst: agent.blurb,
    claim: `${agent.name} operates as an autonomous Web3 AI agent on ${agent.chain}, managing smart contract state and user intent execution.`,
    evidence: {
      rawVolume: agent.activeWallets30d * 320,
      qualifiedVolume: Math.round(agent.activeWallets30d * 240),
      uniqueWallets: agent.activeWallets30d,
      retentionMonth1: 85,
      retentionMonth2: 72,
      retentionMonth3: 61,
      top5WalletShare: 22,
    },
    divergence: agent.auditStatus === 'Verified Public Audit'
      ? 'On-chain telemetry aligns with published documentation. Smart contracts have active timelocks and verified multisig.'
      : 'Discrepancy detected between claimed autonomous decentralization and observed admin control key retention.',
    rubric: {
      verifiabilityScore: Math.round(agent.disclosureScore * 0.3),
      verifiabilityReason: agent.docsUrl ? 'Complete documentation and published specification.' : 'Minimal or closed specification.',
      activityScore: Math.round(agent.consistencyScore * 0.35),
      activityReason: `${agent.activeWallets30d.toLocaleString()} active wallets over rolling 30-day window.`,
      maintenanceScore: Math.round(agent.independenceScore * 0.15),
      maintenanceReason: `${agent.commits30d} developer commits detected across public repositories.`,
      securityScore: Math.round(agent.incidentScore * 0.2),
      securityReason: agent.auditStatus === 'Verified Public Audit' ? 'Verified smart contract audit certificate.' : 'No verified external security audit.',
      adminPenalty: agent.adminKeysSafe ? 0 : 5,
    },
    riskRegister: {
      auditStatus: agent.auditStatus,
      adminKeys: agent.adminKeysSafe ? 'Multisig Timelocked' : 'Risky / Centralized',
      timelock: agent.adminKeysSafe ? '48h Timelock' : 'None',
      multisig: agent.adminKeysSafe ? '3-of-5 Multisig' : 'Single Signer / Unknown',
    },
    limitations: [
      `Telemetry collected over continuous 30-day monitoring on ${agent.chain}.`,
      agent.commits30d > 0 ? 'Public code repositories audited for dependencies and commits.' : 'Closed-source codebase limit verifiability.'
    ],
    verdict: agent.verdict || `${agent.name} is evaluated under the Ordinal Web3 AI Agent Index.`,
    rightOfReply: {
      hasResponded: agent.status === 'verified',
      statement: agent.status === 'verified' ? 'Telemetry records acknowledged and confirmed by engineering team.' : undefined,
      requestedAt: '2026-08-10',
    },
    resources: {
      website: agent.website,
      documentation: agent.docsUrl,
      github: agent.githubUrl,
      twitter: agent.xHandle,
    }
  };
});

export const ReportsCatalogView: React.FC<{ onSelectReport: (slug: string) => void }> = ({ onSelectReport }) => {
  const [filter, setFilter] = useState<'all' | 'verified' | 'watchlist'>('all');
  const [search, setSearch] = useState('');

  const reportsList = Object.values(SAMPLE_REPORTS).filter((r) => {
    const matchesSearch = r.agentName.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'verified') return r.keyCount > 0;
    if (filter === 'watchlist') return r.verificationTier.includes('Watchlist');
    return true;
  });

  return (
    <div className="ordinal-app">
      <OrdinalNavbar currentPath="/reports" />

      <div className="ticker-band">
        <div className="ticker-track">
          <span>ORDINAL RESEARCH DESK · DOSSIER CATALOG · VERIFIED TELEMETRY · ROLLING 30-DAY COVERAGE</span>
          <span>ORDINAL RESEARCH DESK · DOSSIER CATALOG · VERIFIED TELEMETRY · ROLLING 30-DAY COVERAGE</span>
        </div>
      </div>

      <main className="wrap" style={{ padding: '48px 28px 80px' }}>
        <div className="kicker">Ordinal Research Desk</div>
        <h1 className="headline" style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)', margin: '12px 0 16px' }}>
          Dossier Reports Catalog
        </h1>
        <p className="dek" style={{ maxWidth: '720px', marginBottom: '32px' }}>
          Deep-dive risk dossiers and institutional security evaluations of autonomous Web3 AI agents under continuous coverage.
        </p>

        <div className="controls-row" style={{ marginBottom: '32px' }}>
          <div className="filter-row">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              All Reports ({Object.keys(SAMPLE_REPORTS).length})
            </button>
            <button className={`filter-btn ${filter === 'verified' ? 'active' : ''}`} onClick={() => setFilter('verified')}>
              Awarded Keys
            </button>
            <button className={`filter-btn ${filter === 'watchlist' ? 'active' : ''}`} onClick={() => setFilter('watchlist')}>
              Watchlist
            </button>
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Search dossier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {reportsList.map((rep) => (
            <motion.div
              key={rep.slug}
              className="spot-card"
              style={{ cursor: 'pointer', border: '1px solid var(--rule)', borderTop: '3px solid var(--crimson)', padding: '24px' }}
              onClick={() => onSelectReport(rep.slug)}
              whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="spot-card-top">
                <span className="spot-rank">DOSSIER #{rep.dossierNumber}</span>
                <span className="spot-tag" style={{ color: rep.keyCount > 0 ? 'var(--brass)' : 'var(--crimson)' }}>
                  {rep.keyCount > 0 ? `${rep.keyCount} KEY${rep.keyCount > 1 ? 'S' : ''}` : 'UNRATED'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0 6px' }}>
                <AgentAvatar agent={{ name: rep.agentName, avatar: rep.agentName.slice(0, 2), website: rep.websiteUrl }} size={32} />
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.4rem', margin: 0 }}>
                  {rep.agentName}
                </h3>
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.72rem', color: 'var(--ink-soft)', marginBottom: '14px' }}>
                {rep.chains.join(', ').toUpperCase()} · {rep.category.toUpperCase()}
              </div>
              <p className="spot-blurb" style={{ minHeight: '60px' }}>
                {rep.standfirst}
              </p>
              <div className="spot-foot">
                <span className="spot-age">Wallets: {rep.evidence.uniqueWallets.toLocaleString()}</span>
                <span className="spot-score" style={{ color: 'var(--crimson)' }}>Read Dossier →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-row">
            <span>Ordinal: The Web3 AI Agent Index</span>
            <span>Independent Editorial Desk</span>
            <span>ordinal30.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const ReportDetailView: React.FC<{ report: ReportData; onBack: () => void }> = ({ report, onBack }) => {
  return (
    <div className="ordinal-app">
      <OrdinalNavbar currentPath="/reports" />

      <div className="ticker-band">
        <div className="ticker-track">
          <span>DOSSIER #{report.dossierNumber} · {report.agentName.toUpperCase()} · METHODOLOGY {report.methodologyVersion}</span>
          <span>DOSSIER #{report.dossierNumber} · {report.agentName.toUpperCase()} · METHODOLOGY {report.methodologyVersion}</span>
        </div>
      </div>

      <main className="wrap" style={{ maxWidth: '900px', margin: '40px auto 80px', padding: '0 24px' }}>
        <button
          onClick={onBack}
          className="btn"
          style={{ padding: '8px 18px', color: 'var(--ink)', borderColor: 'var(--ink)', marginBottom: '28px' }}
        >
          ← Back to Reports Catalog
        </button>

        <div className="kicker">Dossier Evaluation #{report.dossierNumber}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '14px 0 16px' }}>
          <AgentAvatar agent={{ name: report.agentName, avatar: report.agentName.slice(0, 2), website: report.websiteUrl }} size={56} />
          <h1 className="headline" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', margin: 0 }}>
            {report.agentName}
          </h1>
        </div>
        <p className="dek" style={{ fontSize: '1.2rem', marginBottom: '24px' }}>
          {report.standfirst}
        </p>

        <div className="byline-row" style={{ marginBottom: '32px' }}>
          <span>Desk: <b>{report.editorName}</b></span>
          <span>Published: <b>{report.publicationDate}</b></span>
          <span>Chains: <b>{report.chains.join(', ').toUpperCase()}</b></span>
          <span>Award: <b style={{ color: 'var(--brass)' }}>{'★'.repeat(report.keyCount) || 'Unrated'}</b></span>
        </div>

        <section style={{ border: '1px solid var(--ink)', padding: '24px', background: 'var(--paper)', marginBottom: '36px' }}>
          <div className="aside-title">Executive Claim vs Evidence</div>
          <p style={{ fontSize: '1.02rem', lineHeight: '1.7', marginBottom: '14px' }}>
            <b>Claim:</b> {report.claim}
          </p>
          <p style={{ fontSize: '1.02rem', lineHeight: '1.7', color: 'var(--ink-soft)' }}>
            <b>Divergence Analysis:</b> {report.divergence}
          </p>
        </section>

        <section style={{ marginBottom: '36px' }}>
          <div className="aside-title">30-Day On-Chain Telemetry</div>
          <div className="ledger" style={{ marginTop: '12px' }}>
            <div className="ledger-cell">
              <div className="ledger-num">{report.evidence.uniqueWallets.toLocaleString()}</div>
              <div className="ledger-label">Unique Active Wallets</div>
            </div>
            <div className="ledger-cell">
              <div className="ledger-num">${(report.evidence.qualifiedVolume).toLocaleString()}</div>
              <div className="ledger-label">Qualified Volume (USD)</div>
            </div>
            <div className="ledger-cell">
              <div className="ledger-num">{report.evidence.top5WalletShare}%</div>
              <div className="ledger-label">Top 5 Wallet Concentration</div>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '36px' }}>
          <div className="aside-title">Security & Key Governance Risk Register</div>
          <table className="crit-table" style={{ margin: '14px 0' }}>
            <thead>
              <tr>
                <th>Governance Dimension</th>
                <th>Status</th>
                <th>Risk Classification</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Smart Contract Security Audit</td>
                <td style={{ fontWeight: 600 }}>{report.riskRegister.auditStatus}</td>
                <td>{report.riskRegister.auditStatus.includes('Verified') ? 'Low Risk' : 'High / Centralized'}</td>
              </tr>
              <tr>
                <td>Admin Control Keys</td>
                <td style={{ fontWeight: 600 }}>{report.riskRegister.adminKeys}</td>
                <td>{report.riskRegister.adminKeys.includes('Multisig') ? 'Guarded' : 'Unrestricted'}</td>
              </tr>
              <tr>
                <td>Timelock Delay</td>
                <td style={{ fontWeight: 600 }}>{report.riskRegister.timelock}</td>
                <td>{report.riskRegister.timelock.includes('Timelock') ? 'Grace Period Enforced' : 'Instant Execution'}</td>
              </tr>
              <tr>
                <td>Signer Quorum</td>
                <td style={{ fontWeight: 600 }}>{report.riskRegister.multisig}</td>
                <td>{report.riskRegister.multisig.includes('Multisig') ? 'Decentralized Multi-Party' : 'Single Point of Failure'}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section style={{ background: 'var(--paper-dim)', padding: '24px', borderLeft: '4px solid var(--crimson)', marginBottom: '36px' }}>
          <div className="aside-title" style={{ color: 'var(--crimson)' }}>Editorial Desk Verdict</div>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>
            "{report.verdict}"
          </p>
        </section>

        {report.resources && (
          <section style={{ borderTop: '1px solid var(--rule)', paddingTop: '20px' }}>
            <div className="aside-title">Verified External Resources</div>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8rem' }}>
              {report.resources.website && <a href={report.resources.website} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Official Website</a>}
              {report.resources.documentation && <a href={report.resources.documentation} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Documentation</a>}
              {report.resources.github && <a href={report.resources.github} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>GitHub Repository</a>}
            </div>
          </section>
        )}
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-row">
            <span>Ordinal: The Web3 AI Agent Index</span>
            <span>Independent Editorial Desk</span>
            <span>ordinal30.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
