import React, { useRef, useState } from "react";

function Login({ onLogin, forceBiometric = false, oidcUserInfo = null }) {
  const [username, setUsername] = useState(oidcUserInfo?.sub || "");
  const [password, setPassword] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [biometricType, setBiometricType] = useState("face");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(forceBiometric ? 2 : 1); // 1: credentials, 2: biometric
  const [nationalIdPhotoUrl, setNationalIdPhotoUrl] = useState(null);
  const [showMatchResult, setShowMatchResult] = useState(false);
  const [matchSuccess, setMatchSuccess] = useState(null);

  // If OIDC user info changes, update username and step
  React.useEffect(() => {
    if (forceBiometric) {
      setStep(2);
      if (oidcUserInfo && oidcUserInfo.sub) {
        setUsername(oidcUserInfo.sub);
      }
    }
  }, [forceBiometric, oidcUserInfo]);

  // Fetch national ID photo when username is set and step is biometric
  React.useEffect(() => {
    if (step === 2 && username) {
      fetch(
        `http://localhost:8000/authentication/national-id-photo/?username=${encodeURIComponent(
          username
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.photo_url) setNationalIdPhotoUrl(data.photo_url);
          else setNationalIdPhotoUrl(null);
        });
    }
  }, [step, username]);

  // Start webcam and automatically capture biometric
  const startCamera = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      // Wait for video to load, then automatically capture
      videoRef.current.onloadedmetadata = () => {
        setTimeout(() => {
          autoCapture();
        }, 2000); // Wait 2 seconds for camera to stabilize
      };
    } catch (err) {
      setError("Cannot access webcam. Please allow camera permissions.");
    }
  };

  // Automatically capture image from video
  const autoCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(dataUrl);

      // Automatically proceed to login after capture
      setTimeout(() => {
        handleAutoLogin(dataUrl);
      }, 1000);
    }
  };

  // Handle credentials submission
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    if (username && password) {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          "http://localhost:8000/authentication/verify-credentials/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          }
        );
        const data = await res.json();
        if (res.ok && data.verified) {
          setStep(2);
          startCamera();
        } else {
          setError(data.error || "Invalid username or password.");
        }
      } catch (err) {
        setError("Network error. Please check your connection.");
      }
      setLoading(false);
    }
  };

  // Automatic biometric verification after capture
  const handleAutoLogin = async (imageData) => {
    setLoading(true);
    setError("");
    setShowMatchResult(false);
    setMatchSuccess(null);
    try {
      const res = await fetch(
        "http://localhost:8000/authentication/verify-biometric/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            biometric_type: biometricType,
            biometric_data: imageData,
          }),
        }
      );
      const data = await res.json();
      if (res.ok && data.verified) {
        setShowMatchResult(true);
        setMatchSuccess(true);
        // Store user data temporarily
        const userData = { ...data, biometric: biometricType };

        // Start behavioral monitoring for this user
        try {
          const monitoringResponse = await fetch(
            "http://localhost:8000/authentication/start-monitoring/",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username: userData.username }),
            }
          );

          if (monitoringResponse.ok) {
            console.log("✅ Behavioral monitoring started");
          } else {
            console.warn("⚠️ Could not start behavioral monitoring");
          }
        } catch (error) {
          console.warn("⚠️ Behavioral monitoring error:", error);
        }

        // Redirect to Fayda for additional verification
        const faydaUrl = "https://fayda.gov.et/"; // Replace with actual Fayda OIDC endpoint
        const redirectUrl = `${faydaUrl}?client_id=exam_system&redirect_uri=${encodeURIComponent(
          window.location.origin + "/exam"
        )}&state=${encodeURIComponent(JSON.stringify(userData))}`;

        setLoading(false);
        setError("");
        window.location.href = redirectUrl;
      } else {
        setShowMatchResult(true);
        setMatchSuccess(false);
        setError(
          data.error || "Biometric verification failed. Please try again."
        );
        setLoading(false);
      }
    } catch (err) {
      setShowMatchResult(true);
      setMatchSuccess(false);
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  // VeriFayda OIDC login handler
  const handleVeriFaydaLogin = () => {
    window.location.href =
      "http://localhost:8000/authentication/verifayda-login/";
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  };

  const formStyle = {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "15px",
    marginBottom: "20px",
    border: "2px solid #e1e5e9",
    borderRadius: "10px",
    fontSize: "16px",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    padding: "15px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginBottom: "10px",
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    color: "white",
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: "#f8f9fa",
    color: "#495057",
    border: "2px solid #e1e5e9",
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <div style={{ marginBottom: "30px" }}>
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>🔐</div>
          <h2 style={{ color: "#333", marginBottom: "10px" }}>
            {step === 1 ? "Enter Your Credentials" : "Biometric Verification"}
          </h2>
          <p style={{ color: "#666", fontSize: "14px" }}>
            {step === 1
              ? "Please enter your username and password to continue."
              : "Please provide your biometric data for secure authentication."}
          </p>
        </div>

        {step === 1 ? (
          <>
            {/* VeriFayda OIDC Login Button */}
            <button
              type="button"
              onClick={handleVeriFaydaLogin}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "18px",
                background: "linear-gradient(90deg, #667eea 0%, #5a67d8 100%)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(102,126,234,0.12)",
                cursor: "pointer",
                transition: "background 0.2s",
                letterSpacing: "0.5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "22px" }}>🪪</span> Login with VeriFayda
            </button>
            {/* Username/Password Form */}
            <form onSubmit={handleCredentialsSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e1e5e9")}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e1e5e9")}
              />
              <button
                type="submit"
                style={primaryButtonStyle}
                disabled={loading}
              >
                {loading ? "Verifying Credentials..." : "Verify Credentials"}
              </button>
            </form>
          </>
        ) : (
          // Biometric Step
          <div>
            {/* Show national ID photo and live photo side by side */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 32,
                marginBottom: 24,
              }}
            >
              <div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  National ID Photo
                </div>
                {nationalIdPhotoUrl ? (
                  <img
                    src={nationalIdPhotoUrl}
                    alt="National ID"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 12,
                      border: "2px solid #667eea",
                      background: "#fff",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 12,
                      background: "#eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#aaa",
                      fontSize: 14,
                    }}
                  >
                    No Photo
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  Live Photo
                </div>
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Live"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 12,
                      border: "2px solid #ff6b6b",
                      background: "#fff",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 12,
                      background: "#eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#aaa",
                      fontSize: 14,
                    }}
                  >
                    No Photo
                  </div>
                )}
              </div>
            </div>
            {/* Show match result */}
            {showMatchResult && (
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  color: matchSuccess ? "#28a745" : "#dc3545",
                  marginBottom: 16,
                }}
              >
                {matchSuccess ? "✅ Face Match" : "❌ Face Does Not Match"}
              </div>
            )}
            <select
              value={biometricType}
              onChange={(e) => setBiometricType(e.target.value)}
              style={inputStyle}
            >
              <option value="face">Face Recognition</option>
              <option value="iris">Iris Recognition</option>
              <option value="fingerprint">Fingerprint Recognition</option>
            </select>

            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>📷</div>
              <p
                style={{
                  color: "#666",
                  fontSize: "14px",
                  marginBottom: "15px",
                }}
              >
                Camera will start automatically. Please look at the camera.
              </p>
              <button
                type="button"
                onClick={startCamera}
                style={secondaryButtonStyle}
              >
                {loading
                  ? "Processing..."
                  : "Start Automatic Biometric Capture"}
              </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <video
                ref={videoRef}
                autoPlay
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  border: "2px solid #e1e5e9",
                }}
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              {videoRef.current && videoRef.current.srcObject && (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "10px",
                    padding: "10px",
                    background: "#e8f5e8",
                    borderRadius: "5px",
                    color: "#2d5a2d",
                  }}
                >
                  🔍 Automatic capture in progress... Please look at the camera
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                ...secondaryButtonStyle,
                background: "transparent",
                border: "none",
                color: "#667eea",
                textDecoration: "underline",
              }}
            >
              ← Back to Credentials
            </button>
          </div>
        )}

        {error && (
          <div
            style={{
              color: "#dc3545",
              marginTop: "15px",
              padding: "10px",
              background: "#f8d7da",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
