import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RulesPage.css";

export default function RulesPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [agreed, setAgreed] = useState(false);

  const rules = [
    {
      title: "Copy & Paste Restrictions",
      desc: "Copying, cutting, or pasting is prohibited.",
    },
    {
      title: "Leaving Exam View",
      desc: "Do not leave the exam page; switching tabs will be detected.",
    },
    {
      title: "Cheating",
      desc: "Any unauthorized assistance or devices will terminate the exam.",
    },
    {
      title: "Phones & Electronics",
      desc: "All phones, watches, and electronics are forbidden.",
    },
    {
      title: "Multiple Login Prohibition",
      desc: "Only one active session allowed.",
    },
    {
      title: "Background Noise",
      desc: "Maintain a quiet environment to avoid alerts.",
    },
    {
      title: "Identification Verification",
      desc: "Keep your ID visible for verification.",
    },
    {
      title: "Screen Recording",
      desc: "Screenshots or recordings are prohibited.",
    },
    {
      title: "Network Stability",
      desc: "Maintain a stable internet connection.",
    },
    {
      title: "Time Management",
      desc: "Manage your time; exam auto-submits when time ends.",
    },
  ];

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      setAgreed(true);
    }
  };

  const handleStartExam = () => {
    if (agreed) navigate("/exam");
  };

  const handleBack = () => {
    navigate("/orientation");
  };

  return (
    <div className="rules-container">
      <h6 className="rules-title">Exam Rules</h6>

      <div className="scroll-box" ref={scrollRef} onScroll={handleScroll}>
        {rules.map((rule, idx) => (
          <div key={idx} className="rule-item">
            <h2>{rule.title}</h2>
            <p>{rule.desc}</p>
          </div>
        ))}
      </div>

      <div className="rules-footer rules-buttons">
        <button className="back-btn" onClick={handleBack}>
          ⬅️ Back
        </button>
        <button
          className={`start-btn ${agreed ? "active" : "disabled"}`}
          disabled={!agreed}
          onClick={handleStartExam}
        >
          ✅ Agree & Start Exam
        </button>
      </div>
    </div>
  );
}
