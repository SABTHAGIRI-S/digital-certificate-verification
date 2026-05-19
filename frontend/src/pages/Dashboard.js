import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Award, Upload, Search, CheckCircle, XCircle, Clock } from "lucide-react";

export default function Dashboard() {
  const { user }    = useAuth();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = user.role === "student" ? "/api/certificates/my"
                   : user.role === "institute" ? "/api/certificates/issued"
                   : null;
    if (!endpoint) { setLoading(false); return; }
    axios.get(endpoint)
      .then(r => setCerts(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const total    = certs.length;
  const verified = certs.filter(c => !c.isRevoked).length;
  const revoked  = certs.filter(c => c.isRevoked).length;

  return (
    <div className="page fade-in">
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 36, marginBottom: 8 }}>
          Dashboard
        </h1>
        <p style={{ color: "#6b6b8a" }}>
          Welcome, <span style={{ color: "#00d4aa" }}>{user.name}</span> &nbsp;·&nbsp; <span className="tag">{user.role}</span>
        </p>
      </div>

      {/* Stats */}
      {user.role !== "employer" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }}>
          {[
            { label: "Total",    value: total,    icon: <Award size={24} />,        color: "#00d4aa" },
            { label: "Active",   value: verified, icon: <CheckCircle size={24} />, color: "#2ed573" },
            { label: "Revoked",  value: revoked,  icon: <XCircle size={24} />,     color: "#ff4757" },
          ].map(s => (
            <div key={s.label} className="card" style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ color: s.color }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 32, fontFamily: "Syne", fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ color: "#6b6b8a", fontSize: 13 }}>{s.label} Certificates</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginBottom: 40 }}>
        {user.role === "institute" && (
          <Link to="/issue" className="card" style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer", border: "1px solid rgba(0,212,170,0.3)", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#00d4aa"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(0,212,170,0.3)"}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(0,212,170,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00d4aa" }}>
              <Upload size={22} />
            </div>
            <div>
              <div style={{ fontFamily: "Syne", fontWeight: 700 }}>Issue Certificate</div>
              <div style={{ color: "#6b6b8a", fontSize: 12 }}>Upload & record on blockchain</div>
            </div>
          </Link>
        )}

        <Link to="/verify" className="card" style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer", border: "1px solid #2a2a3a", transition: "all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#00d4aa"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a3a"}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(0,212,170,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00d4aa" }}>
            <Search size={22} />
          </div>
          <div>
            <div style={{ fontFamily: "Syne", fontWeight: 700 }}>Verify Certificate</div>
            <div style={{ color: "#6b6b8a", fontSize: 12 }}>Check if a cert is real or fake</div>
          </div>
        </Link>
      </div>

      {/* Recent Certificates */}
      {user.role !== "employer" && (
        <>
          <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 22, marginBottom: 20 }}>
            {user.role === "institute" ? "Recently Issued" : "My Certificates"}
          </h2>
          {loading ? (
            <div className="loading" style={{ color: "#6b6b8a", padding: 40, textAlign: "center" }}>Loading...</div>
          ) : certs.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 48, color: "#6b6b8a" }}>
              <Award size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p>No certificates yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {certs.slice(0, 10).map(c => (
                <Link to={`/certificate/${c.certId}`} key={c._id} className="card"
                  style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer", textDecoration: "none", transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#00d4aa"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a3a"}>
                  <Award size={20} color="#00d4aa" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Syne", fontWeight: 700 }}>{c.courseName}</div>
                    <div style={{ color: "#6b6b8a", fontSize: 12 }}>{c.studentName} · {c.instituteName}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className={`badge ${c.isRevoked ? "badge-danger" : "badge-success"}`}>
                      {c.isRevoked ? "Revoked" : "Active"}
                    </span>
                    <div style={{ color: "#6b6b8a", fontSize: 11, marginTop: 4 }}>
                      {new Date(c.issueDate).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
