import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import RatingAgents from './RatingAgents.tsx'
import { QualifiedNoticeView } from './views/QualifiedNoticeView.tsx'
import { BuildLogView } from './views/BuildLogView.tsx'
import { GetListedView } from './views/GetListedView.tsx'
import { RankingsView } from './views/RankingsView.tsx'
import { MethodologyView } from './views/MethodologyView.tsx'

function MainRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    let title = 'ORDINAL: The Web3 AI Agent Index';
    let metaDesc = 'Independent security ratings, telemetry verification, and risk metrics for autonomous Web3 AI agents.';

    if (currentPath === '/apply' || currentPath === '/apply/' || currentPath === '/get-listed') {
      title = 'Get Listed & Evaluation Pipeline | ORDINAL';
      metaDesc = 'Submit autonomous Web3 AI agents for review and calculate live telemetry scores.';
    } else if (currentPath === '/rankings' || currentPath === '/rankings/') {
      title = 'Leaderboard & Live Coverage Rankings | ORDINAL';
      metaDesc = 'Real-time leaderboard ranking autonomous Web3 AI agents by verified on-chain telemetry and composite reputation scores.';
    } else if (currentPath === '/methodology' || currentPath === '/methodology/' || currentPath === '/method') {
      title = 'Rating Methodology & Audit Rubric | ORDINAL';
      metaDesc = 'Four weighted audit criteria evaluating autonomous Web3 AI agents across disclosure, consistency, incident response, and independence.';
    } else if (currentPath === '/qualified' || currentPath === '/qualified/') {
      title = 'Qualified Volume: In Development | ORDINAL';
      metaDesc = 'Notice Page: Qualified Volume filter engine assessing Web3 AI agent liquidity and execution metrics.';
    } else if (currentPath === '/log' || currentPath === '/log/') {
      title = 'Public Build Log | ORDINAL';
      metaDesc = 'Append-only chronological record of system deployments, recalibrations, and structural corrections.';
    }

    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', metaDesc);
  }, [currentPath]);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (currentPath === '/apply' || currentPath === '/apply/' || currentPath === '/get-listed') {
    return <GetListedView onNavigate={navigate} />;
  }

  if (currentPath === '/rankings' || currentPath === '/rankings/') {
    return <RankingsView onNavigate={navigate} />;
  }

  if (currentPath === '/methodology' || currentPath === '/methodology/' || currentPath === '/method') {
    return <MethodologyView onNavigate={navigate} />;
  }

  if (currentPath === '/qualified' || currentPath === '/qualified/') {
    return <QualifiedNoticeView onNavigate={navigate} />;
  }

  if (currentPath === '/log' || currentPath === '/log/') {
    return <BuildLogView onNavigate={navigate} />;
  }

  if (currentPath === '/ratingagents') {
    return <RatingAgents />;
  }

  if (currentPath.startsWith('/reports')) {
    return <RankingsView onNavigate={navigate} />;
  }

  if (currentPath.startsWith('/guide')) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 24px', fontFamily: "'IBM Plex Sans', sans-serif" }}>
        <button onClick={() => navigate('/')} style={{ padding: '8px 16px', marginBottom: '24px', cursor: 'pointer' }}>← Back to Home</button>
        <h1>ORDINAL Annual Guide (2026 Edition)</h1>
        <p style={{ color: '#666' }}>The annual benchmark collection of verified Web3 AI agent architectures and ratings.</p>
      </div>
    );
  }

  if (currentPath.startsWith('/record')) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 24px', fontFamily: "'IBM Plex Sans', sans-serif" }}>
        <button onClick={() => navigate('/')} style={{ padding: '8px 16px', marginBottom: '24px', cursor: 'pointer' }}>← Back to Home</button>
        <h1>ORDINAL Monthly Record (2026-08)</h1>
        <p style={{ color: '#666' }}>Monthly movement summary of agent score revisions, key awards, and security re-evaluations.</p>
      </div>
    );
  }

  if (currentPath === '/corrections') {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 24px', fontFamily: "'IBM Plex Sans', sans-serif" }}>
        <button onClick={() => navigate('/')} style={{ padding: '8px 16px', marginBottom: '24px', cursor: 'pointer' }}>← Back to Home</button>
        <h1>Publication Corrections Log</h1>
        <p style={{ color: '#666' }}>Transparent, append-only log of editorial retractions, telemetry recalibrations, and project corrections.</p>
      </div>
    );
  }

  return <App onNavigate={navigate} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainRouter />
  </StrictMode>,
)

