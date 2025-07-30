# 🛡️ SmartGuard Exam Proctor

## Contributors:

- Daniel Gashaw

## 🚀 Project Status: **COMPLETED & READY FOR DEPLOYMENT**

### 🎯 What's New:
- ✅ **Fayda Integration Complete** - Post-login redirect to Fayda for additional verification
- ✅ **Advanced UI/UX** - Professional landing page and modern exam interface
- ✅ **Multi-Biometric Support** - Face, Iris, and Fingerprint recognition
- ✅ **AI Behavioral Monitoring** - Real-time cheating detection via webcam
- ✅ **Real-time Alerts** - Comprehensive supervisor dashboard
- ✅ **ExamQuestions.jsx Removed** - Clean exam interface without unnecessary components

---

## 🧠 Project Synopsis:

### 🛑 Problem Statement:

Online exams face two major challenges:

1. **Identity Fraud** – Anyone could impersonate a student during online exams.
2. **Cheating Detection** – Participants can use external devices like phones, Bluetooth earbuds, or other wireless tools to cheat during exams.

There is no affordable and intelligent system in Ethiopia that combines identity verification and real-time cheating prevention in remote assessments.

---

### ✅ Implemented Solution:

**SmartGuard Exam Proctor** — an advanced online examination monitoring system that solves these challenges using:

- **Multi-Biometric Authentication** – Face, Iris, and Fingerprint recognition for secure login
- **Fayda Integration** – Post-login redirect to Fayda for additional national ID verification
- **AI Behavioral Monitoring** – Real-time webcam monitoring for suspicious activities
- **Device Detection** – Background scanning for unauthorized wireless devices
- **Real-Time Alerts** – Comprehensive dashboard for supervisors with detailed device and location info
- **Secure Exam Environment** – Prevents tab switching, copy/paste, and unauthorized access

---

### 🎯 Achieved Outcomes:

- ✅ **Professional Landing Page** - Beautiful, modern UI with smooth animations
- ✅ **Two-Step Authentication** - Credentials + Biometric verification
- ✅ **Fayda Integration** - Seamless redirect to national ID system after login
- ✅ **Advanced Exam Interface** - Professional exam environment with real-time monitoring
- ✅ **AI-Powered Monitoring** - Behavioral detection using MediaPipe and OpenCV
- ✅ **Comprehensive Dashboard** - Real-time alerts with device and location tracking
- ✅ **Production Ready** - Complete frontend and backend integration

---

### 🇪🇹 Fayda Integration (Updated):

Fayda integration now works as follows:

1. **User Login** - Username/password + biometric verification
2. **Fayda Redirect** - Automatic redirect to Fayda for additional verification
3. **Callback Handling** - System processes Fayda verification response
4. **Exam Access** - User proceeds to secure exam environment

This ensures:
- **Double Verification** - Both biometric and national ID verification
- **Compliance** - Meets Ethiopian government requirements
- **Security** - Multiple layers of identity verification

---

## 💻 Tech Stack:

### Frontend:
- **React.js** – Modern UI with hooks and functional components
- **CSS-in-JS** – Inline styling for consistent design
- **WebSocket** – Real-time communication with backend
- **WebRTC** – Camera access for biometric capture

### Backend:
- **Django + Django REST Framework** – Robust API backend
- **Django Channels** – WebSocket support for real-time alerts
- **PostgreSQL** – Reliable database storage
- **Face Recognition** – Advanced biometric processing

### AI & Monitoring:
- **OpenCV** – Computer vision for behavioral analysis
- **MediaPipe** – Face mesh, pose, and hand detection
- **YOLOv8** – Object detection for suspicious items
- **NumPy** – Numerical computations

### Security Features:
- **Multi-Factor Authentication** – Username/password + biometric
- **Real-time Monitoring** – Behavioral and device detection
- **Secure Communication** – WebSocket encryption
- **Session Management** – Secure exam sessions

---

## 🛠️ Installation and Deployment

### 1. Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **Docker & Docker Compose** (for containerized deployment)

### 2. Clone the Repository
```bash
git clone <your-repo-url>
cd <your-repo-directory>
```

### 3. Install Dependencies
#### Backend (Django)
```bash
cd backend
pip install -r requirements.txt
```
#### Frontend (React)
```bash
cd ../frontend
npm install
```

### 4. Running the App Locally
#### Start the Backend (Django)
```bash
cd backend
python manage.py migrate  # Run migrations if needed
python manage.py runserver
```
#### Start the Frontend (React)
Open a new terminal:
```bash
cd frontend
npm start
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### 5. Deploying with Docker
#### Build and Run All Services
```bash
docker-compose up --build
```
- This will build both the frontend and backend, and start the database.
- Access the app at http://localhost:8000 (backend) and http://localhost:3000 (frontend, if exposed).

#### Stopping the Services
```bash
docker-compose down
```

### 6. Environment Variables
- You may add a `.env` file in the root directory for custom environment variables (see `docker-compose.yml`).

### 7. Running Tests
```bash
python test_fayda_integration.py
```

---

## 🚀 Quick Start:

### Prerequisites:
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Install Node.js dependencies
cd frontend && npm install
```

### Running the System:
```bash
# Start Django backend
cd backend && python manage.py runserver

# Start React frontend (in new terminal)
cd frontend && npm start

# Run integration tests
python test_fayda_integration.py
```

### Access Points:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Dashboard**: Available via supervisor button

---

## 🧪 Testing:

Run the comprehensive test suite:
```bash
python test_fayda_integration.py
```

This tests:
- ✅ Backend API endpoints
- ✅ Fayda callback integration
- ✅ Behavioral monitoring
- ✅ Alert system functionality

---

## 📊 Features Overview:

| Feature | Status | Description |
|---------|--------|-------------|
| Landing Page | ✅ Complete | Professional UI with animations |
| Multi-Biometric Login | ✅ Complete | Face, Iris, Fingerprint support |
| Fayda Integration | ✅ Complete | Post-login redirect and callback |
| Exam Interface | ✅ Complete | Professional exam environment |
| Behavioral Monitoring | ✅ Complete | AI-powered webcam monitoring |
| Real-time Alerts | ✅ Complete | Comprehensive supervisor dashboard |
| Device Detection | ✅ Complete | RF and network scanning |
| Security Features | ✅ Complete | Tab switching, copy/paste prevention |

---

> 🎉 **Ready for Production Deployment** - This system combines **identity verification**, **AI monitoring**, and **real-time security** to create a trustworthy online examination platform for Ethiopia.
