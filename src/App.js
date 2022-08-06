/* eslint-disable react-hooks/exhaustive-deps */
import { Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import Transactions from './pages/Transactions';

import React from 'react';

const App = () => {
  const loggedInStatus = localStorage.getItem('loggedIn');
  return (
    <React.Fragment>
      <Router>
        <Route path="/registration">
          <Registration />
        </Route>
        {loggedInStatus === null && <Redirect to="/login" />}
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/profile/:username">
          <Profile />
        </Route>
        <Route path="/transactions/:userId">
          <Transactions />
        </Route>
        <Route path="/wallet/:walletId">
          <Wallet />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
      </Router>
    </React.Fragment>
  );
};

export default App;
