import Navbar from '../components/UI/Navbar';
import styles from './Transactions.module.css';
import { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { notCharging } from './../redux/chargingReducer';
import Logo from '../components/UI/Logo';
import Chart from '../components/UI/Chart';
import axios from 'axios';
import moment from 'moment';

const Transactions = () => {
  const chargeStatus = useSelector((state) => state.charge);
  console.log(chargeStatus);
  const dispatch = useDispatch();
  const id = localStorage.getItem('id');
  const [elapsedTime, setElapsedTime] = useState();
  const [cost, setCost] = useState(0);
  let totalCost;

  useEffect(() => {
    const info = async () => {
      const getInfo = await axios.get(`/charge-info/${id}`);
      console.log(getInfo.data[0]);
      const chargeStartTime = getInfo.data[0].updatedAt;
      const timeNow = new Date();
      const formattedTimeNow = moment(timeNow);
      const formattedChargedTime = moment(chargeStartTime);
      const elapsed = Math.ceil(
        formattedTimeNow.diff(formattedChargedTime, 'minutes', true)
      );
      if (elapsed / 60 < 1) {
        setCost(1.5);
      } else {
        setCost((elapsed / 60) * 1.5);
      }
      setElapsedTime(elapsed);
    };

    info();
    const interval = setInterval(() => {
      console.log('Logs every minute');
      info();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Fragment>
      <Logo />
      <div className={styles['main-container']}>
        <div className={styles.container}>
          <h1 className={styles.header}>Charging Status</h1>

          {chargeStatus === true ? (
            <>
              <img
                src="https://media3.giphy.com/media/1lv0vVOoTl4jPxT05q/giphy.gif?cid=ecf05e47wfxfgrn1xhhsulr41u304kywvfl6uz50w6ylfzwj&rid=giphy.gif&ct=g"
                alt="charging"
                className={styles.battery}
              />
              {elapsedTime > 60 ? (
                <h2>
                  Elapsed Time : {Math.floor(elapsedTime / 60)} hour{' '}
                  {elapsedTime % 60} minutes
                </h2>
              ) : (
                <h2>Elapsed Time : {elapsedTime} minutes</h2>
              )}
              <button
                onClick={() => dispatch(notCharging(elapsedTime))}
                className={styles.charge}
              >
                Stop Charging
              </button>
            </>
          ) : (
            <>
              <img
                src="https://st.depositphotos.com/8521256/54082/v/600/depositphotos_540821254-stock-video-glitch-car-battery-icon-black.jpg"
                alt="not charging"
                className={styles.battery}
              />
              <h2>No Charging Activity</h2>
            </>
          )}
        </div>
        <div className={styles.container}>
          <h1 className={styles.header}>Charging Cost</h1>
          {/* {chargeStatus ? (
            <div>
              <h2>Current Charging Cost: ${cost.toFixed(2)}</h2>
            </div>
          )  */}
          <div>
            <h2>Current Charging Cost: $--</h2>
          </div>
        </div>
        <div className={styles.container}>
          <h1 className={styles.header}>Charging Activity</h1>
          <div>
            <Chart />
          </div>
        </div>
      </div>
      <Navbar />
    </Fragment>
  );
};

export default Transactions;
