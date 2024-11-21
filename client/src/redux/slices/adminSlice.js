import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentAdmin: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminSigninSuccess: (state, action) => {
      state.currentAdmin = action.payload;
    },
    adminSignoutSuccess: (state) => {
      state.currentAdmin = null;
    },
    updateAdminSuccess: (state, action) => {
      state.currentAdmin = action.payload;
    },
  },
});

export const { adminSigninSuccess, adminSignoutSuccess, updateAdminSuccess } =
  adminSlice.actions;

export default adminSlice.reducer;
