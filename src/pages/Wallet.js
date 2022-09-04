import { Fragment, useEffect, useState } from 'react';
import styles from './Wallet.module.css';
import AuthForm from '../components/Authorization/AuthForm';
import InputForm from '../components/Authorization/InputForm';
import axios from 'axios';
import Navbar from '../components/UI/Navbar';
import WalletTopUp from '../components/Popups/WalletTopUp';
import AddCardDetails from '../components/Popups/AddCardDetails';

const Wallet = () => {
  const [addCardStatus, setAddCardStatus] = useState(false);
  const [topUpStatus, setTopUpStatus] = useState(false);
  const [customerBalance, setCustomerBalance] = useState(0);
  const [stripeCustomerId, setStripeCustomerId] = useState('');
  const [cardName, setCardName] = useState('XXXX XXXX');
  const [cardNumber, setCardNumber] = useState('XXXX');
  const [cardMonth, setCardMonth] = useState('XX');
  const [cardYear, setCardYear] = useState('XX');
  const [cardBrand, setCardBrand] = useState('XXXX');
  const [cardAdded, setCardAdded] = useState();

  const id = localStorage.getItem('id');
  const username = localStorage.getItem('username');

  // CUSTOMER ADDING CARD DETAILS
  const addCardHandler = () => {
    setAddCardStatus(true);
  };

  // OPENING UP MODALS TO TOP UP E-WALLET BALANCE
  const topUpHandler = () => {
    setTopUpStatus(true);
  };

  // CLOSING OF MODALS
  const closeHandler = () => {
    setAddCardStatus(false);
    setTopUpStatus(false);
    console.log('Closing');
  };

  const submitHandler = (event) => {
    event.preventDefault();
    console.log('Adding to funds');
  };

  // CODE REDEMPTION
  const codeChangeHandler = (event) => {
    console.log(event.target.value);
  };

  // STEPPING UP STATES
  const retrieveNameHandler = (name) => {
    setCardName(name);
  };
  const retrieveLastFourHandler = (number) => {
    setCardNumber(number);
  };
  const retrieveMonthHandler = (month) => {
    setCardMonth(month);
  };
  const retrieveYearHandler = (year) => {
    setCardYear(year);
  };
  const retrieveBrandHandler = (brand) => {
    setCardBrand(brand);
  };

  const getData = (data) => {
    //! Getting state from component below
    setCustomerBalance(data / 100);
  };

  useEffect(() => {
    axios.get(`/wallet-details/${id}`).then((response) => {
      console.log(response);
      if (response.data[0].customerId) {
        axios
          .get(`/payment/${response.data[0].customerId}`)
          .then((res) => {
            console.log(res);
            if (!res.data.balance) {
              setCustomerBalance(0);
            }
            setCustomerBalance(Number(res.data.balance / 100));
            console.log(res.data);
            setStripeCustomerId(response.data[0].customerId);
          })
          .catch((error) => console.log(error));
        axios
          .get(`/get-card/${response.data[0].customerId}`)
          .then((res) => {
            if (res.data.card !== false) {
              setCardName(res.data.name);
              setCardNumber(res.data.card);
              setCardMonth(res.data.month);
              setCardYear(res.data.year);
              setCardBrand(res.data.brand);
              setCardAdded(true);
            } else {
              console.log('No card', res.data);
              setCardAdded(false);
            }
          })
          .catch((error) => console.log(error));
      } else {
        axios
          .post(`/payment/customer/${username}`, {
            description: `${username} Stripe Customer`,
            name: username,
          })
          .then((resp) => {
            console.log(resp.data);
            axios.post(`/wallet-details/${id}`, {
              customerId: resp.data.customerId,
            });
            setStripeCustomerId(resp.data.customerId);
            axios.get(`/payment/${response.data[0].customerId}`).then((res) => {
              setCustomerBalance(Number(res.data.balance / 100));
            });
          })
          .catch((error) => console.log(error));
      }
    });
  }, []);

  return (
    <Fragment>
      {topUpStatus && (
        <WalletTopUp onClose={closeHandler} onGetData={getData} />
      )}
      {addCardStatus && (
        <AddCardDetails
          onClose={closeHandler}
          onName={retrieveNameHandler}
          onNumber={retrieveLastFourHandler}
          onMonth={retrieveMonthHandler}
          onYear={retrieveYearHandler}
          onBrand={retrieveBrandHandler}
          retrieveCustomerId={stripeCustomerId}
        />
      )}
      <div className={styles.header}>
        <h1>Wallet</h1>
      </div>
      <div className={styles['profile-details']}>
        <h1>Balance</h1>
        <div className={styles['indiv-details']}>
          {isNaN(customerBalance) ? <p>$0</p> : <p>${customerBalance}</p>}
        </div>
        <div className={styles['indiv-details']}>
          <p>Add funds</p>
          <button
            onClick={topUpHandler}
            className={!cardAdded && styles.disabled}
            title={!cardAdded && 'Card not added yet'}
          >
            +
          </button>
        </div>
      </div>
      <div className={styles['profile-details']}>
        <h1>Card</h1>
        <div className={styles.card}>
          <div>
            <svg>
              <rect id="box" x="0" y="0" />
            </svg>
          </div>
          <p>XXXX XXXX XXXX {cardNumber}</p>
          <p>
            {cardMonth} / {cardYear}
          </p>
          <div className={styles['name-logo']}>
            <p>{cardName}</p>
            <p>{cardBrand}</p>
          </div>
        </div>
        <div className={styles['indiv-details']}>
          <p>Add card details</p>
          <button onClick={addCardHandler}>+</button>
        </div>
      </div>
      <div className={styles['profile-details']}>
        <h1> Code Redemption</h1>
        <AuthForm onSubmit={submitHandler}>
          <InputForm
            for="codeRedemption"
            name="codeRedemption"
            onChange={codeChangeHandler}
            type="text"
          />
          <button>Enter Code</button>
        </AuthForm>
      </div>
      <Navbar />
    </Fragment>
  );
};

export default Wallet;
