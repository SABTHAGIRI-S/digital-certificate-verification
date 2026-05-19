import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Upload, Search, Lock, Zap, Globe } from "lucide-react";

export default function Landing() {
  const steps = [
    { icon: <Upload size={28} />, title: "Institute Uploads", desc: "Authorized institutes upload the certificate PDF. It's hashed with SHA-256 and stored on IPFS." },
    { icon: <Lock size={28} />,   title: "Stored on Blockchain", desc: "The certificate hash and metadata are recorded immutably on the Polygon blockchain." },
    { icon: <Search size={28} />, title: "Instant Verification", desc: "Anyone uploads a certificate PDF + ID. The system rehashes and checks against the blockchain in seconds." },
  ];

  const features = [
    { icon: <Zap size={20} />,    label: "Instant",    desc: "Verification in < 3 seconds" },
    { icon: <Lock size={20} />,   label: "Tamper-Proof", desc: "Any edit changes the hash" },
    { icon: <Globe size={20} />,  label: "Decentralized", desc: "No single point of failure" },
    { icon: <ShieldCheck size={20} />, label: "Trustless", desc: "No institution needed to verify" },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: "90vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "60px 24px", textAlign: "center",
        background: "radial-gradient(ellipse at 50% 0%, rgba(0,212,170,0.08) 0%, transparent 70%)",
      }}>
        <div className="fade-in" style={{ maxWidth: 700 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,212,170,0.1)", border: "1px solid rgba(0,212,170,0.3)",
            borderRadius: 20, padding: "6px 16px", marginBottom: 28, fontSize: 13,
            color: "#00d4aa", fontWeight: 700, letterSpacing: 1,
          }}>
            <ShieldCheck size={14} /> POWERED BY POLYGON BLOCKCHAIN
          </div>

          <h1 style={{
            fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(40px, 7vw, 72px)",
            lineHeight: 1.05, marginBottom: 24,
            background: "linear-gradient(135deg, #fff 0%, #00d4aa 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Certificates That<br />Cannot Be Faked
          </h1>

          <p style={{ color: "#6b6b8a", fontSize: 18, lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: "0 auto 40px" }}>
            Issue, store, and verify academic credentials on the blockchain. Any tampered certificate is instantly flagged as <span style={{ color: "#ff4757", fontWeight: 700 }}>FAKE</span>.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/verify" className="btn btn-primary" style={{ fontSize: 16, padding: "14px 32px", animation: "glow 3s infinite" }}>
              <Search size={18} /> Verify Certificate
            </Link>
            <Link to="/register" className="btn btn-outline" style={{ fontSize: 16, padding: "14px 32px" }}>
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 36, textAlign: "center", marginBottom: 16 }}>
          How It Works
        </h2>
        <p style={{ color: "#6b6b8a", textAlign: "center", marginBottom: 56 }}>Three steps. Zero fraud.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {steps.map((s, i) => (
            <div key={i} className="card fade-in" style={{ textAlign: "center", animationDelay: `${i * 0.15}s` }}>
              <div style={{
                width: 60, height: 60, borderRadius: 16, background: "rgba(0,212,170,0.1)",
                border: "1px solid rgba(0,212,170,0.3)", display: "flex", alignItems: "center",
                justifyContent: "center", margin: "0 auto 20px", color: "#00d4aa",
              }}>{s.icon}</div>
              <div style={{ fontSize: 12, color: "#00d4aa", fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>STEP {i + 1}</div>
              <h3 style={{ fontFamily: "Syne", fontSize: 20, marginBottom: 12 }}>{s.title}</h3>
              <p style={{ color: "#6b6b8a", lineHeight: 1.7, fontSize: 14 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ padding: "40px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ color: "#00d4aa" }}>{f.icon}</div>
              <div>
                <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15 }}>{f.label}</div>
                <div style={{ color: "#6b6b8a", fontSize: 12 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
