import { useEffect, useState } from 'react';
import AuthForm from '../Authorization/AuthForm';
import styles from './AddCardDetails.module.css';
import CloseButton from '../UI/CloseButton';
import Modal from '../UI/Modal';
import axios from 'axios';

const AddCardDetails = (props) => {
  // STATE MANAGEMENTS
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [cvc, setCVC] = useState('');
  const [validName, setValidName] = useState();
  const [validCardNumber, setValidCardNumber] = useState();
  const [validMonth, setValidMonth] = useState();
  const [validYear, setValidYear] = useState();
  const [validCVC, setValidCVC] = useState();
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('Fill in your credit card details');

  const nameValidHandler = (event) => {
    const regex = /\d/g;
    if (event.target.value !== '' && regex.test(event.target.value) !== true) {
      setValidName(true);
      setName(event.target.value);
    } else {
      setValidName(false);
    }
  };
  const cardNumberValidHandler = (event) => {
    if (event.target.value !== '' && event.target.value.length === 16) {
      setValidCardNumber(true);
      setCardNumber(event.target.value);
    } else {
      setValidCardNumber(false);
    }
  };

  const monthValidHandler = (event) => {
    if (event.target.value <= 12) {
      setMonth(event.target.value);
      setValidMonth(true);
      console.log('Valid');
    } else {
      setValidMonth(false);
      console.log('Invalid');
    }
  };
  const yearValidHandler = (event) => {
    if (event.target.value >= 22) {
      setYear(event.target.value);
      setValidYear(true);
    } else {
      setValidYear(false);
    }
  };

  const cvcValidHandler = (event) => {
    if (event.target.value !== '' || event.target.value.length === 3) {
      setCVC(event.target.value);
      setValidCVC(true);
    } else {
      setValidCVC(false);
    }
  };

  useEffect(() => {
    console.log('Customer ID', props.retrieveCustomerId);
  });

  const submitHandler = (event) => {
    console.log('Submitting');
    event.preventDefault();
    axios
      .post(`/card-update/${props.retrieveCustomerId}`, {
        name,
        cardNumber,
        month,
        year,
        cvc,
      })
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setSuccess(true);
          setMessage('You have added your card successfully.');
          props.onName(response.data.name);
          props.onNumber(response.data.lastFourDigit);
          props.onMonth(response.data.expMonth);
          props.onYear(response.data.expYear);
          props.onBrand(response.data.brand);
        }
      });
    setTimeout(() => {
      setMessage('Top up success.');
      setSuccess(false);
      props.onClose();
    }, 800);
  };
  return (
    <Modal>
      {!success ? (
        <AuthForm className={styles.form} onSubmit={submitHandler}>
          <h2 className={styles.payment}>{message}</h2>
          <CloseButton onClose={props.onClose} className={styles.close} />
          <input
            type="text"
            placeholder="Name on Card"
            name="cardName"
            onBlur={nameValidHandler}
          />
          {validName === false && (
            <p className={styles['error-message']}>Invalid card name</p>
          )}
          <input
            type="number"
            placeholder="Card Number"
            name="cardNumber"
            onBlur={cardNumberValidHandler}
            onInput={(e) => (e.target.value = e.target.value.slice(0, 16))}
          />
          {validCardNumber === false && (
            <p className={styles['error-message']}>Invalid card number</p>
          )}
          <fieldset className={styles.fieldset}>
            <legend className={styles.expiry}>Expiry Date</legend>
            <input
              type="number"
              name="expiryMonth"
              placeholder="MM"
              onInput={(e) => (e.target.value = e.target.value.slice(0, 2))}
              step={1}
              min="01"
              max="12"
              onBlur={monthValidHandler}
            />
            /
            <input
              type="number"
              name="expiryYear"
              placeholder="YY"
              onInput={(e) => (e.target.value = e.target.value.slice(0, 2))}
              min="22"
              max="40"
              onBlur={yearValidHandler}
            />
          </fieldset>
          {validMonth === false ||
            (validYear === false && (
              <p className={styles['error-message']}>Invalid expiry date</p>
            ))}
          <input
            type="number"
            placeholder="CVC"
            name="cvc"
            onInput={(e) => (e.target.value = e.target.value.slice(0, 3))}
            onBlur={cvcValidHandler}
          />
          {validCVC === false && (
            <p className={styles['error-message']}>Invalid CVC</p>
          )}
          <h3>Take note this will overwrite your previously saved card.</h3>
          <button type="submit">Save</button>
        </AuthForm>
      ) : (
        <h2 className={styles.payment}>{message}</h2>
      )}
    </Modal>
  );
};

export default AddCardDetails;
