"use client";

import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../api/restApi/authApi";
import Webcam from "react-webcam";

import {
  FaLock,
  FaUser,
  FaIdCard,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaWifi,
} from "react-icons/fa";
import styles from "./Register.module.css";

export default function Register() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [register] = useRegisterMutation();

  const webcamRef = useRef(null);
  const [useCamera, setUseCamera] = useState(false);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: "",
    national_id: "",
    national_id_photo: null, // File or captured image
    address: "",
    age: "",
    education_level: "",
    rf_identifier: "",
    // face_encoding, extracted_face_photo, iris_encoding, fingerprint_encoding can be added later
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const capturePhoto = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "national_id_photo.jpg", {
          type: "image/jpeg",
        });
        setFormData((prev) => ({ ...prev, national_id_photo: file }));
        alert("✅ Photo captured successfully!");
      });
  };

  // Validate current step before moving
  const isStepValid = () => {
    if (step === 1) {
      return (
        formData.full_name.trim() !== "" &&
        formData.national_id.trim() !== "" &&
        formData.national_id_photo !== null
      );
    }
    if (step === 2) {
      return (
        formData.address.trim() !== "" &&
        formData.age !== "" &&
        formData.education_level.trim() !== "" &&
        formData.rf_identifier.trim() !== ""
      );
    }
    return true;
  };

  const nextStep = () => {
    if (!isStepValid()) {
      alert("⚠️ Please fill all required fields before proceeding.");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStepValid()) {
      alert("⚠️ Please complete all fields before submitting.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("username", username);
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );

      const res = await register(data).unwrap();
      if (res.success) navigate("/login");
      else setError(res.error || "Username does not exist. Contact admin.");
    } catch (err) {
      setError(err.message || "Network error");
    }

    setLoading(false);
  };

  return (
    <div className={styles.fullPage}>
      {/* Top Instructions */}
      <div className={styles.topSection}>
        <h2>Secure Exam Registration</h2>
        <p>🔒 Please fill in all fields carefully. Your data is encrypted.</p>
        <ul>
          <li>Use your legal full name.</li>
          <li>National ID must match your document.</li>
          <li>Upload a clear National ID photo (or use live camera).</li>
          <li>Provide accurate address and age.</li>
          <li>RF Identifier must match your exam assignment.</li>
        </ul>
      </div>

      {/* Form Section */}
      <div className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.formCard}>
          {step === 1 && (
            <>
              <h3>Step 1: Personal Information</h3>

              <div className={styles.inputWrapper}>
                <FaUser className={styles.inputIcon} />
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputWrapper}>
                <FaIdCard className={styles.inputIcon} />
                <input
                  type="text"
                  name="national_id"
                  placeholder="National ID"
                  value={formData.national_id}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputWrapper}>
                <label>
                  <input
                    type="checkbox"
                    checked={useCamera}
                    onChange={() => setUseCamera((prev) => !prev)}
                  />{" "}
                  Use Camera
                </label>

                {useCamera ? (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width={300}
                      height={200}
                    />
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className={styles.captureButton}
                    >
                      Capture Photo
                    </button>
                  </>
                ) : (
                  <input
                    type="file"
                    name="national_id_photo"
                    onChange={handleChange}
                    accept="image/*"
                    required
                    className={styles.inputFile}
                  />
                )}
              </div>

              <button
                type="button"
                onClick={nextStep}
                className={styles.nextButton}
              >
                Next ➜
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h3>Step 2: Additional Details</h3>

              <div className={styles.inputWrapper}>
                <FaMapMarkerAlt className={styles.inputIcon} />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputWrapper}>
                <FaLock className={styles.inputIcon} />
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputWrapper}>
                <FaGraduationCap className={styles.inputIcon} />
                <input
                  type="text"
                  name="education_level"
                  placeholder="Education Level"
                  value={formData.education_level}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputWrapper}>
                <FaWifi className={styles.inputIcon} />
                <input
                  type="text"
                  name="rf_identifier"
                  placeholder="RF Identifier"
                  value={formData.rf_identifier}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.navButtons}>
                <button
                  type="button"
                  onClick={prevStep}
                  className={styles.backButton}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className={styles.nextButton}
                >
                  Next ➜
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3>Step 3: Review & Submit</h3>
              <div className={styles.reviewBox}>
                {Object.entries(formData).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key.replaceAll("_", " ")}:</strong>{" "}
                    {value?.name ? value.name : value || "—"}
                  </p>
                ))}
              </div>

              <div className={styles.navButtons}>
                <button
                  type="button"
                  onClick={prevStep}
                  className={styles.backButton}
                >
                  ← Edit
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Confirm & Submit"}
                </button>
              </div>
            </>
          )}
        </form>

        {error && <p className={styles.error}>{error}</p>}
      </div>

      {/* Bottom Section */}
      <div className={styles.bottomSection}>
        <p>💡 Need help? Watch this live tutorial while filling your form.</p>
        <div className={styles.liveVideoPlaceholder}>
          <p>Live Video Stream</p>
        </div>
      </div>
    </div>
  );
}
