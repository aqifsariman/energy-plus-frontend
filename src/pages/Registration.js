import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import styles from './Registration.module.css';
import Logo from '../components/UI/Logo';
import FormWrapper from '../components/Helper/FormWrapper';
import AuthForm from '../components/Authorization/AuthForm';
import Modal from '../components/UI/Modal';
import axios from 'axios';

const Registration = () => {
  // STATE DECLARATION //
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [usernameValid, setUsernameValid] = useState();
  const [emailValid, setEmailValid] = useState();
  const [confirmEmailValid, setConfirmEmailValid] = useState();
  const [passwordValid, setPasswordValid] = useState();
  const [confirmPasswordValid, setConfirmPasswordValid] = useState();
  const [registrationSuccess, setRegistrationSuccess] = useState();
  const [errorMessage, setErrorMessage] = useState('');

  let formIsValid = false;

  // HANDLER FUNCTIONS //
  const usernameCheckHandler = (event) => {
    if (event.target.value.trim().length > 4) {
      setUsernameValid(true);
      setUsernameInput(event.target.value);
    } else {
      setUsernameValid(false);
    }
  };

  const emailCheckHandler = (event) => {
    if (
      event.target.value.includes('@') &&
      event.target.value.includes('.com')
    ) {
      setEmailValid(true);
      setEmailInput(event.target.value);
    } else {
      setEmailValid(false);
    }
  };

  const emailConfirmHandler = (event) => {
    if (event.target.value === emailInput) {
      setConfirmEmailValid(true);
    } else {
      setConfirmEmailValid(false);
    }
  };

  const passwordCheckHandler = (event) => {
    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{8,16}$/;

    if (event.target.value.match(regex)) {
      setPasswordValid(true);
      setPasswordInput(event.target.value);
    } else {
      setPasswordValid(false);
    }
  };

  const passwordConfirmHandler = (event) => {
    if (event.target.value === passwordInput) {
      setConfirmPasswordValid(true);
    } else {
      setConfirmPasswordValid(false);
    }
  };

  if (
    emailValid &&
    passwordValid &&
    confirmEmailValid &&
    confirmPasswordValid &&
    usernameValid
  ) {
    formIsValid = true;
  }

  const formSubmitHandler = (event) => {
    axios
      .post('/register', {
        username: usernameInput,
        email: emailInput,
        password: passwordInput,
      })
      .then((response) => {
        console.log(response);
        if (response.data.errors[0].path === 'email') {
          setRegistrationSuccess(false);
          setErrorMessage('Email address already exist.');
        } else if (response.data.errors[0].path === 'username') {
          setRegistrationSuccess(false);
          setErrorMessage('Username already exist.');
        } else {
          console.log('Submitted', response.config.data);
          setErrorMessage('Registered Successfully');
          setTimeout(() => {
            setRegistrationSuccess(true);
          }, 5000);
        }
      })
      .catch((error) => console.log(error));
  };

  // JSX RETURN //
  return (
    <React.Fragment>
      {registrationSuccess && <Redirect to="login" />}
      <Logo />
      <h1 className={styles['header-message']}>Create New Account</h1>
      <p className={styles['header-message']}>Please fill in the form below</p>
      <FormWrapper>
        <AuthForm onSubmit={formSubmitHandler}>
          <input
            type="text"
            name="username"
            onBlur={usernameCheckHandler}
            className={`${usernameValid === false ? styles.invalid : ''}`}
            placeholder="Username"
          />
          {usernameValid === false && (
            <p className={styles['invalid-message']}>
              Username must be more than 5 characters
            </p>
          )}
          <input
            type="email"
            name="email"
            onBlur={emailCheckHandler}
            className={`${emailValid === false ? styles.invalid : ''}`}
            placeholder="Email Address"
          />
          {emailValid === false && (
            <p className={styles['invalid-message']}>Invalid email address</p>
          )}
          <input
            type="email"
            name="confirmEmail"
            onBlur={emailConfirmHandler}
            className={`${confirmEmailValid === false ? styles.invalid : ''}`}
            placeholder="Confirm Email Address"
          />
          {confirmEmailValid === false && (
            <p className={styles['invalid-message']}>
              Email address do not match
            </p>
          )}
          <input
            type="password"
            name="password"
            onBlur={passwordCheckHandler}
            className={`${passwordValid === false ? styles.invalid : ''}`}
            placeholder="Password"
          />
          {passwordValid === false && (
            <div className={styles['invalid-message']}>
              Must include:{' '}
              <ul>
                <li>Uppercase and lowercase characters</li>
                <li>Numbers</li>
                <li>8 - 16 characters long</li>
              </ul>
            </div>
          )}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onBlur={passwordConfirmHandler}
            className={`${
              confirmPasswordValid === false ? styles.invalid : ''
            }`}
          />
          {confirmPasswordValid === false && (
            <p className={styles['invalid-message']}>Passwords do not match</p>
          )}
          <button
            type="submit"
            className={`${formIsValid === false ? styles.disabled : ''}`}
          >
            Register
          </button>
          {!registrationSuccess ? (
            <h3 className={styles.error}>{errorMessage}</h3>
          ) : (
            <h3 className={styles.success}>{errorMessage}</h3>
          )}
          <div className={styles.links}>
            <a href="/login">
              <h3>Already a member</h3>
            </a>
          </div>
        </AuthForm>
      </FormWrapper>
    </React.Fragment>
  );
};
export default Registration;
