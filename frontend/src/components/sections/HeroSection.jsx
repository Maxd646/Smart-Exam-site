import React, { useEffect, useState } from "react";
import styles from "./HeroSection.module.css";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const navigate = useNavigate();
  const handleStart = () => {
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      {/* Animated Bubbles Background */}
      <div className={styles.bubblesBg}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`${styles.bubble} ${styles[`bubble${i + 1}`]}`}
          ></div>
        ))}
      </div>

      {/* Glassmorphism Card */}
      <div className={styles.glassCard}>
        {/* Animated Logo/Icon */}
        <div className={styles.logo}>🛡️</div>
        {/* Main Title */}
        <h1 className={styles.title}>be careful with your exams!</h1>
        {/* Subtitle */}
        <p className={styles.subtitle}>
          Secure, AI-powered online examinations with advanced biometric
          authentication and real-time anti-cheating detection.
        </p>
        {/* Features */}
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.icon}>🔐</div>
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>
              Multi-Biometric
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>
              Face, Iris, Fingerprint
            </div>
          </div>
          <div className={styles.featuress}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🤖</div>
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>
              AI Monitoring
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>
              Real-time Detection
            </div>
          </div>
          <div className={styles.featuresss}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📊</div>
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>
              Live Dashboard
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>
              Supervisor Alerts
            </div>
          </div>
        </div>
        {/* Start Button */}
        <button
          onClick={handleStart}
          className={styles.startButton}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.04)";
            e.target.style.boxShadow = "0 12px 35px rgba(0,0,0,0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)";
          }}
        >
          <span>🚀</span> Start Secure Exam
        </button>
        {/* Footer */}
        <div className={styles.footer}>
          Powered by Advanced AI Technology • Secure & Reliable
        </div>
      </div>
      {/* CSS Animations and Bubbles */}
    </div>
  );
};

export default HeroSection;
