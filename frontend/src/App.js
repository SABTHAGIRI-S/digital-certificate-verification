import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar         from "./components/Navbar";
import Landing        from "./pages/Landing";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import Dashboard      from "./pages/Dashboard";
import IssueCert      from "./pages/IssueCert";
import MyCertificates from "./pages/MyCertificates";
import VerifyPage     from "./pages/VerifyPage";
import CertDetail     from "./pages/CertDetail";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading" style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  if (!user)   return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/"         element={<Landing />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify"   element={<VerifyPage />} />

      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/issue" element={
        <ProtectedRoute roles={["institute"]}><IssueCert /></ProtectedRoute>
      } />
      <Route path="/my-certificates" element={
        <ProtectedRoute roles={["student"]}><MyCertificates /></ProtectedRoute>
      } />
      <Route path="/certificate/:certId" element={
        <ProtectedRoute><CertDetail /></ProtectedRoute>
      } />
    </Routes>
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background: "#111118", color: "#e8e8f0", border: "1px solid #2a2a3a" }
        }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
