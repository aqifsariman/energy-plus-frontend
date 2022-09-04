import { createSlice } from '@reduxjs/toolkit';

export const loggedInReducer = createSlice({
  name: 'logger',
  initialState: {
    value: false,
  },
  reducers: {
    loggedIn: (state) => (state = true),
    loggedOut: (state) => (state = false),
  },
});

export const { loggedIn, loggedOut } = loggedInReducer.actions;
export default loggedInReducer.reducer;
