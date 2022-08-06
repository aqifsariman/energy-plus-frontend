import styles from './AddVehicle.module.css';
import Modal from '../UI/Modal';
import AuthForm from '../Authorization/AuthForm';
import InputForm from '../Authorization/InputForm';
import CloseButton from '../UI/CloseButton';
import { useState } from 'react';
import axios from 'axios';
const AddVehicle = (props) => {
  const id = localStorage.getItem('id');
  // !TODO Fix Dropdown going upwards in mobile view

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [connector, setConnector] = useState('');
  const [license, setLicense] = useState('');

  const brandHandler = (event) => {
    setBrand(event.target.value);
  };
  const modelHandler = (event) => {
    setModel(event.target.value);
  };
  const connectorHandler = (event) => {
    setConnector(event.target.value);
  };
  const licenseHandler = (event) => {
    setLicense(event.target.value);
  };

  const submitHandler = () => {
    axios.post(`/profile/${id}/user-vehicles`, {
      brand,
      model,
      connector,
      licensePlate: license,
    });
  };
  return (
    <Modal>
      <AuthForm className={styles.form} onSubmit={submitHandler}>
        <CloseButton onClose={props.onClose} className={styles.close} />
        <div className={styles.selector}>
          <label htmlFor="brand">Brand</label>
          <select onChange={brandHandler}>
            <option value="BMW">BMW</option>
            <option value="Ford">Ford</option>
            <option value="Honda">Honda</option>
            <option value="Hyundai">Hyundai</option>
            <option value="Kia">Kia</option>
            <option value="Mercedes">Mercedes</option>
            <option value="Mitsubishi">Mitsubishi</option>
            <option value="Saab">Saab</option>
            <option value="Subaru">Subaru</option>
            <option value="Tesla">Tesla</option>
            <option value="Toyota">Toyota</option>
            <option value="Volvo">Volvo</option>
          </select>
        </div>
        <InputForm
          htmlFor="model"
          name="model"
          onChange={modelHandler}
          placeholder="Model"
        />
        <div className={styles.selector}>
          <label htmlFor="connector">Connector Type</label>
          <select onChange={connectorHandler}>
            <option value="AC-J1772">AC - J1772</option>
            <option value="AC-Mennekes">AC - Mennekes</option>
            <option value="AC-GB/T">AC - GB/T</option>
            <option value="DC-CHAdeMO">DC - CHAdeMO</option>
            <option value="DC-CCS1">DC - CCS1</option>
            <option value="DC-CCS2">DC - CCS2</option>
            <option value="DC-GB/T">DC - GB/T</option>
          </select>
        </div>
        <InputForm
          htmlFor="licensePlate"
          name="licensePlate"
          onChange={licenseHandler}
          placeholder="License Plate"
        />
        <button type="submit">Add Car</button>
      </AuthForm>
    </Modal>
  );
};

export default AddVehicle;
