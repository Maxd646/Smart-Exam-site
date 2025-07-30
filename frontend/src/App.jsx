import React, { useState, useEffect, useRef } from "react";
import LandingPage from "./LandingPage.jsx";
import Login from "./Login.jsx";
import { connectAlertSocket, sendAlert } from "./alertUtils.js";
import AdminDashboard from "./AdminDashboard.jsx";

// Exam interface logic (with anti-cheating features)
function ExamInterface({ user }) {
  const [warning, setWarning] = useState("");
  const warningTimeout = useRef(null);
  const socketRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    socketRef.current = connectAlertSocket(user.username);
  }, [user.username]);

  const showWarning = (msg, type) => {
    setWarning(msg);
    if (warningTimeout.current) clearTimeout(warningTimeout.current);
    warningTimeout.current = setTimeout(() => setWarning(""), 4000);
    sendAlert(type, msg, user.username);
  };

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        showWarning(
          "Tab switching detected! This is not allowed.",
          "tab_switch"
        );
      }
    };
    const handleBlur = () => {
      showWarning("Window focus lost! This is not allowed.", "window_blur");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {
    const handleCopy = (e) => {
      showWarning("Copying is not allowed!", "copy");
      e.preventDefault();
    };
    const handlePaste = (e) => {
      showWarning("Pasting is not allowed!", "paste");
      e.preventDefault();
    };
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "white",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            paddingBottom: "20px",
            borderBottom: "2px solid #f0f0f0",
          }}
        >
          <div>
            <h1 style={{ color: "#333", margin: "0 0 5px 0" }}>
              Welcome, {user.username}!
            </h1>
            <p style={{ color: "#666", margin: "0" }}>
              Exam in Progress • Biometric: {user.biometric || "Face"} • Fayda
              Verified: ✅ • AI Monitoring: 🔍
            </p>
          </div>
          <div
            style={{
              background: "#28a745",
              color: "white",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            🔒 SECURE MODE
          </div>
        </div>

        {warning && (
          <div
            style={{
              background: "#f8d7da",
              color: "#721c24",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "20px",
              border: "1px solid #f5c6cb",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            ⚠️ {warning}
          </div>
        )}

        <div style={{ marginTop: "24px" }}>
          {/* Exam Interface */}
          <div style={{ marginBottom: "30px" }}>
            <h2
              style={{
                color: "#333",
                marginBottom: "20px",
                borderBottom: "2px solid #f0f0f0",
                paddingBottom: "10px",
              }}
            >
              📝 Final Examination - Computer Science
            </h2>

            <div
              style={{
                background: "#f8f9fa",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "20px",
                border: "1px solid #e9ecef",
              }}
            >
              <h3 style={{ color: "#495057", marginBottom: "15px" }}>
                Instructions:
              </h3>
              <ul
                style={{
                  color: "#6c757d",
                  lineHeight: "1.6",
                  margin: "0",
                  paddingLeft: "20px",
                }}
              >
                <li>This exam contains 50 multiple-choice questions</li>
                <li>You have 120 minutes to complete the exam</li>
                <li>Each question has only one correct answer</li>
                <li>You cannot go back to previous questions</li>
                <li>Your session is being monitored for security</li>
              </ul>
            </div>

            <div
              style={{
                background: "#e7f3ff",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "20px",
                border: "1px solid #b3d9ff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: "bold", color: "#0056b3" }}>
                  Question 1 of 50
                </span>
                <span style={{ color: "#0056b3" }}>
                  ⏱️ Time Remaining: 1:58:45
                </span>
              </div>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <h4 style={{ color: "#333", marginBottom: "15px" }}>
                What is the time complexity of binary search?
              </h4>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {["O(1)", "O(log n)", "O(n)", "O(n²)"].map((option, index) => (
                  <label
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 15px",
                      border: "2px solid #e9ecef",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      background: "white",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.borderColor = "#667eea")
                    }
                    onMouseOut={(e) => (e.target.style.borderColor = "#e9ecef")}
                  >
                    <input
                      type="radio"
                      name="question1"
                      value={option}
                      style={{ marginRight: "10px", transform: "scale(1.2)" }}
                    />
                    <span style={{ color: "#495057", fontWeight: "500" }}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                style={{
                  padding: "12px 24px",
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  opacity: "0.5",
                }}
                disabled
              >
                ← Previous
              </button>

              <button
                onClick={() => setSubmitted(true)}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.target.style.transform = "translateY(-1px)")
                }
                onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
              >
                Next →
              </button>
            </div>
          </div>

          {submitted && (
            <div
              style={{
                background: "#d4edda",
                color: "#155724",
                padding: "15px",
                borderRadius: "10px",
                marginTop: "20px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              ✅ Thank you for completing the exam!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [needsBiometric, setNeedsBiometric] = useState(false);
  const [oidcUserInfo, setOidcUserInfo] = useState(null);

  const handleStart = () => {
    setShowLanding(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLanding(false);
    setNeedsBiometric(false);
    setOidcUserInfo(null);
  };

  // Handle VeriFayda OIDC callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      // Call backend to exchange code for user info
      fetch(
        `http://localhost:8000/authentication/verifayda-callback/?code=${code}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.step === "verifayda_authenticated") {
            setOidcUserInfo(data.userinfo);
            setNeedsBiometric(true);
            setShowLanding(false);
            // Clean up URL
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          }
        });
    }
  }, []);

  if (showLanding) {
    return <LandingPage onStart={handleStart} />;
  }

  if (showAdmin) {
    return (
      <div>
        <button
          onClick={() => setShowAdmin(false)}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            padding: "10px 20px",
            background: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          ← Back to Exam
        </button>
        <AdminDashboard />
      </div>
    );
  }

  // If OIDC login, show biometric step in Login
  if (needsBiometric) {
    return (
      <Login
        onLogin={handleLogin}
        oidcUserInfo={oidcUserInfo}
        forceBiometric={true}
      />
    );
  }

  if (!user || !user.verified) {
    return (
      <div>
        <button
          onClick={() => setShowLanding(true)}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            padding: "10px 20px",
            background: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          ← Back to Home
        </button>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setShowAdmin(true)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          background: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1000,
          fontWeight: "bold",
        }}
      >
        👨‍💼 Supervisor Dashboard
      </button>
      <ExamInterface user={user} />
    </div>
  );
}

export default App;
