import React, { useState, useRef, useEffect } from 'react';
import Logo from '../components/UI/Logo';
import FormWrapper from '../components/Helper/FormWrapper';
import AuthForm from '../components/Authorization/AuthForm';
import styles from './Login.module.css';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';

const Login = () => {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const history = useHistory();
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [validMatch, setValidMatch] = useState(true);
  const [validInput, setValidInput] = useState(false);

  const nameChangeHandler = (event) => {
    if (event.target.value !== '') {
      setNameInput(event.target.value);
      setValidInput(true);
    }
  };
  const passwordChangeHandler = (event) => {
    if (event.target.value !== '') {
      setPasswordInput(event.target.value);
      setValidInput(true);
    }
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();
    axios
      .post('/login', {
        username: nameInput,
        password: passwordInput,
      })
      .then((response) => {
        if (response.data.valid === true) {
          setValidMatch(true);
          localStorage.setItem('loggedIn', 'LOGGED_IN');
          localStorage.setItem('username', `${nameInput}`);
          localStorage.setItem('id', `${response.data.id}`);
          history.replace('/');
        } else if (response.data === 'INVALID') {
          setValidMatch(false);
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <React.Fragment>
      <Logo />
      <FormWrapper>
        <AuthForm onSubmit={formSubmitHandler}>
          <input
            ref={inputRef}
            type="text"
            name="username"
            placeholder="Username"
            onChange={nameChangeHandler}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={passwordChangeHandler}
          />
          {!validMatch && (
            <h3 className={styles.invalid}>
              Username and passwords do not match.
            </h3>
          )}
          <div className={styles.links}>
            <a href="/">
              <h3>Forgot password</h3>
            </a>
            <Link to="/registration">
              <h3>New user</h3>
            </Link>
          </div>
          <button
            type="submit"
            className={validInput === false && styles.disabled}
          >
            Login
          </button>
        </AuthForm>
      </FormWrapper>
    </React.Fragment>
  );
};

export default Login;
