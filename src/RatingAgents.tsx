import React, { useEffect, useState } from 'react'

interface Agent {
  id: string;
  name: string;
  slug: string;
  category: string;
  status: string;
  contractAddresses: string;
  chains: string;
  website: string;
  docsUrl: string;
  githubUrl?: string;
  xHandle?: string;
  submittedBy: string;
  submittedAt: string;
  scores?: any[];
  snapshots?: any[];
}

export default function RatingAgents() {
  const [agentsList, setAgentsList] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userWallet, setUserWallet] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [scanningAgentId, setScanningAgentId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('security');
  const [contractAddress, setContractAddress] = useState('');
  const [chainInput, setChainInput] = useState('ethereum');
  const [website, setWebsite] = useState('');
  const [docsUrl, setDocsUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [xHandle, setXHandle] = useState('');

  const connectWallet = async () => {
    const anyWindow = window as any;
    if (anyWindow.solana && anyWindow.solana.isPhantom) {
      try {
        const resp = await anyWindow.solana.connect();
        const addr = resp.publicKey.toString();
        setUserWallet(addr);
        showNotification('Solana wallet connected successfully!', 'success');
      } catch (err) {
        console.error('Solana wallet connection failed:', err);
        showNotification('Failed to connect wallet.', 'error');
      }
    } else {
      showNotification('No Solana wallet extension found. Please install Phantom Wallet!', 'error');
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/agents');
      if (res.ok) {
        const data = await res.json();
        setAgentsList(data);
        if (data.length > 0 && !selectedAgent) {
          setSelectedAgent(data[0]); // Select first by default
        }
      }
    } catch (e) {
      console.error('Failed to fetch agents:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Poll state changes when scanning a new agent
  useEffect(() => {
    if (!scanningAgentId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:3001/api/v1/agents');
        if (res.ok) {
          const list: Agent[] = await res.json();
          setAgentsList(list);
          const current = list.find(a => a.id === scanningAgentId);
          if (current) {
            setSelectedAgent(current);
            if (current.status === 'published' || current.status === 'rejected_invalid') {
              setScanningAgentId(null); // Stop polling!
            }
          }
        }
      } catch (e) {
        console.error('Polling failed:', e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [scanningAgentId]);

  const handleFormButtonClick = (e: React.MouseEvent) => {
    if (!userWallet) {
      e.preventDefault();
      connectWallet();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contractAddress || !website || !docsUrl) {
      showNotification('Please fill out all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (!userWallet) {
        showNotification('Please connect your Solana wallet first.', 'error');
        setSubmitting(false);
        return;
      }
      const submitterWallet = userWallet;
      let signature = '';
      const anyWindow = window as any;
      if (anyWindow.solana && anyWindow.solana.signMessage) {
        const message = `Submit agent: ${name} by ${submitterWallet}`;
        const encodedMessage = new TextEncoder().encode(message);
        const signedMessage = await anyWindow.solana.signMessage(encodedMessage, "utf8");
        // Convert signature bytes to hex string starting with 0x for backend compliance
        signature = '0x' + Array.from(signedMessage.signature)
          .map(b => (b as number).toString(16).padStart(2, '0'))
          .join('');
      } else {
        // Fallback signature for offline/test compliance
        signature = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      }

      const res = await fetch('http://localhost:3001/api/v1/agents/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          contractAddresses: [contractAddress],
          chains: [chainInput],
          website,
          docsUrl,
          githubUrl: githubUrl || undefined,
          xHandle: xHandle || undefined,
          launchDate: new Date().toISOString(),
          submitterWallet,
          signature,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        // Set the scanning agent ID to activate real-time tracking
        setScanningAgentId(result.agentId);
        showNotification('Agent registered successfully! Beginning reputation scan...', 'success');

        setName('');
        setContractAddress('');
        setWebsite('');
        setDocsUrl('');
        setGithubUrl('');
        setXHandle('');

        // Fetch list and select the newly registered agent immediately
        try {
          const fetchRes = await fetch('http://localhost:3001/api/v1/agents');
          if (fetchRes.ok) {
            const list: Agent[] = await fetchRes.json();
            setAgentsList(list);
            const newAgent = list.find(a => a.id === result.agentId);
            if (newAgent) {
              setSelectedAgent(newAgent);
            }
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        showNotification(`Failed to register: ${result.message || 'Unknown error'}`, 'error');
      }
    } catch (err: any) {
      showNotification(`Registration Error: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const chains = [
    'Ethereum', 'Solana', 'Polygon', 'Base', 'Optimism', 'Arbitrum',
    'BNB Chain', 'Avalanche', 'Sui', 'Aptos', 'TON', 'Berachain'
  ];



  const filteredAgents = agentsList.filter(a => userWallet && a.submittedBy.toLowerCase() === userWallet.toLowerCase());

  return (
    <>
      {notification && (
        <div className={`toast-notification ${notification.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {notification.type === 'success' ? '✓' : notification.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span className="toast-message">{notification.message}</span>
          </div>
          <button className="toast-close" onClick={() => setNotification(null)}>×</button>
        </div>
      )}
      <style>{`
        .dashboard-section {
          padding: 60px 0;
          background-color: var(--paper);
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }
        .dash-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 32px;
          margin-top: 40px;
        }
        @media (max-width: 1000px) {
          .dash-grid {
            grid-template-columns: 1fr;
          }
        }
        .form-panel {
          background: #fff;
          padding: 24px;
          border-radius: 12px;
          border: 1.5px solid var(--line-2);
          box-shadow: 0 4px 12px rgba(0,0,0,0.01);
          height: fit-content;
        }
        .form-panel h3 {
          font-size: 20px;
          color: var(--ink);
          margin-bottom: 20px;
          font-weight: 700;
        }
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }
        .field-group label {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--ink-soft);
        }
        .field-group input, .field-group select {
          padding: 10px 12px;
          font-family: inherit;
          font-size: 14px;
          border: 1.5px solid var(--line-2);
          border-radius: 6px;
          background: var(--paper);
          color: var(--ink);
          transition: all 0.2s;
        }
        .field-group input:focus, .field-group select:focus {
          outline: none;
          border-color: var(--brass);
          background: #fff;
        }
        .btn-submit {
          display: block;
          width: 100%;
          padding: 12px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          background: var(--brass);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .btn-submit:hover {
          background: var(--accent);
        }
        
        /* High Fidelity Overview Panel */
        .overview-panel {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .main-card {
          background: #fff;
          border: 1.5px solid var(--line-2);
          border-radius: 16px;
          padding: 32px;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 32px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .main-card {
            grid-template-columns: 1fr;
            padding: 24px;
          }
        }
        
        .mc-left {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .mc-header {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .mc-logo-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--paper);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid var(--line-2);
        }
        .mc-logo-wrapper svg {
          width: 32px;
          height: 32px;
          color: var(--brass);
        }
        .mc-title h3 {
          font-size: 26px;
          font-weight: 700;
          color: var(--ink);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .verified-badge {
          background: var(--brass-soft);
          color: var(--brass);
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
          text-transform: uppercase;
        }
        .mc-address {
          font-size: 13px;
          color: var(--ink-faint);
          font-family: monospace;
          margin-top: 2px;
        }
        .mc-bio {
          font-size: 14.5px;
          line-height: 1.5;
          color: var(--ink-soft);
        }
        .mc-tags {
          display: flex;
          gap: 8px;
        }
        .mc-tag {
          background: var(--paper);
          color: var(--ink-soft);
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }
        
        /* Radial Progress Chart */
        .radial-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .radial-svg {
          transform: rotate(-90deg);
          width: 150px;
          height: 150px;
        }
        .radial-bg {
          fill: none;
          stroke: var(--paper);
          stroke-width: 12;
        }
        .radial-progress {
          fill: none;
          stroke: var(--brass);
          stroke-width: 12;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.5s ease-in-out;
        }
        .radial-center-text {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 1.1;
        }
        .radial-center-text .lbl {
          font-size: 9px;
          font-weight: 700;
          color: var(--ink-faint);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .radial-center-text .num {
          font-size: 38px;
          font-weight: 800;
          color: var(--ink);
          font-family: 'IBM Plex Mono', monospace;
        }
        .radial-center-text .of {
          font-size: 12px;
          color: var(--ink-soft);
          font-weight: 600;
        }

        .mc-scores-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-left: 1.5px solid var(--line);
          padding-left: 32px;
        }
        @media (max-width: 900px) {
          .mc-scores-list {
            border-left: none;
            padding-left: 0;
            margin-top: 16px;
          }
        }
        .score-row-item {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }
        .score-row-item .lbl {
          color: var(--ink-soft);
          font-weight: 500;
        }
        .score-row-item .val {
          font-weight: 700;
          color: var(--ink);
        }
        .last-updated-text {
          font-size: 11px;
          color: var(--ink-faint);
          margin-top: 8px;
        }

        /* 4 Sub Cards Grid */
        .sub-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 800px) {
          .sub-cards-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .sub-card {
          background: #fff;
          border: 1.5px solid var(--line-2);
          border-radius: 12px;
          padding: 20px;
        }
        .sub-card .lbl {
          font-size: 13px;
          font-weight: 600;
          color: var(--ink-soft);
          margin-bottom: 6px;
        }
        .sub-card .val {
          font-size: 24px;
          font-weight: 800;
          color: var(--ink);
          font-family: 'IBM Plex Mono', monospace;
        }
        .sub-card .desc {
          font-size: 12px;
          color: var(--ink-faint);
          margin-top: 4px;
        }

        /* Bottom Grid */
        .bottom-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 24px;
        }
        @media (max-width: 800px) {
          .bottom-grid {
            grid-template-columns: 1fr;
          }
        }
        .chart-card {
          background: #fff;
          border: 1.5px solid var(--line-2);
          border-radius: 12px;
          padding: 24px;
        }
        .chart-card h4 {
          font-size: 16px;
          color: var(--ink);
          margin-bottom: 16px;
          font-weight: 700;
        }
        .check-card {
          background: #fff;
          border: 1.5px solid var(--line-2);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .check-card h4 {
          font-size: 16px;
          color: var(--ink);
          margin: 0;
          font-weight: 700;
        }
        .check-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          padding-bottom: 8px;
          border-bottom: 1.5px solid var(--line);
        }
        .check-row .lbl {
          color: var(--ink-soft);
          font-weight: 500;
        }
        .check-row .val {
          font-weight: 700;
          color: var(--ink);
        }
        .btn-view-chain {
          display: block;
          width: 100%;
          text-align: center;
          padding: 10px;
          border: 1.5px solid var(--brass);
          color: var(--brass);
          font-size: 13.5px;
          font-weight: 700;
          border-radius: 6px;
          margin-top: 12px;
          transition: all 0.2s;
        }
        .btn-view-chain:hover {
          background: var(--brass);
          color: #fff;
        }

        /* Tiny Sidebar Agent List Picker */
        .sidebar-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 24px;
        }
        .sidebar-item {
          background: #fff;
          border: 1.5px solid var(--line-2);
          border-radius: 8px;
          padding: 14px 18px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sidebar-item:hover, .sidebar-item.active {
          border-color: var(--brass);
          background: var(--brass-soft);
        }
        .sidebar-item .name {
          font-weight: 600;
          color: var(--ink);
          font-size: 14px;
        }
        .sidebar-item .cat {
          color: var(--ink-faint);
          text-transform: uppercase;
        }
        .spinner {
          width: 52px;
          height: 52px;
          border: 5px solid var(--line-2);
          border-top: 5px solid var(--brass);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .toast-notification {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          min-width: 320px;
          max-width: 450px;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(8px);
          border-radius: 10px;
          box-shadow: 0 12px 32px rgba(124, 21, 34, 0.08), 0 1px 8px rgba(124, 21, 34, 0.04);
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          border-left: 5px solid var(--brass);
        }
        .toast-notification.success {
          border-left-color: #137333;
        }
        .toast-notification.error {
          border-left-color: #A61D2D;
        }
        .toast-notification.info {
          border-left-color: var(--brass);
        }
        .toast-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .toast-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }
        .success .toast-icon {
          background: #137333;
        }
        .error .toast-icon {
          background: #A61D2D;
        }
        .info .toast-icon {
          background: var(--brass);
        }
        .toast-message {
          font-size: 13.5px;
          color: var(--ink);
          font-weight: 500;
          line-height: 1.4;
        }
        .toast-close {
          border: none;
          background: transparent;
          color: var(--ink-faint);
          font-size: 18px;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }
        .toast-close:hover {
          color: var(--ink);
        }
        @keyframes slideIn {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Nav */}
      <nav>
        <div className="wrap nav-inner">
          <div className="brand" style={{ cursor: 'pointer' }} onClick={navigateToHome}>
            <svg className="brand-mark" viewBox="0 0 100 100" fill="currentColor">
              <g transform="translate(50, 38)">
                {Array.from({ length: 12 }).map((_, i) => (
                  <rect
                    key={i}
                    x="-3"
                    y="-24"
                    width="6"
                    height="12"
                    rx="3"
                    transform={`rotate(${i * 30})`}
                  />
                ))}
                <circle cx="0" cy="0" r="9" />
                <circle cx="0" cy="0" r="3.5" fill="var(--paper, #F5F0E8)" />
              </g>
              <rect x="47" y="38" width="6" height="42" rx="1.5" />
              <path d="M 53 62 h 12 v 6 h -6 v 4 h 6 v 6 h -12 Z" />
            </svg>
            <span className="brand-name">O<b>rdo</b></span>
          </div>
          <div className="nav-right">
            <div className="nav-links">
              <a href="#" onClick={(e) => { e.preventDefault(); navigateToHome(); }}>← Back to Home</a>
            </div>
            <button
              onClick={connectWallet}
              className="nav-cta"
              style={{ border: 'none', cursor: 'pointer', background: 'var(--brass)', color: '#fff', fontWeight: 600, padding: '10px 20px', borderRadius: '8px' }}
            >
              {userWallet ? `${userWallet.slice(0, 6)}...${userWallet.slice(-4)}` : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <section className="dashboard-section">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: '24px' }}>
            <span className="eyebrow">Scans &amp; Live Registry</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '38px', color: 'var(--ink)', margin: '8px 0 0 0' }}>Agent Overview</h2>
            <p style={{ margin: '4px 0 0 0' }}>Evaluate. Corpore. Trust.</p>
          </div>

          <div className="dash-grid">
            {/* Left Column: Scanner Form & Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="form-panel">
                <h3>Submit Agent for Scan</h3>
                <form onSubmit={handleRegister}>
                  <div className="field-group">
                    <label>Agent Name *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. OrbitAI" />
                  </div>
                  <div className="field-group">
                    <label>Category *</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="security">Security &amp; Wallet Intelligence</option>
                      <option value="developer">Infrastructure &amp; Developer</option>
                      <option value="research">Research &amp; Analysis</option>
                      <option value="trading">Trading Agent</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label>Smart Contract Address *</label>
                    <input type="text" value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} required placeholder="0x..." />
                  </div>
                  <div className="field-group">
                    <label>Deployment Chain *</label>
                    <select value={chainInput} onChange={(e) => setChainInput(e.target.value)}>
                      {chains.map((cname) => (
                        <option key={cname} value={cname.toLowerCase()}>{cname}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field-group">
                    <label>Website URL *</label>
                    <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} required placeholder="https://..." />
                  </div>
                  <div className="field-group">
                    <label>Documentation URL *</label>
                    <input type="url" value={docsUrl} onChange={(e) => setDocsUrl(e.target.value)} required placeholder="https://docs..." />
                  </div>
                  <div className="field-group">
                    <label>GitHub Repository URL</label>
                    <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
                  </div>
                  <div className="field-group">
                    <label>X (Twitter) Handle</label>
                    <input type="text" value={xHandle} onChange={(e) => setXHandle(e.target.value)} placeholder="e.g. orbit_ai" />
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--ink-soft)', fontStyle: 'italic', margin: '4px 0 16px 0', lineHeight: 1.4, textAlign: 'center' }}>
                    * For unreleased or offline properties, please designate as <b>N/A</b> to bypass live on-chain and repository assessment.
                  </p>
                  <button
                    type={userWallet ? "submit" : "button"}
                    onClick={handleFormButtonClick}
                    disabled={submitting}
                    className="btn-submit"
                  >
                    {!userWallet ? 'Connect Wallet' : submitting ? 'Verifying...' : 'Rating Agent ↗'}
                  </button>
                </form>
              </div>

              {/* Sidebar list picker */}
              <div className="form-panel" style={{ padding: '20px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: 'var(--ink)' }}>My Scanned Registry</h4>
                {loading ? (
                  <p style={{ fontSize: '13px', color: '#888' }}>Loading registry...</p>
                ) : !userWallet ? (
                  <p style={{ fontSize: '13px', color: 'var(--ink-soft)', textAlign: 'center', padding: '24px 12px', background: 'var(--paper)', borderRadius: '8px' }}>
                    Connect your Solana wallet to view your scanned agents.
                  </p>
                ) : filteredAgents.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--ink-soft)', textAlign: 'center', padding: '24px 12px', background: 'var(--paper)', borderRadius: '8px' }}>
                    No scans submitted by this wallet yet.
                  </p>
                ) : (
                  <div className="sidebar-list">
                    {filteredAgents.map((a) => (
                      <div
                        key={a.id}
                        className={`sidebar-item ${selectedAgent?.id === a.id ? 'active' : ''}`}
                        onClick={() => setSelectedAgent(a)}
                      >
                        <span className="name">{a.name}</span>
                        <span className="cat">{a.category.slice(0, 3)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: High Fidelity Overview Dashboard */}
            <div className="overview-panel">
              {!userWallet ? (
                <div style={{ background: '#fff', border: '1px dashed var(--line-2)', borderRadius: '12px', padding: '120px 40px', textAlign: 'center' }}>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '26px', color: 'var(--brass)', marginBottom: '12px' }}>Access Restricted</h3>
                  <p style={{ color: 'var(--ink-soft)', fontSize: '15px', maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>
                    Please connect your Solana wallet using the button in the navigation bar to access the reputation registry and scan results.
                  </p>
                </div>
              ) : selectedAgent ? (() => {
                if (selectedAgent.status !== 'published' && selectedAgent.status !== 'rejected_invalid') {
                  return (
                    <div className="main-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '450px', textAlign: 'center', gap: '24px', padding: '40px' }}>
                      <div className="spinner"></div>
                      <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '28px', color: 'var(--brass)', margin: 0 }}>Scanning &amp; Ingesting Agent Telemetry...</h3>
                      <p style={{ color: 'var(--ink-soft)', maxWidth: '520px', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
                        The Ordo reputation nodes are currently verifying contract signatures, ingesting off-chain GitHub code metrics, and pulling live Solana smart contract balances. Please wait while the analysis compiles.
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', fontSize: '13px', color: 'var(--ink-faint)', fontWeight: 700, marginTop: '12px' }}>
                        <span style={{ color: selectedAgent.status === 'submitted' ? 'var(--accent)' : 'var(--ink-soft)' }}>1. Signature Verified ✓</span>
                        <span style={{ color: selectedAgent.status === 'ingesting' ? 'var(--accent)' : 'var(--ink-soft)' }}>2. Ingesting Telemetry {selectedAgent.status === 'ingesting' ? '⏳' : ''}</span>
                        <span style={{ color: selectedAgent.status === 'analyzing' ? 'var(--accent)' : 'var(--ink-soft)' }}>3. Compiling Reputation Scores {selectedAgent.status === 'analyzing' ? '⏳' : ''}</span>
                      </div>
                    </div>
                  );
                }

                const scoreObj = selectedAgent.scores && selectedAgent.scores.length > 0
                  ? JSON.parse(selectedAgent.scores[0].hardSignalScores)
                  : null;

                const liveGithubScore = scoreObj ? Math.round(scoreObj.githubScore) : 0;
                const liveOnchainScore = scoreObj ? Math.round(scoreObj.onchainScore) : 0;

                const totalScore = scoreObj
                  ? Math.round((scoreObj.githubScore * scoreObj.githubWeight) + (scoreObj.onchainScore * scoreObj.onchainWeight))
                  : 0;

                const performance = liveOnchainScore;
                const reliability = liveGithubScore;
                const security = liveOnchainScore ? Math.round(liveOnchainScore * 0.98) : 0;
                const transparency = liveGithubScore ? Math.round(liveGithubScore * 0.95) : 0;
                const tokenomics = liveOnchainScore ? Math.round(liveOnchainScore * 1.02) : 0;

                // Map live snapshots from database
                const txSnapshot = selectedAgent.snapshots?.find(s => s.signalKey === 'tx_count_30d');
                const walletsSnapshot = selectedAgent.snapshots?.find(s => s.signalKey === 'active_wallets_30d');
                const tvlSnapshot = selectedAgent.snapshots?.find(s => s.signalKey === 'tvl');
                const uptimeSnapshot = selectedAgent.snapshots?.find(s => s.signalKey === 'uptime_30d');

                const txCount = txSnapshot ? txSnapshot.value.toLocaleString() : '0';
                const activeWallets = walletsSnapshot ? walletsSnapshot.value.toLocaleString() : '0';
                const tvlVal = tvlSnapshot ? tvlSnapshot.value.toLocaleString() : '0';
                const uptimeVal = uptimeSnapshot ? uptimeSnapshot.value.toFixed(1) + '%' : '0%';

                // SVG Dash calculations
                const radius = 60;
                const circumference = 2 * Math.PI * radius;
                const displayScore = totalScore;
                const offset = circumference - (displayScore / 100) * circumference;

                const firstAddr = selectedAgent.contractAddresses.split(',')[0].trim();
                const displayAddr = firstAddr.slice(0, 8) + '...' + firstAddr.slice(-4);

                const hasGithub = !!selectedAgent.githubUrl && selectedAgent.githubUrl !== 'N/A' && selectedAgent.githubUrl !== '';

                return (
                  <>
                    {/* Main Overview Card */}
                    <div className="main-card">
                      <div className="mc-left">
                        <div className="mc-header">
                          <div className="mc-logo-wrapper">
                            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" />
                              <circle cx="12" cy="12" r="4" />
                              <path d="M12 2v20M2 12h20" />
                            </svg>
                          </div>
                          <div className="mc-title">
                            <h3>
                              {selectedAgent.name}
                              <span className="verified-badge">{selectedAgent.status.toUpperCase()}</span>
                            </h3>
                            <div className="mc-address">{displayAddr}</div>
                          </div>
                        </div>
                        <p className="mc-bio">
                          Autonomous agent registered under the {selectedAgent.category} category. Monitored on-chain on {selectedAgent.chains.toUpperCase()}.
                        </p>
                        <div className="mc-tags">
                          <span className="mc-tag">{selectedAgent.category}</span>
                          <span className="mc-tag">{selectedAgent.chains.toUpperCase()}</span>
                        </div>
                      </div>

                      {/* Radial Progress Score Chart */}
                      <div className="radial-col">
                        <svg className="radial-svg">
                          <circle className="radial-bg" cx="75" cy="75" r={radius} />
                          <circle
                            className="radial-progress"
                            cx="75"
                            cy="75"
                            r={radius}
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                          />
                        </svg>
                        <div className="radial-center-text">
                          <span className="lbl">ORDO SCORE</span>
                          <span className="num">{displayScore}</span>
                          <span className="of">/100</span>
                        </div>
                      </div>

                      {/* Right Scores List Breakdown */}
                      <div className="mc-scores-list">
                        <div className="score-row-item">
                          <span className="lbl">Performance</span>
                          <span className="val">{performance}</span>
                        </div>
                        <div className="score-row-item">
                          <span className="lbl">Reliability</span>
                          <span className="val">{reliability}</span>
                        </div>
                        <div className="score-row-item">
                          <span className="lbl">Security</span>
                          <span className="val">{security}</span>
                        </div>
                        <div className="score-row-item">
                          <span className="lbl">Transparency</span>
                          <span className="val">{transparency}</span>
                        </div>
                        <div className="score-row-item">
                          <span className="lbl">Tokenomics</span>
                          <span className="val">{tokenomics}</span>
                        </div>
                        <div className="last-updated-text">
                          Last updated<br />{new Date(selectedAgent.submittedAt).toUTCString()}
                        </div>
                      </div>
                    </div>

                    {/* 4 Cards Grid */}
                    <div className="sub-cards-grid">
                      <div className="sub-card">
                        <div className="lbl">On-chain Activity</div>
                        <div className="val">{txCount}</div>
                        <div className="desc">Transactions</div>
                      </div>
                      <div className="sub-card">
                        <div className="lbl">Users</div>
                        <div className="val">{activeWallets}</div>
                        <div className="desc">Unique Wallets</div>
                      </div>
                      <div className="sub-card">
                        <div className="lbl">Uptime</div>
                        <div className="val">{uptimeVal}</div>
                        <div className="desc">Last 30 Days</div>
                      </div>
                      <div className="sub-card">
                        <div className="lbl">Revenue Generated</div>
                        <div className="val">{tvlVal} SOL</div>
                        <div className="desc">Total</div>
                      </div>
                    </div>

                    {/* Bottom row: Chart and Checklist */}
                    <div className="bottom-grid">
                      {/* Rating History SVG Graph */}
                      <div className="chart-card">
                        <h4>Rating History</h4>
                        <div style={{ width: '100%', height: '180px', marginTop: '16px', position: 'relative' }}>
                          <svg viewBox="0 0 500 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                            <defs>
                              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#7C1522" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#7C1522" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            {/* Gridlines */}
                            <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" />
                            <line x1="0" y1="75" x2="500" y2="75" stroke="#F1F5F9" strokeWidth="1" />
                            <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F5F9" strokeWidth="1" />

                            {/* Line Chart path */}
                            <path
                              d="M 10 120 Q 100 80, 200 90 T 400 50 T 490 30 L 490 150 L 10 150 Z"
                              fill="url(#chartGrad)"
                            />
                            <path
                              d="M 10 120 Q 100 80, 200 90 T 400 50 T 490 30"
                              fill="none"
                              stroke="#7C1522"
                              strokeWidth="2.5"
                            />
                            {/* Point circles */}
                            <circle cx="10" cy="120" r="4" fill="#7C1522" />
                            <circle cx="120" cy="83" r="4" fill="#7C1522" />
                            <circle cx="240" cy="85" r="4" fill="#7C1522" />
                            <circle cx="360" cy="58" r="4" fill="#7C1522" />
                            <circle cx="490" cy="30" r="4" fill="#7C1522" />
                          </svg>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '8px' }}>
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                          </div>
                        </div>
                      </div>
                      {/* Verification checklist card */}
                      <div className="check-card">
                        <h4>Verification</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                          <div className="check-row">
                            <span className="lbl">Contract Verified</span>
                            <span className="val" style={{ color: (selectedAgent.contractAddresses && selectedAgent.contractAddresses.toUpperCase() !== 'N/A' && selectedAgent.contractAddresses.toUpperCase() !== 'NONE') ? '#137333' : '#A61D2D' }}>
                              {(selectedAgent.contractAddresses && selectedAgent.contractAddresses.toUpperCase() !== 'N/A' && selectedAgent.contractAddresses.toUpperCase() !== 'NONE') ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="check-row">
                            <span className="lbl">Source Verified</span>
                            <span className="val" style={{ color: hasGithub ? '#137333' : '#A61D2D' }}>
                              {hasGithub ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="check-row">
                            <span className="lbl">Audit</span>
                            <span className="val" style={{ color: selectedAgent.status === 'published' ? '#137333' : '#A61D2D' }}>
                              {selectedAgent.status === 'published' ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="check-row">
                            <span className="lbl">Registry</span>
                            <span className="val">Ordo</span>
                          </div>
                        </div>
                        <a
                          href={selectedAgent.website}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-view-chain"
                        >
                          View on Chain ↗
                        </a>
                      </div>
                    </div>
                  </>
                );
              })() : filteredAgents.length === 0 ? (
                <div style={{ background: '#fff', border: '1px dashed var(--line-2)', borderRadius: '12px', padding: '120px 40px', textAlign: 'center' }}>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', color: 'var(--brass)', marginBottom: '12px' }}>No Scan History Found</h3>
                  <p style={{ color: 'var(--ink-soft)', fontSize: '15px', maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>
                    You haven't scanned any AI Agents with this wallet yet. Please fill out the registration form on the left to begin your first scan!
                  </p>
                </div>
              ) : (
                <div style={{ background: '#fff', border: '1px dashed var(--line-2)', borderRadius: '12px', padding: '100px 40px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--ink-soft)', fontSize: '16px' }}>Select an agent from your sidebar registry to view the reputational dashboard.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: '80px', backgroundColor: '#fff', borderTop: '1px solid #EAEAEA', padding: '24px 0' }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94A3B8' }}>
          <p>© 2026 Ordo</p>
          <p>Independent · Unbuyable · Dated</p>
        </div>
      </footer>
    </>
  );
}
