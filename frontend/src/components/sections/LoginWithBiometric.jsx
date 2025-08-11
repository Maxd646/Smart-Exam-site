import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginWithBiometric.module.css";
<<<<<<< HEAD
import {
  useGetNationalIdQuery,
  useLoginWithBiometricsMutation,
} from "../../api/restApi/authApi";
=======
import { useGetNationalIdQuery, useLoginWithBiometricsMutation } from "../../api/restApi/authApi";
>>>>>>> 4446e73b0118fb75befe699b53f4db1b3adc2b38
import { useSelector } from "react-redux";

export const LoginWithBiometric = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [biometricType, setBiometricType] = useState("face");
  const [loading, setLoading] = useState(false);
  const [nationalIdPhotoUrl, setNationalIdPhotoUrl] = useState(null);
  const [showMatchResult, setShowMatchResult] = useState(false);
  const [matchSuccess, setMatchSuccess] = useState(null);
  const [error, setError] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
<<<<<<< HEAD

  const username = useSelector((state) => state.user.username);

  // ✅ Only run query if username exists
  const { data: nationalIdData } = useGetNationalIdQuery(username, {
    skip: !username,
  });

  const [loginWithBiometrics] = useLoginWithBiometricsMutation();

  // Start webcam
=======
  const [loginWithBiometrics, result] = useLoginWithBiometricsMutation();
  const username = useSelector((state) => state.user.username);
  const { data: nationalIdData } = useGetNationalIdQuery(username);
>>>>>>> 4446e73b0118fb75befe699b53f4db1b3adc2b38
  const startCamera = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        setTimeout(() => autoCapture(), 2000);
      };
    } catch (err) {
      setError("Cannot access webcam. Please allow camera permissions.");
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
      setTimeout(() => handleAutoLogin(dataUrl), 1000);
    }
  };

  // Send to backend
  const handleAutoLogin = async (imageData) => {
    if (!username) {
      setError("Username not found. Please login first.");
      return;
    }

    setLoading(true);
    setError("");
    setShowMatchResult(false);

    try {
      // ✅ Remove the prefix for backend
      const cleanBase64 = imageData.split(",")[1];

      const res = await loginWithBiometrics({
        username: username,
        biometric_type: biometricType,
        biometric_data: cleanBase64,
      }).unwrap();

      setShowMatchResult(true);
      setMatchSuccess(true);
    } catch (err) {
      setShowMatchResult(true);
      setMatchSuccess(false);

      // ✅ Show backend error if available
      if (err?.data?.message) {
        setError(err.data.message);
      } else {
        setError("Biometric verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    if (nationalIdData?.photo_url) {
      setNationalIdPhotoUrl(nationalIdData.photo_url);
    }
  }, [nationalIdData]);
=======
  useEffect(()=>{
    if(data){
        setNationalIdPhotoUrl(data.photoUrl);
        console.log("National ID photo URL:", data.photoUrl);
      }
  },[data])
>>>>>>> 4446e73b0118fb75befe699b53f4db1b3adc2b38

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        {/* National ID & Live Photo */}
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

        {/* Match Result */}
        {showMatchResult && (
          <div
            className={matchSuccess ? styles.matchSuccess : styles.matchFailure}
          >
            {matchSuccess ? "✅ Face Match" : "❌ Face Does Not Match"}
          </div>
        )}

        {/* Biometric Type */}
        <select
          value={biometricType}
          onChange={(e) => setBiometricType(e.target.value)}
          className={styles.select}
        >
          <option value="face">Face Recognition</option>
          <option value="iris">Iris Recognition</option>
          <option value="fingerprint">Fingerprint Recognition</option>
        </select>

        {/* Start Camera */}
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
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

        {/* Video */}
        <div style={{ marginBottom: "20px" }}>
          <video ref={videoRef} autoPlay className={styles.video} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        {/* Error */}
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
        )}
      </div>
    </div>
  );
};
