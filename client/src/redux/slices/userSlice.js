import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signinSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
    },
  },
});

export const { signinSuccess, signoutSuccess } = userSlice.actions;

export default userSlice.reducer;
