/* eslint-disable multiline-ternary */
/* eslint-disable react/style-prop-object */
import React, { useState, useEffect } from 'react';
import Logo from 'assets/images/calamari-logo.svg';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import ReactFlagsSelect from 'react-flags-select';
import { setLanguage, getLanguage } from 'utils/LocalStorageValue';

function Navbar ({ setAccountAddress, accountBalanceKSM, accountPair }) {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState('US');

  const onChangeLanguage = (code) => {
    setSelected(code);
    const langCode = code === 'US' ? 'en' : 'cn';
    i18n.changeLanguage(langCode);
    setLanguage(langCode);
  };

  useEffect(() => {
    setSelected(getLanguage() === 'en' ? 'US' : 'CN');
  }, []);

  return (
    <div className="navbar-content">
      <div className="logo-content">
        <img src={Logo} alt="logo" />
      </div>
      <div className="navbar-menu">
        <NavLink to="#">
          <div className="menu-item">How it Works</div>
        </NavLink>
        <NavLink to="#">
          <div className="menu-item">My Referral Code</div>
        </NavLink>
        <AccountSelectButton
          setAccountAddress={setAccountAddress}
          accountPair={accountPair}
        />
      </div>
        <div className="hidden lg:flex">
          <NavLink to="#">
            <div className="menu-item text-base lg:text-xl py-2 lg:py-4 px-4 lg:px-8 xl:px-12">
              {t('How it works')}
            </div>
          </NavLink>
          <NavLink to="#">
            <div className="menu-item text-base lg:text-xl py-2 lg:py-4 px-4 lg:px-8 xl:px-12">
              {t('My Referral code')}
            </div>
          </NavLink>
        </div>
        <div className="hidden lg:block">
          <ReactFlagsSelect
            selected={selected}
            countries={['US', 'CN']}
            customLabels={{ US: 'EN', CN: 'CN' }}
            onSelect={(code) => onChangeLanguage(code)}
          />
        </div>
        <AccountSelectButton
          setAccountAddress={setAccountAddress}
          accountPair={accountPair}
        />
    </div>
  );
}

export default Navbar;
