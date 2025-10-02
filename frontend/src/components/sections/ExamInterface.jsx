import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { initSecurityListeners } from "../../utils/security";

import "./ExamInterface.css";

export default function ExamInterface() {
  const [warning, setWarning] = useState("");
  const warningTimeout = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const { username, nationalId } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const user = { username: username || "Unknown User", nationalId };

  const showWarning = (msg, type) => {
    setWarning(msg);
    if (warningTimeout.current) clearTimeout(warningTimeout.current);
    warningTimeout.current = setTimeout(() => setWarning(""), 4000);
    console.log(
      `[SECURITY ALERT] Type: ${type}, User: ${user.username}, Message: ${msg}`
    );
    // TODO: Send alert via WebSocket
  };

  // Init Security Listeners
  useEffect(() => {
    const removeListeners = initSecurityListeners(showWarning);
    return removeListeners;
  }, []);

  // Example: Randomize questions for extra security
  useEffect(() => {
    const sampleQuestions = [
      "What is the time complexity of binary search?",
      "What does HTTP stand for?",
      "What is React used for?",
      "What is CSS?",
    ];
    setQuestions(sampleQuestions.sort(() => Math.random() - 0.5));
  }, []);

  return (
    <div className="exam-container">
      <div className="exam-box">
        {/* Header */}
        <div className="exam-header">
          <div className="user-info">
            {user.nationalId && <img src={user.nationalId} alt="National ID" />}
            <h1>Welcome, {user.username}!</h1>
          </div>
          <div className="secure-badge">🔒 SECURE MODE</div>
        </div>

        {/* Warning */}
        {warning && <div className="warning-box">⚠️ {warning}</div>}

        {/* Exam Section */}
        <div className="exam-section">
          <div className="instructions">
            <h3>Instructions:</h3>
            <ul>
              <li>This exam contains 50 multiple-choice questions</li>
              <li>You have 120 minutes to complete the exam</li>
              <li>Each question has only one correct answer</li>
              <li>You cannot go back to previous questions</li>
              <li>Your session is monitored for security</li>
            </ul>
          </div>

          {questions.map((q, index) => (
            <div key={index} className="question">
              <h4>{`Q${index + 1}: ${q}`}</h4>
              <div className="options">
                {["Option A", "Option B", "Option C", "Option D"].map(
                  (option, i) => (
                    <label key={i}>
                      <input type="radio" name={`q${index}`} value={option} />
                      {option}
                    </label>
                  )
                )}
              </div>
            </div>
          ))}

          {/* Navigation */}
          <div className="navigation">
            <button className="prev-button" disabled>
              ← Previous
            </button>
            <button className="next-button" onClick={() => setSubmitted(true)}>
              Next →
            </button>
          </div>

          {/* Submitted Message */}
          {submitted && (
            <div className="submitted-message">
              ✅ Thank you for completing the exam!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
