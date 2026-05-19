import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Award, ExternalLink, ShieldCheck, ShieldX, AlertTriangle, Trash2, ArrowLeft } from "lucide-react";

export default function CertDetail() {
  const { certId } = useParams();
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [cert, setCert]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    axios.get(`/api/certificates/${certId}`)
      .then(r => setCert(r.data.data))
      .catch(() => toast.error("Certificate not found"))
      .finally(() => setLoading(false));
  }, [certId]);

  const handleRevoke = async () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    setRevoking(true);
    try {
      await axios.patch(`/api/certificates/${certId}/revoke`);
      toast.success("Certificate revoked on blockchain");
      setCert(c => ({ ...c, isRevoked: true }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to revoke");
    } finally {
      setRevoking(false);
    }
  };

  if (loading) return <div className="page loading" style={{ textAlign: "center", paddingTop: 80 }}>Loading...</div>;
  if (!cert)   return <div className="page" style={{ textAlign: "center", paddingTop: 80, color: "#6b6b8a" }}>Certificate not found</div>;

  const statusColor = cert.isRevoked ? "#ff4757" : "#2ed573";
  const StatusIcon  = cert.isRevoked ? ShieldX : ShieldCheck;

  return (
    <div className="page fade-in" style={{ maxWidth: 800 }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: 32, padding: "8px 16px", fontSize: 13 }}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 32 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(0,212,170,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Award size={36} color="#00d4aa" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 28 }}>{cert.courseName}</h1>
            <span className={`badge ${cert.isRevoked ? "badge-danger" : "badge-success"}`}>
              <StatusIcon size={12} /> {cert.isRevoked ? "REVOKED" : "VERIFIED"}
            </span>
          </div>
          <p style={{ color: "#6b6b8a" }}>{cert.instituteName} · {new Date(cert.issueDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Revoked banner */}
      {cert.isRevoked && (
        <div style={{ background: "rgba(255,71,87,0.1)", border: "1px solid rgba(255,71,87,0.3)", borderRadius: 12, padding: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <AlertTriangle size={20} color="#ff4757" />
          <div>
            <div style={{ color: "#ff4757", fontWeight: 700 }}>This certificate has been revoked</div>
            <div style={{ color: "#6b6b8a", fontSize: 13 }}>Revoked on {new Date(cert.revokedAt).toLocaleDateString()}</div>
          </div>
        </div>
      )}

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Details Card */}
        <div className="card">
          <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 20 }}>Student Information</h3>
          {[
            { label: "Name",  value: cert.studentName },
            { label: "Email", value: cert.studentEmail },
            { label: "Grade", value: cert.grade || "—" },
          ].map(({ label, value }) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#6b6b8a", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
              <div>{value}</div>
            </div>
          ))}
        </div>

        {/* Blockchain Card */}
        <div className="card">
          <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 20 }}>Blockchain Record</h3>
          <div style={{ marginBottom: 16 }}>
            <div className="label">Certificate ID</div>
            <div style={{ fontSize: 13, wordBreak: "break-all", color: "#00d4aa" }}>{cert.certId}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div className="label">Block Number</div>
            <div>#{cert.blockNumber || "Pending"}</div>
          </div>
          <div>
            <div className="label">SHA-256 Hash</div>
            <div style={{ fontSize: 11, wordBreak: "break-all", color: "#6b6b8a", fontFamily: "Space Mono" }}>{cert.certHash}</div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 20 }}>Links</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {cert.txHash && (
            <a href={`https://mumbai.polygonscan.com/tx/${cert.txHash}`} target="_blank" rel="noreferrer"
              className="btn btn-outline" style={{ fontSize: 13, padding: "10px 20px" }}>
              <ExternalLink size={14} /> View on Polygonscan
            </a>
          )}
          {cert.ipfsUrl && (
            <a href={cert.ipfsUrl} target="_blank" rel="noreferrer"
              className="btn btn-outline" style={{ fontSize: 13, padding: "10px 20px" }}>
              <ExternalLink size={14} /> View on IPFS
            </a>
          )}
        </div>
      </div>

      {/* Revoke (institute only) */}
      {user?.role === "institute" && !cert.isRevoked && (
        <div className="card" style={{ border: "1px solid rgba(255,71,87,0.3)", background: "rgba(255,71,87,0.05)" }}>
          <h3 style={{ fontFamily: "Syne", fontWeight: 700, color: "#ff4757", marginBottom: 8 }}>Revoke Certificate</h3>
          <p style={{ color: "#6b6b8a", fontSize: 14, marginBottom: 16 }}>
            Revoking will permanently mark this certificate as invalid on the blockchain. This action cannot be undone.
          </p>
          <button className="btn btn-danger" onClick={handleRevoke} disabled={revoking}
            style={{ padding: "10px 24px", fontSize: 14 }}>
            <Trash2 size={16} /> {revoking ? "Revoking..." : "Revoke Certificate"}
          </button>
        </div>
      )}
    </div>
  );
}
