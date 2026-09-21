import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLanguage from "../hooks/useLanguage";
import { getWorkerDashboardSummary } from "../api/workerVisits.api";

import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  GitBranch,
  MapPin,
  Users,
  Activity,
  Clock
} from "lucide-react";

function WorkerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getWorkerDashboardSummary();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to load worker dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const workerRole =
    user?.role === "asha"
      ? t("auth.ashaRole", "ASHA Worker")
      : user?.role === "nurse"
      ? t("worker.roles.nurse", "Primary Care Nurse")
      : t("worker.roles.anm", "ANM Field Worker");

  const stats = dashboardData?.stats;
  const todayVisits = dashboardData?.todayVisits || [];
  const alerts = dashboardData?.alerts || [];
  const recentActivity = dashboardData?.recentActivity || [];
  const pendingFollowUps = dashboardData?.pendingFollowUps || [];
  const urgentReferrals = dashboardData?.urgentReferrals || [];

  const summaryCards = [
    {
      label: t("worker.myPatients", "My Patients"),
      value: stats?.assignedPatients || "48",
      subtext: t("worker.assignedCatchment", "Assigned in catchment"),
      to: "/worker/patients",
      icon: Users
    },
    {
      label: t("worker.todayVisits", "Today's Visits"),
      value: todayVisits.length || "3",
      subtext: t("worker.scheduledFieldChecks", "Scheduled field checks"),
      to: "/worker/visits",
      icon: CalendarDays
    },
    {
      label: t("worker.followUpsDue", "Follow-ups Due"),
      value: pendingFollowUps.length || "2",
      subtext: t("worker.postCareVerifications", "Post-care verifications"),
      to: "/worker/follow-ups",
      icon: ClipboardList
    },
    {
      label: t("worker.openReferrals", "Open Referrals"),
      value: urgentReferrals.length || "2",
      subtext: t("worker.pendingFacilityReview", "Pending facility review"),
      to: "/worker/referrals",
      icon: GitBranch
    }
  ];

  if (loading) {
    return (
      <div className="worker-dashboard">
        <p style={{ color: "var(--text-secondary)", padding: "30px 0" }}>
          {t("loading", "Loading field care workspace...")}
        </p>
      </div>
    );
  }

  return (
    <div className="worker-dashboard">
      {/* ==============================================================
          1. WORKER CONTEXT & HEADER
      ============================================================== */}
      <header className="worker-page-header">
        <div>
          <span className="worker-eyebrow">
            {t("worker.fieldCareWorkspace", "Field Care Workspace")} • {workerRole}
          </span>

          <h1>{t("worker.welcome", { name: user?.name || "Sunita Devi" })}</h1>

          <p>
            {t("worker.workspaceDesc", "Track assigned catchment families, record maternal & child checkups, and manage emergency facility referrals.")}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
          <div className="worker-location-badge">
            <MapPin />
            <span>{stats?.catchmentArea || t("worker.catchmentLocation", "Talwade & Shirur Catchment (Sub-Centre 4)")}</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              borderRadius: "var(--radius-full)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              fontSize: "var(--text-xs)",
              color: "var(--text-secondary)"
            }}
          >
            <span className="sync-pulse-dot" />
            <span>{t("worker.onlineSyncedAbdm", "Online · Synced with ABDM Registry")}</span>
          </div>
        </div>
      </header>

      {/* ==============================================================
          2. SUMMARY CARDS
      ============================================================== */}
      <section className="worker-stat-grid">
        {summaryCards.map(({ label, value, subtext, to, icon: Icon }) => (
          <NavLink
            to={to}
            key={label}
            className="worker-stat-card"
            style={{
              textDecoration: "none",
              color: "inherit"
            }}
            aria-label={`${label}: ${value}, ${subtext}`}
          >
            <div className="worker-stat-icon">
              <Icon />
            </div>

            <div>
              <span>{label}</span>
              <strong>{value}</strong>
              <small
                style={{
                  display: "block",
                  marginTop: "3px",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-secondary)"
                }}
              >
                {subtext}
              </small>
            </div>

            <ArrowRight className="stat-card-arrow" aria-hidden="true" />
          </NavLink>
        ))}
      </section>

      {/* ==============================================================
          3. MAIN DASHBOARD CONTENT (TODAY'S WORK + NEEDS ATTENTION)
      ============================================================== */}
      <section className="worker-dashboard-grid">
        {/* LEFT COLUMN: TODAY'S WORK */}
        <div className="worker-panel">
          <div className="worker-panel-header">
            <div>
              <span className="worker-section-label">{t("worker.todaysScheduleSection", "Today's Schedule")}</span>
              <h2>{t("worker.scheduledFieldVisitsTitle", { count: todayVisits.length }, `Scheduled Field Visits (${todayVisits.length})`)}</h2>
            </div>

            <NavLink to="/worker/visits" className="btn-header-link">
              <span>{t("worker.viewAllVisits", "View all visits")}</span>
              <ArrowRight />
            </NavLink>
          </div>

          <div className="worker-visit-list">
            {todayVisits.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", padding: "20px 0", fontSize: "var(--text-sm)" }}>
                {t("worker.noMoreVisitsToday", "No more visits scheduled for today.")}
              </p>
            ) : (
              todayVisits.map((visit) => {
                const isHighRisk = visit.riskLevel === "High Risk";
                const isMaternal = visit.riskLevel === "Maternal Care";

                return (
                  <article
                    className="worker-visit-item"
                    key={`${visit.id}-${visit.patientId}`}
                  >
                    <div className="worker-visit-time">
                      {visit.time}
                      <span
                        style={{
                          display: "block",
                          marginTop: "3px",
                          fontSize: "var(--text-xs)",
                          fontWeight: 500,
                          color: "var(--text-secondary)"
                        }}
                      >
                        {visit.status === "scheduled" ? t("worker.upcomingStatus", "Upcoming") : visit.status}
                      </span>
                    </div>

                    <div className="worker-visit-main">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <strong>
                          {visit.patientName}
                        </strong>

                        <span
                          style={{
                            fontSize: "var(--text-xs)",
                            padding: "2px 6px",
                            borderRadius: "var(--radius-sm)",
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
                            fontSize: "var(--text-xs)",
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: "var(--radius-full)",
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

                      <span>{visit.purpose}</span>

                      <small>
                        <MapPin />
                        {visit.village}
                      </small>
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <Link
                        to={`/worker/patients/${visit.patientId}`}
                        aria-label={`View patient profile for ${visit.patientName}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "8px 14px",
                          border: "1px solid var(--border-color)",
                          borderRadius: "var(--radius-md)",
                          color: "var(--text-primary)",
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                          textDecoration: "none",
                          background: "var(--card-bg)"
                        }}
                      >
                        {t("worker.patientBtn", "Patient")}
                      </Link>

                      <Link
                        to={`/worker/visits/new?patientId=${visit.patientId}`}
                        aria-label={`Start visit for ${visit.patientName}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "8px 14px",
                          background: "var(--primary-color)",
                          color: "white",
                          border: "1px solid var(--primary-color)",
                          borderRadius: "var(--radius-md)",
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                          textDecoration: "none"
                        }}
                      >
                        {t("worker.startVisitBtn", "Start Visit")}
                      </Link>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: NEEDS ATTENTION & RECENT ACTIVITY */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* NEEDS ATTENTION */}
          <div className="worker-panel">
            <div className="worker-panel-header">
              <div>
                <span className="worker-section-label">{t("worker.needsAttentionSection", "Needs attention")}</span>
                <h2>{t("worker.careAlertsTasksTitle", { count: alerts.length }, `Care Alerts & Tasks (${alerts.length})`)}</h2>
              </div>

              <AlertTriangle style={{ color: "var(--tertiary-color)", width: "19px", height: "19px" }} />
            </div>

            <div className="worker-alert-list">
              {alerts.map((alert) => (
                <article
                  className={`worker-alert ${alert.type || "info"}`}
                  key={alert.id || alert.title}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    {alert.type === "warning" ? (
                      <AlertTriangle style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "2px" }} />
                    ) : (
                      <GitBranch style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "2px" }} />
                    )}

                    <div style={{ flex: 1 }}>
                      <strong>{alert.title}</strong>
                      <p>{alert.detail}</p>
                    </div>
                  </div>

                  {alert.linkTo && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <Link
                        to={alert.linkTo}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                          color: "var(--primary-color)",
                          textDecoration: "none"
                        }}
                      >
                        {t("worker.openActionItem", "Open Action Item")}
                        <ArrowRight style={{ width: "12px", height: "12px" }} />
                      </Link>
                    </div>
                  )}
                </article>
              ))}
            </div>

            {/* CARE CONTINUITY PRINCIPLE (INFORMATIONAL CALLOUT) */}
            <aside className="worker-info-callout" role="note" aria-label="Care Continuity Principle">
              <CheckCircle2 />
              <div>
                <strong>{t("worker.careContinuityTitle", "Care Continuity Principle")}</strong>
                <span>
                  {t("worker.careContinuityDesc", "Every patient referral stays visible on your dashboard until clinical outcome closure is confirmed by the facility.")}
                </span>
              </div>
            </aside>
          </div>

          {/* 5. RECENT ACTIVITY */}
          <div className="worker-panel">
            <div className="worker-panel-header">
              <div>
                <span className="worker-section-label">{t("worker.auditLogSection", "Audit Log")}</span>
                <h2>{t("worker.recentActivityTitle", "Recent Activity")}</h2>
              </div>

              <Activity style={{ width: "17px", height: "17px", color: "var(--text-secondary)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-secondary)",
                    fontSize: "var(--text-xs)"
                  }}
                >
                  <Clock style={{ width: "14px", height: "14px", color: "var(--text-secondary)", marginTop: "2px", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "6px" }}>
                      <strong style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>{activity.title}</strong>
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", flexShrink: 0 }}>{activity.timeAgo}</span>
                    </div>
                    <p style={{ margin: "3px 0 0", color: "var(--text-secondary)", fontSize: "var(--text-xs)", lineHeight: 1.4 }}>
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WorkerDashboard;