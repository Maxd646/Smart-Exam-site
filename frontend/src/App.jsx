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
import Register from "./components/sections/Register";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HeroSection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/:username" element={<Register />} />
          <Route path="/login/biometric" element={<LoginWithBiometric />} />

          {/* Protected Routes */}
          <Route
            path="/start"
            element={
              <ProtectedRoute>
                <RulesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam"
            element={
              <ProtectedRoute>
                <ExamInterface />
              </ProtectedRoute>
            }
          />

          {/* Admin & Not Found */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
