import React, { useEffect, useState } from "react";
import styles from "./HeroSection.module.css";
import LandingPage from "../../LandingPage";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const [needsBiometric, setNeedsBiometric] = useState(false);
  const [oidcUserInfo, setOidcUserInfo] = useState(null);
  const navigate = useNavigate();
  const handleStart = () => {
    navigate("/login");
  };

  // Handle VeriFayda OIDC callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      // Call backend to exchange code for user info
      fetch(
        `http://localhost:8000/authentication/verifayda-callback/?code=${code}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.step === "verifayda_authenticated") {
            setOidcUserInfo(data.userinfo);
            setNeedsBiometric(true);
            setShowLanding(false);
            // Clean up URL
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          }
        });
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "Arial, sans-serif",
        color: "white",
        textAlign: "center",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Animated Bubbles Background */}
      <div className="bubbles-bg">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`bubble bubble${i + 1}`}></div>
        ))}
      </div>

      {/* Glassmorphism Card */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          background: "rgba(255,255,255,0.10)",
          boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderRadius: "32px",
          padding: "48px 36px 36px 36px",
          maxWidth: 540,
          width: "100%",
          margin: "auto",
          border: "1.5px solid rgba(255,255,255,0.18)",
        }}
      >
        {/* Animated Logo/Icon */}
        <div
          style={{
            fontSize: "72px",
            marginBottom: "20px",
            animation: "logoPop 1.2s cubic-bezier(.68,-0.55,.27,1.55)",
          }}
        >
          🛡️
        </div>
        {/* Main Title */}
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            marginBottom: "16px",
            textShadow: "2px 2px 8px rgba(0,0,0,0.18)",
            animation: "fadeInUp 1s ease-out 0.2s both",
          }}
        >
          be careful with your exams!
        </h1>
        {/* Subtitle */}
        <p
          style={{
            fontSize: "20px",
            marginBottom: "32px",
            opacity: 0.92,
            maxWidth: "600px",
            lineHeight: "1.6",
            animation: "fadeInUp 1s ease-out 0.4s both",
          }}
        >
          Secure, AI-powered online examinations with advanced biometric
          authentication and real-time anti-cheating detection.
        </p>
        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: "30px",
            marginBottom: "40px",
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeInUp 1s ease-out 0.6s both",
          }}
        >
          <div
            style={{
              textAlign: "center",
              transition: "transform 0.2s",
              animation: "featurePop 1.2s 0.2s both",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔐</div>
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>
              Multi-Biometric
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>
              Face, Iris, Fingerprint
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              transition: "transform 0.2s",
              animation: "featurePop 1.2s 0.4s both",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🤖</div>
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>
              AI Monitoring
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>
              Real-time Detection
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              transition: "transform 0.2s",
              animation: "featurePop 1.2s 0.6s both",
            }}
          >
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
          style={{
            padding: "18px 54px",
            fontSize: "22px",
            fontWeight: "bold",
            borderRadius: "50px",
            border: "none",
            background: "linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%)",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
            transition: "all 0.3s cubic-bezier(.68,-0.55,.27,1.55)",
            animation: "pulse 1.5s infinite",
            textTransform: "uppercase",
            letterSpacing: "1.2px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "0 auto",
          }}
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
        <div
          style={{
            position: "relative",
            marginTop: "40px",
            fontSize: "13px",
            opacity: 0.8,
            animation: "fadeIn 1s ease-out 1s both",
          }}
        >
          Powered by Advanced AI Technology • Secure & Reliable
        </div>
      </div>
      {/* CSS Animations and Bubbles */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes logoPop {
          0% { transform: scale(0.7) rotate(-10deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(8deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); }
        }
        @keyframes featurePop {
          0% { transform: scale(0.7) translateY(30px); opacity: 0; }
          60% { transform: scale(1.1) translateY(-8px); opacity: 1; }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255,107,107,0.4); }
          70% { box-shadow: 0 0 0 12px rgba(255,107,107,0.0); }
          100% { box-shadow: 0 0 0 0 rgba(255,107,107,0.0); }
        }
        .bubbles-bg {
          position: absolute;
          top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0;
          overflow: hidden;
        }
        .bubble {
          position: absolute;
          border-radius: 50%;
          opacity: 0.18;
          background: linear-gradient(135deg, #fff 0%, #667eea 100%);
          animation: bubbleFloat 12s infinite ease-in-out;
        }
        .bubble1 { width: 120px; height: 120px; left: 8vw; top: 10vh; animation-delay: 0s; }
        .bubble2 { width: 80px; height: 80px; left: 70vw; top: 18vh; animation-delay: 2s; }
        .bubble3 { width: 100px; height: 100px; left: 50vw; top: 70vh; animation-delay: 4s; }
        .bubble4 { width: 60px; height: 60px; left: 20vw; top: 80vh; animation-delay: 1s; }
        .bubble5 { width: 90px; height: 90px; left: 80vw; top: 60vh; animation-delay: 3s; }
        .bubble6 { width: 70px; height: 70px; left: 40vw; top: 30vh; animation-delay: 5s; }
        .bubble7 { width: 110px; height: 110px; left: 60vw; top: 50vh; animation-delay: 6s; }
        .bubble8 { width: 50px; height: 50px; left: 30vw; top: 60vh; animation-delay: 7s; }
        .bubble9 { width: 100px; height: 100px; left: 75vw; top: 80vh; animation-delay: 8s; }
        .bubble10 { width: 60px; height: 60px; left: 15vw; top: 40vh; animation-delay: 9s; }
        .bubble11 { width: 80px; height: 80px; left: 55vw; top: 15vh; animation-delay: 10s; }
        .bubble12 { width: 90px; height: 90px; left: 85vw; top: 35vh; animation-delay: 11s; }
        @keyframes bubbleFloat {
          0% { transform: translateY(0) scale(1); opacity: 0.18; }
          50% { transform: translateY(-40px) scale(1.08); opacity: 0.28; }
          100% { transform: translateY(0) scale(1); opacity: 0.18; }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
