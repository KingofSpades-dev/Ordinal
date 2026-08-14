import React from 'react';

interface PreviewBadgeProps {
  style?: React.CSSProperties;
  className?: string;
}

export const PreviewBadge: React.FC<PreviewBadgeProps> = ({ style, className }) => {
  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '1.2px',
        textTransform: 'uppercase',
        color: 'var(--ink-soft, #6B7280)',
        background: 'rgba(107, 114, 128, 0.12)',
        border: '1px solid rgba(107, 114, 128, 0.25)',
        padding: '3px 8px',
        borderRadius: '4px',
        userSelect: 'none',
        ...style
      }}
    >
      PREVIEW
    </span>
  );
};
