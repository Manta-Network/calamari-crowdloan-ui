import React, { useState } from 'react';
import { useSubstrate } from '../../substrate-lib';
import AccountSelectModal from './AccountSelectModal';

function Main ({ accountPair, setAccountAddress }) {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
    <div
      onClick={() => setOpenModal(true)}
      className="menu-item text-base btn">
      {accountPair
        ? (
        <div className="flex px-3 items-center">
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            shapeRendering="geometricPrecision"
            viewBox="0 0 24 24"
            height="24"
            width="24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="pl-4">{accountPair && accountPair.meta.name.toUpperCase()}</span>
        </div>
          )
        : (
            'Connect Wallet'
          )}
    </div>
    {
      openModal &&
      <AccountSelectModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        setAccountAddress={setAccountAddress}
        accountPair={accountPair}
      />
    }
    </>

  );
}

// function BalanceAnnotation (props) {
//   const { accountSelected, accountBalance } = props;

//   return accountSelected
//     ? <Label pointing='left'>
//         <Icon name='money' color='green' />
//         {accountBalance}
//       </Label>
//     : null;
// }

export default function AccountSelector (props) {
  const { api, keyring } = useSubstrate();
  return keyring.getPairs && api.query ? <Main {...props} /> : null;
}
