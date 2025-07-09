import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import errorReducer from "./slices/error.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    error: errorReducer,
  },
});
