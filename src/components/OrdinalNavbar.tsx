import React from 'react';
import { motion } from 'framer-motion';

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
            href="https://github.com/KingofSpades-dev/Ordinal"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}
            whileHover={{ scale: 1.05, color: '#111' }}
          >
            GitHub
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
