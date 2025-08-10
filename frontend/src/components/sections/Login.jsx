import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useLoginMutation } from "../../api/restApi/authApi";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [login, result] = useLoginMutation();
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
      console.log("proble");
      const res = await login({ username, password }).unwrap();
      console.log("Login successful:", res);
      console.log("verified:", res.verified);
      if (res.verified == true) {
        console.log("verified");
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
