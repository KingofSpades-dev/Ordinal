export interface ReportData {
  agentName: string;
  slug: string;
  category: string;
  chains: string[];
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

export function ReportsCatalogView({ onSelectReport }: { onSelectReport: (slug: string) => void }) {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>ORDO Reports Index</h1>
      <p style={{ color: '#666', fontSize: '15px', marginBottom: '32px' }}>
        Independent, full-length editorial research reports on Web3 AI agents.
      </p>

      <div style={{ display: 'grid', gap: '20px' }}>
        {Object.values(SAMPLE_REPORTS).map(rep => (
          <div
            key={rep.slug}
            onClick={() => onSelectReport(rep.slug)}
            style={{
              border: '1.5px solid var(--line-2, #e5e5e5)',
              padding: '24px',
              borderRadius: '8px',
              cursor: 'pointer',
              background: '#fff',
              transition: 'border-color 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#666', textTransform: 'uppercase' }}>DOSSIER #{rep.dossierNumber} • {rep.category}</span>
              <span style={{ fontWeight: 800, color: rep.keyCount > 0 ? '#b05446' : '#666' }}>
                {rep.keyCount > 0 ? '🔑'.repeat(rep.keyCount) : '0 KEYS'}
              </span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '4px 0 8px 0' }}>{rep.agentName}</h2>
            <p style={{ fontSize: '14px', color: '#444', margin: '0 0 12px 0', lineHeight: 1.5 }}>{rep.standfirst}</p>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb' }}>Read Full Report →</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportDetailView({ report, onBack }: { report: ReportData; onBack: () => void }) {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px', fontFamily: 'Inter, sans-serif', color: 'var(--ink, #111418)' }}>
      {/* Navigation Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: '1.5px solid var(--line-2, #e5e5e5)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          ← Back to Reports Catalog
        </button>
        <span style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>ORDO DOSSIER #{report.dossierNumber} • METHODOLOGY {report.methodologyVersion}</span>
      </div>

      {/* 1. Masthead Block */}
      <div style={{ borderBottom: '2px solid #111', paddingBottom: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span style={{ background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                {report.category}
              </span>
              {report.chains.map(c => (
                <span key={c} style={{ background: '#eef3fe', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                  {c.toUpperCase()}
                </span>
              ))}
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: 800, margin: '8px 0', letterSpacing: '-0.02em' }}>{report.agentName}</h1>
            <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
              Published {report.publicationDate} • Editor: <strong>{report.editorName}</strong> • Tier: <span style={{ textTransform: 'capitalize' }}>{report.verificationTier}</span>
            </p>
          </div>

          {/* Key Award Badge */}
          <div style={{ textAlign: 'right', background: 'var(--paper, #faf8f5)', border: '1.5px solid #111', padding: '16px 24px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em', color: '#666', marginBottom: '4px' }}>ORDO KEY AWARD</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: report.keyCount > 0 ? '#b05446' : '#666' }}>
              {report.keyCount > 0 ? '🔑'.repeat(report.keyCount) : '0 KEYS'}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '4px' }}>
              {report.keyCount === 3 ? 'Three Keys: Benchmark' : report.keyCount === 2 ? 'Two Keys: Exemplary' : report.keyCount === 1 ? 'One Key: Notable' : 'Registered, Unrated'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Standfirst (<30 words) */}
      <div style={{ background: '#fdf8f4', borderLeft: '4px solid #b05446', padding: '16px 20px', borderRadius: '0 8px 8px 0', marginBottom: '32px' }}>
        <p style={{ fontSize: '18px', fontWeight: 600, margin: 0, lineHeight: 1.4, color: '#222' }}>
          "{report.standfirst}"
        </p>
      </div>

      {/* 3. The Claim */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.05em', color: '#666', textTransform: 'uppercase', marginBottom: '12px' }}>1. The Claim</h3>
        <blockquote style={{ margin: 0, padding: '16px', background: '#f9f9f9', border: '1px solid #eee', borderRadius: '6px', fontSize: '14px', fontStyle: 'italic', lineHeight: 1.6 }}>
          "{report.claim}"
        </blockquote>
      </section>

      {/* 4. The Evidence & Core Charts */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.05em', color: '#666', textTransform: 'uppercase', marginBottom: '12px' }}>2. On-Chain Evidence & Qualified Volume</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ border: '1px solid #eee', padding: '16px', borderRadius: '8px', background: '#fff' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Qualified Settlement Volume</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>${report.evidence.qualifiedVolume.toLocaleString()}</div>
            <div style={{ fontSize: '11px', color: '#999' }}>Raw: ${report.evidence.rawVolume.toLocaleString()}</div>
          </div>
          <div style={{ border: '1px solid #eee', padding: '16px', borderRadius: '8px', background: '#fff' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Distinct Paying Wallets</div>
            <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>{report.evidence.uniqueWallets.toLocaleString()}</div>
          </div>
          <div style={{ border: '1px solid #eee', padding: '16px', borderRadius: '8px', background: '#fff' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Top 5 Payer Concentration</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: report.evidence.top5WalletShare > 50 ? '#dc2626' : '#111', marginTop: '4px' }}>{report.evidence.top5WalletShare}%</div>
          </div>
        </div>

        {/* 5 Core Visual Overlay Bars */}
        <div style={{ border: '1px solid #eee', padding: '20px', borderRadius: '8px', background: '#fafafa' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 700 }}>Cohort Retention (Month 1 → Month 3)</h4>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>Month 1 Retention</span>
                <strong>{report.evidence.retentionMonth1}%</strong>
              </div>
              <div style={{ background: '#e5e5e5', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: '#2563eb', width: `${report.evidence.retentionMonth1}%`, height: '100%' }} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>Month 3 Retention</span>
                <strong>{report.evidence.retentionMonth3}%</strong>
              </div>
              <div style={{ background: '#e5e5e5', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: '#16a34a', width: `${report.evidence.retentionMonth3}%`, height: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. The Divergence */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.05em', color: '#b05446', textTransform: 'uppercase', marginBottom: '12px' }}>3. The Divergence</h3>
        <div style={{ background: '#fff', border: '1.5px solid #fecaca', padding: '16px 20px', borderRadius: '8px', fontSize: '14px', lineHeight: 1.6 }}>
          {report.divergence}
        </div>
      </section>

      {/* 6. The Rubric */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.05em', color: '#666', textTransform: 'uppercase', marginBottom: '12px' }}>4. Rubric Breakdown</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ border: '1px solid #eee', padding: '14px', borderRadius: '6px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>Verifiability: {report.rubric.verifiabilityScore} / 25</div>
            <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>{report.rubric.verifiabilityReason}</div>
          </div>
          <div style={{ border: '1px solid #eee', padding: '14px', borderRadius: '6px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>Activity: {report.rubric.activityScore} / 25</div>
            <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>{report.rubric.activityReason}</div>
          </div>
          <div style={{ border: '1px solid #eee', padding: '14px', borderRadius: '6px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>Maintenance: {report.rubric.maintenanceScore} / 25</div>
            <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>{report.rubric.maintenanceReason}</div>
          </div>
          <div style={{ border: '1px solid #eee', padding: '14px', borderRadius: '6px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>Security Posture: {report.rubric.securityScore} / 25</div>
            <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>{report.rubric.securityReason}</div>
          </div>
          <div style={{ border: '1px solid #eee', padding: '14px', borderRadius: '6px', background: (report.rubric.adminPenalty || 0) > 0 ? '#fff5f5' : '#fff' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: (report.rubric.adminPenalty || 0) > 0 ? '#A61D2D' : '#333' }}>
              Admin Control Penalty: {(report.rubric.adminPenalty || 0) > 0 ? `-${report.rubric.adminPenalty} pt` : '0 pt'}
            </div>
            <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
              {(report.rubric.adminPenalty || 0) > 0 ? 'Penalty applied for centralized or unverified admin keys.' : 'No centralized admin key penalty.'}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Risk Register & 8. Limitations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        <div style={{ border: '1px solid #eee', padding: '16px', borderRadius: '8px', background: '#fafafa' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase' }}>Risk Register</h4>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', lineHeight: 1.8 }}>
            <li><strong>Audit Status:</strong> {report.riskRegister.auditStatus}</li>
            <li><strong>Admin Keys:</strong> {report.riskRegister.adminKeys}</li>
            <li><strong>Timelock:</strong> {report.riskRegister.timelock}</li>
            <li><strong>Multisig Threshold:</strong> {report.riskRegister.multisig}</li>
          </ul>
        </div>

        <div style={{ border: '1px solid #eee', padding: '16px', borderRadius: '8px', background: '#fafafa' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase' }}>Limitations of Assessment</h4>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', lineHeight: 1.8 }}>
            {report.limitations.map((lim, idx) => (
              <li key={idx}>{lim}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 9. The Verdict */}
      <section style={{ borderTop: '2px solid #111', paddingTop: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.05em', color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>5. Editorial Verdict</h3>
        <p style={{ fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
          {report.verdict}
        </p>
      </section>

      {/* 10. Right of Reply */}
      <section style={{ background: '#f5f5f5', border: '1px dashed #ccc', padding: '20px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase' }}>Right of Reply (48h Standard)</h4>
        {report.rightOfReply?.hasResponded ? (
          <div style={{ fontStyle: 'italic', fontSize: '13px', lineHeight: 1.6 }}>
            "{report.rightOfReply.statement}"
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
            The development team was invited to comment on {report.rightOfReply?.requestedAt || 'publication date'}. No statement was submitted prior to deadline.
          </p>
        )}
      </section>
    </div>
  );
}
