import BN from 'bn.js';

// Convert Manta currency denominated in MA to the most granular units of Kusama currency
export default function KusamaToAtomicUnits (amountMA, api) {
  const decimals = api.registry.chainDecimals;
  return amountMA * new BN(10).pow(new BN(decimals));
}
