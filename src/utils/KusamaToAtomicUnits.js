import Decimal from 'decimal.js';

// Convert Manta currency denominated in MA to the most granular units of Kusama currency
export function KusamaToAtomicUnits (amount, api) {
  const decimals = api.registry.chainDecimals;
  return amount * new Decimal(10).pow(new Decimal(decimals.toString()));
}

export function KusamaFromAtomicUnits (amount, api) {
  const decimals = api.registry.chainDecimals;
  return amount / new Decimal(10).pow(new Decimal(decimals.toString()));
}