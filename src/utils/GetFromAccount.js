import { web3FromSource } from '@polkadot/extension-dapp';

export default async function getFromAccount (accountPair, api) {
  const {
    address,
    meta: { source, isInjected }
  } = accountPair;
  let fromAcct;
  // signer is from Polkadot-js browser extension
  if (isInjected) {
    const injected = await web3FromSource(source);
    fromAcct = address;
    api.setSigner(injected.signer);
  } else {
    fromAcct = accountPair;
  }
  return fromAcct;
}
