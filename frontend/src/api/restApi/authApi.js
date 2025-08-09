import baseQury from "./basequery";

const { createApi, fetchBaseQuery } = require("@reduxjs/toolkit/query/react");

export const authApi = createApi({
  reducerPath: "authApi", //name of the slice, used while configuring in the store
  baseQuery: fetchBaseQuery({
    baseUrl: baseQury(),
  }),
  tagTypes: ["Auth", "User"], //used for invalidating the cache
  endpoints: (build) => ({
    //login endpoint
    login: build.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => {
        console.log("Login response:", response);
        //handle login response
        return response.data;
      },
      transformErrorResponse: (error) => {
        //handle error response
        console.error("Login error:", error);
        return {
          message: error.data.message,
          status: error.status,
        };
      },
      async onQueryStarted() {}, //optional, can be used for optimistic updates
      async onCacheEntryAdded() {}, //optional, can be used to manage cache
    }),
    //login with biometrics
    loginWithBiometrics: build.mutation({
      query: (credentials) => ({
        url: "/auth/login/biometrics",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => {
        console.log("Biometric login response:", response);
        //handle biometric login response
        return response.data;
      },
      transformErrorResponse: (error) => {
        //handle error response
        console.error("Biometric login error:", error);
        return {
          message: error.data.message,
          status: error.status,
        };
      },
      async onQueryStarted() {}, //optional, can be used for optimistic updates
      async onCacheEntryAdded() {}, //optional, can be used to manage cache
    }),
    //logout endpoint
    logout: build.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted() {}, //optional, can be used for optimistic updates
      async onCacheEntryAdded() {}, //optional, can be used to manage cache
    }),
  }),
});

export const {
  useLoginMutation,
  useLoginWithBiometricsMutation,
  useLogoutMutation,
} = authApi;
