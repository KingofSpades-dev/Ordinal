import React, { useState } from 'react';
import { OrdinalNavbar } from '../components/OrdinalNavbar';

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
  const [formSubmitted, setFormSubmitted] = useState(false);

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agentName || !formData.contract || !formData.website || !formData.docsUrl) {
      alert('Please fill out all required fields: Agent Name, Contract Address, Website URL, and Documentation URL.');
      return;
    }
    setFormSubmitted(true);
    setTimeout(() => {
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
    }, 500);
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
        <button
          onClick={() => navigateTo('/')}
          className="btn"
          style={{ padding: '8px 18px', color: 'var(--ink)', borderColor: 'var(--ink)', marginBottom: '28px' }}
        >
          ← Return to Index
        </button>

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
                <div className="alert-success">
                  ✓ Submission & Rating Benchmark Recorded! The Ordinal Research Desk has indexed your contract telemetry for verification.
                </div>
              )}

              <div className="field">
                <label>Agent Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Cipherworks"
                  value={formData.agentName}
                  onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="field">
                  <label>Primary Chain *</label>
                  <select
                    value={formData.chain}
                    onChange={(e) => setFormData({ ...formData, chain: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, contract: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="field">
                  <label>Official Website URL *</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    required
                  />
                </div>

                <div className="field">
                  <label>Documentation URL (Docs) *</label>
                  <input
                    type="text"
                    placeholder="https://docs..."
                    value={formData.docsUrl}
                    onChange={(e) => setFormData({ ...formData, docsUrl: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>GitHub Repository URL</label>
                <input
                  type="text"
                  placeholder="https://github.com/... or N/A if closed-source"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Describe Strategy, Custody Model & Admin Key Controls</label>
                <textarea
                  placeholder="How does the agent make decisions? Who holds signing keys, and what timelocks or multisigs protect user funds?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '8px' }}>
                <button type="submit" className="submit-btn" style={{ margin: 0 }}>
                  Submit for Official Audit
                </button>
              </div>
            </form>

            {/* Live Rating Diagnostic Simulation */}
            <div style={{ marginTop: '36px', border: '1px solid var(--ink)', padding: '24px', background: 'var(--paper-dim)' }}>
              <div className="kicker" style={{ marginBottom: '8px' }}>Live Rating Engine Diagnostics</div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.3rem', margin: '0 0 14px 0' }}>
                Provisional Rating Simulator
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '18px' }}>
                <div style={{ background: 'var(--paper)', border: '1px solid var(--rule)', padding: '12px' }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.66rem', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
                    Estimated Score
                  </div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: '1.8rem', fontWeight: 700, color: 'var(--crimson)' }}>
                    {hasInput ? compScore.toFixed(1) : '—'}
                  </div>
                </div>
                <div style={{ background: 'var(--paper)', border: '1px solid var(--rule)', padding: '12px' }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.66rem', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
                    Key Award
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.5rem', fontWeight: 700, color: 'var(--brass)' }}>
                    {hasInput ? stars : '—'}
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
                  <b>{hasInput ? `${discScore}/100` : '—'}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>On-Chain Consistency (35% - Contract Telemetry):</span>
                  <b>{hasInput ? `${consScore}/100` : '—'}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Incident Response (20% - Security Audit & Keys):</span>
                  <b>{hasInput ? `${incScore}/100` : '—'}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Code Independence (15% - GitHub Source):</span>
                  <b>{hasInput ? `${indScore}/100` : '—'}</b>
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
                🚀 Priority Evaluation Queue
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
                $ORDINAL Access Portal ↗
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-row">
            <span>Ordinal — The Web3 AI Agent Index</span>
            <span>Independent Editorial Desk</span>
            <span>ordinal.tech</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
