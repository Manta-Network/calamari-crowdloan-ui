import React from 'react';

export default function Main ({ txStatus, batchNumber = 1, totalBatches = 1 }) {
  if (!txStatus) {
    return <div/>;
  }

  let batchMessage = '';
  if (totalBatches > 1) {
    batchMessage = `${batchNumber}/${totalBatches} `;
  }

  let txStatusMesage;
  if (txStatus.isProcessing()) {
    txStatusMesage = `Transaction ${batchMessage}processing`;
  } else if (txStatus.isFinalized()) {
    txStatusMesage = `😊 Transaction ${batchMessage}finalized`;
  } else if (txStatus.isFailed()) {
    txStatusMesage = `❌ Transaction ${batchMessage}failed`;
  }

  const txSecondaryMessage = txStatus.message ? `: ${txStatus.message}` : '';

  return (
    <div style={{ textAlign: 'center', overflowWrap: 'break-word' }}>
      <p>
        {txStatusMesage}{txSecondaryMessage}
      </p>
      {
        txStatus.block && <p>Block hash: {txStatus.block}</p>
      }
    </div>
  );
}
