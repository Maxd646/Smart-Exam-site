import baseQury from "./basequery";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
  baseUrl: baseQury(),
  credentials: "include", // ✅ this sends cookies for session auth
}),
  tagTypes: ["Auth", "User"],
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials) => ({
        url: "/authentication/verify_credentials/",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (error) => ({
        message: error.data.message,
        status: error.status,
      }),
    }),
    register: build.mutation({
      query: (formData) => ({
        url: "/authentication/register_with_national_id/",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (error) => ({
        message: error.data?.error || "Registration failed",
        status: error.status,
      }),
    }),
    loginWithBiometrics: build.mutation({
      query: (credentials) => ({
        url: "/authentication/verify_biometric/",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (error) => ({
        message: error.data?.message,
        status: error?.status,
        error: error,
      }),
    }),
    logout: build.mutation({
      query: () => ({ url: "/authentication/logout", method: "POST" }),
    }),
    getNationalId: build.query({
      query: (username) => ({
        url: `/authentication/national_id_photo/${username}/`,
        method: "GET",
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (error) => ({
        message: error.data?.message || "Unknown error",
        status: error.status,
      }),
      providesTags: ["User"],
    }),

    // NEW: Fetch registration guidance uploaded by admin
    getRegistrationGuidance: build.query({
      query: () => ({
        url: "/authentication/RegistrationGuidance/",
        method: "GET",
      }),
      transformResponse: (response) => response, // expect { instructions, video_url }
      transformErrorResponse: (error) => ({
        message: error.data?.error || "Failed to fetch guidance",
        status: error.status,
      }),
      providesTags: ["User"],
    }),
    startExamSession: build.mutation({
            query: (examId) => ({
                url: `/authentication/start_exam_session/${examId}/`,
                method: "POST",
            }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLoginWithBiometricsMutation,
  useLogoutMutation,
  useGetNationalIdQuery,
  useRegisterMutation,
  useGetRegistrationGuidanceQuery,
  useStartExamSessionMutation,
} = authApi;
