import React, { useEffect, useState } from "react";
import {
  User,
  Shield,
  Fingerprint,
  CheckCircle,
  Eye,
  Clock,
  Smartphone,
} from "lucide-react";
import styles from "./HeroSection.module.css";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const navigate = useNavigate();
  const handleStart = () => {
    navigate("/login");
  };
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <Shield className={styles.logoIcon} />
          <span className={styles.logoText}>SmartGuard</span>
        </div>
        <div className={styles.badge}>Secure Exam Portal</div>
      </header>

      {/* Hero Section */}
      <main className={styles.main}>
        <div className={styles.maxWidth}>
          <div className={styles.grid}>
            {/* Left Column - Student Instructions */}
            <div className={styles.leftColumn}>
              <div className={styles.titleSection}>
                <h1 className={styles.title}>
                  Welcome to Your{" "}
                  <span className={styles.titleHighlight}>Secure Exam</span>
                </h1>

                <p className={styles.subtitle}>
                  Before you begin, we'll verify your identity to ensure exam
                  integrity. This process takes just a few minutes.
                </p>
              </div>

              {/* Authentication Steps */}
              <div className={styles.stepsSection}>
                <h2 className={styles.stepsTitle}>Authentication Steps:</h2>

                <div className={styles.stepsList}>
                  <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                      <User className={styles.stepIcon} />
                      <div>
                        <div className={styles.stepTitle}>
                          Identity Verification
                        </div>
                        <div className={styles.stepDescription}>
                          Verify your student ID and personal details
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                      <Fingerprint className={styles.stepIcon} />
                      <div>
                        <div className={styles.stepTitle}>
                          Biometric Authentication
                        </div>
                        <div className={styles.stepDescription}>
                          Face recognition and fingerprint scan
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                      <Smartphone className={styles.stepIcon} />
                      <div>
                        <div className={styles.stepTitle}>Device Check</div>
                        <div className={styles.stepDescription}>
                          Ensure your device meets security requirements
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <div className={styles.buttonSection}>
                <button onClick={handleStart} className={styles.startButton}>
                  Start Authentication Process
                </button>

                <p className={styles.buttonNote}>
                  The entire process may takes 3-5 minutes
                </p>
              </div>

              {/* Reassurance */}
              <div className={styles.privacyNote}>
                <div className={styles.privacyContent}>
                  <CheckCircle className={styles.privacyIcon} />
                  <div>
                    <div className={styles.privacyTitle}>
                      Your Privacy is Protected
                    </div>
                    <div className={styles.privacyText}>
                      All biometric data is encrypted and used only for exam
                      verification. Data is automatically deleted after exam
                      completion.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Guide */}
            <div className={styles.rightColumn}>
              <div className={styles.previewCard}>
                {/* Authentication Preview */}
                <div className={styles.previewContent}>
                  <div className={styles.previewHeader}>
                    <h3 className={styles.previewTitle}>
                      Authentication Preview
                    </h3>
                    <p className={styles.previewSubtitle}>
                      Here's what you'll see during verification
                    </p>
                  </div>

                  {/* Mock Authentication Interface */}
                  <div className={styles.mockInterface}>
                    <div
                      className={`${styles.mockStep} ${styles.mockStepVerified}`}
                    >
                      <div className={styles.mockStepContent}>
                        <div
                          className={`${styles.mockStepIcon} ${styles.mockStepIconVerified}`}
                        >
                          <CheckCircle className={styles.mockStepIconSvg} />
                        </div>
                        <div>
                          <div
                            className={`${styles.mockStepTitle} ${styles.mockStepTitleVerified}`}
                          >
                            Identity Verified
                          </div>
                          <div
                            className={`${styles.mockStepDesc} ${styles.mockStepDescVerified}`}
                          >
                            Student ID confirmed
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`${styles.mockStep} ${styles.mockStepActive}`}
                    >
                      <div className={styles.mockStepContent}>
                        <div
                          className={`${styles.mockStepIcon} ${styles.mockStepIconActive}`}
                        >
                          <Eye className={styles.mockStepIconSvg} />
                        </div>
                        <div>
                          <div
                            className={`${styles.mockStepTitle} ${styles.mockStepTitleActive}`}
                          >
                            Face Recognition
                          </div>
                          <div
                            className={`${styles.mockStepDesc} ${styles.mockStepDescActive}`}
                          >
                            Please look at the camera
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`${styles.mockStep} ${styles.mockStepPending}`}
                    >
                      <div className={styles.mockStepContent}>
                        <div
                          className={`${styles.mockStepIcon} ${styles.mockStepIconPending}`}
                        >
                          <Clock className={styles.mockStepIconSvg} />
                        </div>
                        <div>
                          <div
                            className={`${styles.mockStepTitle} ${styles.mockStepTitlePending}`}
                          >
                            Device Check
                          </div>
                          <div
                            className={`${styles.mockStepDesc} ${styles.mockStepDescPending}`}
                          >
                            Scanning environment...
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.securityBadge}>
                    <div className={styles.securityBadgeContent}>
                      <Shield className={styles.securityBadgeIcon} />
                      Secure & Encrypted
                    </div>
                  </div>
                </div>

                {/* Floating Security Badge */}
                <div className={styles.floatingBadge}>
                  <Shield className={styles.floatingBadgeIcon} />
                </div>
              </div>

              {/* Background Accent */}
              <div className={styles.backgroundAccent}></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;
