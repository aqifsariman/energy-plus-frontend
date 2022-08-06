import React from 'react';
import Modal from '../UI/Modal';
import styles from './WalletTopUp.module.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';
import CloseButton from '../UI/CloseButton';

const PUBLIC_KEY = process.env.REACT_APP_STRIPE_API_KEY;
const stripeTestPromise = loadStripe(PUBLIC_KEY);

const WalletTopUp = (props) => {
  return (
    <Modal>
      <CloseButton onClose={props.onClose} className={styles.close} />
      <Elements stripe={stripeTestPromise}>
        <PaymentForm onClose={props.onClose} />
      </Elements>
    </Modal>
  );
};

export default WalletTopUp;
