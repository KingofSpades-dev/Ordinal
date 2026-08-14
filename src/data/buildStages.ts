export type BuildStage = 
  | 'Specification'
  | 'Filter implementation'
  | 'Internal testing against known cases'
  | 'Public';

export interface QualifiedNoticeData {
  eyebrow: string;
  headline: string;
  description: string;
  expectedPublication: string;
  currentStage: BuildStage;
  allStages: BuildStage[];
}

export const QUALIFIED_NOTICE_DATA: QualifiedNoticeData = {
  eyebrow: 'IN DEVELOPMENT',
  headline: 'Qualified Volume',
  description: 'An institutional filter engine assessing Web3 AI Agent volume. It separates verified, on-chain execution and organic liquidity flows from wash-trading, self-looping token swaps, and synthetic volume spikes. Requires no token approval or wallet connection to inspect.',
  expectedPublication: 'October 2026',
  currentStage: 'Filter implementation',
  allStages: [
    'Specification',
    'Filter implementation',
    'Internal testing against known cases',
    'Public'
  ]
};
