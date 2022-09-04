import styles from './AddAvatar.module.css';
import Modal from '../UI/Modal';
import CloseButton from '../UI/CloseButton';
// import AuthForm from '../Authorization/AuthForm';
import axios from 'axios';
import { useState } from 'react';

const AddAvatar = (props) => {
  const id = localStorage.getItem('id');
  const [photo, setPhoto] = useState('');
  const [message, setMessage] = useState('Upload your avatar');

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
    setMessage('Uploading Avatar...');
    axios.post(`/avatar-upload/${id}`, formData, config);
    setTimeout(() => {
      props.onClose();
    }, 2000);
  };

  return (
    <Modal>
      <form className={styles.form} enctype="multipart/form-data">
        <p className={styles.message}>{message}</p>
        <CloseButton onClose={props.onClose} className={styles.close} />
        <input type="file" name="photo" onChange={photoHandler} />
        <input
          type="button"
          value="Save"
          onClick={submitHandler}
          className={styles.submit}
        />
      </form>
    </Modal>
  );
};

export default AddAvatar;
