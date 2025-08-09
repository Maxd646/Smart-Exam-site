import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroSection from "./components/sections/HeroSection";
import Login from "./components/sections/Login";
import AdminDashboard from "./components/sections/admin";
import { LoginWithBiometric } from "./components/sections/LoginWithBiometric";
import ExamInterface from "./components/sections/ExamInterface";
import { NotFound } from "./components/sections/notFound";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/biometric" element={<LoginWithBiometric />} />
        <Route path="/exam" element={<ExamInterface />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
