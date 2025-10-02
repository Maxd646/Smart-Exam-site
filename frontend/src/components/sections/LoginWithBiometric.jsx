"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginWithBiometric.module.css";
import { useAuth } from "./AuthContext";

import {
  useGetNationalIdQuery,
  useLoginWithBiometricsMutation,
} from "../../api/restApi/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";

export const LoginWithBiometric = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [biometricType, setBiometricType] = useState("face");
  const [loading, setLoading] = useState(false);
  const [nationalIdPhotoUrl, setNationalIdPhotoUrl] = useState(null);
  const [showMatchResult, setShowMatchResult] = useState(false);
  const [matchSuccess, setMatchSuccess] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const { login } = useAuth();
  const canvasRef = useRef(null);
  const isVerifiedWithCredentials = useSelector(
    (state) => state.user.isVerifiedWithCredentials
  );
  const dispatch = useDispatch();

  const username = useSelector((state) => state.user.username);

  //if not verified with credentials, redirect to login
  useEffect(() => {
    //redirect to the login if not isVerifiedWithCredentials
    if (!isVerifiedWithCredentials) {
      navigate("/login");
    }
  }, [isVerifiedWithCredentials]);

  const { data: nationalIdData } = useGetNationalIdQuery(username, {
    skip: !username,
  });

  const [loginWithBiometrics] = useLoginWithBiometricsMutation();

  // Start webcam
  const startCamera = async () => {
    setError("");
    setCameraActive(true);
    setCountdown(3);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        // Start countdown
        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              setTimeout(() => autoCapture(), 500);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      };
    } catch (err) {
      setError("Cannot access webcam. Please allow camera permissions.");
      setCameraActive(false);
    }
  };

  // Capture image automatically
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
      setCameraActive(false);

      // Stop camera stream
      const stream = video.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      setTimeout(() => handleAutoLogin(dataUrl), 1000);
    }
  };

  // Send to backend
  const handleAutoLogin = async (imageData) => {
    setStarted(true);
    if (!username) {
      setError("Username not found. Please login first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const cleanBase64 = imageData.replace("/^data:image/jpeg:base64,/", "");

      const res = await loginWithBiometrics({
        username: username,
        // biometric_type: biometricType,
        biometric_data: cleanBase64,
      }).unwrap();

      console.log("Biometric login response:", res);
      if (!res.success) {
        throw new Error(res.message || "Biometric verification failed.");
      }

      setShowMatchResult(true);
      setMatchSuccess(true);

      // Authenticate user
      login();

      // Dispatch user data to Redux store
      dispatch(
        setCredentials({
          username: username,
          isVerifiedWithBiometrics: true,
        })
      );

      // Navigate to rules page
      setTimeout(() => {
        navigate("/start");
      }, 2000);
    } catch (err) {
      setShowMatchResult(true);
      setMatchSuccess(false);

      if (err?.data?.message) {
        setError(err.data.message);
      } else {
        setError("Biometric verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nationalIdData?.photo_url) {
      setNationalIdPhotoUrl(nationalIdData.photo_url);
    }
  }, [nationalIdData]);

  const getBiometricTypeLabel = (type) => {
    switch (type) {
      case "face":
        return "Face Recognition";
      case "iris":
        return "Iris Recognition";
      case "fingerprint":
        return "Fingerprint Recognition";
      default:
        return "Face Recognition";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Biometric Verification</h1>
          <p className={styles.subtitle}>
            Please verify your identity using{" "}
            {getBiometricTypeLabel(biometricType).toLowerCase()}
          </p>

          {/* Progress Steps */}
          <div className={styles.progressSteps}>
            <div className={`${styles.step} ${styles.stepCompleted}`}>
              <div className={styles.stepIcon}>✓</div>
              Login
            </div>
            <div className={`${styles.step} ${styles.stepActive}`}>
              <div className={styles.stepIcon}>2</div>
              Biometric
            </div>
            <div className={`${styles.step} ${styles.stepPending}`}>
              <div className={styles.stepIcon}>3</div>
              Exam
            </div>
          </div>
        </div>

        {/* Photo Comparison */}
        <div className={styles.photoComparison}>
          <div className={styles.photoSection}>
            <div className={styles.photoLabel}>National ID Photo</div>
            <div className={styles.photoFrame}>
              {nationalIdPhotoUrl ? (
                <img
                  src={nationalIdPhotoUrl || "/placeholder.svg"}
                  alt="National ID"
                  className={styles.photo}
                />
              ) : (
                <div className={styles.noPhoto}>
                  <div className={styles.cameraIcon}>📄</div>
                  Loading ID Photo...
                </div>
              )}
            </div>
          </div>

          <div className={styles.photoSection}>
            <div className={styles.photoLabel}>Live Capture</div>
            <div
              className={`${styles.photoFrame} ${
                cameraActive ? styles.photoFrameActive : ""
              }`}
            >
              {cameraActive ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <video ref={videoRef} autoPlay className={styles.video} />
                  {countdown > 0 && (
                    <div
                      className={`${styles.captureStatus} ${styles.captureStatusActive}`}
                    >
                      Capturing in {countdown}s
                    </div>
                  )}
                  {countdown === 0 && loading && (
                    <div
                      className={`${styles.captureStatus} ${styles.captureStatusActive}`}
                    >
                      Processing...
                    </div>
                  )}
                </div>
              ) : capturedImage ? (
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Live Capture"
                  className={styles.photo}
                />
              ) : (
                <div className={styles.noPhoto}>
                  <div className={styles.cameraIcon}>📷</div>
                  Ready to capture
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Match Result */}
        {showMatchResult && (
          <div
            className={matchSuccess ? styles.matchSuccess : styles.matchFailure}
          >
            {matchSuccess ? (
              <>✅ Face Match Successful</>
            ) : (
              <>❌ Face Does Not Match</>
            )}
          </div>
        )}

        {/* Retry Message */}
        {!loading && error && !matchSuccess && started && (
          <div className={styles.retryMessage}>
            Your face does not match with the national ID photo. Please ensure
            good lighting and try again.
          </div>
        )}

        {/* Biometric Type Selector */}
        <div className={styles.biometricSelector}>
          <label className={styles.selectorLabel}>Verification Method</label>
          <select
            value={biometricType}
            onChange={(e) => setBiometricType(e.target.value)}
            className={styles.select}
            disabled={loading || cameraActive}
          >
            <option value="face">Face Recognition</option>
            <option value="iris">Iris Recognition</option>
            <option value="fingerprint">Fingerprint Recognition</option>
          </select>
        </div>

        {/* Instructions and Camera Button */}
        <div className={styles.instructions}>
          <p className={styles.instructionText}>
            {cameraActive
              ? "Please look directly at the camera. Capture will begin automatically."
              : "Click the button below to start the verification process. Make sure you're in a well-lit area."}
          </p>

          <button
            type="button"
            onClick={startCamera}
            className={styles.cameraButton}
            disabled={loading || cameraActive}
          >
            {loading ? (
              <>
                <div className={styles.loadingSpinner}></div>
                Processing...
              </>
            ) : cameraActive ? (
              <>📹 Camera Active</>
            ) : started ? (
              <>🔄 Retry Verification</>
            ) : (
              <>📷 Start Biometric Capture</>
            )}
          </button>
        </div>

        {/* Hidden video canvas */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Error Message */}
        {error && !showMatchResult && (
          <div className={styles.errorMessage}>{error}</div>
        )}

        {/* Security Note */}
        <div className={styles.securityNote}>
          <p className={styles.securityText}>
            🔒 Your biometric data is encrypted and processed securely. This
            verification ensures exam integrity.
          </p>
        </div>
      </div>
    </div>
  );
};
