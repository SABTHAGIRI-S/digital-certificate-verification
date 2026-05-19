import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";
import { Upload, FileText, CheckCircle } from "lucide-react";

export default function IssueCert() {
  const navigate = useNavigate();
  const [file, setFile]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    studentName: "", studentEmail: "", studentWallet: "",
    courseName: "", grade: "", issueDate: new Date().toISOString().split("T")[0],
  });

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "application/pdf": [".pdf"] }, maxFiles: 1,
  });

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!file) return toast.error("Please upload a PDF certificate");
    if (!form.studentName || !form.studentEmail || !form.courseName)
      return toast.error("Please fill all required fields");

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("certificate", file);
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      const { data } = await axios.post("/api/certificates/issue", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Certificate issued on blockchain! ✅");
      navigate(`/certificate/${data.data.certId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to issue certificate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page fade-in" style={{ maxWidth: 760 }}>
      <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 36, marginBottom: 8 }}>Issue Certificate</h1>
      <p style={{ color: "#6b6b8a", marginBottom: 40 }}>Upload a certificate PDF and record it permanently on the blockchain.</p>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 20 }}>Certificate PDF</h3>

        {/* Dropzone */}
        <div {...getRootProps()} style={{
          border: `2px dashed ${isDragActive ? "#00d4aa" : file ? "#2ed573" : "#2a2a3a"}`,
          borderRadius: 12, padding: 40, textAlign: "center", cursor: "pointer",
          background: isDragActive ? "rgba(0,212,170,0.05)" : file ? "rgba(46,213,115,0.05)" : "transparent",
          transition: "all 0.2s",
        }}>
          <input {...getInputProps()} />
          {file ? (
            <div style={{ color: "#2ed573" }}>
              <CheckCircle size={40} style={{ marginBottom: 12 }} />
              <div style={{ fontFamily: "Syne", fontWeight: 700 }}>{file.name}</div>
              <div style={{ color: "#6b6b8a", fontSize: 13 }}>{(file.size / 1024).toFixed(1)} KB · Click to change</div>
            </div>
          ) : (
            <div style={{ color: "#6b6b8a" }}>
              <Upload size={40} style={{ marginBottom: 12, color: "#00d4aa" }} />
              <div style={{ fontFamily: "Syne", fontWeight: 700, color: "#e8e8f0", marginBottom: 8 }}>
                {isDragActive ? "Drop the PDF here" : "Drag & drop certificate PDF"}
              </div>
              <div style={{ fontSize: 13 }}>or click to browse · Max 10MB</div>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 20 }}>Student Details</h3>
        <div className="grid-2">
          <div className="form-group">
            <label className="label">Student Name *</label>
            <input placeholder="Full name" value={form.studentName} onChange={e => upd("studentName", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Student Email *</label>
            <input type="email" placeholder="student@email.com" value={form.studentEmail} onChange={e => upd("studentEmail", e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="label">Student Wallet Address (optional)</label>
          <input placeholder="0x..." value={form.studentWallet} onChange={e => upd("studentWallet", e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 20 }}>Certificate Details</h3>
        <div className="form-group">
          <label className="label">Course / Degree Name *</label>
          <input placeholder="B.Tech Computer Science, MBA Finance..." value={form.courseName} onChange={e => upd("courseName", e.target.value)} />
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label className="label">Grade / GPA</label>
            <input placeholder="A+, 9.2 CGPA..." value={form.grade} onChange={e => upd("grade", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Issue Date *</label>
            <input type="date" value={form.issueDate} onChange={e => upd("issueDate", e.target.value)} />
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.3)", borderRadius: 12, padding: 20, marginBottom: 24, color: "#00d4aa", fontSize: 14 }}>
          ⏳ Uploading to IPFS and recording on blockchain... This may take 15-30 seconds.
        </div>
      )}

      <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}
        style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "16px" }}>
        {loading ? "Recording on Blockchain..." : "Issue Certificate on Blockchain"}
      </button>
    </div>
  );
}
