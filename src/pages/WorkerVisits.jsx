import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLanguage from "../hooks/useLanguage";
import {
  CalendarDays,
  MapPin,
  ArrowRight,
  Plus,
  CheckCircle2,
  Search,
  X
} from "lucide-react";
import { getWorkerScheduledVisits } from "../api/workerVisits.api";

function WorkerVisits() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const timeframeTabs = [
    { id: "today", label: t("worker.timeframeToday", "Today") },
    { id: "tomorrow", label: t("worker.timeframeTomorrow", "Tomorrow") },
    { id: "this_week", label: t("worker.timeframeThisWeek", "This Week") },
    { id: "all", label: t("worker.timeframeAll", "All Scheduled") }
  ];

  const statusFilters = [
    { id: "all", label: t("worker.statusAll", "All Statuses") },
    { id: "scheduled", label: t("worker.statusPending", "Pending / Scheduled") },
    { id: "completed", label: t("worker.statusCompleted", "Completed") },
    { id: "missed", label: t("worker.statusMissed", "Missed / Overdue") }
  ];

  useEffect(() => {
    let isMounted = true;
    async function loadVisits() {
      setLoading(true);
      try {
        const data = await getWorkerScheduledVisits({
          timeframe,
          status: statusFilter,
          search
        });
        if (isMounted) {
          setVisits(data);
        }
      } catch (err) {
        console.error("Failed to load scheduled visits", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadVisits();
    return () => {
      isMounted = false;
    };
  }, [timeframe, statusFilter, search]);

  const handleClearSearch = () => {
    setSearch("");
  };

  const workerRole =
    user?.role === "asha"
      ? t("auth.ashaRole", "ASHA Worker")
      : user?.role === "nurse"
      ? t("worker.roles.nurse", "Primary Care Nurse")
      : t("worker.roles.anm", "ANM Field Worker");

  return (
    <div className="worker-dashboard">
      {/* ==============================================================
          1. HEADER & CONTEXT
      ============================================================== */}
      <header className="worker-page-header">
        <div>
          <span className="worker-eyebrow">
            {t("worker.fieldWorkItineraryEyebrow", { role: workerRole }, `Field Work Itinerary • ${workerRole}`)}
          </span>
          <h1>{t("worker.scheduledVisitsTitle", "Scheduled Visits")}</h1>
          <p>
            {t("worker.scheduledVisitsDesc", "Community home visits, screening schedules, maternal checkups, and chronic care follow-ups assigned to you in Talwade & Shirur blocks.")}
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link
            to="/worker/visits/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 16px",
              background: "var(--primary-color)",
              color: "white",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "13px",
              textDecoration: "none"
            }}
          >
            <Plus style={{ width: "16px", height: "16px" }} />
            {t("worker.recordNewVisitBtn", "Record New Visit")}
          </Link>
        </div>
      </header>

      {/* ==============================================================
          2. TIMEFRAME & STATUS FILTER CONTROLS
      ============================================================== */}
      <div
        className="worker-panel"
        style={{
          marginBottom: "20px",
          padding: "16px 20px"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}
        >
          {/* SEARCH BAR */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "540px"
            }}
          >
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("worker.searchVisitsPlaceholder", "Search visits by patient name, ID (e.g. PAT-1001), village, or purpose...")}
              style={{
                width: "100%",
                padding: "10px 36px 10px 38px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "13px",
                outline: "none"
              }}
            />

            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
                title="Clear search"
              >
                <X style={{ width: "14px", height: "14px" }} />
              </button>
            )}
          </div>

          {/* TIMEFRAME BUTTONS & STATUS DROPDOWN */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap"
            }}
          >
            {/* TIMEFRAME TABS */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {timeframeTabs.map((tab) => {
                const isActive = timeframe === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTimeframe(tab.id)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: isActive
                        ? "1px solid var(--primary-color)"
                        : "1px solid var(--border-color)",
                      background: isActive
                        ? "var(--primary-color)"
                        : "var(--bg-secondary)",
                      color: isActive ? "white" : "var(--text-secondary)",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* STATUS FILTER BUTTONS */}
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600 }}>
                {t("common.status", "Status")}:
              </span>
              {statusFilters.map((st) => {
                const isSelected = statusFilter === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStatusFilter(st.id)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: isSelected
                        ? "1px solid var(--primary-color)"
                        : "1px solid var(--border-color)",
                      background: isSelected
                        ? "var(--primary-light)"
                        : "var(--card-bg)",
                      color: isSelected ? "var(--primary-color)" : "var(--text-secondary)"
                    }}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          3. SCHEDULED VISIT LIST
      ============================================================== */}
      <div className="worker-panel">
        <div className="worker-panel-header">
          <div>
            <span className="worker-section-label">{t("worker.fieldScheduleSection", "Field Schedule")}</span>
            <h2>
              {t("worker.visitsQueueTitle", { count: visits.length }, `Visits Queue (${visits.length})`)}
            </h2>
          </div>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-secondary)", padding: "24px 0" }}>
            {t("worker.loadingVisitsSchedule", "Loading field visit schedule...")}
          </p>
        ) : visits.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <CalendarDays
              style={{
                width: "36px",
                height: "36px",
                color: "var(--border-color)",
                margin: "0 auto 12px"
              }}
            />
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              {t("worker.noScheduledVisitsMatch", "No scheduled visits match the selected date or status filter.")}
            </p>
            {(search || timeframe !== "all" || statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setTimeframe("all");
                  setStatusFilter("all");
                }}
                style={{
                  marginTop: "12px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "var(--card-bg)",
                  color: "var(--primary-color)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {t("worker.showAllScheduledVisits", "Show All Scheduled Visits")}
              </button>
            )}
          </div>
        ) : (
          <div className="worker-visit-list">
            {visits.map((visit) => {
              const isHighRisk = visit.riskLevel === "High Risk";
              const isMaternal = visit.riskLevel === "Maternal Care";
              const isCompleted = visit.status === "completed";
              const isMissed = visit.status === "missed";

              return (
                <article
                  className="worker-visit-item"
                  key={visit.id}
                  style={{
                    opacity: isCompleted ? 0.75 : 1
                  }}
                >
                  {/* TIME & DATE */}
                  <div className="worker-visit-time">
                    {visit.time}
                    <span
                      style={{
                        display: "block",
                        marginTop: "2px",
                        fontSize: "10px",
                        fontWeight: "normal",
                        color: "var(--text-secondary)"
                      }}
                    >
                      {visit.date}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "4px",
                        fontSize: "9px",
                        fontWeight: 700,
                        padding: "1px 5px",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                        background: isCompleted
                          ? "rgba(22, 163, 74, 0.12)"
                          : isMissed
                          ? "rgba(220, 38, 38, 0.12)"
                          : "var(--bg-secondary)",
                        color: isCompleted
                          ? "#16a34a"
                          : isMissed
                          ? "#dc2626"
                          : "var(--text-secondary)"
                      }}
                    >
                      {visit.status}
                    </span>
                  </div>

                  {/* MAIN VISIT INFO */}
                  <div className="worker-visit-main">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap"
                      }}
                    >
                      <strong style={{ fontSize: "14px" }}>
                        {visit.patientName}
                      </strong>

                      <span
                        style={{
                          fontSize: "11px",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          background: "var(--bg-secondary)",
                          border: "1px solid var(--border-color)",
                          fontFamily: "monospace",
                          color: "var(--text-secondary)"
                        }}
                      >
                        {visit.patientId}
                      </span>

                      <span
                        style={{
                          fontSize: "10px",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          fontFamily: "monospace",
                          color: "var(--text-secondary)"
                        }}
                      >
                        {visit.id}
                      </span>

                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          padding: "2px 7px",
                          borderRadius: "999px",
                          background: isHighRisk
                            ? "rgba(220, 38, 38, 0.12)"
                            : isMaternal
                            ? "rgba(217, 119, 6, 0.12)"
                            : "var(--primary-light)",
                          color: isHighRisk
                            ? "#dc2626"
                            : isMaternal
                            ? "#d97706"
                            : "var(--primary-color)"
                        }}
                      >
                        {visit.riskLevel || t("worker.routineCareBadge", "Routine Care")}
                      </span>
                    </div>

                    <span style={{ marginTop: "4px", display: "block", fontSize: "12px" }}>
                      {visit.purpose}
                    </span>

                    <small style={{ marginTop: "4px" }}>
                      <MapPin style={{ width: "13px", height: "13px" }} />
                      {visit.village} {visit.address && `(${visit.address})`}
                    </small>
                  </div>

                  {/* ACTIONS */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexShrink: 0
                    }}
                  >
                    <NavLink
                      to={`/worker/patients/${visit.patientId}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "7px 12px",
                        border: "1px solid var(--border-color)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        fontSize: "11px",
                        fontWeight: 600,
                        textDecoration: "none",
                        background: "var(--card-bg)"
                      }}
                    >
                      {t("worker.viewPatientBtn", "View Patient")}
                    </NavLink>

                    {isCompleted ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "7px 12px",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--primary-color)"
                        }}
                      >
                        <CheckCircle2 style={{ width: "14px", height: "14px" }} />
                        {t("completed", "Completed")}
                      </span>
                    ) : (
                      <NavLink
                        to={`/worker/visits/new?patientId=${visit.patientId}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "7px 12px",
                          background: "var(--primary-color)",
                          color: "white",
                          border: "1px solid var(--primary-color)",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontWeight: 600,
                          textDecoration: "none"
                        }}
                      >
                        {t("worker.startVisitBtn", "Start Visit")}
                        <ArrowRight style={{ width: "12px", height: "12px" }} />
                      </NavLink>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkerVisits;
