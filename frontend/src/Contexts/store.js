import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "/src/api/restApi/authApi.js";
import userReducer from "/src/features/auth/authSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer, // registering the authApi reducer
    // [examMonitorApi.reducerPath]: examMonitorApi.reducer, // if needed,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware
      // examMonitorApi.middleware // only if imported
    ),
});
