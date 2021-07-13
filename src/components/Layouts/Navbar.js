import React from 'react';
import Logo from 'assets/images/calamari-logo.png';
import { NavLink } from 'react-router-dom';
import AccountSelector from '../../AccountSelector'

function Navbar ({ setAccountAddress, setAccountBalance, accountBalance }) {
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
      <AccountSelector setAccountAddress={setAccountAddress}  setAccountBalance={setAccountBalance} accountBalance={accountBalance}/>
        {/* <div className="menu-item btn">Connect Wallet</div> */}
      </div>
    </div>
  );
};

export default Navbar;
