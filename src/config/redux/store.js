import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";

export default store = configureStore({
  reducer: {
    auth: authSlice,
  },
});
