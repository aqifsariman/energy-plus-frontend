import styles from './AddAvatar.module.css';
import Modal from '../UI/Modal';
import CloseButton from '../UI/CloseButton';
// import AuthForm from '../Authorization/AuthForm';
import axios from 'axios';
import { useState } from 'react';

const AddAvatar = (props) => {
  const id = localStorage.getItem('id');
  const [photo, setPhoto] = useState('');

  //! Fix Dropdown going upwards in mobile view

  const photoHandler = (event) => {
    console.log('on Change', event.target.files[0]);
    setPhoto(event.target.files[0]);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    let formData = new FormData();
    const config = { headers: { 'content-type': 'multipart/form-data' } };
    formData.append('photo', photo);
    console.log('clicked submit');
    axios.post(`/avatar-upload/${id}`, formData, config);
  };

  return (
    <Modal>
      <form className={styles.form} enctype="multipart/form-data">
        <CloseButton onClose={props.onClose} className={styles.close} />
        <input
          type="file"
          name="photo"
          className={styles.upload}
          onChange={photoHandler}
          on
        />
        <input type="button" value="Save" onClick={submitHandler} />
      </form>
    </Modal>
  );
};

export default AddAvatar;
