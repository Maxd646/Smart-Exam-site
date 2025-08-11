import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/restApi/authApi";
import userReducer from "../features/auth/authSlice"
export const store = configureStore({
  reducer: {
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer, //registering the authApi reducer
    // // [examMonitorApi.reducerPath]: examMonitorApi.reducer, //registering the examMonitorApi reducer
  },
  middleware: (
    getDefaultMiddleware //used for adding custom middleware
  ) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      // examMonitorApi.middleware
    ),
});
