import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle credentials submission
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();

    if (!password || !username) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // const res = await fetch(
      //   "http://localhost:8000/authentication/verify-credentials/",
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ username, password }),
      //   }
      // );
      // const data = await res.json();
      // if (res.ok && data.verified) {
      if (true) {
        // setStep(2);
        // startCamera();
        //navigate to login with credentials
        navigate("/login/biometric");
      } else {
        setError(data.error || "Invalid username or password.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div style={{ marginBottom: "30px" }}>
          <div className={styles.icon}>🔐</div>

          <p style={{ color: "#666", fontSize: "14px" }}>
            Please enter your username and password to continue.
          </p>
        </div>
        {/* Username/Password Form */}
        <form onSubmit={handleCredentialsSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#667eea")}
            onBlur={(e) => (e.target.style.borderColor = "#e1e5e9")}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#667eea")}
            onBlur={(e) => (e.target.style.borderColor = "#e1e5e9")}
          />
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={loading}
          >
            {loading ? "Verifying Credentials..." : "Verify Credentials"}
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}

export default Login;
