import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import useLanguage from "../hooks/useLanguage";
import { getWorkerPatients, createWorkerReferral } from "../api/worker.api";

function WorkerNewReferral() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPatientId = searchParams.get("patientId") || "";

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId);
  const [facilityName, setFacilityName] = useState("Shirur 24x7 Primary Health Centre");
  const [specialtyRequired, setSpecialtyRequired] = useState("General Medicine / OPD");
  const [urgency, setUrgency] = useState("Routine");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await getWorkerPatients();
        setPatients(data);
        if (!selectedPatientId && data.length > 0) {
          setSelectedPatientId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load patients", err);
      }
    }
    loadPatients();
  }, [selectedPatientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const patientObj = patients.find((p) => p.id === selectedPatientId);
    const newRef = await createWorkerReferral({
      patientId: selectedPatientId,
      patientName: patientObj?.name || "Patient",
      village: patientObj?.village || "Talwade",
      facilityName,
      specialtyRequired,
      urgency,
      reason,
      notes
    });
    setSaved(true);
    setTimeout(() => {
      navigate(`/worker/referrals/${newRef.id}`);
    }, 1200);
  };

  return (
    <div className="worker-dashboard">
      <Link
        to={selectedPatientId ? `/worker/patients/${selectedPatientId}` : "/worker/referrals"}
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
        {selectedPatientId ? t("worker.backToPatientProfile") : t("worker.backToReferrals")}
      </Link>

      <header className="worker-page-header">
        <div>
          <span className="worker-eyebrow">{t("worker.careEscalationEyebrow")}</span>
          <h1>{t("worker.generateFacilityReferralTitle")}</h1>
          <p>
            {t("worker.generateFacilityReferralDesc")}
          </p>
        </div>
      </header>

      <div className="worker-panel" style={{ maxWidth: "780px" }}>
        {saved ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <CheckCircle2 style={{ width: "48px", height: "48px", color: "var(--primary-color)", margin: "0 auto 16px" }} />
            <h2>{t("worker.referralCreatedSuccessTitle")}</h2>
            <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>{t("worker.openingReferralDetails")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>{t("worker.selectPatientLabel")}</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-primary)" }}
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} - {p.name} ({p.village}, {p.riskCategory})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>{t("worker.destinationFacilityLabel")}</label>
                <select
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-primary)" }}
                >
                  <option value="Shirur 24x7 Primary Health Centre">Shirur 24x7 Primary Health Centre</option>
                  <option value="District Hospital, Pune">District Hospital, Pune</option>
                  <option value="Talwade Sub-Health Centre">Talwade Sub-Health Centre</option>
                  <option value="Sassoon General Hospital">Sassoon General Hospital</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>{t("worker.urgencyLevelLabel")}</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-primary)" }}
                >
                  <option value="Routine">{t("worker.urgencyRoutine7Days")}</option>
                  <option value="Urgent">{t("worker.urgencyUrgent48Hours")}</option>
                  <option value="Emergency">{t("worker.urgencyEmergencyTransfer")}</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>{t("worker.specialtyServiceRequired")}</label>
              <input
                type="text"
                value={specialtyRequired}
                onChange={(e) => setSpecialtyRequired(e.target.value)}
                placeholder={t("worker.specialtyServicePlaceholder")}
                style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>{t("worker.reasonForReferralLabel")}</label>
              <textarea
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                placeholder={t("worker.reasonForReferralPlaceholder")}
                style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>{t("worker.ashaInstructionsFieldNotes")}</label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("worker.ashaInstructionsPlaceholder")}
                style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-primary)" }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "12px 20px",
                background: "var(--primary-color)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                marginTop: "10px"
              }}
            >
              {t("worker.generateReferralSubmitBtn")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default WorkerNewReferral;

