import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const chargingReducer = createSlice({
  name: 'charger',
  initialState: {
    chargeStatus: false,
    totalCharge: 0,
  },
  reducers: {
    charging: (state) => {
      console.log('Charging now!');
      const id = localStorage.getItem('id');
      axios
        .post('/new-charge', {
          id,
        })
        .then((response) => {
          console.log(response);
        });
      return (state = true);
    },
    notCharging: (state, action) => {
      console.log('Charging stopping!');
      const id = localStorage.getItem('id');
      axios
        .put('/end-charge', {
          userId: id,
          electricityUsed: action.payload,
        })
        .then((response) => {
          console.log(response);
        });
      return (state = false);
    },
  },
});

export const { charging, notCharging } = chargingReducer.actions;

export default chargingReducer.reducer;
