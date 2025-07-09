import { createSlice } from "@reduxjs/toolkit";

const error = createSlice({
  name: "errors",
  initialState: {
    error: {},
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setError } = error.actions;
export default error.reducer;
