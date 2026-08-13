import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import RatingAgents from './RatingAgents.tsx'
import { ReportDetailView, ReportsCatalogView, SAMPLE_REPORTS } from './editorial/ReportDetailView.tsx'

function MainRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

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
