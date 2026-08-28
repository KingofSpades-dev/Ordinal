export type LogEntryType = 'feature' | 'correction' | 'reversal';

export interface BuildLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  summary: string;
  type: LogEntryType;
  link?: string;
  linkText?: string;
}

export const BUILD_LOG_ENTRIES: BuildLogEntry[] = [
  {
    id: 'log-005',
    date: '2026-08-14',
    summary: 'Published devbrief preview mechanics and initialized /qualified notice route.',
    type: 'feature',
    link: '/qualified',
    linkText: 'View Notice Page'
  },
  {
    id: 'log-004',
    date: '2026-08-14',
    summary: 'Removed static empty-string SHA-256 verifiability checksum field from dossier pages until live payload hashing is activated.',
    type: 'correction',
    link: '/reports',
    linkText: 'Dossier Catalog'
  },
  {
    id: 'log-003',
    date: '2026-08-08',
    summary: 'Standardized institutional color palette (Ivory & Burgundy) across all agent evaluation views.',
    type: 'feature'
  },
  {
    id: 'log-002',
    date: '2026-07-28',
    summary: 'Recalibrated liquidity depth scoring threshold following DEX pool migrations.',
    type: 'feature',
    link: '/ratingagents',
    linkText: 'Agent Benchmark'
  },
  {
    id: 'log-001',
    date: '2026-07-15',
    summary: 'Initial release of ORDINAL Annual Guide benchmark methodology specification.',
    type: 'feature'
  }
];

