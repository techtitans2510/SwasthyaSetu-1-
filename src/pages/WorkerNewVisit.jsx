import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  Activity,
  Calendar,
  Sparkles
} from "lucide-react";
import { getWorkerPatients, getWorkerPatientById } from "../api/workerPatients.api";
import { recordWorkerVisit } from "../api/workerVisits.api";

const SYMPTOM_OPTIONS = [
  "Dizziness / Vertigo",
  "Headache",
  "Chest Discomfort / Tightness",
  "Shortness of Breath",
  "Pedal Edema / Swelling",
  "Fever / Chills",
  "Excessive Thirst / Urination",
  "Fatigue / Generalized Weakness",
  "Blurred Vision",
  "No Acute Symptoms"
];

function WorkerNewVisit() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPatientId = searchParams.get("patientId") || "";

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(false);

  // Section 2: Visit Details
  const [visitDate, setVisitDate] = useState("2026-09-22");
  const [visitTime, setVisitTime] = useState("09:30 AM");
  const [visitReason, setVisitReason] = useState("Routine NCD screening & vitals check");
  const [visitLocation, setVisitLocation] = useState("Home Visit - Household");
  const [visitNotes, setVisitNotes] = useState("");

  // Section 3: Vitals
  const [vitals, setVitals] = useState({
    bpSystolic: "",
    bpDiastolic: "",
    pulse: "",
    bloodSugar: "",
    bloodSugarType: "Random",
    spo2: "",
    temperature: "98.6",
    respiratoryRate: "18",
    weightKg: ""
  });

  // Section 4: Symptoms & Screening
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomNotes, setSymptomNotes] = useState("");
  const [observations, setObservations] = useState("");

  // Section 5: Assessment
  const [workerAssessment, setWorkerAssessment] = useState("");

  // Section 6: Action Plan
  const [actionAdvice, setActionAdvice] = useState(true);
  const [actionMedication, setActionMedication] = useState(false);
  const [medicationNotes, setMedicationNotes] = useState("");
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("2026-09-29");
  const [followUpReason, setFollowUpReason] = useState("Re-measure BP and check medication adherence");
  const [referralRequired, setReferralRequired] = useState(false);
  const [referralFacility, setReferralFacility] = useState("Shirur 24x7 Primary Health Centre");
  const [referralSpecialty, setReferralSpecialty] = useState("General Medicine / OPD");
  const [referralUrgency, setReferralUrgency] = useState("Routine");
  const [referralReason, setReferralReason] = useState("");

  const [savedState, setSavedState] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load cohort patients list
  useEffect(() => {
    async function loadCohort() {
      try {
        const data = await getWorkerPatients();
        setPatients(data);
        if (!selectedPatientId && data.length > 0) {
          setSelectedPatientId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load patient cohort", err);
      }
    }
    loadCohort();
  }, [selectedPatientId]);

  // Load selected patient profile details
  useEffect(() => {
    if (!selectedPatientId) return;
    async function loadSelected() {
      setLoadingPatient(true);
      try {
        const data = await getWorkerPatientById(selectedPatientId);
        setSelectedPatient(data);
        if (data.village) {
          setVisitLocation(`Home Visit - ${data.village}`);
        }
      } catch (err) {
        console.error("Failed to load selected patient", err);
      } finally {
        setLoadingPatient(false);
      }
    }
    loadSelected();
  }, [selectedPatientId]);

  const handleToggleSymptom = (symptom) => {
    if (symptom === "No Acute Symptoms") {
      setSelectedSymptoms(["No Acute Symptoms"]);
      return;
    }
    setSelectedSymptoms((prev) => {
      const filtered = prev.filter((s) => s !== "No Acute Symptoms");
      if (filtered.includes(symptom)) {
        return filtered.filter((s) => s !== symptom);
      }
      return [...filtered, symptom];
    });
  };

  const handleVitalChange = (field, value) => {
    setVitals((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const visitPayload = {
      patientId: selectedPatientId,
      patientName: selectedPatient?.name || "Patient",
      village: selectedPatient?.village || "Talwade",
      visitDate,
      visitTime,
      reason: visitReason,
      location: visitLocation,
      notes: visitNotes,
      vitals: {
        bpSystolic: Number(vitals.bpSystolic) || null,
        bpDiastolic: Number(vitals.bpDiastolic) || null,
        pulse: Number(vitals.pulse) || null,
        bloodSugar: Number(vitals.bloodSugar) || null,
        bloodSugarType: vitals.bloodSugarType,
        spo2: Number(vitals.spo2) || null,
        temperature: Number(vitals.temperature) || 98.6,
        respiratoryRate: Number(vitals.respiratoryRate) || 18,
        weightKg: Number(vitals.weightKg) || null
      },
      symptoms: selectedSymptoms,
      symptomNotes,
      observations,
      workerAssessment,
      actionsTaken: [
        actionAdvice ? "Advice & Health Education" : null,
        actionMedication ? `Medication: ${medicationNotes || "Verified"}` : null,
        followUpRequired ? "Follow-up Scheduled" : null,
        referralRequired ? "Referral Generated" : null
      ].filter(Boolean),
      treatmentGiven: [
        actionAdvice ? "Health education provided" : null,
        medicationNotes ? medicationNotes : null
      ]
        .filter(Boolean)
        .join("; "),
      followUp: {
        required: followUpRequired,
        dueDate: followUpDate,
        reason: followUpReason
      },
      referral: {
        required: referralRequired,
        facilityName: referralFacility,
        specialty: referralSpecialty,
        urgency: referralUrgency,
        reason: referralReason || visitReason
      }
    };

    try {
      await recordWorkerVisit(visitPayload);
      setSavedState(true);
      setTimeout(() => {
        navigate(`/worker/patients/${selectedPatientId}`);
      }, 1400);
    } catch (err) {
      console.error("Failed to save visit record", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="worker-dashboard">
      {/* BACK BUTTON */}
      <Link
        to={selectedPatientId ? `/worker/patients/${selectedPatientId}` : "/worker/patients"}
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
        Back to {selectedPatientId ? "Patient Profile" : "Patients Registry"}
      </Link>

      <header className="worker-page-header">
        <div>
          <span className="worker-eyebrow">Field Clinical Workflow</span>
          <h1>Record New Patient Visit</h1>
          <p>
            Document community screening vitals, symptom screening, observations,
            and care actions for this patient visit.
          </p>
        </div>
      </header>

      {savedState ? (
        <div
          className="worker-panel"
          style={{ maxWidth: "680px", textAlign: "center", padding: "50px 20px" }}
        >
          <CheckCircle2
            style={{
              width: "52px",
              height: "52px",
              color: "var(--primary-color)",
              margin: "0 auto 16px"
            }}
          />
          <h2>Visit Record Saved Successfully!</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "8px", fontSize: "14px" }}>
            Continuity log, scheduled visit status, and care records updated for{" "}
            <strong>{selectedPatient?.name} ({selectedPatientId})</strong>.
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "4px" }}>
            Redirecting to Patient Profile...
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "920px"
          }}
        >
          {/* ==========================================================
              SECTION 1: PATIENT IDENTIFICATION
          ========================================================== */}
          <div className="worker-panel">
            <div className="worker-panel-header">
              <div>
                <span className="worker-section-label">Section 1 of 6</span>
                <h2>Patient Identification</h2>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "6px"
                  }}
                >
                  Select Assigned Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                    outline: "none"
                  }}
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} — {p.name} ({p.age}y, {p.gender}, {p.village}) • Risk: {p.riskCategory}
                    </option>
                  ))}
                </select>
              </div>

              {/* SELECTED PATIENT SUMMARY BANNER */}
              {selectedPatient && !loadingPatient && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    fontSize: "12px",
                    flexWrap: "wrap",
                    gap: "10px"
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "13px" }}>
                      {selectedPatient.name} ({selectedPatient.id})
                    </strong>
                    <span style={{ color: "var(--text-secondary)", marginLeft: "8px" }}>
                      {selectedPatient.age}y • {selectedPatient.gender} • {selectedPatient.village}
                    </span>
                    <div style={{ marginTop: "3px", color: "var(--text-secondary)", fontSize: "11px" }}>
                      Care Context: {selectedPatient.chronicConditions?.join(", ") || "Routine"}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "999px",
                      background:
                        selectedPatient.riskCategory === "High Risk"
                          ? "rgba(220, 38, 38, 0.12)"
                          : "var(--primary-light)",
                      color:
                        selectedPatient.riskCategory === "High Risk"
                          ? "#dc2626"
                          : "var(--primary-color)"
                    }}
                  >
                    {selectedPatient.riskCategory}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ==========================================================
              SECTION 2: VISIT DETAILS
          ========================================================== */}
          <div className="worker-panel">
            <div className="worker-panel-header">
              <div>
                <span className="worker-section-label">Section 2 of 6</span>
                <h2>Visit Details</h2>
              </div>
              <Calendar style={{ width: "16px", height: "16px", color: "var(--primary-color)" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Visit Date
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
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
                  Visit Time
                </label>
                <input
                  type="text"
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  placeholder="e.g. 09:30 AM"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
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
                  Location / Context
                </label>
                <input
                  type="text"
                  value={visitLocation}
                  onChange={(e) => setVisitLocation(e.target.value)}
                  placeholder="e.g. Home Visit - Talwade"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "13px"
                  }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Purpose / Reason for Visit
                </label>
                <input
                  type="text"
                  value={visitReason}
                  onChange={(e) => setVisitReason(e.target.value)}
                  placeholder="e.g. Blood pressure monitoring, IFA supply check, Post-referral follow-up"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "13px"
                  }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Short Visit Notes
                </label>
                <input
                  type="text"
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  placeholder="Context or remarks for this home encounter..."
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "13px"
                  }}
                />
              </div>
            </div>
          </div>

          {/* ==========================================================
              SECTION 3: VITALS SCREENING
          ========================================================== */}
          <div className="worker-panel">
            <div className="worker-panel-header">
              <div>
                <span className="worker-section-label">Section 3 of 6</span>
                <h2>Vital Signs Screening</h2>
              </div>
              <Heart style={{ width: "16px", height: "16px", color: "var(--primary-color)" }} />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "14px"
              }}
            >
              {/* BLOOD PRESSURE */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Blood Pressure (Systolic / Diastolic)
                </label>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <input
                    type="number"
                    placeholder="120"
                    value={vitals.bpSystolic}
                    onChange={(e) => handleVitalChange("bpSystolic", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      fontSize: "13px"
                    }}
                  />
                  <span style={{ color: "var(--text-secondary)" }}>/</span>
                  <input
                    type="number"
                    placeholder="80"
                    value={vitals.bpDiastolic}
                    onChange={(e) => handleVitalChange("bpDiastolic", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      fontSize: "13px"
                    }}
                  />
                  <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>mmHg</span>
                </div>
              </div>

              {/* BLOOD SUGAR */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Blood Glucose & Type
                </label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    type="number"
                    placeholder="110"
                    value={vitals.bloodSugar}
                    onChange={(e) => handleVitalChange("bloodSugar", e.target.value)}
                    style={{
                      width: "60%",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      fontSize: "13px"
                    }}
                  />
                  <select
                    value={vitals.bloodSugarType}
                    onChange={(e) => handleVitalChange("bloodSugarType", e.target.value)}
                    style={{
                      width: "40%",
                      padding: "8px 6px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      fontSize: "12px"
                    }}
                  >
                    <option value="Random">Random</option>
                    <option value="Fasting">Fasting</option>
                    <option value="PP">Post-Meal</option>
                  </select>
                </div>
              </div>

              {/* PULSE / HEART RATE */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Pulse / Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  placeholder="76"
                  value={vitals.pulse}
                  onChange={(e) => handleVitalChange("pulse", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "13px"
                  }}
                />
              </div>

              {/* SPO2 */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Oxygen Saturation SpO2 (%)
                </label>
                <input
                  type="number"
                  placeholder="98"
                  value={vitals.spo2}
                  onChange={(e) => handleVitalChange("spo2", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "13px"
                  }}
                />
              </div>

              {/* TEMPERATURE */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Body Temperature (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="98.6"
                  value={vitals.temperature}
                  onChange={(e) => handleVitalChange("temperature", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "13px"
                  }}
                />
              </div>

              {/* RESPIRATORY RATE */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Respiratory Rate (breaths/min)
                </label>
                <input
                  type="number"
                  placeholder="18"
                  value={vitals.respiratoryRate}
                  onChange={(e) => handleVitalChange("respiratoryRate", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "13px"
                  }}
                />
              </div>

              {/* WEIGHT */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="65"
                  value={vitals.weightKg}
                  onChange={(e) => handleVitalChange("weightKg", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "13px"
                  }}
                />
              </div>
            </div>
          </div>

          {/* ==========================================================
              SECTION 4: SYMPTOMS & FIELD SCREENING
          ========================================================== */}
          <div className="worker-panel">
            <div className="worker-panel-header">
              <div>
                <span className="worker-section-label">Section 4 of 6</span>
                <h2>Symptoms & Field Screening</h2>
              </div>
              <Activity style={{ width: "16px", height: "16px", color: "var(--primary-color)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>
                  Reported Symptoms / Red Flags (Select all applicable)
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {SYMPTOM_OPTIONS.map((symp) => {
                    const isSelected = selectedSymptoms.includes(symp);
                    return (
                      <button
                        key={symp}
                        type="button"
                        onClick={() => handleToggleSymptom(symp)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 500,
                          cursor: "pointer",
                          border: isSelected
                            ? "1px solid var(--primary-color)"
                            : "1px solid var(--border-color)",
                          background: isSelected
                            ? "var(--primary-color)"
                            : "var(--bg-secondary)",
                          color: isSelected ? "white" : "var(--text-primary)",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {symp}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Additional Symptom Details
                </label>
                <input
                  type="text"
                  value={symptomNotes}
                  onChange={(e) => setSymptomNotes(e.target.value)}
                  placeholder="Duration, severity, onset, triggers..."
                  style={{
                    width: "100%",
                    padding: "9px 12px",
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
                  Worker Screening Observations
                </label>
                <textarea
                  rows="2"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="General appearance, medication stock check, dietary compliance, fluid intake..."
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "13px"
                  }}
                />
              </div>
            </div>
          </div>

          {/* ==========================================================
              SECTION 5: ASSESSMENT & FUTURE ML TRIAGE PLACEHOLDER
          ========================================================== */}
          <div className="worker-panel">
            <div className="worker-panel-header">
              <div>
                <span className="worker-section-label">Section 5 of 6</span>
                <h2>Worker Assessment</h2>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Field Worker Clinical Notes & Impressions
                </label>
                <textarea
                  rows="2"
                  value={workerAssessment}
                  onChange={(e) => setWorkerAssessment(e.target.value)}
                  placeholder="Summary of current episode, adherence evaluation, recovery progression..."
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontSize: "13px"
                  }}
                />
              </div>

              {/* ======================================================
                  FUTURE ML TRIAGE ASSESSMENT INTEGRATION POINT
                  Architecture Contract:
                  Vitals + Symptoms -> triage.api.js -> ML inference API -> XGBoost -> Acuity Result
                  ====================================================== */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  border: "1px dashed var(--border-color)",
                  background: "var(--bg-secondary)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px"
                }}
              >
                <Sparkles style={{ width: "18px", height: "18px", color: "var(--primary-color)", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: "12px", display: "block" }}>
                    Clinical Triage Model Assessment Module (Integration Placeholder)
                  </strong>
                  <p style={{ margin: "3px 0 0", fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    The ML-assisted acuity scoring engine (XGBoost triage model) will connect to this section
                    via <code style={{ fontFamily: "monospace" }}>triage.api.js</code> upon model contract finalization.
                    No automated prediction is claimed during this prototype skeleton phase.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ==========================================================
              SECTION 6: ACTION PLAN (ADVICE, FOLLOW-UP, REFERRAL)
          ========================================================== */}
          <div className="worker-panel">
            <div className="worker-panel-header">
              <div>
                <span className="worker-section-label">Section 6 of 6</span>
                <h2>Action Plan & Care Continuity</h2>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* ACTION: ADVICE */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  id="actAdvice"
                  checked={actionAdvice}
                  onChange={(e) => setActionAdvice(e.target.checked)}
                />
                <label htmlFor="actAdvice" style={{ fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                  Provide Health Education & Dietary Advice (Salt restriction, hydration, rest)
                </label>
              </div>

              {/* ACTION: MEDICATION */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    id="actMed"
                    checked={actionMedication}
                    onChange={(e) => setActionMedication(e.target.checked)}
                  />
                  <label htmlFor="actMed" style={{ fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                    Medication Verification & Supply (IFA / Calcium distribution, adherence check)
                  </label>
                </div>
                {actionMedication && (
                  <input
                    type="text"
                    value={medicationNotes}
                    onChange={(e) => setMedicationNotes(e.target.value)}
                    placeholder="e.g. Distributed 30 IFA tablets, verified daily Amlodipine 5mg compliance"
                    style={{
                      marginTop: "6px",
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      fontSize: "12px"
                    }}
                  />
                )}
              </div>

              {/* ACTION: FOLLOW-UP REQUIRED */}
              <div style={{ padding: "12px", borderRadius: "8px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    id="actFollowUp"
                    checked={followUpRequired}
                    onChange={(e) => setFollowUpRequired(e.target.checked)}
                  />
                  <label htmlFor="actFollowUp" style={{ fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                    Schedule Post-Screening Follow-up
                  </label>
                </div>

                {followUpRequired && (
                  <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, marginBottom: "3px" }}>
                        Follow-up Due Date
                      </label>
                      <input
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid var(--border-color)",
                          background: "var(--card-bg)",
                          color: "var(--text-primary)",
                          fontSize: "12px"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, marginBottom: "3px" }}>
                        Follow-up Purpose
                      </label>
                      <input
                        type="text"
                        value={followUpReason}
                        onChange={(e) => setFollowUpReason(e.target.value)}
                        placeholder="e.g. Re-check BP, verify symptom resolution"
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid var(--border-color)",
                          background: "var(--card-bg)",
                          color: "var(--text-primary)",
                          fontSize: "12px"
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION: REFERRAL REQUIRED */}
              <div style={{ padding: "12px", borderRadius: "8px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    id="actReferral"
                    checked={referralRequired}
                    onChange={(e) => setReferralRequired(e.target.checked)}
                  />
                  <label htmlFor="actReferral" style={{ fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                    Escalate & Refer to Primary Health Centre / Hospital
                  </label>
                </div>

                {referralRequired && (
                  <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 600, marginBottom: "3px" }}>
                          Target Facility
                        </label>
                        <select
                          value={referralFacility}
                          onChange={(e) => setReferralFacility(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px 10px",
                            borderRadius: "6px",
                            border: "1px solid var(--border-color)",
                            background: "var(--card-bg)",
                            color: "var(--text-primary)",
                            fontSize: "12px"
                          }}
                        >
                          <option value="Shirur 24x7 Primary Health Centre">Shirur 24x7 Primary Health Centre</option>
                          <option value="District Hospital, Pune">District Hospital, Pune</option>
                          <option value="Talwade Sub-Health Centre">Talwade Sub-Health Centre</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 600, marginBottom: "3px" }}>
                          Urgency Level
                        </label>
                        <select
                          value={referralUrgency}
                          onChange={(e) => setReferralUrgency(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px 10px",
                            borderRadius: "6px",
                            border: "1px solid var(--border-color)",
                            background: "var(--card-bg)",
                            color: "var(--text-primary)",
                            fontSize: "12px"
                          }}
                        >
                          <option value="Routine">Routine (Within 7 Days)</option>
                          <option value="Urgent">Urgent (Within 24-48 Hours)</option>
                          <option value="Emergency">Emergency (Immediate)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, marginBottom: "3px" }}>
                        Specialty / Department Required
                      </label>
                      <input
                        type="text"
                        value={referralSpecialty}
                        onChange={(e) => setReferralSpecialty(e.target.value)}
                        placeholder="e.g. Internal Medicine, Obstetrics, Cardiology"
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid var(--border-color)",
                          background: "var(--card-bg)",
                          color: "var(--text-primary)",
                          fontSize: "12px"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, marginBottom: "3px" }}>
                        Reason for Facility Referral
                      </label>
                      <input
                        type="text"
                        value={referralReason}
                        onChange={(e) => setReferralReason(e.target.value)}
                        placeholder="e.g. Uncontrolled high systolic BP, abnormal glucose, specialist review needed"
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid var(--border-color)",
                          background: "var(--card-bg)",
                          color: "var(--text-primary)",
                          fontSize: "12px"
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ==========================================================
              SECTION 7: SAVE ACTIONS
          ========================================================== */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "12px",
              paddingTop: "10px"
            }}
          >
            <Link
              to={selectedPatientId ? `/worker/patients/${selectedPatientId}` : "/worker/patients"}
              style={{
                padding: "11px 18px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                background: "var(--card-bg)",
                color: "var(--text-primary)",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none"
              }}
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "11px 24px",
                borderRadius: "10px",
                background: "var(--primary-color)",
                color: "white",
                border: "none",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              {saving ? "Saving Visit Record..." : "Save Visit Record"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default WorkerNewVisit;
