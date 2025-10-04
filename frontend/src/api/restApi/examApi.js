import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQuery from "./basequery";

export const examApi = createApi({
  reducerPath: "examApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseQuery() }),
  tagTypes: ["Exam"],
  endpoints: (build) => ({
    // Get questions for the exam
    getExamQuestions: build.query({
      query: () => "/authentication/exam/questions/",
      transformResponse: (response) => response.questions || [],
      providesTags: ["Exam"],
    }),

    // Submit exam answers
    submitExam: build.mutation({
      query: (payload) => ({
        url: "/authentication/exam/submit/",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useGetExamQuestionsQuery, useSubmitExamMutation } = examApi;
