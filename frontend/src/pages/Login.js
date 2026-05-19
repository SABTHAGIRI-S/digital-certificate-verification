import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="card fade-in" style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <ShieldCheck size={40} color="#00d4aa" style={{ marginBottom: 12 }} />
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 28 }}>Sign In</h2>
          <p style={{ color: "#6b6b8a", fontSize: 14, marginTop: 8 }}>Access your CertChain account</p>
        </div>

        <div className="form-group">
          <label className="label">Email</label>
          <input type="email" placeholder="you@example.com"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>

        <div className="form-group">
          <label className="label">Password</label>
          <div style={{ position: "relative" }}>
            <input type={show ? "text" : "password"} placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{ paddingRight: 44 }} />
            <button onClick={() => setShow(!show)} style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "#6b6b8a", cursor: "pointer",
            }}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p style={{ textAlign: "center", marginTop: 24, color: "#6b6b8a", fontSize: 14 }}>
          No account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
