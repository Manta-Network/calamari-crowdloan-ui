import PropTypes from 'prop-types';
import React from 'react';
import Kusama from 'types/Kusama';
import config from 'config';
import Decimal from 'decimal.js';
import { useTranslation } from 'react-i18next';

export default function Header({ totalContributionsKSM }) {
  const { t, i18n } = useTranslation();
  const infoLink =
    i18n.language === 'cn'
      ? 'https://www.chainnews.com/articles/122281316964.htm'
      : 'https://twitter.com/CalamariNetwork/status/1432739625647411202';
  const stage1TargetKSM = new Kusama(
    Kusama.KSM,
    new Decimal(config.STAGE_1_TARGET_KSM),
  );
  return (
    totalContributionsKSM.gt(stage1TargetKSM) && (
      <a href={infoLink} rel="noreferrer" target="_blank">
        <section
          style={{
            color: '#fff',
            position: 'fixed',
            backgroundColor: ' #07b801',
            width: '100%',
            textAlign: 'center',
            padding: '5px 0px',
            zIndex: 1000,
            marginBottom: '10rem',
          }}>
          {t(
            'Calamari crowdloan has finished stage 1, thank you! New rewards are paused until stage 2. Click for details.',
          )}
        </section>
      </a>
    )
  );
}

Header.propTypes = {
  totalContributionsKSM: PropTypes.instanceOf(Kusama),
};
