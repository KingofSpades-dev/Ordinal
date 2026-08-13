import React from 'react';

export const OrdoKeyIcon = ({ size = 20, color = 'var(--brass, #A37E36)' }: { size?: number; color?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    style={{ width: `${size}px`, height: `${size}px`, color, display: 'inline-block', verticalAlign: 'middle' }}
  >
    <g transform="translate(50, 38)">
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x="-3" y="-24" width="6" height="12" rx="3" transform={`rotate(${i * 30})`} />
      ))}
      <circle cx="0" cy="0" r="9" />
      <circle cx="0" cy="0" r="3.5" fill="var(--paper, #F5F0E8)" />
    </g>
    <rect x="47" y="38" width="6" height="42" rx="1.5" />
    <path d="M 53 62 h 12 v 6 h -6 v 4 h 6 v 6 h -12 Z" />
  </svg>
);

interface OrdoNavbarProps {
  currentPath?: string;
}

export const OrdoNavbar: React.FC<OrdoNavbarProps> = ({ currentPath }) => {
  const activePath = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/');

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/#' + sectionId);
        window.dispatchEvent(new PopStateEvent('popstate'));
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      } else {
        window.history.pushState({}, '', '/#' + sectionId);
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const getLinkStyle = (path: string) => {
    const isActive = activePath === path || (path !== '/' && activePath.startsWith(path));
    return {
      color: isActive ? 'var(--accent, #7C1522)' : 'var(--ink-soft, #5A6578)',
      fontWeight: isActive ? 800 : 600,
      textDecoration: 'none',
      transition: 'color 0.2s ease',
      cursor: 'pointer'
    };
  };

  return (
    <nav style={{
      borderBottom: '1.5px solid var(--line-2, #E2D9CC)',
      padding: '16px 0',
      background: 'rgba(245, 240, 232, 0.95)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigateTo('/')}>
          <OrdoKeyIcon size={30} color="var(--accent, #7C1522)" />
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink, #1B2A4A)' }}>O<b>rdo</b></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '22px', fontSize: '13.5px' }}>
          <a href="/" onClick={(e) => { e.preventDefault(); navigateTo('/'); }} style={getLinkStyle('/')}>Home</a>
          <a href="/reports" onClick={(e) => { e.preventDefault(); navigateTo('/reports'); }} style={getLinkStyle('/reports')}>Reports</a>
          <a href="/#rankings" onClick={(e) => { e.preventDefault(); scrollToSection('rankings'); }} style={{ color: 'var(--ink-soft, #5A6578)', fontWeight: 600, textDecoration: 'none' }}>Ratings</a>
          <a href="/#method" onClick={(e) => { e.preventDefault(); scrollToSection('method'); }} style={{ color: 'var(--ink-soft, #5A6578)', fontWeight: 600, textDecoration: 'none' }}>Methodology</a>
          <a href="https://x.com/OrdoKeyRank" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink-soft, #5A6578)', fontWeight: 600, textDecoration: 'none' }}>X</a>
          <a href="https://github.com/KingofSpades-dev/OrdoKey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink-soft, #5A6578)', fontWeight: 600, textDecoration: 'none' }}>GitHub</a>

          <button onClick={() => navigateTo('/ratingagents')} style={{ border: 'none', background: 'var(--brass, #A37E36)', color: '#fff', fontWeight: 700, padding: '9px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 12px rgba(163, 126, 54, 0.25)' }}>
            Rating Agent ↗
          </button>
        </div>
      </div>
    </nav>
  );
};
