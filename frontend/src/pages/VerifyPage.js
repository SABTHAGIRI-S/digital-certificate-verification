import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { ShieldCheck, ShieldX, AlertTriangle, Upload, Search, ExternalLink } from "lucide-react";

const ResultCard = ({ result }) => {
  const configs = {
    VERIFIED: {
      icon: <ShieldCheck size={56} />, color: "#2ed573",
      bg: "rgba(46,213,115,0.08)", border: "rgba(46,213,115,0.3)",
      title: "✅ CERTIFICATE VERIFIED",
      subtitle: "This certificate is authentic and matches the blockchain record.",
      badge: "badge-success", badgeText: "GENUINE",
    },
    FAKE: {
      icon: <ShieldX size={56} />, color: "#ff4757",
      bg: "rgba(255,71,87,0.08)", border: "rgba(255,71,87,0.3)",
      title: "❌ CERTIFICATE IS FAKE",
      subtitle: "This certificate does NOT match the blockchain record. It may have been tampered or forged.",
      badge: "badge-danger", badgeText: "FRAUDULENT",
    },
    REVOKED: {
      icon: <AlertTriangle size={56} />, color: "#ffa502",
      bg: "rgba(255,165,2,0.08)", border: "rgba(255,165,2,0.3)",
      title: "⚠️ CERTIFICATE REVOKED",
      subtitle: "This certificate was revoked by the issuing institution.",
      badge: "badge-warn", badgeText: "REVOKED",
    },
    NOT_FOUND: {
      icon: <Search size={56} />, color: "#6b6b8a",
      bg: "rgba(107,107,138,0.08)", border: "rgba(107,107,138,0.3)",
      title: "Certificate Not Found",
      subtitle: "No certificate with this ID exists in the system.",
      badge: "badge-info", badgeText: "NOT FOUND",
    },
  };

  const cfg  = configs[result.result] || configs.NOT_FOUND;
  const cert = result.details;

  return (
    <div style={{ border: `1px solid ${cfg.border}`, background: cfg.bg, borderRadius: 16, padding: 32, animation: "fadeIn 0.4s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ color: cfg.color, marginBottom: 16 }}>{cfg.icon}</div>
        <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 26, color: cfg.color, marginBottom: 8 }}>{cfg.title}</h2>
        <p style={{ color: "#6b6b8a", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>{cfg.subtitle}</p>
        {result.reason && result.reason !== cfg.subtitle && (
          <p style={{ color: cfg.color, fontSize: 13, marginTop: 8, opacity: 0.8 }}>{result.reason}</p>
        )}
      </div>

      {cert && (
        <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 24 }}>
          <h4 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 20, color: "#e8e8f0" }}>Certificate Details</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "Student",     value: cert.studentName },
              { label: "Course",      value: cert.courseName },
              { label: "Institution", value: cert.instituteName },
              { label: "Grade",       value: cert.grade || "—" },
              { label: "Issue Date",  value: new Date(cert.issueDate).toLocaleDateString() },
              { label: "Cert ID",     value: cert.certId },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: "#6b6b8a", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, color: "#e8e8f0", wordBreak: "break-all" }}>{value}</div>
              </div>
            ))}
          </div>

          {cert.txHash && (
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #2a2a3a" }}>
              <div style={{ fontSize: 11, color: "#6b6b8a", fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>BLOCKCHAIN TX HASH</div>
              <a href={`https://mumbai.polygonscan.com/tx/${cert.txHash}`} target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#00d4aa", wordBreak: "break-all" }}>
                {cert.txHash} <ExternalLink size={14} />
              </a>
            </div>
          )}

          {cert.ipfsUrl && (
            <div style={{ marginTop: 12 }}>
              <a href={cert.ipfsUrl} target="_blank" rel="noreferrer"
                className="btn btn-outline" style={{ fontSize: 13, padding: "8px 16px" }}>
                <ExternalLink size={14} /> View on IPFS
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function VerifyPage() {
  const [file,   setFile]   = useState(null);
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,  setError]  = useState("");

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) { setFile(accepted[0]); setResult(null); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "application/pdf": [".pdf"] }, maxFiles: 1,
  });

  const handleVerify = async () => {
    if (!file)   return setError("Please upload the certificate PDF");
    if (!certId) return setError("Please enter the Certificate ID");
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("certificate", file);
      fd.append("certId", certId.trim());
      const { data } = await axios.post("/api/verify/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page fade-in" style={{ maxWidth: 760 }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 40, marginBottom: 12,
          background: "linear-gradient(135deg, #fff, #00d4aa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Verify Certificate
        </h1>
        <p style={{ color: "#6b6b8a", fontSize: 16 }}>
          Upload any certificate PDF + its ID to instantly check if it's real or fake.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        {/* Drop Zone */}
        <div {...getRootProps()} style={{
          border: `2px dashed ${isDragActive ? "#00d4aa" : file ? "#2ed573" : "#2a2a3a"}`,
          borderRadius: 12, padding: 40, textAlign: "center", cursor: "pointer",
          background: isDragActive ? "rgba(0,212,170,0.05)" : "transparent", marginBottom: 24,
          transition: "all 0.2s",
        }}>
          <input {...getInputProps()} />
          {file ? (
            <div style={{ color: "#2ed573" }}>
              <Upload size={36} style={{ marginBottom: 8 }} />
              <div style={{ fontFamily: "Syne", fontWeight: 700 }}>{file.name}</div>
              <div style={{ color: "#6b6b8a", fontSize: 13 }}>Click to change</div>
            </div>
          ) : (
            <div>
              <Upload size={36} color="#00d4aa" style={{ marginBottom: 12 }} />
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                Drop Certificate PDF Here
              </div>
              <div style={{ color: "#6b6b8a", fontSize: 14 }}>or click to browse</div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="label">Certificate ID</label>
          <input placeholder="e.g. CERT-a1b2c3d4-..." value={certId}
            onChange={e => { setCertId(e.target.value); setResult(null); }} />
          <div style={{ color: "#6b6b8a", fontSize: 12, marginTop: 6 }}>
            This ID is printed on the certificate or shared by the issuing institution.
          </div>
        </div>

        {error && (
          <div style={{ background: "rgba(255,71,87,0.1)", border: "1px solid rgba(255,71,87,0.3)", borderRadius: 10, padding: 12, marginBottom: 16, color: "#ff4757", fontSize: 14 }}>
            {error}
          </div>
        )}

        <button className="btn btn-primary" onClick={handleVerify} disabled={loading}
          style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "16px" }}>
          {loading ? "Checking Blockchain..." : <><Search size={18} /> Verify Now</>}
        </button>
      </div>

      {result && <ResultCard result={result} />}
    </div>
  );
}
