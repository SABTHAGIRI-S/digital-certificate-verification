import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { Award, ExternalLink, QrCode, X } from "lucide-react";

export default function MyCertificates() {
  const [certs,   setCerts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrCert,  setQrCert]  = useState(null);

  useEffect(() => {
    axios.get("/api/certificates/my")
      .then(r => setCerts(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page loading" style={{ textAlign: "center", paddingTop: 80 }}>Loading...</div>;

  return (
    <div className="page fade-in">
      <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 36, marginBottom: 8 }}>My Certificates</h1>
      <p style={{ color: "#6b6b8a", marginBottom: 40 }}>Your verified credentials stored on the blockchain.</p>

      {certs.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 64, color: "#6b6b8a" }}>
          <Award size={56} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p style={{ fontSize: 18 }}>No certificates yet.</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>Contact your institution to issue your certificate.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {certs.map(cert => (
            <div key={cert._id} className="card" style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(0,212,170,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Award size={26} color="#00d4aa" />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                  <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 17 }}>{cert.courseName}</span>
                  <span className={`badge ${cert.isRevoked ? "badge-danger" : "badge-success"}`}>
                    {cert.isRevoked ? "Revoked" : "Active"}
                  </span>
                </div>
                <div style={{ color: "#6b6b8a", fontSize: 13 }}>
                  {cert.instituteName} · Issued {new Date(cert.issueDate).toLocaleDateString()}
                  {cert.grade && <> · Grade: <span style={{ color: "#00d4aa" }}>{cert.grade}</span></>}
                </div>
                <div style={{ color: "#6b6b8a", fontSize: 11, marginTop: 4, fontFamily: "Space Mono" }}>
                  ID: {cert.certId}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-outline" style={{ padding: "8px 14px", fontSize: 13 }}
                  onClick={() => setQrCert(cert)}>
                  <QrCode size={16} />
                </button>
                {cert.ipfsUrl && (
                  <a href={cert.ipfsUrl} target="_blank" rel="noreferrer"
                    className="btn btn-outline" style={{ padding: "8px 14px", fontSize: 13 }}>
                    <ExternalLink size={16} />
                  </a>
                )}
                <Link to={`/certificate/${cert.certId}`} className="btn btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Modal */}
      {qrCert && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
          onClick={() => setQrCert(null)}>
          <div className="card" style={{ padding: 40, textAlign: "center", maxWidth: 360 }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setQrCert(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#6b6b8a" }}>
              <X size={20} />
            </button>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 4 }}>{qrCert.courseName}</h3>
            <p style={{ color: "#6b6b8a", fontSize: 13, marginBottom: 24 }}>{qrCert.instituteName}</p>
            <QRCodeSVG
              value={`${window.location.origin}/verify?certId=${qrCert.certId}`}
              size={200} bgColor="#111118" fgColor="#00d4aa"
              style={{ borderRadius: 8 }} />
            <p style={{ color: "#6b6b8a", fontSize: 12, marginTop: 16, lineHeight: 1.6 }}>
              Scan to verify this certificate on CertChain
            </p>
            <div style={{ fontSize: 11, color: "#6b6b8a", wordBreak: "break-all", marginTop: 8, fontFamily: "Space Mono" }}>
              {qrCert.certId}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
