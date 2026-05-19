import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate      = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", instituteName: "" });
  const [loading, setLoading] = useState(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password)
      return toast.error("Please fill all fields");
    if (form.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="card fade-in" style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <ShieldCheck size={40} color="#00d4aa" style={{ marginBottom: 12 }} />
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 28 }}>Create Account</h2>
          <p style={{ color: "#6b6b8a", fontSize: 14, marginTop: 8 }}>Join the blockchain verification network</p>
        </div>

        <div className="form-group">
          <label className="label">Role</label>
          <select value={form.role} onChange={e => upd("role", e.target.value)}>
            <option value="student">Student</option>
            <option value="institute">Institute / University</option>
            <option value="employer">Employer / Verifier</option>
          </select>
        </div>

        {form.role === "institute" && (
          <div className="form-group">
            <label className="label">Institution Name</label>
            <input placeholder="MIT, IIT Delhi, etc." value={form.instituteName}
              onChange={e => upd("instituteName", e.target.value)} />
          </div>
        )}

        <div className="form-group">
          <label className="label">Full Name</label>
          <input placeholder="Your name" value={form.name} onChange={e => upd("name", e.target.value)} />
        </div>

        <div className="form-group">
          <label className="label">Email</label>
          <input type="email" placeholder="you@example.com" value={form.email} onChange={e => upd("email", e.target.value)} />
        </div>

        <div className="form-group">
          <label className="label">Password</label>
          <input type="password" placeholder="Min 6 characters" value={form.password} onChange={e => upd("password", e.target.value)} />
        </div>

        {form.role === "institute" && (
          <div style={{ background: "rgba(255,165,2,0.08)", border: "1px solid rgba(255,165,2,0.3)", borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 13, color: "#ffa502" }}>
            ⚠️ Institute accounts require admin approval before issuing certificates.
          </div>
        )}

        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", justifyContent: "center" }}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p style={{ textAlign: "center", marginTop: 24, color: "#6b6b8a", fontSize: 14 }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
