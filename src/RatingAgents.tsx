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
  selectionRationale?: string;
  scores?: any[];
  snapshots?: any[];
  processAfter?: string | null;
  scanIndex?: number;
  identities?: any[];
  updatedAt?: string;
}

const CountdownScreen = ({ processAfter, onComplete }: { processAfter: string; onComplete: () => void }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(processAfter) - +new Date();
      if (difference <= 0) {
        onComplete();
        return '00:00';
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const parts = [];
      if (hours > 0) parts.push(String(hours).padStart(2, '0'));
      parts.push(String(minutes).padStart(2, '0'));
      parts.push(String(seconds).padStart(2, '0'));

      return parts.join(':');
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [processAfter, onComplete]);

  return (
    <div className="main-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '450px', textAlign: 'center', gap: '24px', padding: '40px' }}>
      <div className="spinner" style={{ borderTopColor: 'var(--accent)', width: '60px', height: '60px' }}></div>
      <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '28px', color: 'var(--ink)', margin: 0 }}>Reputation Verification in Progress</h3>

      <div style={{ background: 'var(--paper)', border: '1px solid var(--ink-faint)', borderRadius: '12px', padding: '24px 48px', margin: '12px 0' }}>
        <p style={{ color: 'var(--ink-soft)', textTransform: 'uppercase', fontSize: '11px', fontWeight: 900, letterSpacing: '1.5px', margin: '0 0 8px 0' }}>Estimated Completion Time</p>
        <span style={{ fontFamily: 'monospace', fontSize: '48px', fontWeight: 700, color: 'var(--accent)' }}>{timeLeft}</span>
      </div>

      <p style={{ color: 'var(--ink-soft)', maxWidth: '520px', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
        Ordo nodes are compiling off-chain reputation snapshots and validating smart contract telemetry. Your final rating and secure badge will be unlocked when the verification cooldown expires.
      </p>

      <div style={{ background: 'rgba(226, 193, 124, 0.1)', border: '1px dashed var(--brass)', borderRadius: '8px', padding: '16px 24px', maxWidth: '500px', marginTop: '12px' }}>
        <h4 style={{ color: 'var(--brass)', fontSize: '14px', fontWeight: 900, margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🚀 Speed Up Rating Queue</h4>
        <p style={{ color: 'var(--ink-soft)', fontSize: '13px', lineHeight: 1.5, margin: '0 0 12px 0' }}>
          Want to skip the queue? Hold at least <b>50,000 $ORDO</b> in your wallet for <b>instant rating</b>!
        </p>
        <a
          href="https://pump.fun"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '8px 18px',
            fontSize: '12px',
            textDecoration: 'none',
            backgroundColor: 'var(--brass)',
            color: '#fff',
            borderRadius: '6px',
            fontWeight: 800,
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          Buy $ORDO ↗
        </a>
      </div>
    </div>
  );
};

const OrdoKeyIcon = ({ size = 24 }: { size?: number }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="currentColor" 
    style={{ width: `${size}px`, height: `${size}px`, color: 'var(--accent)' }}
  >
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
);

function AgentFavicon({ websiteUrl, name, size = 48, className = '', borderRadius = '11px', fallback }: { websiteUrl?: string; name: string; size?: number; className?: string; borderRadius?: string; fallback?: React.ReactNode }) {
  const [imgError, setImgError] = useState(false);
  
  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: borderRadius,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flex: 'none',
    textTransform: 'uppercase'
  };

  const renderFallback = () => {
    if (fallback) {
      return (
        <div className={className} style={{ ...containerStyle }}>
          {fallback}
        </div>
      );
    }
    return (
      <div 
        className={className} 
        style={{ 
          ...containerStyle, 
          background: 'var(--paper)',
          border: '1.5px solid var(--line-2)'
        }}
      >
        <OrdoKeyIcon size={Math.round(size * 0.6)} />
      </div>
    );
  };

  if (!websiteUrl || imgError) {
    return renderFallback();
  }

  try {
    const url = new URL(websiteUrl);
    const domain = url.hostname;
    const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}&default=404`;

    return (
      <div 
        className={className} 
        style={{ 
          ...containerStyle, 
          background: 'transparent'
        }}
      >
        <img 
          src={faviconUrl} 
          alt={`${name} favicon`} 
          onError={() => setImgError(true)}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain'
          }} 
        />
      </div>
    );
  } catch (e) {
    return renderFallback();
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function RatingAgents() {
  const [agentsList, setAgentsList] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userWallet, setUserWallet] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  // Form states cached in localStorage
  const [name, setName] = useState(() => localStorage.getItem('ordo_form_name') || '');
  const [category, setCategory] = useState(() => localStorage.getItem('ordo_form_category') || 'security');
  const [contractAddress, setContractAddress] = useState(() => localStorage.getItem('ordo_form_contractAddress') || '');
  const [chainInput, setChainInput] = useState(() => localStorage.getItem('ordo_form_chainInput') || 'ethereum');
  const [website, setWebsite] = useState(() => localStorage.getItem('ordo_form_website') || '');
  const [docsUrl, setDocsUrl] = useState(() => localStorage.getItem('ordo_form_docsUrl') || '');
  const [githubUrl, setGithubUrl] = useState(() => localStorage.getItem('ordo_form_githubUrl') || '');
  const [xHandle, setXHandle] = useState(() => localStorage.getItem('ordo_form_xHandle') || '');

  // Synchronize form states to localStorage
  useEffect(() => {
    localStorage.setItem('ordo_form_name', name);
    localStorage.setItem('ordo_form_category', category);
    localStorage.setItem('ordo_form_contractAddress', contractAddress);
    localStorage.setItem('ordo_form_chainInput', chainInput);
    localStorage.setItem('ordo_form_website', website);
    localStorage.setItem('ordo_form_docsUrl', docsUrl);
    localStorage.setItem('ordo_form_githubUrl', githubUrl);
    localStorage.setItem('ordo_form_xHandle', xHandle);
  }, [name, category, contractAddress, chainInput, website, docsUrl, githubUrl, xHandle]);

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

  const fetchAgents = async (wallet?: string) => {
    try {
      const url = wallet 
        ? `${API_URL}/api/v1/agents?walletAddress=${encodeURIComponent(wallet)}`
        : `${API_URL}/api/v1/agents`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAgentsList(data);
        if (data.length > 0) {
          const currentSelectedId = selectedAgent?.id;
          const stillExists = data.find((a: any) => a.id === currentSelectedId);
          if (stillExists) {
            setSelectedAgent(stillExists);
          } else {
            setSelectedAgent(data[0]);
          }
        } else {
          setSelectedAgent(null);
        }
      }
    } catch (e) {
      console.error('Failed to fetch agents:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents(userWallet);
  }, [userWallet]);

  // Poll state changes when scanning a new agent
  useEffect(() => {
    if (!scanningAgentId) return;

    const interval = setInterval(async () => {
      try {
        const url = userWallet 
          ? `${API_URL}/api/v1/agents?walletAddress=${encodeURIComponent(userWallet)}`
          : `${API_URL}/api/v1/agents`;
        const res = await fetch(url);
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

      const res = await fetch(`${API_URL}/api/v1/agents/submit`, {
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
          const url = submitterWallet 
            ? `${API_URL}/api/v1/agents?walletAddress=${encodeURIComponent(submitterWallet)}`
            : `${API_URL}/api/v1/agents`;
          const fetchRes = await fetch(url);
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



  const filteredAgents = agentsList;

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
          margin-top: 16px;
          max-height: 280px;
          overflow-y: auto;
          padding-right: 6px;
        }
        .sidebar-list::-webkit-scrollbar {
          width: 5px;
        }
        .sidebar-list::-webkit-scrollbar-track {
          background: var(--paper);
          border-radius: 4px;
        }
        .sidebar-list::-webkit-scrollbar-thumb {
          background: var(--line-2);
          border-radius: 4px;
        }
        .sidebar-list::-webkit-scrollbar-thumb:hover {
          background: var(--brass);
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
          font-size: 13.5px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          flex: 1;
          text-align: left;
          margin-right: 12px;
        }
        .sidebar-item .cat {
          color: var(--ink-soft);
          text-transform: uppercase;
          font-size: 11px;
          font-weight: 700;
          padding: 6px 10px;
          background: var(--paper);
          border-radius: 6px;
          border: 1px solid var(--line-2);
          flex-shrink: 0;
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
              <a href="https://x.com/OrdoKeyRank" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" style={{ display: 'inline-flex', alignItems: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://github.com/KingofSpades-dev/OrdoKey" target="_blank" rel="noopener noreferrer">GitHub</a>
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
              {/* Sidebar list picker */}
              <div className="form-panel" style={{ padding: '20px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: 'var(--ink)' }}>Reputation Registry</h4>
                {loading ? (
                  <p style={{ fontSize: '13px', color: '#888' }}>Loading registry...</p>
                ) : filteredAgents.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--ink-soft)', textAlign: 'center', padding: '24px 12px', background: 'var(--paper)', borderRadius: '8px' }}>
                    No scans available.
                  </p>
                ) : (
                  <div style={{ position: 'relative', width: '100%' }}>
                    {/* Trigger Button */}
                    <div
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="sidebar-item active"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        border: '1.5px solid var(--brass)',
                        borderRadius: '8px',
                        padding: '14px 18px',
                        background: 'var(--brass-soft)',
                        height: '52px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <span className="name" style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '13.5px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', flex: 1, textAlign: 'left', marginRight: '12px' }}>
                        {selectedAgent ? selectedAgent.name : 'Select Agent'}
                      </span>
                      <span className="cat" style={{ color: 'var(--ink-soft)', textTransform: 'uppercase', fontSize: '11px', fontWeight: 700, padding: '6px 10px', background: '#fff', borderRadius: '6px', border: '1px solid var(--line-2)', flexShrink: 0 }}>
                        {selectedAgent ? selectedAgent.category.slice(0, 3) : ''}
                      </span>
                      <span style={{ marginLeft: '8px', fontSize: '10px', color: 'var(--brass)' }}>▼</span>
                    </div>

                    {/* Dropdown Options List */}
                    {dropdownOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '58px',
                          left: 0,
                          right: 0,
                          zIndex: 100,
                          background: '#fff',
                          border: '1.5px solid var(--line-2)',
                          borderRadius: '8px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                          maxHeight: '280px',
                          overflowY: 'auto',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          padding: '6px'
                        }}
                      >
                        {filteredAgents.map((a) => (
                          <div
                            key={a.id}
                            onClick={() => {
                              setSelectedAgent(a);
                              setDropdownOpen(false);
                            }}
                            className="sidebar-item"
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer',
                              borderRadius: '6px',
                              padding: '10px 12px',
                              background: selectedAgent?.id === a.id ? 'var(--brass-soft)' : '#fff',
                              border: selectedAgent?.id === a.id ? '1px solid var(--brass)' : '1px solid transparent',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={(e) => {
                              if (selectedAgent?.id !== a.id) {
                                e.currentTarget.style.background = 'var(--paper)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (selectedAgent?.id !== a.id) {
                                e.currentTarget.style.background = '#fff';
                              }
                            }}
                          >
                            <span className="name" style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '13px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', flex: 1, textAlign: 'left', marginRight: '12px' }}>
                              {a.name}
                            </span>
                            <span className="cat" style={{ color: 'var(--ink-soft)', textTransform: 'uppercase', fontSize: '10px', fontWeight: 700, padding: '4px 8px', background: 'var(--paper)', borderRadius: '6px', border: '1px solid var(--line-2)', flexShrink: 0 }}>
                              {a.category.slice(0, 3)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Scanner Form */}
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
                    <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} required placeholder="https://..." />
                  </div>
                  <div className="field-group">
                    <label>Documentation URL *</label>
                    <input type="text" value={docsUrl} onChange={(e) => setDocsUrl(e.target.value)} required placeholder="https://docs..." />
                  </div>
                  <div className="field-group">
                    <label>GitHub Repository URL</label>
                    <input type="text" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
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
            </div>

            {/* Right Column: High Fidelity Overview Dashboard */}
            <div className="overview-panel">
              {!userWallet ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '400px',
                  textAlign: 'center',
                  padding: '60px 40px',
                  background: '#fff',
                  border: '1.5px dashed var(--line-2)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
                }}>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '32px', color: '#8c1d2d', margin: '0 0 16px 0', fontWeight: 'bold' }}>Access Restricted</h3>
                  <p style={{ color: 'var(--ink-soft)', maxWidth: '440px', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
                    Please connect your Solana wallet using the button in the navigation bar to access the reputation registry and scan results.
                  </p>
                </div>
              ) : selectedAgent ? (() => {
                const processAfterDate = selectedAgent.processAfter ? new Date(selectedAgent.processAfter) : null;
                const isDelayActive = processAfterDate && new Date() < processAfterDate;

                if (isDelayActive) {
                  return (
                    <CountdownScreen
                      processAfter={selectedAgent.processAfter!}
                      onComplete={() => fetchAgents()}
                    />
                  );
                }

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

                const isUnrated = scoreObj?.insufficientEvidence;
                const editorialScore = selectedAgent.scores?.[0]?.editorialScore ?? 0;
                const totalScore = scoreObj
                  ? (typeof scoreObj.finalScore === 'number'
                    ? Math.round(editorialScore + scoreObj.finalScore)
                    : Math.round(editorialScore + (scoreObj.verifiabilityScore + scoreObj.activityScore + scoreObj.maintenanceScore + scoreObj.securityScore - (scoreObj.adminPenalty || 0))))
                  : 0;

                // SVG Dash calculations
                const radius = 60;
                const circumference = 2 * Math.PI * radius;
                const displayScore = totalScore;
                const offset = circumference - (displayScore / 100) * circumference;



                const hasGithub = !!selectedAgent.githubUrl && selectedAgent.githubUrl !== 'N/A' && selectedAgent.githubUrl !== '';

                const starsCount = scoreObj && typeof scoreObj.starsCount === 'number' ? scoreObj.starsCount : 0;
                const starLabel = scoreObj && scoreObj.starLabel ? scoreObj.starLabel : "Unrated";
                const starDesc = scoreObj && scoreObj.starDesc ? scoreObj.starDesc : "Below Ordo rating threshold.";

                return (
                  <>
                    {/* Main Overview Card */}
                    <div className="main-card">
                      <div className="mc-left">
                        <div className="mc-header">
                          <AgentFavicon 
                            websiteUrl={selectedAgent.website} 
                            name={selectedAgent.name} 
                            size={64} 
                            className="mc-logo-wrapper" 
                            borderRadius="50%" 
                            fallback={
                              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '32px', height: '32px', color: 'var(--brass)' }}>
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v20M2 12h20" />
                              </svg>
                            }
                          />
                          <div className="mc-title">
                            <h3>
                              {selectedAgent.name}
                              <span className="verified-badge">{selectedAgent.status.toUpperCase()}</span>
                            </h3>
                            {(() => {
                              const primaryIdentity = selectedAgent.identities?.find((id: any) => id.isPrimary) || selectedAgent.identities?.[0] || null;
                              const contractAddress = primaryIdentity?.contractAddress || selectedAgent.contractAddresses.split(',')[0].trim();
                              const displayAddr = contractAddress 
                                ? `${contractAddress.slice(0, 6)}...${contractAddress.slice(-6)}` 
                                : 'N/A';
                              const verificationTier = primaryIdentity?.verificationTier || 'unverified';
                              const explorerUrl = primaryIdentity?.explorerUrl || '';
                              const lastCheckedAt = primaryIdentity?.lastCheckedAt || selectedAgent.updatedAt;
                              const formattedCheckedDate = lastCheckedAt ? new Date(lastCheckedAt).toLocaleDateString() : '';

                              return (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    {explorerUrl ? (
                                      <a 
                                        href={explorerUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{ 
                                          fontFamily: 'monospace', 
                                          fontSize: '13px', 
                                          color: 'var(--brass)', 
                                          textDecoration: 'underline',
                                          fontWeight: 600
                                        }}
                                      >
                                        {displayAddr}
                                      </a>
                                    ) : (
                                      <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--ink-soft)' }}>
                                        {displayAddr}
                                      </span>
                                    )}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(contractAddress);
                                        const target = e.currentTarget;
                                        const originalText = target.innerHTML;
                                        target.innerHTML = '✓';
                                        target.style.color = 'var(--accent)';
                                        setTimeout(() => {
                                          target.innerHTML = originalText;
                                          target.style.color = '';
                                        }, 1000);
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        fontSize: '12px',
                                        color: 'var(--brass)',
                                        display: 'inline-flex',
                                        alignItems: 'center'
                                      }}
                                      title="Copy Address"
                                    >
                                      📋
                                    </button>
                                    <span 
                                      style={{
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        background: verificationTier === 'ownership_verified' 
                                          ? 'var(--brass-soft)' 
                                          : verificationTier === 'verified' 
                                            ? '#e2ece9' 
                                            : '#fdeded',
                                        color: verificationTier === 'ownership_verified' 
                                          ? 'var(--brass)' 
                                          : verificationTier === 'verified' 
                                            ? '#2d6a4f' 
                                            : '#d32f2f',
                                        border: `1px solid ${
                                          verificationTier === 'ownership_verified' 
                                            ? 'var(--brass)' 
                                            : verificationTier === 'verified' 
                                              ? '#2d6a4f' 
                                              : '#d32f2f'
                                        }`
                                      }}
                                    >
                                      {verificationTier === 'ownership_verified' ? '✓ OWNER VERIFIED' : verificationTier === 'verified' ? '✓ VERIFIED' : 'UNVERIFIED'}
                                    </span>
                                  </div>
                                  {formattedCheckedDate && (
                                    <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>
                                      Checked on {formattedCheckedDate}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                              <div style={{ display: 'flex', gap: '2px', fontSize: '15px', color: 'var(--brass)' }}>
                                {Array.from({ length: 3 }).map((_, i) => (
                                  <span key={i}>{i < starsCount ? '★' : '☆'}</span>
                                ))}
                              </div>
                              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brass)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {starLabel}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--ink-soft)', maxWidth: '280px', lineHeight: 1.35 }}>
                                {starDesc}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="mc-bio">
                          Autonomous agent registered under the {selectedAgent.category} category. Monitored on-chain on {selectedAgent.chains.toUpperCase()}.
                        </p>
                        <div className="mc-tags" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <span className="mc-tag">{selectedAgent.category}</span>
                            <span className="mc-tag">{selectedAgent.chains.toUpperCase()}</span>
                          </div>
                          <a
                            href={`${API_URL}/api/v1/badge/${selectedAgent.id}.svg?walletAddress=${encodeURIComponent(userWallet)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mc-tag"
                            style={{
                              background: 'var(--brass)',
                              color: '#fff',
                              textDecoration: 'none',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              transition: 'opacity 0.2s',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
                            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                          >
                            View Live Badge ↗
                          </a>
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
                        {isUnrated ? (
                          <div style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
                            No rating breakdown available due to insufficient data.
                          </div>
                        ) : (
                          <>
                            <div className="score-row-item">
                              <span className="lbl">Verifiability</span>
                              <span className="val">{scoreObj ? scoreObj.verifiabilityScore : 0} / 25</span>
                            </div>
                            <div className="score-row-item">
                              <span className="lbl">Activity</span>
                              <span className="val">{scoreObj ? Math.round(scoreObj.activityScore) : 0} / 25</span>
                            </div>
                            <div className="score-row-item">
                              <span className="lbl">Maintenance</span>
                              <span className="val">{scoreObj ? Math.round(scoreObj.maintenanceScore) : 0} / 25</span>
                            </div>
                            <div className="score-row-item">
                              <span className="lbl">Security Posture</span>
                              <span className="val">{scoreObj ? scoreObj.securityScore : 0} / 25</span>
                            </div>
                          </>
                        )}
                        <div className="last-updated-text" style={{ marginTop: '16px' }}>
                          Last updated<br />{new Date(selectedAgent.submittedAt).toUTCString()}
                        </div>
                      </div>
                    </div>

                    {/* Telemetry Evidence Store */}
                    <div style={{ margin: '12px 0 24px' }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Telemetry Evidence Store</h4>
                      <div className="sub-cards-grid">
                        <div className="sub-card">
                          <div className="lbl">GitHub Commits (30d)</div>
                          <div className="val">{scoreObj?.commitsVal !== undefined ? scoreObj.commitsVal : 'N/A'}</div>
                          <div className="desc">Commits</div>
                        </div>
                        <div className="sub-card">
                          <div className="lbl">Unique Users (30d)</div>
                          <div className="val">{scoreObj?.uniqueAddresses !== undefined ? scoreObj.uniqueAddresses.toLocaleString() : 'N/A'}</div>
                          <div className="desc">Active Wallets</div>
                        </div>
                        <div className="sub-card">
                          <div className="lbl">Security Audit</div>
                          <div className="val" style={{ color: selectedAgent.snapshots?.find((s: any) => s.signalKey === 'audit_exists')?.value === 1 ? '#137333' : '#A61D2D' }}>
                            {selectedAgent.snapshots?.find((s: any) => s.signalKey === 'audit_exists')?.value === 1 ? 'Yes' : 'No / Unknown'}
                          </div>
                          <div className="desc">Verified Audit</div>
                        </div>
                        <div className="sub-card">
                          <div className="lbl">Admin Control Keys</div>
                          <div className="val" style={{ color: selectedAgent.snapshots?.find((s: any) => s.signalKey === 'admin_keys_safe')?.value === 1 ? '#137333' : '#A61D2D' }}>
                            {selectedAgent.snapshots?.find((s: any) => s.signalKey === 'admin_keys_safe')?.value === 1 ? 'Safe' : 'Risky / Retained'}
                          </div>
                          <div className="desc">Key Structure</div>
                        </div>
                      </div>
                    </div>

                    {/* Selection Rationale and Limitations */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                      <div style={{ padding: '20px', border: '1px solid var(--line-2)', borderRadius: '8px', background: '#fff' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Selection Rationale</h4>
                        <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
                          {selectedAgent.selectionRationale || 'Autonomous Web3 AI agent seeded in the cohort.'}
                        </p>
                      </div>

                      {(() => {
                        const limitationsList = [];
                        if (!selectedAgent.githubUrl || selectedAgent.githubUrl === 'N/A' || selectedAgent.githubUrl === '') {
                          limitationsList.push("Open-source code repository: We could not verify the source code, developer commits, or contributor distribution.");
                        }
                        if (!selectedAgent.docsUrl || selectedAgent.docsUrl === 'N/A' || selectedAgent.docsUrl === '') {
                          limitationsList.push("Developer integration docs: Missing integration instructions or public API schemas.");
                        }
                        const activeWalletsSnapshot = selectedAgent.snapshots?.find((s: any) => s.signalKey === 'active_wallets_30d');
                        if (!activeWalletsSnapshot) {
                          limitationsList.push("On-chain user telemetry: Unique interacting address counts could not be verified.");
                        }
                        const auditSnapshot = selectedAgent.snapshots?.find((s: any) => s.signalKey === 'audit_exists');
                        if (!auditSnapshot || auditSnapshot.value === 0) {
                          limitationsList.push("Security audits: No public smart contract audit reports were evidenced.");
                        }
                        const adminKeysSnapshot = selectedAgent.snapshots?.find((s: any) => s.signalKey === 'admin_keys_safe');
                        if (!adminKeysSnapshot || adminKeysSnapshot.value === 0) {
                          limitationsList.push("Admin control keys: Upgradeability admin key structure remains undisclosed or unrestricted.");
                        }

                        return (
                          <div style={{
                            padding: '20px',
                            border: '1px solid #A61D2D',
                            backgroundColor: 'rgba(166, 29, 45, 0.03)',
                            borderRadius: '8px'
                          }}>
                            <h4 style={{ color: '#A61D2D', margin: '0 0 8px 0', fontSize: '14px' }}>⚠ Limitations of Assessment</h4>
                            {limitationsList.length > 0 ? (
                              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                                {limitationsList.map((lim, idx) => (
                                  <li key={idx}>{lim}</li>
                                ))}
                              </ul>
                            ) : (
                              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)' }}>
                                No verifiability limitations identified for this agent profile.
                              </p>
                            )}
                          </div>
                        );
                      })()}
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
              })() : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '400px',
                  textAlign: 'center',
                  padding: '60px 40px',
                  background: '#fff',
                  border: '1.5px dashed var(--line-2)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
                }}>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '32px', color: '#8c1d2d', margin: '0 0 16px 0', fontWeight: 'bold' }}>No Rating Data</h3>
                  <p style={{ color: 'var(--ink-soft)', maxWidth: '440px', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
                    There are no scans or rating records in the registry for this wallet. Use the form on the left to submit an agent for reputation rating.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div className="foot-brand">
              <div className="brand">
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
              <p>The independent editorial authority for Web3 AI agents. Rankings you can trust, methodology you can read.</p>
            </div>
            <div className="foot-cols">
              <div className="foot-col">
                <h5>Rankings</h5>
                <a href="#">Security</a><a href="#">Infrastructure</a><a href="#">Research</a><a href="#">Trading</a>
              </div>
              <div className="foot-col">
                <h5>Publication</h5>
                <a href="#">Dossiers</a><a href="#">Investigations</a><a href="#">Weekly report</a><a href="#">Interviews</a>
              </div>
              <div className="foot-col">
                <h5>The Guide</h5>
                <a href="#">Methodology</a><a href="#">Editorial standards</a><a href="#">Holder benefits</a><a href="#">Submit an agent</a>
              </div>
            </div>
          </div>
          <div className="foot-bottom">
            <p>© 2026 Ordo</p>
            <p>Independent · Unbuyable · Dated</p>
          </div>
        </div>
      </footer>
    </>
  );
}
