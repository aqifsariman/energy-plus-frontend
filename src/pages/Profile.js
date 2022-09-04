/* eslint-disable react-hooks/exhaustive-deps */
import { Redirect, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Switch from 'react-switch';
import Logo from '../components/UI/Logo';
import styles from './Profile.module.css';
import AddVehicle from '../components/Popups/AddVehicle';
import AddUserDetails from '../components/Popups/AddUserDetails';
import AddAvatar from '../components/Popups/AddAvatar';
import Navbar from '../components/UI/Navbar';
import axios from 'axios';

const Profile = () => {
  const [addCarStatus, setAddCarStatus] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [addDetailsStatus, setAddDetailsStatus] = useState(false);
  const [addAvatarStatus, setAddAvatarStatus] = useState(false);

  // PROFILE STATES
  const [nickname, setNickname] = useState('');
  const [address, setAddress] = useState('');
  const [handphone, setHandphone] = useState('');
  const [avatar, setAvatar] = useState('');

  // CAR STATES
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [connector, setConnector] = useState('');
  const [license, setLicense] = useState('');
  const [validVehicle, setValidVehicle] = useState(false);

  // NOTIFICATIONS STATES
  const [checkedWallet, setCheckedWallet] = useState(false);
  const [checkedCharged, setCheckedCharged] = useState(false);
  const [checkedPromos, setCheckedPromos] = useState(false);

  const closeHandler = () => {
    console.log('Closing');
    setAddDetailsStatus(false);
    setAddCarStatus(false);
    setAddAvatarStatus(false);
  };

  const avatarHandler = () => {
    console.log('clicked');
    setAddAvatarStatus(true);
  };
  const walletHandler = (event) => {
    setCheckedWallet(event);
  };
  const chargingHandler = (event) => {
    setCheckedCharged(event);
  };
  const promosHandler = (event) => {
    setCheckedPromos(event);
  };

  const carClickHandler = () => {
    console.log('clicked');
    setAddCarStatus(true);
  };
  const userDetailsHandler = () => {
    console.log('Opening');
    setAddDetailsStatus(true);
  };

  const logoutHandler = () => {
    setIsLoggedOut(true);
    localStorage.clear();
  };
  let capitalizeUsername;
  const id = localStorage.getItem('id');
  const username = localStorage.getItem('username');
  if (username !== null) {
    capitalizeUsername = username.toUpperCase();
  }

  // AXIOS REQUESTS
  useEffect(() => {
    axios
      .get(`/avatar/${id}`)
      .then((response) => {
        setAvatar(response.data[0].link);
      })
      .catch((error) => console.log(error));

    axios.get(`/profile/${id}/get-details`).then((response) => {
      setNickname(response.data[0].nickname);
      setAddress(response.data[0].address);
      setHandphone(response.data[0].handphone);
    });

    axios.get(`/profile/${id}/get-vehicles`).then((response) => {
      setBrand(response.data[0].brand);
      setModel(response.data[0].model);
      setConnector(response.data[0].connector);
      setLicense(response.data[0].licensePlate);
    });
    if (
      brand === null &&
      model === null &&
      connector === null &&
      license === null
    ) {
      setValidVehicle(false);
    } else {
      setValidVehicle(true);
    }
  });

  return (
    <div>
      {isLoggedOut && <Redirect to="/login" />}
      {addCarStatus && <AddVehicle onClose={closeHandler} />}
      {addDetailsStatus && <AddUserDetails onClose={closeHandler} />}
      {addAvatarStatus && <AddAvatar onClose={closeHandler} />}
      <Logo />
      <div className={styles.message}>
        <h1>Welcome {capitalizeUsername}</h1>
      </div>
      <div className={styles['profile-details']}>
        <h1>Profile</h1>
        <div className={styles['indiv-details']}>
          <p>Avatars</p>
          <div className={styles.photo}>
            {avatar !== null ? (
              <img
                src={avatar}
                alt={avatar}
                className={styles.avatar}
                onClick={avatarHandler}
              />
            ) : (
              <button>
                <p className={styles.upload} onClick={avatarHandler}>
                  Upload
                </p>
              </button>
            )}
          </div>
        </div>
        <div className={styles['indiv-details']}>
          <p>Nickname</p>
          {nickname !== null ? <p>{nickname}</p> : <p>---</p>}
        </div>
        <div className={styles['indiv-details']}>
          <p>Address</p>
          {address !== null ? <p>{address}</p> : <p>---</p>}
        </div>
        <div className={styles['indiv-details']}>
          <p>Handphone</p>
          {handphone !== null ? <p>{handphone}</p> : <p>---</p>}
        </div>
        <div className={styles['indiv-details-user']}>
          <button onClick={userDetailsHandler}>+</button>
        </div>
      </div>
      <div className={styles['profile-details']}>
        <h1>Your Ride</h1>
        <div className={styles['indiv-details']}>
          <p>Brand</p>
          {brand !== null ? <p>{brand}</p> : <p>---</p>}
        </div>
        <div className={styles['indiv-details']}>
          <p>Model</p>
          {model !== null ? <p>{model}</p> : <p>---</p>}
        </div>
        <div className={styles['indiv-details']}>
          <p>Connector</p>
          {connector !== null ? <p>{connector}</p> : <p>---</p>}
        </div>
        <div className={styles['indiv-details']}>
          <p>License Plate</p>
          {license !== null ? <p>{license}</p> : <p>---</p>}
        </div>
        <div className={styles['indiv-details']}>
          <p>Add a vehicle</p>
          <button onClick={carClickHandler}>+</button>
        </div>
      </div>

      <div className={styles['profile-details']}>
        <h1>Notifications</h1>
        <div className={styles['indiv-details']}>
          <p>Notify when my wallet is out of juice.</p>
          <Switch onChange={walletHandler} checked={checkedWallet} />
        </div>
        <div className={styles['indiv-details']}>
          <p>Notify when my car is fully charged.</p>
          <Switch onChange={chargingHandler} checked={checkedCharged} />
        </div>
        <div className={styles['indiv-details']}>
          <p>Notify me of good deals and promos.</p>
          <Switch onChange={promosHandler} checked={checkedPromos} />
        </div>
      </div>
      <Link className={styles.logout}>
        <button onClick={logoutHandler} type="button">
          Logout
        </button>
      </Link>
      <Navbar />
    </div>
  );
};

export default Profile;
