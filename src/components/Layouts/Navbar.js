/* eslint-disable multiline-ternary */
/* eslint-disable react/style-prop-object */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Logo from 'assets/images/calamari-logo.svg';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactFlagsSelect from 'react-flags-select';
import { setLanguage, getLanguage } from 'utils/LocalStorageValue';
import 'react-toastify/dist/ReactToastify.css';
import MenuIcon from 'assets/icons/menu.svg';
import CloseMenuIcon from 'assets/icons/close-menu.svg';
import { toast, ToastContainer } from 'react-toastify';
import ReferralCode from 'types/ReferralCode';
import config from 'config';
import AccountSelectButton from './AccountSelectButton';

function Navbar ({
  setAccountAddress,
  accountAddress,
  accountPair
}) {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState('US');
  const [isOpen, setIsOpen] = useState(false);

  const onChangeLanguage = (code) => {
    setSelected(code);
    const langCode = code === 'US' ? 'en' : 'cn';
    i18n.changeLanguage(langCode);
    setLanguage(langCode);
  };

  useEffect(() => {
    setSelected(getLanguage() === 'en' ? 'US' : 'CN');
  }, []);

  const onClickMyReferralCode = () => {
    if (accountAddress) {
      navigator.clipboard.writeText(
        config.APP_BASE_URL +
          ReferralCode.fromAddress(accountAddress).toString()
      );
      toast('Copied to clipboard', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        draggable: true,
        progress: undefined
      });
    }
  };

  return (
    <div className="navbar-content">
      <div className="logo-content">
        <img src={Logo} alt="logo" />
      </div>
      <ToastContainer />
      <div className="navbar-menu">
        <div className="hidden lg:flex">
          <a href="https://mantanetwork.medium.com/the-calamari-crowdloan-on-kusama-74a3cb2a2a4b">
            <div className="menu-item text-base lg:text-xl py-2 lg:py-4 px-4 lg:px-8 xl:px-12">
              {t('How it works')}
            </div>
          </a>
          <div
            onClick={onClickMyReferralCode}
            className="menu-item text-base lg:text-xl py-2 lg:py-4 px-4 cursor-pointer lg:px-8 xl:px-12">
            {t('My referral link')}
          </div>
        </div>
        <div className="hidden lg:block">
          <ReactFlagsSelect
            selected={selected}
            countries={['US', 'CN']}
            customLabels={{ US: 'EN', CN: 'CN' }}
            onSelect={(code) => onChangeLanguage(code)}
          />
        </div>
        <div className="hidden lg:block">
          <AccountSelectButton
            setAccountAddress={setAccountAddress}
            accountPair={accountPair}
          />
        </div>
        <div className="lg:hidden flex items-center">
          <img
            src={MenuIcon}
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer w-10"
            alt="menu-icon"
          />
        </div>
        <div
          style={{ transform: isOpen && 'none', overflow: isOpen && 'visible' }}
          className="nav-menu-mobile">
          {isOpen && (
            <div>
              <span onClick={() => setIsOpen(false)} className="close-icon">
                <img src={CloseMenuIcon} alt="close-menu-icon" />
              </span>
              <div className="px-8 py-4">
                <NavLink to="#">
                  <div className="menu-item text-base py-2">
                    {t('How it works')}
                  </div>
                </NavLink>
                <div
                  onClick={onClickMyReferralCode}
                  className="menu-item text-base py-3 mb-2 cursor-pointer">
                  {t('My referral link')}
                </div>
                <ReactFlagsSelect
                  className="w-2/5 mb-4"
                  selected={selected}
                  countries={['US', 'CN']}
                  customLabels={{ US: 'EN', CN: 'CN' }}
                  onSelect={(code) => onChangeLanguage(code)}
                />
                <AccountSelectButton
                  setAccountAddress={setAccountAddress}
                  accountPair={accountPair}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="navbar-mobile-overlay"></div>
      )}
    </div>
  );
}

Navbar.propTypes = {
  setAccountAddress: PropTypes.func,
  accountAddress: PropTypes.string,
  accountPair: PropTypes.object
};

export default Navbar;
