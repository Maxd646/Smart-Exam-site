import baseQury from "./basequery";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
        url: "/authentication/verify_credentials/",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => {
        console.log("Login response:", response);
        //handle login response
        return response;
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
        url: "/authentication/verify_biometric/",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => {
        console.log("Biometric login response:", response);
        //handle biometric login response
        return response;
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
        url: "/authentication/logout",
        method: "POST",
      }),
      async onQueryStarted() {}, //optional, can be used for optimistic updates
      async onCacheEntryAdded() {}, //optional, can be used to manage cache
    }),
<<<<<<< HEAD

    getNationalId: build.query({
     query: (username) => ({
    url: `/authentication/national_id_photo/${username}/`,
    method: "GET",
     }),
    transformResponse: (response) => {
    // handle response here if needed
    return response;
  },
  transformErrorResponse: (error) => {
    console.error("Get National ID error:", error);
    return {
      message: error.data?.message || 'Unknown error',
      status: error.status,
    };
  },          
    async onQueryStarted() {}, //optional, can be used for optimistic updates
    async onCacheEntryAdded() {}, //optional, can be used to manage cache
    providesTags: ["User"], //tags for cache invalidation
  }),
  }),
=======
    getNationalId: build.query({
        query: (username) => ({
          url: `/get_national_id/${username}/`,
          method:"GET",
        }),
        transformResponse: (response) => {
          //handle response
          return response;
        },
        transformErrorResponse: (error) => {
          //handle error response
          console.error("Get National ID error:", error);
          return {
            message: error.data.message,
            status: error.status,
          };
        },

    })
  }), 
>>>>>>> 4446e73b0118fb75befe699b53f4db1b3adc2b38
});

export const {
  useLoginMutation,
  useLoginWithBiometricsMutation,
  useLogoutMutation,
  useGetNationalIdQuery
} = authApi;
