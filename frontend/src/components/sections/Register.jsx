"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../api/restApi/authApi";
import styles from "./Register.module.css";

export default function Register() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    national_id: "",
    national_id_photo: null,
    address: "",
    age: "",
    education_level: "",
    rf_identifier: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [register] = useRegisterMutation();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("username", username); // pre-given by admin
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );

      const res = await register(data).unwrap();
      if (res.success) navigate("/login/biometric");
      else setError(res.error || "Registration failed");
    } catch (err) {
      setError(err.message || "Network error");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Complete Registration</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="national_id"
            placeholder="National ID"
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="national_id_photo"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="education_level"
            placeholder="Education Level"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="rf_identifier"
            placeholder="RF Identifier"
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
