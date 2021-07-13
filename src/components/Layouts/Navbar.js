/* eslint-disable multiline-ternary */
/* eslint-disable react/style-prop-object */
import React, { useState } from 'react';
import Logo from 'assets/images/calamari-logo.svg';
import { NavLink } from 'react-router-dom';
import FakeData from 'pages/FakeData';
import classNames from 'classnames';
import { Modal } from 'semantic-ui-react';

const Navbar = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
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
        <div
          onClick={() => setOpenModal(true)}
          className="menu-item text-base btn">
          {selectedAddress ? (
            <div className="flex px-3 items-center">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                shapeRendering="geometricPrecision"
                viewBox="0 0 24 24"
                height="24"
                width="24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="pl-4">{selectedAddress.userName}</span>
            </div>
          ) : (
            'Connect Wallet'
          )}
        </div>
      </div>
      <Modal
        size="small"
        className="address-modal"
        open={openModal}
        onClose={() => setOpenModal(!openModal)}>
        <Modal.Header className="py-2">
          <div className="text-2xl calamari-text text-center font-semibold">
            Accounts
          </div>
          <div className="text-center purple-text text-lg font-normal">
            Select an account
          </div>
        </Modal.Header>
        <Modal.Content>
          <div className="px-24">
            {FakeData.accountData.map((val, index) => (
              <div
                onClick={() => {
                  setSelectedAddress(val);
                  setOpenModal(false);
                }}
                className={classNames(
                  'border cursor-pointer px-8 mb-4 account rounded-md',
                  {
                    active: selectedAddress.address === val.address,
                  },
                )}
                key={index}>
                <div className="flex calamari-text items-center content">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    shapeRendering="geometricPrecision"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <div className="px-4 py-1">
                    <p className="mb-1 account-name font-semibold calamari-text">
                      {val.userName}
                    </p>
                    <span className="purple-text account-address">
                      {val.address}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default Navbar;
