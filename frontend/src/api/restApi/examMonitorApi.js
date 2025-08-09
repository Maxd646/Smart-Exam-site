import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import baseQury from "./basequery";

export const examMonitorApi = createApi({
  reducerPath: "examMonitorApi", //name of the slice, used in configure store of redux
  baseQuery: fetchBaseQuery({
    baseUrl: baseQury(),
  }),
  tagTypes: ["ExamMonitor", "Exam", "Student"], //used for invalidating the cache
  endpoints: (build) => ({
    // Define your endpoints here
    //real time monitoring of exam
  }),
});
