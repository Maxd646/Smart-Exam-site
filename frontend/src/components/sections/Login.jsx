"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useLoginMutation } from "../../api/restApi/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [login, result] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      const res = await login({ username, password }).unwrap();
      console.log("Login successful:", res);

      if (res.verified === true) {
        // Dispatch user data to Redux store
        dispatch(
          setCredentials({
            username: res.username,
            isVerifiedWithCredentials: true,
          })
        );

        navigate("/login/biometric");
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>🛡️</div>
            <div className={styles.brandText}>
              <h1 className={styles.brandName}>SmartGuard</h1>
              <p className={styles.brandTagline}>Exam Proctor</p>
            </div>
          </div>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>
            Enter your credentials to continue to your exam
          </p>
        </div>

        <form onSubmit={handleCredentialsSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={styles.input}
                autoComplete="username"
              />
              <span className={styles.inputIcon}>👤</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                autoComplete="current-password"
              />
              <span className={styles.inputIcon}>🔒</span>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading && <span className={styles.loadingSpinner}></span>}
            {loading ? "Verifying Credentials..." : "Continue to Verification"}
          </button>
        </form>

        {error && (
          <div className={styles.error}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        <div className={styles.securityNote}>
          <span className={styles.securityIcon}>🔐</span>
          <p className={styles.securityText}>
            Your login is secured with advanced encryption. After credential
            verification, you'll proceed to biometric authentication for
            enhanced security.
          </p>
        </div>

        <div className={styles.progressSteps}>
          <div className={`${styles.step} ${styles.active}`}></div>
          <div className={styles.step}></div>
          <div className={styles.step}></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
