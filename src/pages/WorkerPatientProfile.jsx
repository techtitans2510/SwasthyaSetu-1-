import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useLanguage from "../hooks/useLanguage";
import {
  ArrowLeft,
  Plus,
  GitBranch,
  MapPin,
  Building2,
  Calendar,
  Activity,
  Heart,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText
} from "lucide-react";
import { getWorkerPatientById } from "../api/workerPatients.api";

function WorkerPatientProfile() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadPatient() {
      setLoading(true);
      setError("");
      try {
        const data = await getWorkerPatientById(id);
        if (isMounted) {
          setPatient(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || `Failed to load profile for patient ${id}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadPatient();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="worker-dashboard">
        <p style={{ color: "var(--text-secondary)", padding: "30px 0" }}>
          {t("worker.loadingPatientProfile", "Loading community patient profile...")}
        </p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="worker-dashboard">
        <Link
          to="/worker/patients"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--primary-color)",
            marginBottom: "16px",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: 600
          }}
        >
          <ArrowLeft style={{ width: "16px", height: "16px" }} />
          {t("worker.backToPatientsRegistry", "Back to Patients Registry")}
        </Link>
        <div className="worker-panel" style={{ maxWidth: "600px", padding: "30px" }}>
          <AlertTriangle style={{ width: "36px", height: "36px", color: "#d97706", marginBottom: "12px" }} />
          <h2>{t("worker.patientProfileNotFound", "Patient Profile Not Found")}</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "6px", fontSize: "14px" }}>
            {error || t("worker.noCatchmentRecordFound", { id }, `No catchment record found matching patient identifier "${id}".`)}
          </p>
          <div style={{ marginTop: "18px" }}>
            <Link
              to="/worker/patients"
              style={{
                display: "inline-block",
                padding: "8px 16px",
                background: "var(--primary-color)",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 600
              }}
            >
              {t("worker.returnToPatientList", "Return to Patient List")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isHighRisk = patient.riskCategory === "High Risk";
  const isMaternal = patient.riskCategory === "Maternal Care" || patient.isPregnant;
  const visitHistory = patient.visitHistory || [];
  const referrals = patient.referrals || [];
  const followUps = patient.followUps || [];
  const latestVisit = patient.latestVisit;

  return (
    <div className="worker-dashboard">
      {/* BACK BUTTON */}
      <Link
        to="/worker/patients"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--primary-color)",
          marginBottom: "16px",
          textDecoration: "none",
          fontSize: "13px",
          fontWeight: 600
        }}
      >
        <ArrowLeft style={{ width: "16px", height: "16px" }} />
        {t("worker.backToPatientsRegistry", "Back to Patients Registry")}
      </Link>

      {/* ==============================================================
          1. PATIENT HEADER
      ============================================================== */}
      <header
        className="worker-page-header"
        style={{
          paddingBottom: "20px",
          borderBottom: "1px solid var(--border-color)",
          marginBottom: "22px"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
            <span className="worker-eyebrow" style={{ margin: 0 }}>
              {t("worker.communityProfileEyebrow", "Community Profile")}
            </span>

            <span
              style={{
                fontSize: "12px",
                padding: "2px 8px",
                borderRadius: "4px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                fontFamily: "monospace",
                color: "var(--text-secondary)"
              }}
            >
              {patient.id}
            </span>

            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "2px 8px",
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
              {t(patient.riskCategory)}
            </span>
          </div>

          <h1 style={{ fontSize: "28px", margin: 0 }}>{t(patient.name)}</h1>

          <p style={{ marginTop: "6px", fontSize: "13px", color: "var(--text-secondary)" }}>
            {patient.age} {t("worker.yrs", "yrs")} • {t(patient.gender)} • {t("worker.bloodGroupLabel", "Blood Group:")} {patient.bloodGroup || "O+"} •{" "}
            <MapPin style={{ width: "13px", height: "13px", display: "inline", verticalAlign: "middle" }} />{" "}
            {t(patient.village)} ({t(patient.address)})
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "6px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-secondary)"
              }}
            >
              <ShieldCheck style={{ width: "12px", height: "12px", color: "var(--primary-color)" }} />
              {t("worker.abhaLabel", "ABHA:")} {patient.abhaNumber}
            </span>

            {patient.tags?.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)"
                }}
              >
                {t(tag)}
              </span>
            ))}
          </div>
        </div>

        {/* HEADER ACTIONS */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-start" }}>
          <Link
            to={`/worker/referrals/new?patientId=${patient.id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 16px",
              background: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "13px",
              textDecoration: "none"
            }}
          >
            <GitBranch style={{ width: "15px", height: "15px", color: "var(--primary-color)" }} />
            {t("worker.createReferralBtn", "Create Referral")}
          </Link>

          <Link
            to={`/worker/visits/new?patientId=${patient.id}`}
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
          2. OVERVIEW (CARE CONTEXT, LATEST VITALS, SCHEDULE)
      ============================================================== */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "18px",
          marginBottom: "24px"
        }}
      >
        {/* CARE CONTEXT & CONDITIONS */}
        <div className="worker-panel">
          <div className="worker-panel-header">
            <div>
              <span className="worker-section-label">{t("worker.careContextLabel", "Care Context")}</span>
              <h2 style={{ fontSize: "16px" }}>{t("worker.clinicalSummaryTitle", "Clinical Summary")}</h2>
            </div>
            <Activity style={{ width: "16px", height: "16px", color: "var(--primary-color)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
            <div>
              <span style={{ color: "var(--text-secondary)", fontSize: "11px", display: "block" }}>
                {t("worker.identifiedConditions", "Identified Conditions")}
              </span>
              <strong>{patient.chronicConditions ? patient.chronicConditions.map((c) => t(c)).join(", ") : t("worker.generalRoutineCare", "General Routine Care")}</strong>
            </div>

            {patient.allergies && patient.allergies.length > 0 && (
              <div>
                <span style={{ color: "var(--text-secondary)", fontSize: "11px", display: "block" }}>
                  {t("worker.knownAllergies", "Known Allergies")}
                </span>
                <span style={{ color: patient.allergies[0] !== "None known" ? "#dc2626" : "inherit" }}>
                  {patient.allergies.map((a) => t(a)).join(", ")}
                </span>
              </div>
            )}

            <div>
              <span style={{ color: "var(--text-secondary)", fontSize: "11px", display: "block" }}>
                {t("worker.primaryHealthFacility", "Primary Health Facility")}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                <Building2 style={{ width: "13px", height: "13px", color: "var(--text-secondary)" }} />
                <span>{t(patient.primaryFacility || "Shirur 24x7 Primary Health Centre")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* LATEST VITALS / SCREENING */}
        <div className="worker-panel">
          <div className="worker-panel-header">
            <div>
              <span className="worker-section-label">{t("worker.latestFieldScreeningSection", "Latest Field Screening")}</span>
              <h2 style={{ fontSize: "16px" }}>{t("worker.vitalsObservationsTitle", "Vitals & Observations")}</h2>
            </div>
            <Heart style={{ width: "16px", height: "16px", color: "var(--primary-color)" }} />
          </div>

          {latestVisit ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                <div
                  style={{
                    padding: "8px",
                    background: "var(--bg-secondary)",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}
                >
                  <span style={{ fontSize: "10px", color: "var(--text-secondary)", display: "block" }}>
                    {t("worker.bloodPressureLabel", "Blood Pressure")}
                  </span>
                  <strong style={{ fontSize: "13px", color: latestVisit.vitals?.bpSystolic > 140 ? "#dc2626" : "inherit" }}>
                    {latestVisit.vitals?.bpSystolic}/{latestVisit.vitals?.bpDiastolic}
                  </strong>
                  <small style={{ fontSize: "9px", color: "var(--text-secondary)", display: "block" }}>mmHg</small>
                </div>

                <div
                  style={{
                    padding: "8px",
                    background: "var(--bg-secondary)",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}
                >
                  <span style={{ fontSize: "10px", color: "var(--text-secondary)", display: "block" }}>
                    {t("worker.bloodSugarLabel", "Blood Sugar")}
                  </span>
                  <strong style={{ fontSize: "13px", color: latestVisit.vitals?.bloodSugar > 180 ? "#dc2626" : "inherit" }}>
                    {latestVisit.vitals?.bloodSugar || "—"}
                  </strong>
                  <small style={{ fontSize: "9px", color: "var(--text-secondary)", display: "block" }}>mg/dL</small>
                </div>

                <div
                  style={{
                    padding: "8px",
                    background: "var(--bg-secondary)",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}
                >
                  <span style={{ fontSize: "10px", color: "var(--text-secondary)", display: "block" }}>
                    {t("worker.spo2PulseLabel", "SpO2 / Pulse")}
                  </span>
                  <strong style={{ fontSize: "13px" }}>
                    {latestVisit.vitals?.spo2}% / {latestVisit.vitals?.pulse}
                  </strong>
                  <small style={{ fontSize: "9px", color: "var(--text-secondary)", display: "block" }}>bpm</small>
                </div>
              </div>

              <div style={{ fontSize: "12px", marginTop: "2px" }}>
                <span style={{ color: "var(--text-secondary)" }}>{t("worker.observationsLabel", "Observations:")} </span>
                <span>{t(latestVisit.observations || "Screening completed within normal limits.")}</span>
              </div>
            </div>
          ) : (
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", padding: "10px 0" }}>
              {t("worker.noPreviousVisitLogged", "No previous visit screening logged. Click \"Record New Visit\" to document baseline vitals.")}
            </p>
          )}
        </div>

        {/* SCHEDULE & CONTINUITY */}
        <div className="worker-panel">
          <div className="worker-panel-header">
            <div>
              <span className="worker-section-label">{t("worker.careCadenceSection", "Care Cadence")}</span>
              <h2 style={{ fontSize: "16px" }}>{t("worker.scheduleContinuityTitle", "Schedule & Continuity")}</h2>
            </div>
            <Calendar style={{ width: "16px", height: "16px", color: "var(--primary-color)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
            <div>
              <span style={{ color: "var(--text-secondary)", fontSize: "11px", display: "block" }}>
                {t("worker.lastVisitRecorded", "Last Visit Recorded")}
              </span>
              <strong>{patient.lastVisitDate || t("worker.noPriorRecords", "No prior records")}</strong>
            </div>

            <div>
              <span style={{ color: "var(--text-secondary)", fontSize: "11px", display: "block" }}>
                {t("worker.nextFollowUpDue", "Next Follow-up Due")}
              </span>
              <strong style={{ color: patient.hasPendingFollowUp ? "#d97706" : "inherit" }}>
                {patient.nextFollowUp || patient.nextScheduledVisit || t("worker.notScheduledText", "Not scheduled")}
              </strong>
            </div>

            <div>
              <span style={{ color: "var(--text-secondary)", fontSize: "11px", display: "block" }}>
                {t("worker.continuityStatus", "Continuity Status")}
              </span>
              <span
                style={{
                  display: "inline-block",
                  marginTop: "2px",
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: "6px",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)"
                }}
              >
                {patient.hasPendingFollowUp
                  ? t("worker.followUpRequiredStatus", "Follow-up Required")
                  : patient.activeReferralId
                  ? t("worker.referredToFacilityStatus", "Referred to Facility")
                  : t("worker.routineMonitoringStatus", "Routine Community Monitoring")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          MAIN CONTENT: VISIT HISTORY + (REFERRALS & FOLLOW-UPS)
      ============================================================== */}
      <div className="worker-dashboard-grid">
        {/* LEFT COLUMN: 3. VISIT HISTORY */}
        <div className="worker-panel">
          <div className="worker-panel-header">
            <div>
              <span className="worker-section-label">{t("worker.careTimelineSection", "Care Timeline")}</span>
              <h2>{t("worker.fieldVisitHistoryTitle", { count: visitHistory.length }, `Field Visit History (${visitHistory.length})`)}</h2>
            </div>

            <Link
              to={`/worker/visits/new?patientId=${patient.id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color: "var(--primary-color)",
                fontSize: "12px",
                fontWeight: 600,
                textDecoration: "none"
              }}
            >
              <Plus style={{ width: "14px", height: "14px" }} />
              {t("worker.logVisitBtn", "Log Visit")}
            </Link>
          </div>

          {visitHistory.length === 0 ? (
            <div style={{ padding: "30px 20px", textAlign: "center", color: "var(--text-secondary)" }}>
              <FileText style={{ width: "32px", height: "32px", margin: "0 auto 8px", color: "var(--border-color)" }} />
              <p style={{ fontSize: "13px" }}>{t("worker.noPreviousFieldVisits", "No previous field visits recorded for this patient.")}</p>
              <Link
                to={`/worker/visits/new?patientId=${patient.id}`}
                style={{
                  display: "inline-block",
                  marginTop: "10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--primary-color)",
                  textDecoration: "none"
                }}
              >
                {t("worker.recordBaselineScreening", "+ Record Baseline Screening Visit")}
              </Link>
            </div>
          ) : (
            <div className="worker-visit-list">
              {visitHistory.map((visit) => (
                <article className="worker-visit-item" key={visit.id}>
                  <div className="worker-visit-time">
                    {visit.visitDate}
                    <span
                      style={{
                        display: "block",
                        marginTop: "2px",
                        fontSize: "10px",
                        fontWeight: "normal",
                        color: "var(--text-secondary)"
                      }}
                    >
                      {visit.visitTime || "09:00 AM"}
                    </span>
                  </div>

                  <div className="worker-visit-main">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <strong>
                        BP {visit.vitals?.bpSystolic}/{visit.vitals?.bpDiastolic} mmHg
                        {visit.vitals?.bloodSugar && ` • Sugar ${visit.vitals.bloodSugar} mg/dL`}
                      </strong>

                      {visit.referredToFacility && (
                        <span
                          style={{
                            fontSize: "10px",
                            padding: "1px 6px",
                            borderRadius: "4px",
                            background: "rgba(217, 119, 6, 0.12)",
                            color: "#d97706",
                            fontWeight: 600
                          }}
                        >
                          {t("worker.referredBadge", "Referred")}
                        </span>
                      )}
                    </div>

                    <p style={{ margin: "4px 0 2px", fontSize: "12px", color: "var(--text-primary)" }}>
                      {t(visit.observations)}
                    </p>

                    <small style={{ color: "var(--text-secondary)", fontSize: "11px" }}>
                      {t("worker.actionTakenLabel", "Action Taken:")} {t(visit.treatmentGiven || "General guidance provided")}
                    </small>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: 4. REFERRALS & 5. FOLLOW-UPS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* 4. REFERRALS SECTION */}
          <div className="worker-panel">
            <div className="worker-panel-header">
              <div>
                <span className="worker-section-label">{t("worker.facilityEscalationSection", "Facility Escalation")}</span>
                <h2>{t("worker.activePastReferralsTitle", { count: referrals.length }, `Active & Past Referrals (${referrals.length})`)}</h2>
              </div>

              <Link
                to={`/worker/referrals/new?patientId=${patient.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "var(--primary-color)",
                  fontSize: "12px",
                  fontWeight: 600,
                  textDecoration: "none"
                }}
              >
                <Plus style={{ width: "13px", height: "13px" }} />
                {t("worker.newBtn", "New")}
              </Link>
            </div>

            {referrals.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", padding: "10px 0" }}>
                {t("worker.noActivePastReferrals", "No active or past referrals recorded for this patient.")}
              </p>
            ) : (
              <div className="worker-alert-list">
                {referrals.map((ref) => (
                  <article
                    className={`worker-alert ${ref.urgency === "Urgent" ? "warning" : "info"}`}
                    key={ref.id}
                    style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <GitBranch style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "2px" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "6px" }}>
                          <strong>
                            {ref.id} • {t(ref.urgency)}
                          </strong>
                          <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
                            {ref.referralDate}
                          </span>
                        </div>
                        <p style={{ margin: "2px 0", fontSize: "11px" }}>{t(ref.reason)}</p>
                        <small style={{ display: "block", color: "var(--text-secondary)", fontSize: "10px" }}>
                          {t(ref.facilityName)} ({t(ref.status)})
                        </small>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <Link
                        to={`/worker/referrals/${ref.id}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--primary-color)",
                          textDecoration: "none"
                        }}
                      >
                        {t("worker.referralDetailsLink", "Referral Details")}
                        <ArrowRight style={{ width: "12px", height: "12px" }} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* 5. FOLLOW-UPS SECTION */}
          <div className="worker-panel">
            <div className="worker-panel-header">
              <div>
                <span className="worker-section-label">{t("worker.careTasksSection", "Care Tasks")}</span>
                <h2>{t("worker.followUpsTitle", { count: followUps.length }, `Follow-ups (${followUps.length})`)}</h2>
              </div>

              <Clock style={{ width: "16px", height: "16px", color: "var(--text-secondary)" }} />
            </div>

            {followUps.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", padding: "10px 0" }}>
                {t("worker.noPendingFollowUps", "No pending follow-ups currently scheduled for this patient.")}
              </p>
            ) : (
              <div className="worker-alert-list">
                {followUps.map((task) => (
                  <article
                    className={`worker-alert ${task.status === "completed" ? "info" : "warning"}`}
                    key={task.id}
                    style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "6px" }}>
                      <strong style={{ fontSize: "12px" }}>{t(task.type)}</strong>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          color: task.status === "completed" ? "var(--primary-color)" : "#d97706"
                        }}
                      >
                        {task.status === "completed" ? t("completed", "Completed") : `${t("worker.dueLabel", "Due:")} ${task.dueDate}`}
                      </span>
                    </div>

                    <p style={{ margin: "2px 0", fontSize: "11px" }}>{t(task.reason)}</p>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                      <Link
                        to="/worker/follow-ups"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--primary-color)",
                          textDecoration: "none"
                        }}
                      >
                        {t("worker.manageFollowUpsLink", "Manage Follow-ups")}
                        <ArrowRight style={{ width: "12px", height: "12px" }} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkerPatientProfile;
