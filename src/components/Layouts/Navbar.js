import React from 'react';
import Logo from 'assets/images/calamari-logo.png';

const Navbar = () => {
  return (
    <div className="navbar-content">
      <div className="logo-content">
        <img src={Logo} alt="logo" />
      </div>
      <div className="navbar-menu">
        <div className="menu-item">How it Works</div>
        <div className="menu-item">My Referral Code</div>
        <div className="menu-item btn">Connect Wallet</div>
      </div>
    </div>
  );
};

export default Navbar;
