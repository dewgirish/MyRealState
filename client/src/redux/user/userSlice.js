import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentuser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.currentuser = action.payload;
    },
    signInFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateUserInfoStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserInfoSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.currentuser = action.payload;
    },
    updateUserInfoFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.currentuser = null;
    },
    deleteUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    signOutUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signOutUsersuccess: (state) => {
      state.currentuser = null;
      state.loading = false;
    },
    signOutUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFail,
  updateUserInfoStart,
  updateUserInfoSuccess,
  updateUserInfoFail,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFail,
  signOutUserStart,
  signOutUsersuccess,
  signOutUserFail
} = userSlice.actions;

export default userSlice.reducer;
