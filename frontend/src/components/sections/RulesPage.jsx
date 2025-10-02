import React from "react";
import { useNavigate } from "react-router-dom";
import "./RulesPage.css";

export default function RulesPage() {
  const navigate = useNavigate();

  const handleStartExam = () => {
    navigate("/exam");
  };

  return (
    <div className="rules-container">
      <h1 className="rules-title">📜 Exam Rules & Warnings</h1>

      <div className="rule-section">
        <h2>1. Copy & Paste Restrictions 🚫</h2>
        <p>
          Copying (Ctrl+C), cutting (Ctrl+X), or pasting (Ctrl+V) is strictly
          prohibited during the exam. Attempting these actions will be
          automatically logged and may lead to disqualification.
        </p>
      </div>

      <div className="rule-section">
        <h2>2. Leaving Exam View ⚠️</h2>
        <p>
          You must stay on the exam page at all times. Switching tabs,
          minimizing the window, or leaving the exam view will be detected and
          recorded. Such actions can result in disqualification.
        </p>
      </div>

      <div className="rule-section">
        <h2>3. Cheating 🚨</h2>
        <p>
          Cheating includes any of the following: using another device, asking
          someone for answers, communicating with other people, having more than
          one face visible for authentication, or using unauthorized materials.
          Violations will result in immediate exam termination and file
          deletion.
        </p>
      </div>

      <div className="rules-footer">
        <p className="warning-text">
          ⚠️ Breaking any of these rules will result in immediate exam
          termination.
        </p>
        <button className="start-btn" onClick={handleStartExam}>
          ✅ Start Exam
        </button>
      </div>
    </div>
  );
}
