import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginWithBiometric.module.css";
import { useLoginWithBiometricsMutation } from "../../api/restApi/authApi";

export const LoginWithBiometric = () => {
  const [capturedImage, setCapturedImage] = React.useState(null);
  const [biometricType, setBiometricType] = React.useState("face");
  const [loading, setLoading] = React.useState(false);
  const [nationalIdPhotoUrl, setNationalIdPhotoUrl] = useState(null);
  const [showMatchResult, setShowMatchResult] = useState(false);
  const [matchSuccess, setMatchSuccess] = useState(null);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loginWithBiometrics, result] = useLoginWithBiometricsMutation();

  const startCamera = async () => {
    console.log("starting webcam...");
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      console.log("Webcam started successfully");
      // Wait for video to load, then automatically capture
      videoRef.current.onloadedmetadata = () => {
        setTimeout(() => {
          autoCapture();
        }, 2000); // Wait 2 seconds for camera to stabilize
      };
    } catch (err) {
      console.error("Error starting webcam:", err);
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
  // Automatic biometric verification after capture
  const handleAutoLogin = async (imageData) => {
    setLoading(true);
    setError("");
    setShowMatchResult(false);
    setMatchSuccess(null);
    try {
      const res = await loginWithBiometrics({
        username: username,
        biometric_type: biometricType,
        biometric_data: imageData,
      }).unwrap();
      console.log("response:", res);
      if (res.ok) {
        // Simulating successful verification for demo purposes
        setShowMatchResult(true);
        setMatchSuccess(true);
        // Store user data temporarily
        // const userData = { ...data, biometric: biometricType };

        // Start behavioral monitoring for this user
        console.log("success login....");
        try {
          // const monitoringResponse = await fetch(
          //   "http://localhost:8000/authentication/start_behavioral_monitoring/",
          //   {
          //     method: "POST",
          //     headers: { "Content-Type": "application/json" },
          //     body: JSON.stringify({ username: userData.username }),
          //   }
          // );

          // if (monitoringResponse.ok) {
          //   console.log("✅ Behavioral monitoring started");
          // } else {
          //   console.warn("⚠️ Could not start behavioral monitoring");
          // }
          console.log("success login2....");
        } catch (error) {
          console.warn("⚠️ Behavioral monitoring error:", error);
        }

        // Redirect to Fayda for additional verification
        // const faydaUrl = "https://fayda.gov.et/"; // Replace with actual Fayda OIDC endpoint
        // const redirectUrl = `${faydaUrl}?client_id=exam_system&redirect_uri=${encodeURIComponent(
        //   window.location.origin + "/exam"
        // )}&state=${encodeURIComponent(JSON.stringify(userData))}`;

        setLoading(false);
        setError("");
        // window.location.href = redirectUrl;
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

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        {/* Show national ID photo and live photo side by side */}
        <div className={styles.photoContainer}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              National ID Photo
            </div>
            {nationalIdPhotoUrl ? (
              <img
                src={nationalIdPhotoUrl}
                alt="National ID"
                className={styles.video}
              />
            ) : (
              <div className={styles.noPhoto}>No Photo</div>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Live Photo</div>
            {capturedImage ? (
              <img src={capturedImage} alt="Live" className={styles.video} />
            ) : (
              <div className={styles.noPhoto}>No Photo</div>
            )}
          </div>
        </div>
        {/* Show match result */}
        {showMatchResult && (
          <div
            className={matchSuccess ? styles.matchSuccess : styles.matchFailure}
          >
            {matchSuccess ? "✅ Face Match" : "❌ Face Does Not Match"}
          </div>
        )}
        <select
          value={biometricType}
          onChange={(e) => setBiometricType(e.target.value)}
          className={styles.select}
        >
          <option value="face">Face Recognition</option>
          <option value="iris">Iris Recognition</option>
          <option value="fingerprint">Fingerprint Recognition</option>
        </select>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "10px" }}>📷</div>
          <p className={styles.instructions}>
            Camera will start automatically. Please look at the camera.
          </p>
          <button
            type="button"
            onClick={startCamera}
            className={styles.secondaryButtonStyle}
          >
            {loading ? "Processing..." : "Start Automatic Biometric Capture"}
          </button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <video ref={videoRef} autoPlay className={styles.video} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          {videoRef.current && videoRef.current.srcObject && (
            <div className={styles.captureStatus}>
              🔍 Automatic capture in progress... Please look at the camera
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
