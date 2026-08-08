export interface ChainExplorerConfig {
  chainKey: string;
  displayName: string;
  addressUrlTemplate: string; // e.g. "https://etherscan.io/address/{address}"
  tokenUrlTemplate: string;   // e.g. "https://etherscan.io/token/{address}"
  addressFormat: 'evm_hex' | 'solana_base58';
  logo: string;
}

export const EXPLORER_REGISTRY: Record<string, ChainExplorerConfig> = {
  ethereum: {
    chainKey: 'ethereum',
    displayName: 'Ethereum',
    addressUrlTemplate: 'https://etherscan.io/address/{address}',
    tokenUrlTemplate: 'https://etherscan.io/token/{address}',
    addressFormat: 'evm_hex',
    logo: '/chains/ethereum.svg'
  },
  solana: {
    chainKey: 'solana',
    displayName: 'Solana',
    addressUrlTemplate: 'https://solscan.io/account/{address}',
    tokenUrlTemplate: 'https://solscan.io/token/{address}',
    addressFormat: 'solana_base58',
    logo: '/chains/solana.svg'
  },
  base: {
    chainKey: 'base',
    displayName: 'Base',
    addressUrlTemplate: 'https://basescan.org/address/{address}',
    tokenUrlTemplate: 'https://basescan.org/token/{address}',
    addressFormat: 'evm_hex',
    logo: '/chains/base.svg'
  }
};

export function isValidAddressForChain(address: string, format: 'evm_hex' | 'solana_base58'): boolean {
  const clean = address.trim();
  if (format === 'evm_hex') {
    return /^0x[0-9a-fA-F]{40}$/.test(clean);
  }
  if (format === 'solana_base58') {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(clean);
  }
  return false;
}
