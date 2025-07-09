import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") ?? null,
    user: null,
    isLoading: false,
  },
  reducers: {
    login: (state, action) => {
      state.token = localStorage.getItem("token");
      state.user = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

export const { login, setUser, logout, startLoading, stopLoading } =
  authSlice.actions;
export default authSlice.reducer;
