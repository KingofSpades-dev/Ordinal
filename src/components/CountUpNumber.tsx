import React, { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const CountUpNumber: React.FC<CountUpProps> = ({
  to,
  from = 0,
  duration = 1.8,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  style = {}
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  const [displayValue, setDisplayValue] = useState<string>(
    `${prefix}${from.toFixed(decimals)}${suffix}`
  );

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1], // Smooth custom ease-out curve
      onUpdate: (latest) => {
        setDisplayValue(`${prefix}${latest.toFixed(decimals)}${suffix}`);
      }
    });

    return () => controls.stop();
  }, [isInView, from, to, duration, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className} style={style}>
      {displayValue}
    </span>
  );
};
