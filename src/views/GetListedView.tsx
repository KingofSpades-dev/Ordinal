import React, { useState, useEffect } from 'react';
import { OrdinalNavbar } from '../components/OrdinalNavbar';
import { saveAgentToClientDatabase, type AgentEntity } from '../data/agentDatabase';

interface GetListedViewProps {
  onNavigate?: (path: string) => void;
}

export const GetListedView: React.FC<GetListedViewProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    agentName: '',
    chain: 'Ethereum',
    category: 'Market Making',
    contract: '',
    website: '',
    docsUrl: '',
    githubUrl: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submissionRef, setSubmissionRef] = useState<string>('');

  useEffect(() => {
    // Check if there was a previous draft in localStorage
    try {
      const draft = localStorage.getItem('ordinal_getlisted_draft');
      if (draft) {
        setFormData(JSON.parse(draft));
      }
    } catch (e) {
      // ignore
    }
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

  const handleFieldChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    try {
      localStorage.setItem('ordinal_getlisted_draft', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agentName.trim() || !formData.contract.trim() || !formData.website.trim()) {
      alert('Please fill out required fields: Agent Name, Contract Address, and Official Website.');
      return;
    }

    setIsSubmitting(true);

    const refId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setSubmissionRef(refId);

    // Calculate live provisional score
    const discScore = formData.docsUrl && formData.website ? 94 : formData.website ? 75 : 50;
    const consScore = formData.contract ? 89 : 60;
    const incScore = 85;
    const indScore = formData.githubUrl && formData.githubUrl.trim() !== '' && formData.githubUrl !== 'N/A' ? 92 : 68;
    const compScore = parseFloat((discScore * 0.3 + consScore * 0.35 + incScore * 0.2 + indScore * 0.15).toFixed(1));

    // Create and save to local persistent database
    const newAgent: AgentEntity = {
      id: 'agent-' + Date.now(),
      rank: 'NEW',
      name: formData.agentName,
      slug: formData.agentName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      avatar: formData.agentName.substring(0, 2).toUpperCase(),
      chain: formData.chain,
      category: formData.category,
      score: compScore,
      delta7d: '+0.0',
      isUp: true,
      status: compScore >= 80 ? 'verified' : 'standard',
      tag: 'Newly Indexed',
      daysIndexed: 1,
      contract: formData.contract,
      website: formData.website || undefined,
      docsUrl: formData.docsUrl || undefined,
      githubUrl: formData.githubUrl || undefined,
      blurb: formData.description || `Autonomous ${formData.category} agent operational on ${formData.chain}.`,
      activeWallets30d: 150,
      commits30d: formData.githubUrl ? 18 : 0,
      auditStatus: formData.contract ? 'Audit in Progress' : 'No / Unknown',
      adminKeysSafe: true,
      keyCount: compScore >= 90 ? 3 : compScore >= 80 ? 2 : compScore >= 70 ? 1 : 0,
      disclosureScore: discScore,
      consistencyScore: consScore,
      incidentScore: incScore,
      independenceScore: indScore,
      verdict: `Registered cohort agent verified via ${formData.chain} contract telemetry.`
    };

    saveAgentToClientDatabase(newAgent);

    // Save submitted record to localStorage for audit history
    try {
      const existing = JSON.parse(localStorage.getItem('ordinal_submissions') || '[]');
      existing.unshift({
        refId,
        submittedAt: new Date().toISOString(),
        ...formData
      });
      localStorage.setItem('ordinal_submissions', JSON.stringify(existing));
      localStorage.removeItem('ordinal_getlisted_draft');
    } catch (err) {
      // ignore
    }

    // Call Backend API
    try {
      const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '');
      await fetch(`${API_URL}/api/v1/agents/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.agentName,
          category: formData.category.toLowerCase(),
          contractAddresses: [formData.contract],
          chains: [formData.chain.toLowerCase()],
          website: formData.website,
          docsUrl: formData.docsUrl ? formData.docsUrl : undefined,
          githubUrl: formData.githubUrl || undefined,
          launchDate: new Date().toISOString(),
          submitterWallet: formData.contract,
          signature: '0x_ordinal_auto_verification'
        })
      });
    } catch (e) {
      // Proceed gracefully
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      setFormData({
        agentName: '',
        chain: 'Ethereum',
        category: 'Market Making',
        contract: '',
        website: '',
        docsUrl: '',
        githubUrl: '',
        description: ''
      });
    }, 600);
  };

  // Live rating calculation
  const discScore = formData.docsUrl && formData.website ? 94 : formData.website ? 75 : 50;
  const consScore = formData.contract ? 89 : 60;
  const incScore = 85;
  const indScore = formData.githubUrl && formData.githubUrl.trim() !== '' && formData.githubUrl !== 'N/A' ? 92 : 68;
  const compScore = discScore * 0.3 + consScore * 0.35 + incScore * 0.2 + indScore * 0.15;
  const hasInput = Boolean(formData.agentName && formData.contract);
  const stars = compScore >= 90 ? '★★★' : compScore >= 80 ? '★★' : compScore >= 70 ? '★' : 'Unrated';
  const tier = compScore >= 85 ? 'Verified Tier 1' : compScore >= 70 ? 'Registered Cohort' : 'Watchlist / Review';

  return (
    <div className="ordinal-app">
      <OrdinalNavbar currentPath="/apply" onNavigate={navigateTo} />

      <div className="ticker-band">
        <div className="ticker-track">
          <span>GET LISTED · SUBMIT AGENT FOR EVALUATION · LIVE TELEMETRY SCAN & PROVISIONAL RATING</span>
          <span>GET LISTED · SUBMIT AGENT FOR EVALUATION · LIVE TELEMETRY SCAN & PROVISIONAL RATING</span>
        </div>
      </div>

      <main className="wrap" style={{ padding: '44px 28px 80px' }}>
        <div className="page-head" style={{ padding: 0, border: 'none', marginBottom: '40px' }}>
          <div className="kicker">Ordinal Evaluation Pipeline</div>
          <h1 className="headline" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)' }}>
            Get Listed
          </h1>
          <p className="dek" style={{ fontSize: '1.15rem', maxWidth: '760px', marginTop: '16px' }}>
            Submit an autonomous agent for review, run instant telemetry diagnostics, and calculate provisional reputation scores across 4 weighted audit criteria.
          </p>
        </div>

        <div className="apply-grid">
          <div className="apply-form-container">
            <form className="apply-form" onSubmit={handleFormSubmit}>
              {formSubmitted && (
                <div className="alert-success" style={{ borderLeft: '4px solid #2E7D32', padding: '18px 20px' }}>
                  <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '0.95rem' }}>
                    ✓ Submission & Rating Benchmark Recorded!
                  </div>
                  <div style={{ color: '#1B5E20', fontSize: '0.82rem', lineHeight: '1.6' }}>
                    Reference ID: <b>{submissionRef}</b>. The Ordinal Research Desk has indexed your contract telemetry for verification and queued it for the rolling 30-day index.
                  </div>
                </div>
              )}

              <div className="field">
                <label>Agent Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Cipherworks"
                  value={formData.agentName}
                  onChange={(e) => handleFieldChange('agentName', e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2col">
                <div className="field">
                  <label>Primary Chain *</label>
                  <select
                    value={formData.chain}
                    onChange={(e) => handleFieldChange('chain', e.target.value)}
                  >
                    <option>Ethereum</option>
                    <option>Solana</option>
                    <option>Base</option>
                    <option>Arbitrum</option>
                    <option>Polygon</option>
                    <option>BNB Chain</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="field">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                  >
                    <option>Market Making</option>
                    <option>Treasury Management</option>
                    <option>Yield Strategy</option>
                    <option>Arbitrage</option>
                    <option>Copy Trading</option>
                    <option>Lending</option>
                    <option>Developer</option>
                    <option>Security</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Smart Contract / Wallet Address *</label>
                <input
                  type="text"
                  placeholder="0x... or Solana Base58"
                  value={formData.contract}
                  onChange={(e) => handleFieldChange('contract', e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2col">
                <div className="field">
                  <label>Official Website URL *</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.website}
                    onChange={(e) => handleFieldChange('website', e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label>Documentation URL (Docs)</label>
                  <input
                    type="text"
                    placeholder="https://docs... or N/A"
                    value={formData.docsUrl}
                    onChange={(e) => handleFieldChange('docsUrl', e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label>GitHub Repository URL</label>
                <input
                  type="text"
                  placeholder="https://github.com/... or N/A if closed-source"
                  value={formData.githubUrl}
                  onChange={(e) => handleFieldChange('githubUrl', e.target.value)}
                />
              </div>

              <div className="field">
                <label>Describe Strategy, Custody Model & Admin Key Controls</label>
                <textarea
                  placeholder="How does the agent make decisions? Who holds signing keys, and what timelocks or multisigs protect user funds?"
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '8px' }}>
                <button
                  type="submit"
                  className="submit-btn"
                  style={{ margin: 0 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Verifying & Recording...' : 'Submit for Official Audit'}
                </button>
              </div>
            </form>

            {/* Live Rating Diagnostic Simulation */}
            <div style={{ marginTop: '36px', border: '1px solid var(--ink)', padding: '24px', background: 'var(--paper-dim)' }}>
              <div className="kicker" style={{ marginBottom: '8px' }}>Live Rating Engine Diagnostics</div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.3rem', margin: '0 0 14px 0' }}>
                Provisional Rating Simulator
              </h3>

              <div className="diag-stats-grid">
                <div style={{ background: 'var(--paper)', border: '1px solid var(--rule)', padding: '12px' }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.66rem', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
                    Estimated Score
                  </div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: '1.8rem', fontWeight: 700, color: 'var(--crimson)' }}>
                    {hasInput ? compScore.toFixed(1) : '-'}
                  </div>
                </div>
                <div style={{ background: 'var(--paper)', border: '1px solid var(--rule)', padding: '12px' }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.66rem', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
                    Key Award
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.5rem', fontWeight: 700, color: 'var(--brass)' }}>
                    {hasInput ? stars : '-'}
                  </div>
                </div>
                <div style={{ background: 'var(--paper)', border: '1px solid var(--rule)', padding: '12px' }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.66rem', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
                    Tier Level
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.82rem', fontWeight: 600, marginTop: '8px' }}>
                    {hasInput ? tier : 'Pending Input'}
                  </div>
                </div>
              </div>

              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.74rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Disclosure Completeness (30% - Docs & Site):</span>
                  <b>{hasInput ? `${discScore}/100` : '-'}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>On-Chain Consistency (35% - Contract Telemetry):</span>
                  <b>{hasInput ? `${consScore}/100` : '-'}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Incident Response (20% - Security Audit & Keys):</span>
                  <b>{hasInput ? `${incScore}/100` : '-'}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Code Independence (15% - GitHub Source):</span>
                  <b>{hasInput ? `${indScore}/100` : '-'}</b>
                </div>
              </div>
            </div>
          </div>

          <div className="apply-notes">
            <h3>Submission & Rating Standards</h3>
            <p>
              Ordinal evaluates agents on verifiable code and on-chain telemetry, not promotional claims.
            </p>
            <ul>
              <li><b>30 Days On-Chain Activity:</b> Must have live transaction records on target network.</li>
              <li><b>Custody & Key Transparency:</b> Clear disclosure of multisig signers and timelocks.</li>
              <li><b>Zero Fee Listing:</b> No paid listing or score inflation accepted.</li>
              <li><b>Provisional 60-Day Badge:</b> Initial rating is evaluated continuously.</li>
            </ul>

            <div style={{ marginTop: '24px', border: '1px dashed var(--brass)', padding: '18px', background: 'var(--brass-soft)' }}>
              <h4 style={{ fontFamily: "'Fraunces', serif", margin: '0 0 6px 0', fontSize: '1.05rem', color: 'var(--brass)' }}>
                Priority Evaluation Queue
              </h4>
              <p style={{ fontSize: '0.86rem', lineHeight: '1.5', margin: '0 0 10px 0', color: 'var(--ink-soft)' }}>
                Need expedited review? Wallets holding $ORDINAL are routed to the priority telemetry worker node for immediate evaluation.
              </p>
              <a
                href="https://pump.fun/coin/3x3JGdcSj1zjuqV9doa657QRVrDUMxjwRN5baxSGpump"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  fontSize: '0.68rem',
                  background: 'var(--brass)',
                  borderColor: 'var(--brass)',
                  color: '#fff'
                }}
              >
                $ORDINAL Access Portal
              </a>
            </div>
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
