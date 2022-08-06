import styles from './AddUserDetails.module.css';
import Modal from '../UI/Modal';
import CloseButton from '../UI/CloseButton';
import AuthForm from '../Authorization/AuthForm';
import InputForm from '../Authorization/InputForm';
import axios from 'axios';
import { useRef, useState } from 'react';

const AddUserDetails = (props) => {
  const [nickname, setName] = useState('');
  const [address, setAddress] = useState('');
  const [handphone, setHandpone] = useState('');

  const nameHandler = (event) => {
    setName(event.target.value);
  };
  const addressHandler = (event) => {
    setAddress(event.target.value);
  };
  const handphoneHandler = (event) => {
    setHandpone(event.target.value);
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
          placeholder="Nickname"
        />
        <InputForm
          htmlFor="address"
          name="address"
          onChange={addressHandler}
          type="text"
          placeholder="Adddress"
        />
        <InputForm
          htmlFor="handphone"
          name="handphone"
          onChange={handphoneHandler}
          type="number"
          placeholder="Handphone"
        />
        <button type="submit">Save</button>
      </AuthForm>
    </Modal>
  );
};

export default AddUserDetails;
