import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Building2,
  Clock,
  User,
  GitBranch,
  AlertCircle,
  Activity,
  Plus,
  CheckCircle2,
  ArrowRight,
  Info
} from "lucide-react";
import useLanguage from "../hooks/useLanguage";
import {
  getWorkerReferralById,
  REFERRAL_STATUS_CONFIG
} from "../api/workerReferrals.api";

function WorkerReferralDetails() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getWorkerReferralById(id);
        setReferral(data);
      } catch (err) {
        setError(err.message || "Failed to load referral details");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="worker-dashboard">
        <p style={{ color: "var(--text-secondary)", padding: "30px 0" }}>
          {t("worker.loadingReferralDetails")}
        </p>
      </div>
    );
  }

  if (error || !referral) {
    return (
      <div className="worker-dashboard">
        <Link
          to="/worker/referrals"
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
          {t("worker.backToReferrals")}
        </Link>
        <div className="worker-panel" style={{ maxWidth: "600px" }}>
          <h2>{t("worker.referralCaseNotFound")}</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>
            {error || t("worker.noReferralRecordExists", { id })}
          </p>
        </div>
      </div>
    );
  }

  const statusConfig = REFERRAL_STATUS_CONFIG[referral.status] || {
    label: referral.status,
    color: "var(--text-secondary)",
    bg: "var(--bg-secondary)",
    nextActionGuidance: "Review referral status with local health authority."
  };

  const isUrgent = referral.urgency === "Urgent" || referral.urgency === "Emergency";
  const history = referral.statusHistory || [
    {
      status: referral.status,
      timestamp: referral.createdDate || referral.referralDate,
      actor: referral.referringWorker || "ASHA Field Worker",
      role: "Field Health Worker",
      note: "Referral created and logged in registry."
    }
  ];

  return (
    <div className="worker-dashboard">
      <Link
        to="/worker/referrals"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--primary-color)",
          marginBottom: "18px",
          textDecoration: "none",
          fontSize: "13px",
          fontWeight: 600
        }}
      >
        <ArrowLeft style={{ width: "16px", height: "16px" }} />
        {t("worker.backToReferralsRegistry")}
      </Link>

      {/* ==============================================================
          1. REFERRAL HEADER
      ============================================================== */}
      <header className="worker-page-header">
        <div>
          <span className="worker-eyebrow">{t("worker.referralCaseEyebrow", { id: referral.id })}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginTop: "4px" }}>
            <h1 style={{ margin: 0 }}>{referral.patientName}</h1>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 10px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 600,
                background: statusConfig.bg,
                color: statusConfig.color,
                border: `1px solid ${statusConfig.color}40`
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: statusConfig.color }} />
              {statusConfig.label}
            </span>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 600,
                background: isUrgent ? "rgba(220, 38, 38, 0.12)" : "var(--bg-secondary)",
                color: isUrgent ? "#dc2626" : "var(--text-secondary)",
                border: isUrgent ? "1px solid rgba(220, 38, 38, 0.25)" : "1px solid var(--border-color)"
              }}
            >
              {isUrgent && <AlertCircle style={{ width: "12px", height: "12px" }} />}
              Urgency: {referral.urgency}
            </span>
          </div>
          <p style={{ marginTop: "6px" }}>
            {t("worker.referredOnDate", {
              date: referral.createdDate || referral.referralDate,
              specialty: referral.serviceRequired || referral.specialtyRequired,
              facility: referral.destinationFacility || referral.facilityName
            })}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Link
            to={`/worker/patients/${referral.patientId}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              background: "var(--card-bg)",
              color: "var(--text-primary)",
              fontSize: "12px",
              fontWeight: 600,
              textDecoration: "none"
            }}
          >
            <User style={{ width: "14px", height: "14px" }} />
            {t("worker.viewPatientBtn")} ({referral.patientId})
          </Link>

          <Link
            to={`/worker/visits/new?patientId=${referral.patientId}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              background: "var(--primary-color)",
              color: "white",
              fontSize: "12px",
              fontWeight: 600,
              textDecoration: "none"
            }}
          >
            <Plus style={{ width: "14px", height: "14px" }} />
            {t("worker.recordHomeVisitBtn")}
          </Link>
        </div>
      </header>

      {/* ==============================================================
          2. CONTEXTUAL NEXT ACTION GUIDANCE STATE
      ============================================================== */}
      <div
        className="worker-panel"
        style={{
          marginBottom: "20px",
          background: statusConfig.bg,
          borderColor: `${statusConfig.color}40`,
          padding: "16px 20px"
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <Info style={{ width: "20px", height: "20px", color: statusConfig.color, marginTop: "2px", flexShrink: 0 }} />
          <div>
            <strong style={{ fontSize: "13px", color: statusConfig.color, display: "block" }}>
              {t("worker.currentReferralState", { state: statusConfig.label })}
            </strong>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.5 }}>
              {statusConfig.nextActionGuidance}
            </p>
          </div>
        </div>
      </div>

      {/* ==============================================================
          3. MAIN CONTENT: CASE DETAILS & STATUS TIMELINE
      ============================================================== */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", maxWidth: "980px" }}>
        {/* LEFT COLUMN: CLINICAL DETAILS & FACILITY OUTCOME */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* CASE INFORMATION */}
          <div className="worker-panel">
            <div className="worker-panel-header">
              <div>
                <span className="worker-section-label">{t("worker.referralMetadataSection")}</span>
                <h2>{t("worker.clinicalEscalationDetailsTitle")}</h2>
              </div>
              <GitBranch style={{ width: "16px", height: "16px", color: "var(--primary-color)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px" }}>
              <div>
                <strong style={{ display: "block", fontSize: "11px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "3px" }}>
                  {t("worker.targetHealthFacilityLabel")}
                </strong>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                  <Building2 style={{ width: "15px", height: "15px", color: "var(--primary-color)" }} />
                  {referral.destinationFacility || referral.facilityName}
                </div>
              </div>

              <div>
                <strong style={{ display: "block", fontSize: "11px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "3px" }}>
                  {t("worker.specialtyDeptRequired")}
                </strong>
                <div>{referral.serviceRequired || referral.specialtyRequired}</div>
              </div>

              <div>
                <strong style={{ display: "block", fontSize: "11px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "3px" }}>
                  {t("worker.reasonForReferralLabel")}
                </strong>
                <div style={{ lineHeight: 1.5 }}>{referral.reason}</div>
              </div>

              <div>
                <strong style={{ display: "block", fontSize: "11px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "3px" }}>
                  {t("worker.referringWorkerLabel")}
                </strong>
                <div>{referral.referringWorker || "Ananya Sharma (ASHA-001)"}</div>
              </div>

              {referral.notes && (
                <div>
                  <strong style={{ display: "block", fontSize: "11px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "3px" }}>
                    {t("worker.ashaNotesLabel")}
                  </strong>
                  <div style={{ lineHeight: 1.5 }}>{referral.notes}</div>
                </div>
              )}
            </div>
          </div>

          {/* CLINICAL OUTCOME & ACTION */}
          <div className="worker-panel">
            <div className="worker-panel-header">
              <div>
                <span className="worker-section-label">{t("worker.careOutcomeSection")}</span>
                <h2>{t("worker.facilityAcknowledgementOutcomeTitle")}</h2>
              </div>
              <Activity style={{ width: "16px", height: "16px", color: "var(--primary-color)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px" }}>
              <div>
                <strong style={{ display: "block", fontSize: "11px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "3px" }}>
                  {t("worker.facilityAcknowledgementStatusLabel")}
                </strong>
                <div>{referral.acknowledgementStatus || t("worker.awaitingFacilityReviewStatus")}</div>
              </div>

              {referral.outcome ? (
                <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(22, 163, 74, 0.08)", border: "1px solid rgba(22, 163, 74, 0.2)" }}>
                  <strong style={{ display: "block", fontSize: "11px", textTransform: "uppercase", color: "#16a34a", marginBottom: "3px" }}>
                    {t("worker.dischargeOutcomeReportTitle")}
                  </strong>
                  <div style={{ color: "var(--text-primary)", lineHeight: 1.5 }}>{referral.outcome}</div>
                </div>
              ) : (
                <div style={{ padding: "12px", borderRadius: "8px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
                  <strong style={{ display: "block", fontSize: "11px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "3px" }}>
                    {t("worker.clinicalOutcomeLabel")}
                  </strong>
                  <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                    {t("worker.consultationInProgressAwaiting")}
                  </div>
                </div>
              )}

              {referral.status === "COMPLETED" && (
                <div style={{ marginTop: "4px" }}>
                  <Link
                    to="/worker/follow-ups"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--primary-color)",
                      textDecoration: "none"
                    }}
                  >
                    {t("worker.openPostReferralTasks")}
                    <ArrowRight style={{ width: "13px", height: "13px" }} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CHRONOLOGICAL STATUS TIMELINE */}
        <div className="worker-panel">
          <div className="worker-panel-header">
            <div>
              <span className="worker-section-label">{t("worker.lifecycleAuditSection")}</span>
              <h2>{t("worker.referralStatusTimelineTitle", { count: history.length })}</h2>
            </div>
            <Clock style={{ width: "16px", height: "16px", color: "var(--primary-color)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
            {history.map((step, idx) => {
              const stepCfg = REFERRAL_STATUS_CONFIG[step.status] || {
                label: step.status,
                color: "var(--text-secondary)",
                bg: "var(--bg-secondary)"
              };
              const isLast = idx === history.length - 1;

              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: "12px",
                    position: "relative"
                  }}
                >
                  {/* TIMELINE CONNECTOR LINE */}
                  {!isLast && (
                    <div
                      style={{
                        position: "absolute",
                        left: "11px",
                        top: "24px",
                        bottom: "-16px",
                        width: "2px",
                        background: "var(--border-color)"
                      }}
                    />
                  )}

                  {/* TIMELINE DOT */}
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: stepCfg.bg,
                      border: `2px solid ${stepCfg.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      zIndex: 1
                    }}
                  >
                    <CheckCircle2 style={{ width: "12px", height: "12px", color: stepCfg.color }} />
                  </div>

                  {/* TIMELINE CONTENT */}
                  <div style={{ flex: 1, paddingBottom: isLast ? "0" : "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: stepCfg.color
                        }}
                      >
                        {stepCfg.label}
                      </span>
                      <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
                        {step.timestamp}
                      </span>
                    </div>

                    <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      <strong>{step.actor}</strong> {step.role ? `• ${step.role}` : ""}
                    </div>

                    {step.note && (
                      <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-primary)", lineHeight: 1.4 }}>
                        {step.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkerReferralDetails;

