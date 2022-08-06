/* eslint-disable react/style-prop-object */
import React, { Fragment, useEffect, useState } from 'react';
import styles from './PaymentForm.module.css';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';

const cardOptions = {
  iconStyle: 'solid',
  style: {
    base: {
      iconColor: '#c4f0ff',
      color: '#fff',
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': { color: '#fce883' },
      '::placeholder': { color: '#87bbfd' },
    },
    invalid: {
      iconColor: '#ffc7ee',
      color: '#ffc7ee',
    },
  },
};

const PaymentForm = (props) => {
  const userId = localStorage.getItem('id');

  const [success, setSuccess] = useState(false);
  const [amountValue, setAmountValue] = useState(0);
  const [button1Clicked, setButton1Clicked] = useState();
  const [button2Clicked, setButton2Clicked] = useState();
  const [button3Clicked, setButton3Clicked] = useState();
  const [enableTopUp, setEnableTopUp] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [message, setMessage] = useState('Choose your amount to top up.');

  const stripe = useStripe();
  const elements = useElements();

  const amountChosenHandler = (event) => {
    setAmountValue(event.target.value);
    setEnableTopUp(true);
    if (event.target.value === '2000') {
      setButton1Clicked(true);
      setButton2Clicked(false);
      setButton3Clicked(false);
    } else if (event.target.value === '5000') {
      setButton1Clicked(false);
      setButton2Clicked(true);
      setButton3Clicked(false);
    } else if (event.target.value === '10000') {
      setButton1Clicked(false);
      setButton2Clicked(false);
      setButton3Clicked(true);
    }
  };

  // USE EFFECT FOR CUSTOMER ID RETRIEVAL
  useEffect(() => {
    axios.get(`/wallet-details/${userId}`).then((response) => {
      setCustomerId(response.data[0].customerId);
    });
  });

  // ONSUBMIT
  const submitHandler = async (event) => {
    setMessage('Loading...');
    event.preventDefault();
    const customerName = localStorage.getItem('username');
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    if (!error) {
      try {
        const { id } = paymentMethod;
        const response = await axios.post(`/payment/${customerName}`, {
          customer: customerId,
          amount: Number(amountValue),
          id,
        });
        if (response.data.success) {
          setSuccess(true);
          setMessage('You have topped up successfully.');
        }
        console.log(response.data);
      } catch (error) {
        console.log('Error', error);
      }
    } else {
      console.log(error.message);
    }
    setTimeout(() => {
      setMessage('Top up success.');
      setSuccess(false);
      props.onClose();
    }, 800);
  };

  return (
    <Fragment>
      {!success ? (
        <>
          <form onSubmit={submitHandler}>
            <fieldset className={styles.formGroup}>
              <div className={styles['amount-button']}>
                <button
                  type="button"
                  value="2000"
                  onClick={amountChosenHandler}
                  className={button1Clicked ? styles.active : ''}
                >
                  $20
                </button>
                <button
                  type="button"
                  value="5000"
                  onClick={amountChosenHandler}
                  className={button2Clicked ? styles.active : ''}
                >
                  $50
                </button>
                <button
                  type="button"
                  value="10000"
                  onClick={amountChosenHandler}
                  className={button3Clicked ? styles.active : ''}
                >
                  $100
                </button>
              </div>
              <div className={styles.formRow}>
                <CardElement
                  options={cardOptions}
                  className={styles.stripeElement}
                />
                <button
                  className={
                    enableTopUp ? styles['button'] : styles['button-disabled']
                  }
                  type="submit"
                >
                  Top Up
                </button>
              </div>
            </fieldset>
          </form>
          <h2 className={styles.payment}>{message}</h2>
        </>
      ) : (
        <h2 className={styles.payment}>{message}</h2>
      )}
    </Fragment>
  );
};

export default PaymentForm;
