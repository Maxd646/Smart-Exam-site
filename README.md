# Project Title: SmartGuard Exam Proctor

## Contributors:

- Daniel Gashaw

## 🧠 Project Synopsis:

### 🛑 Problem Statement:

Online exams face two major challenges:

1. **Identity Fraud** – Anyone could impersonate a student during online exams.
2. **Cheating Detection** – Participants can use external devices like phones, Bluetooth earbuds, or other wireless tools to cheat during exams.

There is no affordable and intelligent system in Ethiopia that combines identity verification and real-time cheating prevention in remote assessments.

---

### ✅ Planned Solution:

We propose **SmartGuard Exam Proctor** — an advanced yet practical online examination monitoring system that solves these challenges using:

- **Fayda (National ID) Integration** – Ensures verified identity during registration and login.
- **Face Recognition Login** – Matches user's face with their National ID photo.
- **Wireless Device Scanner** – Uses background scanning of WiFi, Bluetooth, and hotspot signals to detect suspicious nearby devices.
- **Real-Time Alerts** – Notifies mentors if cheating is suspected (e.g., if multiple devices are detected around a candidate).
- **Secure Lockdown Environment** – Prevents users from switching tabs or running unauthorized applications during the exam.

---

### 🎯 Expected Outcome:

- A fully functional demo that proves identity is linked with Fayda.
- A face-authenticated login system that guarantees the examinee is genuine.
- A background scanning agent (PC or Raspberry Pi) to catch and report unauthorized devices.
- A secure dashboard for mentors to view student activity and cheating alerts.
- Increased trust in online exams — suitable for universities, national exams, and job assessments.

---

### 🇪🇹 Fayda’s Role (National ID Integration):

Fayda is the **backbone of identity verification** in this project:

- During registration, users must input their **National ID number**.
- The system sends a request to Fayda's API to retrieve and verify **basic identity information and facial photo**.
- During login, the user undergoes **live face recognition**, matched with the official photo from Fayda.

Fayda ensures:

- Only **genuine, verified citizens** can register.
- No impersonation during exams.
- Seamless integration into Ethiopia’s growing national ID system.

---

## 💻 Tech Stack:

### Frontend:

- **React.js** – UI for login, exam panel, and mentor dashboard.
- **Material-UI (MUI)** – For clean and responsive design.
- **Framer Motion** – Smooth animations for components.

### Backend:

- **Django + Django REST Framework** – API backend with secure routing.
- **Fayda Integration** – Simulated or real API integration to validate national ID.
- **Face Recognition Library** – Python-based OpenCV + Dlib for login.
- **Socket.IO (Django Channels)** – For real-time alerts.

### Cheating Detection Agent:

- **Python** – Runs on exam computer (or nearby Raspberry Pi).
- **Scapy / PyBluez** – For scanning nearby WiFi, Bluetooth, Hotspot devices.
- **WebSocket Client** – Sends detected signals to backend.

### Deployment:

- **Docker** – For consistent environment setup.
- **Vercel** – Frontend hosting.
- **Render / Railway** – Backend and database hosting.

---

> This solution combines **identity**, **AI**, and **security** — creating an innovative and local-first approach for trustworthy online exams.
