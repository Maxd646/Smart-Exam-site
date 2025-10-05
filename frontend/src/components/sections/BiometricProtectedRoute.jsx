import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function BiometricProtectedRoute({ children }) {
  const { isAuthenticated, isBiometricVerified } = useAuth();

  // ❌ If no credential login → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🧭 If credential login done but biometric not verified → go to biometric login
  if (!isBiometricVerified) {
    return <Navigate to="/login/biometric" replace />;
  }
  return children;
}
