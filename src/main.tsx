import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import RatingAgents from './RatingAgents.tsx'
import { ReportDetailView, ReportsCatalogView, SAMPLE_REPORTS } from './editorial/ReportDetailView.tsx'
import { QualifiedNoticeView } from './views/QualifiedNoticeView.tsx'
import { BuildLogView } from './views/BuildLogView.tsx'

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
    let title = 'ORDO — Institutional Evaluation of Web3 AI Agents';
    let metaDesc = 'Independent security ratings, telemetry verification, and risk metrics for autonomous Web3 AI agents.';

    if (currentPath === '/qualified' || currentPath === '/qualified/') {
      title = 'Qualified Volume — In Development | ORDO';
      metaDesc = 'Notice Page: Qualified Volume filter engine assessing Web3 AI agent liquidity and execution metrics.';
    } else if (currentPath === '/log' || currentPath === '/log/') {
      title = 'Public Build Log | ORDO';
      metaDesc = 'Append-only chronological record of system deployments, recalibrations, and structural corrections.';
    } else if (currentPath === '/reports' || currentPath === '/reports/') {
      title = 'Dossier Reports Catalog | ORDO';
      metaDesc = 'Comprehensive evaluation dossiers and deep-dive risk reports for Web3 AI agents.';
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

  if (currentPath === '/qualified' || currentPath === '/qualified/') {
    return <QualifiedNoticeView onNavigate={navigate} />;
  }

  if (currentPath === '/log' || currentPath === '/log/') {
    return <BuildLogView onNavigate={navigate} />;
  }

  if (currentPath === '/ratingagents') {
    return <RatingAgents />;
  }

  if (currentPath === '/reports' || currentPath === '/reports/') {
    return <ReportsCatalogView onSelectReport={(slug) => navigate('/reports/' + slug)} />;
  }

  if (currentPath.startsWith('/reports/')) {
    const slug = currentPath.replace('/reports/', '');
    const reportData = SAMPLE_REPORTS[slug] || SAMPLE_REPORTS['aixbt'];
    return <ReportDetailView report={reportData} onBack={() => navigate('/reports')} />;
  }

  if (currentPath.startsWith('/guide')) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 24px', fontFamily: 'Inter, sans-serif' }}>
        <button onClick={() => navigate('/')} style={{ padding: '8px 16px', marginBottom: '24px', cursor: 'pointer' }}>← Back to Home</button>
        <h1>ORDO Annual Guide (2026 Edition)</h1>
        <p style={{ color: '#666' }}>The annual benchmark collection of verified Web3 AI agent architectures and ratings.</p>
      </div>
    );
  }

  if (currentPath.startsWith('/record')) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 24px', fontFamily: 'Inter, sans-serif' }}>
        <button onClick={() => navigate('/')} style={{ padding: '8px 16px', marginBottom: '24px', cursor: 'pointer' }}>← Back to Home</button>
        <h1>ORDO Monthly Record (2026-08)</h1>
        <p style={{ color: '#666' }}>Monthly movement summary of agent score revisions, key awards, and security re-evaluations.</p>
      </div>
    );
  }

  if (currentPath === '/corrections') {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 24px', fontFamily: 'Inter, sans-serif' }}>
        <button onClick={() => navigate('/')} style={{ padding: '8px 16px', marginBottom: '24px', cursor: 'pointer' }}>← Back to Home</button>
        <h1>Publication Corrections Log</h1>
        <p style={{ color: '#666' }}>Transparent, append-only log of editorial retractions, telemetry recalibrations, and project corrections.</p>
      </div>
    );
  }

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainRouter />
  </StrictMode>,
)
