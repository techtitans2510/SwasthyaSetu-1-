import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useMedicalRecords from "../hooks/useMedicalRecords";
import useAuth from "../hooks/useAuth";
import useLanguage from "../hooks/useLanguage";
import {
  FileText,
  Search,
  Building2,
  User,
  FlaskConical,
  Pill,
  Stethoscope,
  Scan,
  ShieldCheck,
  ArrowRight,
  Activity,
  AlertCircle,
  FolderOpen
} from "lucide-react";

function MedicalRecords() {
  const { records, loading, error } = useMedicalRecords();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    { key: "All", label: t("records.allRecords", "All Records") },
    { key: "Lab Report", label: t("records.labReports", "Lab Reports") },
    { key: "Prescription", label: t("records.prescriptions", "Prescriptions") },
    { key: "Diagnosis", label: t("records.diagnosticSummary", "Diagnosis") },
    { key: "Imaging", label: t("records.imaging", "Imaging") }
  ];

  const filteredRecords = useMemo(() => {
    return (records || []).filter((record) => {
      const matchesCategory = category === "All" || record.type === category;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        record.title.toLowerCase().includes(searchText) ||
        record.description.toLowerCase().includes(searchText) ||
        record.doctor.toLowerCase().includes(searchText) ||
        record.facility.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [records, search, category]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getRecordIcon = (type) => {
    switch (type) {
      case "Lab Report":
        return <FlaskConical className="w-5 h-5 text-emerald-600" />;
      case "Prescription":
        return <Pill className="w-5 h-5 text-sky-600" />;
      case "Diagnosis":
        return <Stethoscope className="w-5 h-5 text-primary-color" />;
      case "Imaging":
        return <Scan className="w-5 h-5 text-amber-600" />;
      default:
        return <FileText className="w-5 h-5 text-primary-color" />;
    }
  };

  return (
    <div className="records-page-container">
      {/* 1. Patient Profile & ABDM Health Continuity Banner */}
      <section className="records-patient-banner">
        <div className="patient-identity-row">
          <div className="patient-identity-left">
            <div className="patient-avatar-large">
              {user?.name ? user.name[0].toUpperCase() : "P"}
            </div>
            <div className="patient-name-block">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <h2>{user?.name || "Ramesh Patil"}</h2>
                <span className="tag-badge">62 Y • MALE</span>
                <span className="tag-badge" style={{ background: "var(--surface-container-low)", color: "var(--surface-tint)" }}>
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                  {t("patientDashboard.abhaVerified", "ABDM Verified")}
                </span>
              </div>
              <div className="patient-tags-block">
                <span className="tag-badge abha-id">
                  ABHA ID: 91-4029-1823-0192
                </span>
                <span style={{ color: "var(--text-secondary)" }}>•</span>
                <span style={{ color: "var(--text-secondary)" }}>
                  ABHA Address: <strong>{user?.email || "patient@example.com"}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cadre & PHC Linkage Quick Metrics */}
        <div className="patient-quick-metrics">
          <div className="metric-strip-card">
            <User className="w-5 h-5 text-primary-color shrink-0" />
            <div className="metric-strip-text">
              <span className="metric-strip-label">{t("records.assignedAsha", "Assigned ASHA Worker")}</span>
              <span className="metric-strip-value">{t("records.ashaWorkerName", "Sunita More (Talwade Sub-Centre)")}</span>
            </div>
          </div>

          <div className="metric-strip-card">
            <Building2 className="w-5 h-5 text-secondary-color shrink-0" />
            <div className="metric-strip-text">
              <span className="metric-strip-label">{t("records.primaryCarePhc", "Primary Health Center")}</span>
              <span className="metric-strip-value">{t("records.primaryPhcName", "Shirur 24x7 PHC (Pune Grid)")}</span>
            </div>
          </div>

          <div className="metric-strip-card">
            <ShieldCheck className="w-5 h-5 text-surface-tint shrink-0" />
            <div className="metric-strip-text">
              <span className="metric-strip-label">{t("records.consentArtifact", "ABDM Consent Artifact")}</span>
              <span className="metric-strip-value">{t("records.longitudinalCareActive", "Longitudinal Care Active")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Search and Category Filter Toolbar */}
      <section className="records-toolbar-card">
        <div className="search-input-wrapper">
          <Search className="w-5 h-5 search-input-icon" />
          <input
            type="search"
            placeholder={t("records.searchPlaceholder", "Search records by doctor, facility, or diagnosis...")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="category-pills-row">
          {categories.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`category-pill-btn ${category === item.key ? "active" : ""}`}
              onClick={() => setCategory(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>


      {/* 3. Loading State */}
      {loading && (
        <div className="state-container-card">
          <Activity className="w-10 h-10 text-primary-color animate-spin" />
          <h3 className="state-title">{t("records.loadingTitle", "Loading Medical Records...")}</h3>
          <p className="state-subtitle">
            {t("records.loadingSubtitle", "Synchronizing longitudinal diagnostic reports, prescriptions, and lab data.")}
          </p>
        </div>
      )}

      {/* 4. Error State */}
      {!loading && error && (
        <div className="state-container-card" style={{ borderColor: "var(--error-color)" }}>
          <AlertCircle className="w-10 h-10 text-rose-600" />
          <h3 className="state-title" style={{ color: "var(--error-color)" }}>{t("records.unableToLoad", "Unable to Load Records")}</h3>
          <p className="state-subtitle">
            {t("records.errorSubtitle", "An error occurred while fetching medical records. Please try again.")}
          </p>
        </div>
      )}

      {/* 5. Empty State */}
      {!loading && !error && filteredRecords.length === 0 && (
        <div className="state-container-card">
          <FolderOpen className="w-10 h-10 text-muted-color" />
          <h3 className="state-title">{t("records.noRecordsFound", "No Records Found")}</h3>
          <p className="state-subtitle">
            {t("records.noRecordsFilterMatch", { query: search || category }, `No matching medical records found for "${search || category}". Try resetting your filter.`)}
          </p>
        </div>
      )}

      {/* 6. Medical Records Grid */}
      {!loading && !error && filteredRecords.length > 0 && (
        <section className="records-cards-grid">
          {filteredRecords.map((record) => (
            <article className="record-item-card" key={record.id}>
              <div>
                <div className="record-top-badge-row">
                  <div className="record-type-pill">
                    {getRecordIcon(record.type)}
                    <span>{record.type}</span>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-secondary)" }}>
                    ID: {record.id}
                  </span>
                </div>

                <h3 className="record-title-heading">{record.title}</h3>
                <p className="record-desc-text">{record.description}</p>

                <div className="record-meta-info-grid">
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <User className="w-3.5 h-3.5 text-primary-color" />
                    <span>{t("records.doctorLabel", "Doctor:")} <strong>{record.doctor}</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Building2 className="w-3.5 h-3.5 text-secondary-color" />
                    <span>{t("records.facilityLabel", "Facility:")} <strong>{record.facility}</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Calendar className="w-3.5 h-3.5 text-muted-color" />
                    <span>{t("records.dateLabel", "Date:")} <strong>{formatDate(record.recordDate)}</strong></span>
                  </div>
                </div>
              </div>

              <div className="record-card-bottom-actions">
                <span
                  className={`offline-availability-indicator ${
                    record.offlineAvailable ? "available" : "online-only"
                  }`}
                >
                  {record.offlineAvailable ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t("records.availableOffline", "Available Offline")}</span>
                    </>
                  ) : (
                    <>
                      <Cloud className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t("records.cloudSynced", "Cloud Synced")}</span>
                    </>
                  )}
                </span>

                <Link
                  to={`/medical-records/${record.id}`}
                  className="view-record-link"
                >
                  <span>{t("records.viewRecordLink", "View Details")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default MedicalRecords;
