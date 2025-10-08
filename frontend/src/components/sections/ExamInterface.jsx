import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useStartExamMutation,
  useGetExamQuestionsQuery,
  useAutoSaveAnswerMutation,
  useSubmitExamMutation,
} from "../../api/restApi/examApi";

export default function ExamInterface() {
  const { examId } = useParams();
  const { username, isAuthenticated } = useSelector((state) => state.user);

  const [startExam] = useStartExamMutation();
  const [autoSaveAnswer] = useAutoSaveAnswerMutation();
  const [submitExam] = useSubmitExamMutation();

  const [sessionId, setSessionId] = useState(null);
  const [page, setPage] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [answers, setAnswers] = useState({});
  const timerRef = useRef(null);

  const { data, isLoading, refetch } = useGetExamQuestionsQuery(
    { sessionId, page },
    { skip: !sessionId }
  );

  const questions = data?.questions || [];
  const totalPages = data?.total_pages || 1;

  const handleStartExam = async () => {
    if (!isAuthenticated) {
      alert("❌ You must be logged in to start the exam");
      return;
    }

    try {
      const res = await startExam({ examId, username }).unwrap();
      setSessionId(res.id);
      if (res.end_time) {
        const now = new Date();
        const endTime = new Date(res.end_time);
        setTimeLeft(Math.floor((endTime - now) / 1000));
      }
    } catch (err) {
      console.error("Failed to start exam:", err);
      alert("❌ Failed to start exam");
    }
  };

  useEffect(() => {
    if (!sessionId) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [sessionId]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const handleSelect = async (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
    if (sessionId) {
      try {
        await autoSaveAnswer({
          session: sessionId,
          question: qId,
          selected_option: option,
        });
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    }
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleSubmit = async () => {
    if (!sessionId) return;
    try {
      await submitExam(sessionId);
      alert("✅ Exam submitted successfully!");
      setSessionId(null);
    } catch (err) {
      console.error("Submit failed:", err);
      alert("❌ Failed to submit exam!");
    }
  };

  if (!sessionId)
    return (
      <div className="flex flex-col items-center mt-20">
        <h2 className="text-2xl font-bold mb-4">Start Exam</h2>
        <button
          onClick={handleStartExam}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Start Exam
        </button>
      </div>
    );

  if (isLoading) return <div className="mt-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center relative">
      <div className="absolute top-6 right-8 text-lg font-semibold text-red-600">
        ⏰ Time Left: {formatTime(timeLeft)}
      </div>

      <h2 className="text-2xl font-bold mb-6">Exam Interface</h2>
      <p className="mb-4 text-gray-700">
        Welcome, <strong>{username}</strong>
      </p>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        {questions.map((q, idx) => (
          <div key={q.id} className="mb-6 border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">
              Q{idx + 1}: {q.text}
            </h3>
            {["A", "B", "C", "D"].map((opt, i) => (
              <label key={i} className="block cursor-pointer">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleSelect(q.id, opt)}
                />{" "}
                {q[`option_${opt.toLowerCase()}`]}
              </label>
            ))}
          </div>
        ))}

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`px-4 py-2 rounded ${
              page === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
            }`}
          >
            Previous
          </button>

          {page < totalPages ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
