import styles from './AddUserDetails.module.css';
import Modal from '../UI/Modal';
import CloseButton from '../UI/CloseButton';
import AuthForm from '../Authorization/AuthForm';
import InputForm from '../Authorization/InputForm';
import axios from 'axios';
import { useState, useEffect } from 'react';

const AddUserDetails = (props) => {
  const [nickname, setNickname] = useState('Nickname');
  const [address, setAddress] = useState('Address');
  const [handphone, setHandphone] = useState('Handphone');

  useEffect(() => {
    axios.get(`/profile/${id}/get-details`).then((response) => {
      if (
        response.data[0].nickname !== null &&
        response.data[0].address !== null &&
        response.data[0].handphone !== null
      ) {
        setNickname(response.data[0].nickname);
        setAddress(response.data[0].address);
        setHandphone(response.data[0].handphone);
      }
    });
  });
  console.log(nickname);

  const nameHandler = (event) => {
    if (event.target.value !== '') {
      setNickname(event.target.value);
    }
  };
  const addressHandler = (event) => {
    if (event.target.value !== '') {
      setAddress(event.target.value);
    }
  };
  const handphoneHandler = (event) => {
    if (event.target.value !== '') {
      setHandphone(event.target.value);
    }
  };

  const id = localStorage.getItem('id');

  const details = {
    nickname,
    address,
    handphone,
  };
  const submitHandler = () => {
    axios.post(`/profile/${id}/user-details`, details);
  };
  return (
    <Modal>
      <AuthForm className={styles.form} onSubmit={submitHandler}>
        <CloseButton onClose={props.onClose} className={styles.close} />
        <InputForm
          htmlFor="nickname"
          name="nickname"
          onChange={nameHandler}
          type="text"
          placeholder={nickname}
        />
        <InputForm
          htmlFor="address"
          name="address"
          onChange={addressHandler}
          type="text"
          placeholder={address}
        />
        <InputForm
          htmlFor="handphone"
          name="handphone"
          onChange={handphoneHandler}
          type="number"
          placeholder={handphone}
        />
        <button type="submit">Save</button>
      </AuthForm>
    </Modal>
  );
};

export default AddUserDetails;
