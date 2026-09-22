import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Search,
  User,
  GitBranch,
  ArrowRight,
  ListChecks,
  AlertTriangle,
  Send,
  X
} from "lucide-react";
import useLanguage from "../hooks/useLanguage";
import {
  getWorkerFollowUps,
  getWorkerFollowUpSummary,
  completeWorkerFollowUp,
  FOLLOW_UP_OUTCOMES
} from "../api/workerFollowUps.api";

function WorkerFollowUps() {
  const { t } = useLanguage();

  const FILTER_TABS = [
    { key: "ALL", label: t("worker.tabAllTasks") },
    { key: "DUE_TODAY", label: t("worker.tabDueToday") },
    { key: "OVERDUE", label: t("worker.tabOverdue") },
    { key: "UPCOMING", label: t("worker.tabUpcoming") },
    { key: "COMPLETED", label: t("worker.completedStat") }
  ];

  const [followUps, setFollowUps] = useState([]);
  const [summary, setSummary] = useState({
    totalCount: 0,
    dueTodayCount: 0,
    overdueCount: 0,
    upcomingCount: 0,
    completedCount: 0
  });
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Active follow-up form state (for Start Follow-up interaction)
  const [activeTask, setActiveTask] = useState(null);
  const [outcome, setOutcome] = useState("Stable");
  const [notes, setNotes] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        const [listData, summaryData] = await Promise.all([
          getWorkerFollowUps({
            category: activeFilter,
            search: searchQuery
          }),
          getWorkerFollowUpSummary()
        ]);
        if (isMounted) {
          setFollowUps(listData);
          setSummary(summaryData);
        }
      } catch (err) {
        console.error("Failed to load worker follow-ups", err);
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

  const handleOpenStartFollowUp = (task) => {
    setActiveTask(task);
    setOutcome("Stable");
    setNotes("");
    setNextAction(task.nextAction || "Continue routine home monitoring");
    setNextFollowUpDate("");
    setSuccessMessage("");
  };

  const handleCloseModal = () => {
    setActiveTask(null);
    setSubmitting(false);
  };

  const handleSaveFollowUp = async (e) => {
    e.preventDefault();
    if (!activeTask) return;

    setSubmitting(true);
    try {
      await completeWorkerFollowUp(activeTask.id, {
        outcome,
        notes,
        nextAction,
        nextFollowUpDate: nextFollowUpDate || null
      });

      setSuccessMessage(t("worker.followUpCompletedSuccess", { id: activeTask.id }));

      // Refresh list & summary
      const [listData, summaryData] = await Promise.all([
        getWorkerFollowUps({
          category: activeFilter,
          search: searchQuery
        }),
        getWorkerFollowUpSummary()
      ]);
      setFollowUps(listData);
      setSummary(summaryData);

      setTimeout(() => {
        setActiveTask(null);
        setSuccessMessage("");
      }, 1200);
    } catch (err) {
      console.error("Failed to complete follow-up", err);
    } finally {
      setSubmitting(false);
    }
  };

  const isOverdue = (dueDate, status) => {
    return status !== "completed" && dueDate < "2026-09-22";
  };

  const isDueToday = (dueDate, status) => {
    return status !== "completed" && dueDate === "2026-09-22";
  };

  return (
    <div className="worker-dashboard">
      {/* ==============================================================
          1. HEADER & OVERVIEW
      ============================================================== */}
      <header className="worker-page-header">
        <div>
          <span className="worker-eyebrow">{t("worker.careContinuitySurveillanceEyebrow")}</span>
          <h1>{t("worker.postCareClinicalFollowUpsTitle")}</h1>
          <p>
            {t("worker.postCareClinicalFollowUpsDesc")}
          </p>
        </div>
      </header>

      {/* ==============================================================
          2. SUMMARY METRICS CARDS
      ============================================================== */}
      <section className="worker-stat-grid" style={{ marginBottom: "20px" }}>
        <div
          className="worker-stat-card"
          onClick={() => setActiveFilter("DUE_TODAY")}
          style={{ cursor: "pointer" }}
        >
          <div className="worker-stat-icon" style={{ background: "rgba(217, 119, 6, 0.12)", color: "#d97706" }}>
            <Clock />
          </div>
          <div>
            <span>{t("worker.dueTodayStat")}</span>
            <strong>{summary.dueTodayCount}</strong>
            <small style={{ display: "block", marginTop: "3px", fontSize: "10px", color: "var(--text-secondary)" }}>
              {t("worker.dueTodaySubtext")}
            </small>
          </div>
        </div>

        <div
          className="worker-stat-card"
          onClick={() => setActiveFilter("OVERDUE")}
          style={{ cursor: "pointer" }}
        >
          <div className="worker-stat-icon" style={{ background: "rgba(220, 38, 38, 0.12)", color: "#dc2626" }}>
            <AlertTriangle />
          </div>
          <div>
            <span>{t("worker.overdueStat")}</span>
            <strong>{summary.overdueCount}</strong>
            <small style={{ display: "block", marginTop: "3px", fontSize: "10px", color: "var(--text-secondary)" }}>
              {t("worker.overdueSubtext")}
            </small>
          </div>
        </div>

        <div
          className="worker-stat-card"
          onClick={() => setActiveFilter("UPCOMING")}
          style={{ cursor: "pointer" }}
        >
          <div className="worker-stat-icon" style={{ background: "rgba(37, 99, 235, 0.12)", color: "#2563eb" }}>
            <Calendar />
          </div>
          <div>
            <span>{t("worker.upcomingStat")}</span>
            <strong>{summary.upcomingCount}</strong>
            <small style={{ display: "block", marginTop: "3px", fontSize: "10px", color: "var(--text-secondary)" }}>
              {t("worker.upcomingSubtext")}
            </small>
          </div>
        </div>

        <div
          className="worker-stat-card"
          onClick={() => setActiveFilter("COMPLETED")}
          style={{ cursor: "pointer" }}
        >
          <div className="worker-stat-icon" style={{ background: "rgba(220, 38, 38, 0.12)", color: "#16a34a" }}>
            <CheckCircle2 />
          </div>
          <div>
            <span>{t("worker.completedStat")}</span>
            <strong>{summary.completedCount}</strong>
            <small style={{ display: "block", marginTop: "3px", fontSize: "10px", color: "var(--text-secondary)" }}>
              {t("worker.completedSubtext")}
            </small>
          </div>
        </div>
      </section>

      {/* ==============================================================
          3. SEARCH & FILTER TABS
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
              placeholder={t("worker.searchFollowUpsPlaceholder")}
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

          {/* FILTER TABS */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
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
          4. FOLLOW-UPS LIST
      ============================================================== */}
      <div className="worker-panel">
        <div className="worker-panel-header">
          <div>
            <span className="worker-section-label">{t("worker.followUpTaskQueueSection")}</span>
            <h2>
              {FILTER_TABS.find((t) => t.key === activeFilter)?.label || t("worker.tabAllTasks")} ({followUps.length})
            </h2>
          </div>

          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            {t("worker.showingTasksCount", { count: followUps.length })}
          </span>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-secondary)", padding: "24px 0", textAlign: "center" }}>
            {t("worker.loadingFollowUpTasks")}
          </p>
        ) : followUps.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <ListChecks style={{ width: "40px", height: "40px", color: "var(--text-secondary)", margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: "15px" }}>{t("worker.noFollowUpTasksFound")}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>
              {t("worker.noFollowUpItemsMatch")}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {followUps.map((task) => {
              const overdue = isOverdue(task.dueDate, task.status);
              const dueToday = isDueToday(task.dueDate, task.status);
              const isCompleted = task.status === "completed";

              return (
                <article
                  key={task.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    padding: "16px",
                    borderRadius: "10px",
                    background: "var(--bg-secondary)",
                    border: overdue
                      ? "1px solid rgba(220, 38, 38, 0.4)"
                      : dueToday
                      ? "1px solid rgba(217, 119, 6, 0.4)"
                      : "1px solid var(--border-color)",
                    transition: "border-color 0.15s ease"
                  }}
                >
                  {/* TOP ROW: ID, TYPE, DUE DATE, STATUS BADGE */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "8px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <strong style={{ fontSize: "14px", fontFamily: "monospace", color: "var(--primary-color)" }}>
                        {task.id}
                      </strong>

                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "6px",
                          background: "var(--card-bg)",
                          border: "1px solid var(--border-color)",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--text-primary)"
                        }}
                      >
                        {t(task.type)}
                      </span>

                      {task.priority === "High" && (
                        <span
                          style={{
                            padding: "2px 7px",
                            borderRadius: "6px",
                            background: "rgba(220, 38, 38, 0.12)",
                            color: "#dc2626",
                            fontSize: "10px",
                            fontWeight: 700
                          }}
                        >
                          {t("worker.highPriorityBadge")}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: overdue
                            ? "#dc2626"
                            : dueToday
                            ? "#d97706"
                            : isCompleted
                            ? "#16a34a"
                            : "var(--text-secondary)"
                        }}
                      >
                        <Calendar style={{ width: "13px", height: "13px" }} />
                        {overdue
                          ? t("worker.dueOverdue", { date: task.dueDate })
                          : dueToday
                          ? t("worker.dueTodayTag", { date: task.dueDate })
                          : t("worker.dueNormal", { date: task.dueDate })}
                      </span>

                      {isCompleted ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "3px 8px",
                            borderRadius: "999px",
                            background: "rgba(220, 38, 38, 0.12)",
                            color: "#16a34a",
                            fontSize: "11px",
                            fontWeight: 600
                          }}
                        >
                          <CheckCircle2 style={{ width: "12px", height: "12px" }} />
                          {t("worker.completedStat")}
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "3px 8px",
                            borderRadius: "999px",
                            background: "rgba(217, 119, 6, 0.12)",
                            color: "#d97706",
                            fontSize: "11px",
                            fontWeight: 600
                          }}
                        >
                          <Clock style={{ width: "12px", height: "12px" }} />
                          {t("worker.pendingActionBadge")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* MIDDLE ROW: PATIENT CONTEXT & CARE DETAILS */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                      gap: "12px",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      background: "var(--card-bg)",
                      border: "1px solid var(--border-color)"
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-secondary)", fontWeight: 600 }}>
                        {t("worker.patientDetailsLabel")}
                      </span>
                      <div style={{ marginTop: "3px" }}>
                        <Link
                          to={`/worker/patients/${task.patientId}`}
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
                          {t(task.patientName)} ({task.patientId})
                        </Link>
                        <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                          {task.patientAge ? `${task.patientAge}y • ` : ""}{task.patientGender ? `${t(task.patientGender)} • ` : ""}{t(task.village || "Talwade")}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-secondary)", fontWeight: 600 }}>
                        {t("worker.careActionReasonLabel")}
                      </span>
                      <div style={{ marginTop: "3px", fontSize: "12px", lineHeight: 1.4 }}>
                        {t(task.reason)}
                      </div>
                      {task.linkedReferralId && (
                        <div style={{ marginTop: "4px" }}>
                          <Link
                            to={`/worker/referrals/${task.linkedReferralId}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                              fontSize: "11px",
                              color: "var(--primary-color)",
                              textDecoration: "none",
                              fontWeight: 600
                            }}
                          >
                            <GitBranch style={{ width: "11px", height: "11px" }} />
                            {t("worker.linkedReferralLink", { id: task.linkedReferralId })}
                          </Link>
                        </div>
                      )}
                    </div>

                    <div>
                      <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-secondary)", fontWeight: 600 }}>
                        {isCompleted ? t("worker.completionOutcomeLabel") : t("worker.baselineLastOutcomeLabel")}
                      </span>
                      <div style={{ marginTop: "3px", fontSize: "12px", color: isCompleted ? "#16a34a" : "var(--text-primary)" }}>
                        {isCompleted ? (
                          <div>
                            <strong>{t("worker.outcomeLabel")} {t(task.outcome || "Stable")}</strong>
                            {task.notes && <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>{t("worker.notesLabel")} {t(task.notes)}</div>}
                          </div>
                        ) : (
                          <div>{t(task.lastOutcome || "Routine post-care verification")}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ROW: ACTIONS */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                      paddingTop: "4px",
                      borderTop: "1px solid var(--border-color)"
                    }}
                  >
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                      <strong>{t("worker.nextActionLabel")} </strong> {t(task.nextAction || "Conduct home visit")}
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <Link
                        to={`/worker/patients/${task.patientId}`}
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
                        {t("worker.viewPatientBtn")}
                      </Link>

                      {!isCompleted && (
                        <button
                          type="button"
                          onClick={() => handleOpenStartFollowUp(task)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            background: "var(--primary-color)",
                            color: "white",
                            border: "none",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer"
                          }}
                        >
                          {t("worker.startFollowUpBtn")}
                          <ArrowRight style={{ width: "13px", height: "13px" }} />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ==============================================================
          5. START FOLLOW-UP INTERACTION MODAL
      ============================================================== */}
      {activeTask && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "20px"
          }}
        >
          <div
            className="worker-panel"
            style={{
              maxWidth: "580px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                paddingBottom: "10px",
                borderBottom: "1px solid var(--border-color)"
              }}
            >
              <div>
                <span className="worker-section-label">{t("worker.careVerificationFormSection")}</span>
                <h2 style={{ fontSize: "16px", margin: 0 }}>
                  {t("worker.performFollowUpTitle", { name: t(activeTask.patientName), id: activeTask.patientId })}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)"
                }}
              >
                <X style={{ width: "20px", height: "20px" }} />
              </button>
            </div>

            {successMessage ? (
              <div style={{ textAlign: "center", padding: "30px 10px" }}>
                <CheckCircle2 style={{ width: "44px", height: "44px", color: "#16a34a", margin: "0 auto 12px" }} />
                <h3>{successMessage}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>
                  {t("worker.updatingTaskRegistry")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveFollowUp} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                    {t("worker.followUpPurposeTaskLabel")}
                  </label>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
                    {t(activeTask.reason)}
                  </p>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
                    {t("worker.clinicalRecoveryOutcomeLabel")}
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {FOLLOW_UP_OUTCOMES.map((out) => {
                      const isSelected = outcome === out;
                      const outcomeKeyMap = {
                        "Stable": "stable",
                        "Improving": "improving",
                        "Deteriorating": "deteriorating",
                        "Non-Compliant": "nonCompliant",
                        "Referred to Hospital": "referredToHospital",
                        "Resolved": "resolved"
                      };
                      const outcomeLabel = outcomeKeyMap[out] ? t(`worker.outcomes.${outcomeKeyMap[out]}`) : out;

                      return (
                        <button
                          key={out}
                          type="button"
                          onClick={() => setOutcome(out)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            border: isSelected ? "1px solid var(--primary-color)" : "1px solid var(--border-color)",
                            background: isSelected ? "var(--primary-color)" : "var(--bg-secondary)",
                            color: isSelected ? "white" : "var(--text-primary)"
                          }}
                        >
                          {outcomeLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                    {t("worker.observationAdherenceNotesLabel")}
                  </label>
                  <textarea
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    required
                    placeholder={t("worker.notesTextareaPlaceholder")}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      fontSize: "13px"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                    {t("worker.nextActionPlannedLabel")}
                  </label>
                  <input
                    type="text"
                    value={nextAction}
                    onChange={(e) => setNextAction(e.target.value)}
                    placeholder={t("worker.nextActionPlannedPlaceholder")}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      fontSize: "13px"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                    {t("worker.scheduleSubsequentFollowUpOptional")}
                  </label>
                  <input
                    type="date"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      fontSize: "13px"
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    paddingTop: "10px",
                    borderTop: "1px solid var(--border-color)"
                  }}
                >
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={{
                      padding: "9px 16px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      background: "var(--card-bg)",
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {t("common.cancel")}
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "9px 18px",
                      borderRadius: "8px",
                      background: "var(--primary-color)",
                      color: "white",
                      border: "none",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    <Send style={{ width: "13px", height: "13px" }} />
                    {submitting ? t("worker.savingFollowUpBtn") : t("worker.recordCompleteFollowUpBtn")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkerFollowUps;

