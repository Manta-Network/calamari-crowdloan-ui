import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Modal } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useSubstrate } from '../../substrate-lib';

function AddressSelectModal ({ openModal, setOpenModal, acccountAddress, setAccountAddress }) {
  const { keyring } = useSubstrate();
  const { t } = useTranslation();
  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase(),
    icon: 'user'
  }));

  return (
    <Modal
      size="small"
      className="address-modal"
      open={openModal}
      onClose={() => setOpenModal(!openModal)}>
      <Modal.Header className="py-2">
        <div className="text-2xl calamari-text text-center font-semibold">
          {t('Select an account')}
        </div>
      </Modal.Header>
      <Modal.Content>
        <div className="px-24">
          {keyringOptions?.map((option, index) => (
            <div
              onClick={() => {
                setAccountAddress(option.value);
                setOpenModal(false);
              }}
              className={classNames(
                'border cursor-pointer px-8 mb-4 account rounded-md',
                {
                  active:
                        acccountAddress &&
                        acccountAddress === option.value
                }
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
                    {option.text}
                  </p>
                  <span className="purple-text account-address">
                    {option.value}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal.Content>
    </Modal>
  );
}

AddressSelectModal.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  acccountAddress: PropTypes.string,
  setAccountAddress: PropTypes.func
};

export default AddressSelectModal;
