import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  useGetExamQuestionsQuery,
  useSubmitExamMutation,
} from "../../api/restApi/examApi";

export default function ExamInterface() {
  const username = useSelector(
    (state) => state.auth?.user?.username || "Guest"
  );
  const { data: questions = [], isLoading } = useGetExamQuestionsQuery();
  const [submitExam] = useSubmitExamMutation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 min = 900s
  const timerRef = useRef(null);

  // Countdown timer
  useEffect(() => {
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
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const handleAnswerSelect = (option) => {
    setAnswers({ ...answers, [questions[currentIndex].id]: option });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = async () => {
    const payload = {
      username,
      answers,
    };
    try {
      await submitExam(payload).unwrap();
      alert("✅ Exam submitted successfully!");
    } catch (error) {
      console.error("Submit error:", error);
      alert("❌ Failed to submit exam.");
    }
  };

  if (isLoading)
    return <div className="text-center mt-10">Loading questions...</div>;
  if (questions.length === 0)
    return <div className="text-center mt-10">No questions available.</div>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center relative">
      {/* Timer */}
      <div className="absolute top-6 right-8 text-lg font-semibold text-red-600">
        ⏰ Time Left: {formatTime(timeLeft)}
      </div>

      <h2 className="text-2xl font-bold mb-6">Exam Interface</h2>
      <p className="mb-4 text-gray-700">
        Welcome, <strong>{username}</strong>
      </p>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h3 className="text-lg font-semibold mb-4">
          Question {currentIndex + 1} of {questions.length}
        </h3>
        <p className="mb-4 text-gray-800">{currentQuestion.text}</p>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <label
              key={idx}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option}
                checked={answers[currentQuestion.id] === option}
                onChange={() => handleAnswerSelect(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded ${
              currentIndex === 0 ? "bg-gray-300" : "bg-blue-500 text-white"
            }`}
          >
            Previous
          </button>
          {currentIndex < questions.length - 1 ? (
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
