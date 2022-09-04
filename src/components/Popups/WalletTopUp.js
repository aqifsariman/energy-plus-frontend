import React from 'react';
import Modal from '../UI/Modal';
import styles from './WalletTopUp.module.css';
import PaymentForm from './PaymentForm';
import CloseButton from '../UI/CloseButton';

// const PUBLIC_KEY = process.env.REACT_APP_STRIPE_API_KEY;
// const stripeTestPromise = loadStripe(PUBLIC_KEY);

const WalletTopUp = (props) => {
  const getData = (balance) => {
    props.onGetData(balance);
  };
  return (
    <Modal>
      <CloseButton onClose={props.onClose} className={styles.close} />
      <PaymentForm onClose={props.onClose} onGetData={getData} />
    </Modal>
  );
};

export default WalletTopUp;
