import React from 'react';
import config from 'config';
import { useTranslation } from 'react-i18next';
import { Loader } from 'semantic-ui-react';


export default function Main({ txStatus, transactionType = 'Transacion' }) {
  const { t } = useTranslation();

  let txStatusMesage;
  if (txStatus.isProcessing()) {
    txStatusMesage = t(`${transactionType} processing`)
  } else if (txStatus.isFinalized()) {
    txStatusMesage = '✅ ' + t(`${transactionType} finalized`);
  } else if (txStatus.isFailed()) {
    txStatusMesage = '❌ ' + t(`${transactionType} failed`);
  }

  return (
    <div style={{ textAlign: 'center', overflowWrap: 'break-word' }} className="pt-10 pr-2" >
      <span style={{ flexGrow: 1 }} className='items-center'>
        {txStatus.isProcessing()
          ? <p>
            <Loader active inline size='small' inverted />{' ' + txStatusMesage}
          </p>
          : <a href={config.BLOCK_EXPLORER_URL + txStatus.block} style={{ textAlign: 'center', overflowWrap: 'break-word' }}>
            <p>{txStatusMesage}</p>
          </a>
        }
      </span>
    </div>
  );
}

