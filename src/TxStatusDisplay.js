import React from 'react';
import config from 'config';

export default function Main ({ txStatus, transactionType = 'Transacion' }) {
  if (!txStatus) {
    return <div/>;
  }

  let txStatusMesage;
  if (txStatus.isProcessing()) {
    txStatusMesage = `🕒 ${transactionType} processing`;
  } else if (txStatus.isFinalized()) {
    txStatusMesage = `✅ ${transactionType} finalized`;
  } else if (txStatus.isFailed()) {
    txStatusMesage = `❌ ${transactionType} failed`;
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
