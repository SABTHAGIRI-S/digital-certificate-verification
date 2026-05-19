import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, LogOut, Menu } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const location         = useLocation();

  const handleLogout = () => { logout(); navigate("/"); };

  const navLinks = user
    ? user.role === "institute"
      ? [{ to: "/dashboard", label: "Dashboard" }, { to: "/issue", label: "Issue Cert" }]
      : user.role === "student"
      ? [{ to: "/dashboard", label: "Dashboard" }, { to: "/my-certificates", label: "My Certs" }]
      : [{ to: "/dashboard", label: "Dashboard" }]
    : [];

  return (
    <nav style={{
      background: "rgba(10,10,15,0.9)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid #2a2a3a",
      position: "sticky", top: 0, zIndex: 100,
      padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", height: 64, gap: 32 }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, color: "#00d4aa", fontFamily: "Syne", fontWeight: 800, fontSize: 20 }}>
          <ShieldCheck size={24} />
          CertChain
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 8, flex: 1 }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding: "6px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              color: location.pathname === l.to ? "#00d4aa" : "#6b6b8a",
              background: location.pathname === l.to ? "rgba(0,212,170,0.1)" : "transparent",
              transition: "all 0.2s",
            }}>{l.label}</Link>
          ))}
          <Link to="/verify" style={{
            padding: "6px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700,
            color: location.pathname === "/verify" ? "#00d4aa" : "#6b6b8a",
            background: location.pathname === "/verify" ? "rgba(0,212,170,0.1)" : "transparent",
          }}>Verify</Link>
        </div>

        {/* Auth */}
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: "#6b6b8a" }}>{user.name}</span>
            <span className="tag">{user.role}</span>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: "8px 16px", fontSize: 13 }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <Link to="/login"    className="btn btn-outline" style={{ padding: "8px 16px", fontSize: 13 }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
