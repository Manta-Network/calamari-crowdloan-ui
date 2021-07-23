import React from 'react';
import config from 'config';
import { useTranslation } from 'react-i18next';

export default function Main ({ txStatus, transactionType = 'Transacion' }) {
  const { t } = useTranslation();

  if (!txStatus) {
    return <div/>;
  }


  let txStatusMesage;
  if (txStatus.isProcessing()) {
    txStatusMesage = '🕒 ' + t(`${transactionType} processing`);
  } else if (txStatus.isFinalized()) {
    txStatusMesage = '✅ ' +  t(`${transactionType} finalized`);
  } else if (txStatus.isFailed()) {
    txStatusMesage = '❌ ' + t(`${transactionType} failed`);
  }
  console.log(txStatus);

  return (
    <div style={{ textAlign: 'center', overflowWrap: 'break-word' }}>
      {!txStatus.isProcessing()
        ? <a href={config.BLOCK_EXPLORER_URL + txStatus.block}>
      <p>
        {txStatusMesage}
      </p>
      </a>
        : <p>
            {txStatusMesage}
          </p>
      }
    </div>
  );
}
