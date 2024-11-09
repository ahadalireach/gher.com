import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentAdmin: null,
  error: null,
  loading: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminSigninStart: (state) => {
      state.loading = true;
    },
    adminSigninSuccess: (state, action) => {
      state.currentAdmin = action.payload;
      state.loading = false;
      state.error = null;
    },
    adminSigninFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    adminSignoutStart: (state) => {
      state.loading = true;
    },
    adminSignoutSuccess: (state) => {
      state.currentAdmin = null;
      state.loading = false;
      state.error = null;
    },
    adminSignoutFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateAdminStart: (state) => {
      state.loading = true;
    },
    updateAdminSuccess: (state, action) => {
      state.currentAdmin = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateAdminFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  adminSigninStart,
  adminSigninSuccess,
  adminSigninFailure,
  adminSignoutStart,
  adminSignoutSuccess,
  adminSignoutFailure,
  updateAdminStart,
  updateAdminSuccess,
  updateAdminFailure,
} = adminSlice.actions;

export default adminSlice.reducer;
