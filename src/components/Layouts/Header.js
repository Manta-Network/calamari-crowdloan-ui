import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t } = useTranslation();
  // const infoLink =
  //   i18n.language === 'cn'
  //     ? 'https://www.chainnews.com/articles/122281316964.htm'
  //     : 'https://twitter.com/CalamariNetwork/status/1432739625647411202';
  const infoLink =
    'https://mantanetwork.medium.com/unlocking-the-second-and-final-tranche-for-calamari-c835e57ae332';
  return (
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
        {t('Stage 2 of rewards is open now. Click for details.')}
      </section>
    </a>
  );
}
