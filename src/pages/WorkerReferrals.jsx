import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Calendar,
  Clock,
  Search,
  User,
  GitBranch,
  AlertCircle,
  Plus,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import {
  getWorkerReferrals,
  getWorkerReferralSummary,
  CANONICAL_REFERRAL_STATUSES,
  REFERRAL_STATUS_CONFIG
} from "../api/workerReferrals.api";

const FILTER_TABS = [
  { key: "ALL", label: "All Referrals" },
  { key: CANONICAL_REFERRAL_STATUSES.PENDING, label: "Pending" },
  { key: CANONICAL_REFERRAL_STATUSES.ACCEPTED, label: "Accepted" },
  { key: CANONICAL_REFERRAL_STATUSES.SCHEDULED, label: "Scheduled" },
  { key: CANONICAL_REFERRAL_STATUSES.IN_PROGRESS, label: "In Progress" },
  { key: CANONICAL_REFERRAL_STATUSES.COMPLETED, label: "Completed" },
  { key: CANONICAL_REFERRAL_STATUSES.CLOSED, label: "Closed" }
];

function WorkerReferrals() {
  const [referrals, setReferrals] = useState([]);
  const [summary, setSummary] = useState({
    openCount: 0,
    pendingCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    totalCount: 0
  });
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        const [listData, summaryData] = await Promise.all([
          getWorkerReferrals({
            status: activeFilter,
            search: searchQuery
          }),
          getWorkerReferralSummary()
        ]);
        if (isMounted) {
          setReferrals(listData);
          setSummary(summaryData);
        }
      } catch (err) {
        console.error("Failed to load worker referrals", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [activeFilter, searchQuery]);

  const getStatusBadge = (status) => {
    const config = REFERRAL_STATUS_CONFIG[status] || {
      label: status,
      color: "var(--text-secondary)",
      bg: "var(--bg-secondary)"
    };

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "3px 9px",
          borderRadius: "999px",
          fontSize: "11px",
          fontWeight: 600,
          background: config.bg,
          color: config.color,
          border: `1px solid ${config.color}33`,
          whiteSpace: "nowrap"
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: config.color
          }}
        />
        {config.label}
      </span>
    );
  };

  const getUrgencyBadge = (urgency) => {
    const isUrgent = urgency === "Urgent" || urgency === "Emergency";
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "2px 7px",
          borderRadius: "6px",
          fontSize: "10px",
          fontWeight: 600,
          background: isUrgent ? "rgba(220, 38, 38, 0.12)" : "var(--bg-secondary)",
          color: isUrgent ? "#dc2626" : "var(--text-secondary)",
          border: isUrgent ? "1px solid rgba(220, 38, 38, 0.25)" : "1px solid var(--border-color)"
        }}
      >
        {isUrgent && <AlertCircle style={{ width: "11px", height: "11px" }} />}
        {urgency}
      </span>
    );
  };

  return (
    <div className="worker-dashboard">
      {/* ==============================================================
          1. HEADER & ACTIONS
      ============================================================== */}
      <header className="worker-page-header">
        <div>
          <span className="worker-eyebrow">Care Continuity & Escalation</span>
          <h1>Community Referrals Registry</h1>
          <p>
            Track community patients referred to Primary Health Centres, Community Health Centres,
            and District Hospitals across their clinical lifecycle until closure.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link
            to="/worker/referrals/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 16px",
              borderRadius: "8px",
              background: "var(--primary-color)",
              color: "white",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none"
            }}
          >
            <Plus style={{ width: "16px", height: "16px" }} />
            Create New Referral
          </Link>
        </div>
      </header>

      {/* ==============================================================
          2. SUMMARY CARDS
      ============================================================== */}
      <section className="worker-stat-grid" style={{ marginBottom: "20px" }}>
        <div
          className="worker-stat-card"
          onClick={() => setActiveFilter("ALL")}
          style={{ cursor: "pointer" }}
        >
          <div className="worker-stat-icon" style={{ background: "rgba(37, 99, 235, 0.12)", color: "#2563eb" }}>
            <GitBranch />
          </div>
          <div>
            <span>Open Referrals</span>
            <strong>{summary.openCount}</strong>
            <small style={{ display: "block", marginTop: "3px", fontSize: "10px", color: "var(--text-secondary)" }}>
              Active in care loop
            </small>
          </div>
        </div>

        <div
          className="worker-stat-card"
          onClick={() => setActiveFilter(CANONICAL_REFERRAL_STATUSES.PENDING)}
          style={{ cursor: "pointer" }}
        >
          <div className="worker-stat-icon" style={{ background: "rgba(217, 119, 6, 0.12)", color: "#d97706" }}>
            <Clock />
          </div>
          <div>
            <span>Pending Review</span>
            <strong>{summary.pendingCount}</strong>
            <small style={{ display: "block", marginTop: "3px", fontSize: "10px", color: "var(--text-secondary)" }}>
              Awaiting facility review
            </small>
          </div>
        </div>

        <div
          className="worker-stat-card"
          onClick={() => setActiveFilter(CANONICAL_REFERRAL_STATUSES.IN_PROGRESS)}
          style={{ cursor: "pointer" }}
        >
          <div className="worker-stat-icon" style={{ background: "rgba(13, 148, 136, 0.12)", color: "#0d9488" }}>
            <RefreshCw />
          </div>
          <div>
            <span>In Progress</span>
            <strong>{summary.inProgressCount}</strong>
            <small style={{ display: "block", marginTop: "3px", fontSize: "10px", color: "var(--text-secondary)" }}>
              Consultation / Triage
            </small>
          </div>
        </div>

        <div
          className="worker-stat-card"
          onClick={() => setActiveFilter(CANONICAL_REFERRAL_STATUSES.COMPLETED)}
          style={{ cursor: "pointer" }}
        >
          <div className="worker-stat-icon" style={{ background: "rgba(22, 163, 74, 0.12)", color: "#16a34a" }}>
            <Building2 />
          </div>
          <div>
            <span>Completed</span>
            <strong>{summary.completedCount}</strong>
            <small style={{ display: "block", marginTop: "3px", fontSize: "10px", color: "var(--text-secondary)" }}>
              Consultation finished
            </small>
          </div>
        </div>
      </section>

      {/* ==============================================================
          3. SEARCH & STATUS FILTERS
      ============================================================== */}
      <div className="worker-panel" style={{ marginBottom: "20px", padding: "16px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* SEARCH BAR */}
          <div style={{ position: "relative", width: "100%" }}>
            <Search
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "16px",
                height: "16px",
                color: "var(--text-secondary)"
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name, ID (e.g. PAT-1001), referral ID, destination facility, or clinical reason..."
              style={{
                width: "100%",
                padding: "9px 12px 9px 36px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "13px",
                outline: "none"
              }}
            />
          </div>

          {/* CANONICAL STATUS FILTER TABS */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "4px"
            }}
          >
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: isActive
                      ? "1px solid var(--primary-color)"
                      : "1px solid var(--border-color)",
                    background: isActive ? "var(--primary-color)" : "var(--bg-secondary)",
                    color: isActive ? "white" : "var(--text-primary)",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease"
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==============================================================
          4. REFERRALS LIST
      ============================================================== */}
      <div className="worker-panel">
        <div className="worker-panel-header">
          <div>
            <span className="worker-section-label">Referral Registry</span>
            <h2>
              {activeFilter === "ALL" ? "All Referrals" : `${FILTER_TABS.find((t) => t.key === activeFilter)?.label || activeFilter}`} ({referrals.length})
            </h2>
          </div>

          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Showing {referrals.length} cases
          </span>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-secondary)", padding: "24px 0", textAlign: "center" }}>
            Loading referral cases...
          </p>
        ) : referrals.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <GitBranch style={{ width: "40px", height: "40px", color: "var(--text-secondary)", margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: "15px" }}>No referrals match your criteria</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>
              Try adjusting the status filter or search keywords.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {referrals.map((ref) => (
              <article
                key={ref.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  padding: "16px",
                  borderRadius: "10px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  transition: "border-color 0.15s ease"
                }}
              >
                {/* ROW 1: HEADER (ID, STATUS, URGENCY, DATES) */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "8px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <strong style={{ fontSize: "14px", fontFamily: "monospace", color: "var(--primary-color)" }}>
                      {ref.id}
                    </strong>
                    {getStatusBadge(ref.status)}
                    {getUrgencyBadge(ref.urgency)}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      fontSize: "11px",
                      color: "var(--text-secondary)"
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Calendar style={{ width: "12px", height: "12px" }} />
                      Created: {ref.createdDate || ref.referralDate}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Clock style={{ width: "12px", height: "12px" }} />
                      Updated: {ref.lastUpdate || "Recent"}
                    </span>
                  </div>
                </div>

                {/* ROW 2: PATIENT & SERVICE DETAILS */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "14px",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    background: "var(--card-bg)",
                    border: "1px solid var(--border-color)"
                  }}
                >
                  {/* PATIENT INFO */}
                  <div>
                    <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-secondary)", fontWeight: 600 }}>
                      Referred Patient
                    </span>
                    <div style={{ marginTop: "3px" }}>
                      <Link
                        to={`/worker/patients/${ref.patientId}`}
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--primary-color)",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <User style={{ width: "13px", height: "13px" }} />
                        {ref.patientName} ({ref.patientId})
                      </Link>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                        {ref.patientAge ? `${ref.patientAge}y • ` : ""}{ref.patientGender ? `${ref.patientGender} • ` : ""}{ref.village || "Talwade"}
                      </div>
                    </div>
                  </div>

                  {/* DESTINATION FACILITY & SERVICE */}
                  <div>
                    <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-secondary)", fontWeight: 600 }}>
                      Destination Facility & Specialty
                    </span>
                    <div style={{ marginTop: "3px", fontSize: "12px" }}>
                      <strong style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Building2 style={{ width: "13px", height: "13px", color: "var(--primary-color)" }} />
                        {ref.destinationFacility || ref.facilityName}
                      </strong>
                      <div style={{ color: "var(--text-secondary)", fontSize: "11px", marginTop: "2px" }}>
                        Service: {ref.serviceRequired || ref.specialtyRequired || "General OPD"}
                      </div>
                    </div>
                  </div>

                  {/* REFERRING WORKER */}
                  <div>
                    <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-secondary)", fontWeight: 600 }}>
                      Referring Worker
                    </span>
                    <div style={{ marginTop: "3px", fontSize: "12px" }}>
                      <strong>{ref.referringWorker || "Ananya Sharma (ASHA-001)"}</strong>
                      <div style={{ color: "var(--text-secondary)", fontSize: "11px", marginTop: "2px" }}>
                        Catchment: {ref.village || "Talwade Sub-Centre"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROW 3: REASON & OUTCOME */}
                <div style={{ fontSize: "12px" }}>
                  <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Clinical Reason: </span>
                  <span>{ref.reason}</span>
                  {ref.outcome && (
                    <div style={{ marginTop: "4px", color: "#16a34a", fontSize: "11px" }}>
                      <strong>Outcome: </strong> {ref.outcome}
                    </div>
                  )}
                  {ref.notes && (
                    <div style={{ marginTop: "3px", color: "var(--text-secondary)", fontSize: "11px" }}>
                      <strong>ASHA Notes: </strong> {ref.notes}
                    </div>
                  )}
                </div>

                {/* ROW 4: ACTION BUTTONS */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "10px",
                    paddingTop: "4px",
                    borderTop: "1px solid var(--border-color)"
                  }}
                >
                  <Link
                    to={`/worker/patients/${ref.patientId}`}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color)",
                      background: "var(--card-bg)",
                      color: "var(--text-secondary)",
                      fontSize: "12px",
                      fontWeight: 500,
                      textDecoration: "none"
                    }}
                  >
                    View Patient
                  </Link>

                  <Link
                    to={`/worker/referrals/${ref.id}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      background: "var(--primary-color)",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: 600,
                      textDecoration: "none"
                    }}
                  >
                    View Referral Details
                    <ArrowRight style={{ width: "13px", height: "13px" }} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkerReferrals;
