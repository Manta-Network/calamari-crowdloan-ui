/* eslint-disable multiline-ternary */
/* eslint-disable react/style-prop-object */
import React from 'react';
import Logo from 'assets/images/calamari-logo.svg';
import { NavLink } from 'react-router-dom';
import AccountSelectButton from './AccountSelectButton';

function Navbar ({ setAccountAddress, accountBalance, accountPair }) {
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
    </div>
  );
}

export default Navbar;
