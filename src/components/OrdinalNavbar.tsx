import React from 'react';

interface OrdinalNavbarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const OrdinalNavbar: React.FC<OrdinalNavbarProps> = ({
  currentPath = '/',
  onNavigate,
}) => {
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

  const isCurrent = (path: string) => {
    if (path === '/apply') {
      return currentPath === '/apply' || currentPath === '/apply/' || currentPath === '/get-listed';
    }
    if (path === '/rankings') {
      return currentPath === '/rankings' || currentPath === '/rankings/';
    }
    if (path === '/methodology') {
      return currentPath === '/methodology' || currentPath === '/methodology/' || currentPath === '/method';
    }
    if (path === '/reports') {
      return currentPath.startsWith('/reports');
    }
    if (path === '/log') {
      return currentPath === '/log' || currentPath === '/log/';
    }
    if (path === '/qualified') {
      return currentPath === '/qualified' || currentPath === '/qualified/';
    }
    if (path === '/') {
      return currentPath === '/' || currentPath === '';
    }
    return currentPath === path;
  };

  return (
    <header className="wrap masthead" style={{ marginBottom: 0 }}>
      <div className="masthead-row">
        <div
          className="brand-wrapper"
          onClick={() => navigateTo('/')}
          style={{ cursor: 'pointer' }}
        >
          <img src="/logo.jpeg" alt="Ordinal Logo" className="brand-logo-img" />
          <div className="logotype">
            ORDINAL
          </div>
        </div>
        <div className="masthead-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="live-dot"></span>
            Vol. I 2026
          </span>
          <span>Web3 Intelligence Desk</span>
          <a
            href="https://github.com/KingofSpades-dev/OrdoKey"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}
          >
            GitHub
          </a>
        </div>
      </div>

      <nav className="masthead-tags" aria-label="Main Navigation">
        <span
          className={`nav-link ${isCurrent('/') ? 'active' : ''}`}
          onClick={() => navigateTo('/')}
        >
          The Index
        </span>
        <span
          className={`nav-link ${isCurrent('/rankings') ? 'active' : ''}`}
          onClick={() => navigateTo('/rankings')}
        >
          Rankings
        </span>
        <span
          className={`nav-link ${isCurrent('/log') ? 'active' : ''}`}
          onClick={() => navigateTo('/log')}
        >
          Build Log
        </span>
        <span
          className={`nav-link ${isCurrent('/qualified') ? 'active' : ''}`}
          onClick={() => navigateTo('/qualified')}
        >
          Qualified Volume
        </span>
        <span
          className={`nav-link ${isCurrent('/methodology') ? 'active' : ''}`}
          onClick={() => navigateTo('/methodology')}
        >
          Methodology
        </span>
        <span
          className={`nav-link ${isCurrent('/apply') ? 'active' : ''}`}
          onClick={() => navigateTo('/apply')}
        >
          Get Listed
        </span>
      </nav>
    </header>
  );
};

export const OrdoNavbar = OrdinalNavbar;
export const OrdoKeyIcon = () => (
  <img
    src="/logo.jpeg"
    alt="Logo"
    style={{ width: '22px', height: '22px', borderRadius: '4px', verticalAlign: 'middle' }}
  />
);
