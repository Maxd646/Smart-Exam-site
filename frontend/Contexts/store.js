import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../src/api/restApi/authApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer, //registering the authApi reducer
    // [examMonitorApi.reducerPath]: examMonitorApi.reducer, //registering the examMonitorApi reducer
  },
  middleware: (
    getDefaultMiddleware //used for adding custom middleware
  ) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      // examMonitorApi.middleware
    ),
});
