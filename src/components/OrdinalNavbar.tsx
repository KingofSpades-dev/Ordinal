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
  activeTab,
  onTabChange,
}) => {
  const navigateTo = (path: string, tab?: string) => {
    if (tab && onTabChange) {
      onTabChange(tab);
      return;
    }
    if (onNavigate) {
      onNavigate(path);
      return;
    }
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const isCurrent = (path: string, tab?: string) => {
    if (tab && activeTab) {
      return activeTab === tab;
    }
    if (path === '/' && (currentPath === '/' || !currentPath)) {
      return true;
    }
    return currentPath === path || (path !== '/' && currentPath.startsWith(path));
  };

  return (
    <header className="wrap masthead" style={{ marginBottom: 0 }}>
      <div className="masthead-row">
        <div
          className="brand-wrapper"
          onClick={() => navigateTo('/', 'home')}
          style={{ cursor: 'pointer' }}
        >
          <img src="/logo.jpeg" alt="Ordinal Logo" className="brand-logo-img" />
          <div className="logotype">
            ORDINAL<span>KEY</span>
          </div>
        </div>
        <div className="masthead-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="live-dot"></span>
            Vol. I — 2026
          </span>
          <span>Web3 Intelligence Desk</span>
          <a
            href="https://github.com/KingofSpades-dev/OrdoKey"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}
          >
            GitHub ↗
          </a>
        </div>
      </div>

      <nav className="masthead-tags" aria-label="Main Navigation">
        <span
          className={`nav-link ${isCurrent('/', 'home') ? 'active' : ''}`}
          onClick={() => navigateTo('/', 'home')}
        >
          The Index
        </span>
        <span
          className={`nav-link ${isCurrent('/rankings', 'rankings') ? 'active' : ''}`}
          onClick={() => navigateTo('/', 'rankings')}
        >
          Rankings
        </span>
        <span
          className={`nav-link ${isCurrent('/reports') ? 'active' : ''}`}
          onClick={() => navigateTo('/reports')}
        >
          Dossier Reports
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
          className={`nav-link ${isCurrent('/method', 'method') ? 'active' : ''}`}
          onClick={() => navigateTo('/', 'method')}
        >
          Methodology
        </span>
        <span
          className={`nav-link ${isCurrent('/apply', 'apply') || isCurrent('/ratingagents') ? 'active' : ''}`}
          onClick={() => navigateTo('/apply', 'apply')}
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
