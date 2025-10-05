import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // credential verified
  const [isBiometricVerified, setIsBiometricVerified] = useState(false); // biometric verified

  // Called after credentials (username/password) verified
  const login = () => {
    setIsAuthenticated(true);
  };

  // Called after biometric verification success
  const verifyBiometric = () => {
    setIsBiometricVerified(true);
  };

  // Logout resets both
  const logout = () => {
    setIsAuthenticated(false);
    setIsBiometricVerified(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isBiometricVerified,
        login,
        logout,
        verifyBiometric,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
