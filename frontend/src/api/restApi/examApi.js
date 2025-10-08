import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQuery from "./basequery";

export const examApi = createApi({
  reducerPath: "examApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseQuery() }),
  tagTypes: ["Exam"],
  endpoints: (build) => ({
   startExam: build.mutation({
  query: ({ username }) => ({
    url: `/authentication/start_exam_session/${username}/`, // username in URL
    method: "POST",
  }),
}),
    getExamQuestions: build.query({
      query: ({ sessionId, page }) =>
        `/authentication/exam/questions/${sessionId}/?page=${page}`,
    }),
    autoSaveAnswer: build.mutation({
      query: (payload) => ({
        url: "/authentication/AutoSaveAnswer/",
        method: "POST",
        body: payload,
      }),
    }),
    submitExam: build.mutation({
      query: (sessionId) => ({
        url: `/authentication/submit_exam/${sessionId}/`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useStartExamMutation,
  useGetExamQuestionsQuery,
  useAutoSaveAnswerMutation,
  useSubmitExamMutation,
} = examApi;
