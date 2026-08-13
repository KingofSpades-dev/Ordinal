import { Injectable } from '@nestjs/common';

export interface X402Transaction {
  id: string;
  payerWallet: string;
  recipientWallet: string;
  amountUsd: number;
  timestamp: number;
}

export interface WashFilterResult {
  qualifiedVolume: number;
  rawVolume: number;
  washRatioPercent: number;
  filteredCount: number;
  totalCount: number;
  details: {
    fundedByTreasuryCount: number;
    circularFlowCount: number;
    freshWalletCount: number;
    machineIntervalCount: number;
  };
}

@Injectable()
export class X402WashFilterService {
  /**
   * Filter x402 payment transactions using 5-step heuristic wash-detection.
   */
  async filterVolume(
    transactions: X402Transaction[],
    agentTreasuryWallets: string[] = []
  ): Promise<WashFilterResult> {
    let qualifiedVolume = 0;
    let rawVolume = 0;
    let filteredCount = 0;

    const details = {
      fundedByTreasuryCount: 0,
      circularFlowCount: 0,
      freshWalletCount: 0,
      machineIntervalCount: 0,
    };

    const treasurySet = new Set(agentTreasuryWallets.map(w => w.toLowerCase()));

    for (const tx of transactions) {
      rawVolume += tx.amountUsd;

      // Step 1: Trace funding graph (is payer funded by agent team/treasury)
      const isTreasuryFunded = this.isWalletFundedByTreasury(tx.payerWallet, treasurySet);
      if (isTreasuryFunded) {
        details.fundedByTreasuryCount++;
        filteredCount++;
        continue;
      }

      // Step 2: Circular Flows (Payer receives money back from recipient)
      const isCircular = this.detectCircularFlow(tx, transactions);
      if (isCircular) {
        details.circularFlowCount++;
        filteredCount++;
        continue;
      }

      // Step 3: Fresh single-use wallets created shortly before payment
      const isFreshWallet = this.isFreshSingleUseWallet(tx, transactions);
      if (isFreshWallet) {
        details.freshWalletCount++;
        filteredCount++;
        continue;
      }

      // Step 4: Machine-regular timing intervals
      const isMachineInterval = this.detectUniformTimingPattern(tx, transactions);
      if (isMachineInterval) {
        details.machineIntervalCount++;
        filteredCount++;
        continue;
      }

      qualifiedVolume += tx.amountUsd;
    }

    const totalCount = transactions.length;
    const washRatioPercent = rawVolume > 0 ? ((rawVolume - qualifiedVolume) / rawVolume) * 100 : 0;

    return {
      qualifiedVolume: Math.round(qualifiedVolume * 100) / 100,
      rawVolume: Math.round(rawVolume * 100) / 100,
      washRatioPercent: Math.round(washRatioPercent * 10) / 10,
      filteredCount,
      totalCount,
      details,
    };
  }

  private isWalletFundedByTreasury(payer: string, treasurySet: Set<string>): boolean {
    if (treasurySet.has(payer.toLowerCase())) return true;
    return false;
  }

  private detectCircularFlow(targetTx: X402Transaction, allTxs: X402Transaction[]): boolean {
    // Check if recipient sent funds back to payer within 24 hours
    const returnTx = allTxs.find(
      tx =>
        tx.payerWallet.toLowerCase() === targetTx.recipientWallet.toLowerCase() &&
        tx.recipientWallet.toLowerCase() === targetTx.payerWallet.toLowerCase() &&
        Math.abs(tx.timestamp - targetTx.timestamp) < 24 * 3600 * 1000
    );
    return returnTx !== undefined;
  }

  private isFreshSingleUseWallet(targetTx: X402Transaction, allTxs: X402Transaction[]): boolean {
    const payerTxs = allTxs.filter(tx => tx.payerWallet.toLowerCase() === targetTx.payerWallet.toLowerCase());
    // Single transaction with exact micro-payment amount < $0.05
    return payerTxs.length === 1 && targetTx.amountUsd < 0.05;
  }

  private detectUniformTimingPattern(targetTx: X402Transaction, allTxs: X402Transaction[]): boolean {
    const payerTxs = allTxs
      .filter(tx => tx.payerWallet.toLowerCase() === targetTx.payerWallet.toLowerCase())
      .sort((a, b) => a.timestamp - b.timestamp);

    if (payerTxs.length < 4) return false;

    // Calculate time differences between consecutive transactions
    const diffs: number[] = [];
    for (let i = 1; i < payerTxs.length; i++) {
      diffs.push(payerTxs[i].timestamp - payerTxs[i - 1].timestamp);
    }

    // Check if standard deviation of intervals is near zero (< 500ms variance)
    const avg = diffs.reduce((sum, val) => sum + val, 0) / diffs.length;
    const variance = diffs.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / diffs.length;
    return Math.sqrt(variance) < 500;
  }
}
