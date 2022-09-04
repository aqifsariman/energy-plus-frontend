/* eslint-disable react/style-prop-object */
import React, { Fragment, useEffect, useState } from 'react';
import styles from './PaymentForm.module.css';
import axios from 'axios';

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

  useEffect(() => {
    axios.get(`/wallet-details/${userId}`).then((response) => {
      setCustomerId(response.data[0].customerId);
    });
  });

  // ONSUBMIT
  const submitHandler = async (event) => {
    event.preventDefault();
    console.log('Topping up!');
    setMessage('Loading...');
    axios
      .get(`/payment-method/${customerId}`)
      .then((response) => {
        console.log('Running Payment saved card');
        console.log(response);
        axios
          .post(`/payment-saved-card`, {
            customer: customerId,
            amount: Number(amountValue),
            currency: 'sgd',
            payment_method: response.data.payment.data[0].id,
          })
          .then((resp) => {
            console.log('Existing card', resp);
            //! Passing state up
            props.onGetData(Number(resp.data.balance));
            if (resp.data.success) {
              setSuccess(true);
              setMessage('You have topped up successfully.');
            }
          });
      })
      .catch((error) => console.log(error));
    setTimeout(() => {
      setMessage('Top up success.');
      setSuccess(false);
      props.onClose();
    }, 3500);
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
