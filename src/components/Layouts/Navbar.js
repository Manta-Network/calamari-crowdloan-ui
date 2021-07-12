import React from 'react';
import Logo from 'assets/images/calamari-logo.svg';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar-content">
      <div className="logo-content">
        <img src={Logo} alt="logo" />
      </div>
      <div className="navbar-menu">
        <div className="hidden lg:flex">
          <NavLink to="#">
            <div className="menu-item">How it Works</div>
          </NavLink>
          <NavLink to="#">
            <div className="menu-item">My Referral Code</div>
          </NavLink>
        </div>
        <div className="menu-item text-base btn">Connect Wallet</div>
      </div>
    </div>
  );
};

export default Navbar;
