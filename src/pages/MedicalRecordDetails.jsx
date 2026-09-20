import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import useMedicalRecords from "../hooks/useMedicalRecords";
import {
  ArrowLeft,
  Calendar,
  Building2,
  User,
  FlaskConical,
  Pill,
  Stethoscope,
  Scan,
  ShieldCheck,
  Check,
  Cloud,
  FileText,
  Download,
  AlertCircle,
  Activity,
  Printer
} from "lucide-react";

function MedicalRecordDetails() {
  const { id } = useParams();
  const { records, loading, error } = useMedicalRecords();

  const record = useMemo(() => {
    return (records || []).find((item) => item.id === id);
  }, [records, id]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getRecordIcon = (type) => {
    switch (type) {
      case "Lab Report":
        return <FlaskConical className="w-7 h-7 text-emerald-600" />;
      case "Prescription":
        return <Pill className="w-7 h-7 text-sky-600" />;
      case "Diagnosis":
        return <Stethoscope className="w-7 h-7 text-primary-color" />;
      case "Imaging":
        return <Scan className="w-7 h-7 text-amber-600" />;
      default:
        return <FileText className="w-7 h-7 text-primary-color" />;
    }
  };

  if (loading) {
    return (
      <div className="state-container-card">
        <Activity className="w-10 h-10 text-primary-color animate-spin" />
        <h3 className="state-title">Loading Medical Record...</h3>
        <p className="state-subtitle">
          Retrieving encrypted clinical record artifact from ABDM health repository.
        </p>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="state-container-card" style={{ borderColor: "var(--error-color)" }}>
        <AlertCircle className="w-10 h-10 text-rose-600" />
        <h3 className="state-title" style={{ color: "var(--error-color)" }}>
          Record Not Found
        </h3>
        <p className="state-subtitle">
          The requested medical record ID ({id}) could not be located in your health records.
        </p>
        <Link to="/medical-records" className="btn-secondary-action" style={{ marginTop: "12px" }}>
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Medical Records</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="record-details-container">
      {/* 1. Header Navigation and Breadcrumb */}
      <div className="record-details-header">
        <Link
          to="/medical-records"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "700",
            color: "var(--primary-color)",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Records</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            className="btn-secondary-action"
            onClick={() => window.print()}
            style={{ padding: "8px 14px", fontSize: "13px" }}
          >
            <Printer className="w-4 h-4" />
            <span>Print Artifact</span>
          </button>
        </div>
      </div>

      {/* 2. Main Clinical Record Card */}
      <section className="record-details-main-card">
        <div className="record-profile-row">
          <div className="record-type-avatar">
            {getRecordIcon(record.type)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
              <span className="record-type-pill">
                {record.type}
              </span>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--surface-tint)" }}>
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                NHA / ABDM Verified
              </span>
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-color)" }}>
              {record.title}
            </h1>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginTop: "6px", lineHeight: "1.6" }}>
              {record.description}
            </p>
          </div>
        </div>

        {/* Clinical Metadata 2-Column Grid */}
        <div className="details-meta-grid">
          <div className="details-meta-item">
            <span className="meta-label">Recording Date</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
              <Calendar className="w-4 h-4 text-primary-color" />
              <span className="meta-val">{formatDate(record.recordDate)}</span>
            </div>
          </div>

          <div className="details-meta-item">
            <span className="meta-label">Attending Doctor</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
              <User className="w-4 h-4 text-primary-color" />
              <span className="meta-val">{record.doctor}</span>
            </div>
          </div>

          <div className="details-meta-item">
            <span className="meta-label">Healthcare Facility</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
              <Building2 className="w-4 h-4 text-secondary-color" />
              <span className="meta-val">{record.facility}</span>
            </div>
          </div>

          <div className="details-meta-item">
            <span className="meta-label">ABDM Record ID</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
              <FileText className="w-4 h-4 text-secondary-color" />
              <span className="meta-val">{record.id}</span>
            </div>
          </div>
        </div>

        {/* Offline Cache Status */}
        <div className="offline-banner-box">
          {record.offlineAvailable ? (
            <>
              <Check className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <strong style={{ fontSize: "14px", color: "var(--text-color)" }}>
                  Cached for Offline Access
                </strong>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  This medical record is securely stored on this device. You can view it without active cellular data.
                </p>
              </div>
            </>
          ) : (
            <>
              <Cloud className="w-6 h-6 text-sky-600 shrink-0" />
              <div>
                <strong style={{ fontSize: "14px", color: "var(--text-color)" }}>
                  Online Cloud Synchronized
                </strong>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  This record is stored in your ABDM repository and requires a network connection to load fresh attachments.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Document Attachment / PDF Viewer Box */}
        <div className="document-attachment-box">
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-container-low)",
                color: "var(--primary-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-color)" }}>
                Official Clinical Document ({record.type})
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                Signed PDF artifact verified by {record.doctor}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-primary-action"
            style={{ padding: "10px 18px", fontSize: "13px" }}
            onClick={() => alert(`Downloading verified record artifact: ${record.title} (${record.id})`)}
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default MedicalRecordDetails;