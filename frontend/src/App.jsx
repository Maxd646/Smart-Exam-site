import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroSection from "./components/sections/HeroSection";
import Login from "./components/sections/Login";
import AdminDashboard from "./components/sections/admin";
import { LoginWithBiometric } from "./components/sections/LoginWithBiometric";
import ExamInterface from "./components/sections/ExamInterface";
import { NotFound } from "./components/sections/notFound";
import RulesPage from "./components/sections/RulesPage";
import { AuthProvider } from "./components/sections/AuthContext";
import ProtectedRoute from "./components/sections/ProtectedRoute";
import BiometricProtectedRoute from "./components/sections/BiometricProtectedRoute";
import Register from "./components/sections/Register";
import OrientationPage from "./components/sections/OrientationPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HeroSection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/start" element={<RulesPage />} />
          <Route path="/exam/" element={<ExamInterface />} />
          <Route path="/orientation" element={<OrientationPage />} />
          <Route path="/login/biometric" element={<LoginWithBiometric />} />

          {/* Only login required */}
          <Route
            path="/register/:username"
            element={
              <ProtectedRoute>
                <Register />
              </ProtectedRoute>
            }
          />

          {/* Both login + biometric required */}
          {/* <Route
            path="/start"
            element={
              <BiometricProtectedRoute>
                <RulesPage />
              </BiometricProtectedRoute>
            }
          />
          <Route
            path="/exam"
            element={
              <BiometricProtectedRoute>
                <ExamInterface />
              </BiometricProtectedRoute>
            }
          /> */}

          {/* Admin & Not Found */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
