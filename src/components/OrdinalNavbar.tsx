import React from 'react';
import { motion } from 'framer-motion';

interface OrdinalNavbarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const XLogoIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 14,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const GitHubLogoIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 14,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

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

  const navItems = [
    { label: 'The Index', path: '/' },
    { label: 'Rankings', path: '/rankings' },
    { label: 'Build Log', path: '/log' },
    { label: 'Qualified Volume', path: '/qualified' },
    { label: 'Methodology', path: '/methodology' },
    { label: 'Get Listed', path: '/apply' },
  ];

  return (
    <header className="wrap masthead" style={{ marginBottom: 0 }}>
      <div className="masthead-row">
        <motion.div
          className="brand-wrapper"
          onClick={() => navigateTo('/')}
          style={{ cursor: 'pointer' }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <img src="/logo.jpeg" alt="Ordinal Logo" className="brand-logo-img" />
          <div className="logotype">
            ORDINAL
          </div>
        </motion.div>
        <div className="masthead-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="live-dot"></span>
            Vol. I 2026
          </span>
          <span>Web3 Intelligence Desk</span>
          <motion.a
            href="https://x.com/OrdinalAgentsX"
            target="_blank"
            rel="noopener noreferrer"
            title="Official X account (@OrdinalAgentsX)"
            aria-label="Official X account (@OrdinalAgentsX)"
            style={{ color: 'var(--ink-soft)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            whileHover={{ scale: 1.15, color: '#111' }}
          >
            <XLogoIcon size={14} />
          </motion.a>
          <motion.a
            href="https://github.com/KingofSpades-dev/Ordinal"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Repository"
            aria-label="GitHub Repository"
            style={{ color: 'var(--ink-soft)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            whileHover={{ scale: 1.05, color: '#111' }}
          >
            <GitHubLogoIcon size={14} />
            <span>GitHub</span>
          </motion.a>
        </div>
      </div>

      <nav className="masthead-tags" aria-label="Main Navigation">
        {navItems.map((item) => {
          const active = isCurrent(item.path);
          return (
            <motion.span
              key={item.path}
              className={`nav-link ${active ? 'active' : ''}`}
              onClick={() => navigateTo(item.path)}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {item.label}
            </motion.span>
          );
        })}
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
