import { Injectable } from '@nestjs/common';

export interface Erc8004AgentIdentity {
  agentId: string;
  chain: string;
  registryAddress: string;
  tokenUri: string;
  declaredCapabilities: string[];
  declaredOperator: string;
  observedCapabilities: string[];
  divergenceDetected: boolean;
  divergenceDetails: string[];
}

@Injectable()
export class Erc8004ResolverService {
  private readonly registryAddresses: Record<string, string> = {
    ethereum: '0x8004A1d2d0b8A2d312A349a1752b575A38408004',
    base: '0x8004B2d2d0b8A2d312A349a1752b575A38408004',
    solana: 'ERC8004111111111111111111111111111111111111',
  };

  /**
   * Resolve ERC-8004 Agent Registration File & Detect Capabilities Divergence
   */
  async resolveAgentIdentity(
    agentId: string,
    chain: string,
    contractCodeAbiKeywords: string[] = []
  ): Promise<Erc8004AgentIdentity> {
    const chainLower = chain.toLowerCase();
    const registryAddress = this.registryAddresses[chainLower] || this.registryAddresses.ethereum;

    // Simulated tokenURI resolution & capabilities parsing
    const mockTokenUri = `ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi/${agentId}.json`;
    const declaredCapabilities = ['x402-payment-settlement', 'autonomous-treasury-rebalance', 'governance-execution'];
    const declaredOperator = '0x1111111111111111111111111111111111111111';

    // Compare declared capabilities against observed on-chain contract ABI/bytecode keywords
    const divergenceDetails: string[] = [];
    let divergenceDetected = false;

    for (const cap of declaredCapabilities) {
      const keyword = cap.split('-')[0];
      const isObserved = contractCodeAbiKeywords.some(k => k.toLowerCase().includes(keyword));
      if (!isObserved && contractCodeAbiKeywords.length > 0) {
        divergenceDetected = true;
        divergenceDetails.push(`Declared capability "${cap}" not found in on-chain contract bytecode/ABI.`);
      }
    }

    return {
      agentId,
      chain,
      registryAddress,
      tokenUri: mockTokenUri,
      declaredCapabilities,
      declaredOperator,
      observedCapabilities: contractCodeAbiKeywords,
      divergenceDetected,
      divergenceDetails,
    };
  }
}
