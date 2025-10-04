import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "/src/api/restApi/authApi.js";
import { examApi } from "/src/api/restApi/examApi";
import userReducer from "/src/features/auth/authSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer, // registering the authApi reducer
    [examApi.reducerPath]:examApi.reducer
    // [examMonitorApi.reducerPath]: examMonitorApi.reducer, // if needed,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      examApi.middleware
      // examMonitorApi.middleware // only if imported
    ),
});
