import styles from './AddQRCode.module.css';
import AuthForm from '../Authorization/AuthForm';
import InputForm from '../Authorization/InputForm';
import Modal from '../UI/Modal';
import CloseButton from '../UI/CloseButton';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { charging } from '../../redux/chargingReducer';

const AddQRCode = (props) => {
  const codes = [10183666];
  const [codeInput, setCodeInput] = useState('');
  const dispatch = useDispatch();
  const codeHandler = (event) => {
    console.log(event.target.value);
    setCodeInput(event.target.value);
  };

  return (
    <Modal>
      <CloseButton onClose={props.onClose} className={styles.close} />
      <h1> QR Code</h1>
      <AuthForm>
        <InputForm
          for="codeRedemption"
          name="codeRedemption"
          type="text"
          onChange={codeHandler}
        />
        <button type="button" onClick={() => dispatch(charging())}>
          Enter Code
        </button>
      </AuthForm>
    </Modal>
  );
};

export default AddQRCode;
