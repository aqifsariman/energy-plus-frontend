import { configureStore } from '@reduxjs/toolkit';
import chargingReducer from './chargingReducer';

export default configureStore({
  reducer: {
    charge: chargingReducer,
  },
});
