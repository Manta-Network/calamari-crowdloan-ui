import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t } = useTranslation();
  return (
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
        'Second tranche of rewards has been consumed. Thank you for supporting Calamari Network! Do not contribute any more KSM at this time.',
      )}
    </section>
  );
}
