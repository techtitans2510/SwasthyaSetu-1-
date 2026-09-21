import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useDashboard from "../hooks/useDashboard";
import useLanguage from "../hooks/useLanguage";
import {
  HeartPulse,
  Calendar,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Stethoscope,
  PhoneCall,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  Pill,
  Sun,
  Sunset,
  Moon,
  AlertCircle,
  Activity,
  Ambulance,
  TrendingUp
} from "lucide-react";

function Dashboard() {
  const { user } = useAuth();
  const { dashboard, loading, error } = useDashboard();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [medTaken, setMedTaken] = useState(false);

  if (loading) {
    return (
      <div className="state-container-card">
        <Activity className="w-10 h-10 text-primary-color animate-spin" />
        <h3 className="state-title">{t("patientDashboard.loadingDashboard", "Loading Health Dashboard...")}</h3>
        <p className="state-subtitle">
          {t("patientDashboard.loadingSubtitle", "Retrieving your ABHA profile and synced healthcare records from the PHC network.")}
        </p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="state-container-card" style={{ borderColor: "var(--error-color)" }}>
        <AlertCircle className="w-10 h-10 text-rose-600" />
        <h3 className="state-title" style={{ color: "var(--error-color)" }}>
          {t("patientDashboard.unableToLoad", "Unable to Load Dashboard")}
        </h3>
        <p className="state-subtitle">
          {t("patientDashboard.errorSubtitle", "Could not sync records from the local health server. Please check your connection.")}
        </p>
      </div>
    );
  }

  const { patient, stats, upcomingAppointment } = dashboard;

  const rawName = user?.name || patient?.name || t("patient", "Patient");
  const displayName = rawName.trim().split(/\s+/)[0] || rawName;

  const currentHour = new Date().getHours();
  const timeGreeting =
    currentHour < 12
      ? t("patientDashboard.morningGreeting", "Good morning")
      : currentHour < 17
        ? t("patientDashboard.afternoonGreeting", "Good afternoon")
        : t("patientDashboard.eveningGreeting", "Good evening");

  const abhaNumber = patient?.id ? `91-4029-1823-${patient.id.replace(/\D/g, "").padStart(4, "0")}` : "91-4029-1823-0192";

  const handleCopyAbha = () => {
    navigator.clipboard.writeText(abhaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedApptDate = upcomingAppointment?.date
    ? new Date(upcomingAppointment.date).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : "Friday, 24 Oct";

  return (
    <div className="dashboard-page-container">
      {/* 1. Greeting & ABHA Identifier Hero */}
      <section className="dashboard-hero-card">
        <div className="hero-welcome-section">
          <h1 className="hero-greeting-title">
            {timeGreeting}, {displayName} 👋
          </h1>
          <p className="hero-greeting-desc">
            {t("patientDashboard.welcomeDesc", "Welcome back to your citizen health portal. Here is your longitudinal care schedule, verified ABHA health ID, and clinic updates.")}
          </p>
        </div>

        <div className="abha-identity-pill">
          <div className="abha-icon-box">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div className="abha-info">
            <div className="abha-tag-row">
              <span className="abha-tag">{t("patientDashboard.abhaIdLabel", "Ayushman Bharat ID")}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-surface-tint" />
              <span className="abha-verified-text">{t("patientDashboard.abhaVerified", "ABDM Verified")}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="abha-id-number">{abhaNumber}</span>
              <button
                type="button"
                onClick={handleCopyAbha}
                className="p-1 rounded hover:bg-surface-container transition-colors"
                title={t("patientDashboard.copyAbha", "Copy ABHA ID")}
                style={{ background: "transparent", border: "none", color: "var(--secondary-color)" }}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Upcoming Appointment Highlight Card */}
      {upcomingAppointment && (
        <section className="appointment-hero-card">
          <div className="appointment-hero-header">
            <div className="appointment-badge-group">
              <span className="appointment-chip-primary">
                <Calendar className="w-3.5 h-3.5" />
                {t("patientDashboard.nextAppointmentConfirmed", "Next Appointment · Confirmed")}
              </span>
              <span className="appointment-chip-secondary">
                {t("patientDashboard.inPersonOPD", "In-Person OPD Consultation")}
              </span>
            </div>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--surface-tint)" }}>
              {t("patientDashboard.tokenAssigned", "Token #14 Assigned")}
            </span>
          </div>

          <div className="appointment-hero-body">
            <div className="appointment-doctor-info">
              <div className="doctor-avatar-box">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div className="doctor-details">
                <h2 className="doctor-name">{upcomingAppointment.doctor}</h2>
                <p className="doctor-specialty">
                  {t("patientDashboard.seniorMedicalOfficer", "Senior Medical Officer · General & Preventive Care")}
                </p>
                <div className="appointment-meta-row">
                  <span className="meta-item">
                    <Clock className="w-4 h-4 text-primary-color" />
                    {formattedApptDate} · {upcomingAppointment.time}
                  </span>
                  <span className="meta-item">
                    <Building2 className="w-4 h-4 text-primary-color" />
                    {upcomingAppointment.facility}
                  </span>
                </div>
              </div>
            </div>

            <div className="appointment-actions-group">
              <Link to="/appointments" className="btn-primary-action">
                <MapPin className="w-4 h-4" />
                <span>{t("patientDashboard.viewOPDDetails", "View OPD Details")}</span>
              </Link>
              <Link to="/facilities" className="btn-secondary-action">
                <span>{t("patientDashboard.findOtherCenters", "Find Other Centers")}</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 3. Four Quick-Action Metric Navigation Cards */}
      <section className="dashboard-quick-grid">
        <Link to="/facilities" className="quick-card">
          <div className="quick-card-top">
            <div className="quick-icon-box">
              <Search className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-color" />
          </div>
          <div>
            <h3 className="quick-card-title">{t("patientDashboard.findFacilityCardTitle", "Find Facility")}</h3>
            <p className="quick-card-desc">{t("patientDashboard.findFacilityCardDesc", "Nearby PHCs, CHCs, & Hospitals")}</p>
          </div>
        </Link>

        <Link to="/appointments" className="quick-card">
          <div className="quick-card-top">
            <div className="quick-icon-box" style={{ background: "var(--secondary-container)", color: "var(--secondary-color)" }}>
              <Calendar className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-color" />
          </div>
          <div>
            <h3 className="quick-card-title">{t("patientDashboard.appointmentsCardTitle", "Appointments")} ({stats.appointments})</h3>
            <p className="quick-card-desc">{t("patientDashboard.appointmentsCardDesc", "Scheduled OPD visits & tokens")}</p>
          </div>
        </Link>

        <Link to="/medical-records" className="quick-card">
          <div className="quick-card-top">
            <div className="quick-icon-box">
              <FileText className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-color" />
          </div>
          <div>
            <h3 className="quick-card-title">{t("patientDashboard.recordsCardTitle", "Medical Records")} ({stats.medicalRecords})</h3>
            <p className="quick-card-desc">{t("patientDashboard.recordsCardDesc", "Prescriptions, labs & diagnostics")}</p>
          </div>
        </Link>

        <Link to="/medical-records" className="quick-card">
          <div className="quick-card-top">
            <div className="quick-icon-box" style={{ background: "var(--secondary-container)", color: "var(--secondary-color)" }}>
              <TrendingUp className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-color" />
          </div>
          <div>
            <h3 className="quick-card-title">{t("patientDashboard.referralsCardTitle", "Active Referrals")} ({stats.referrals})</h3>
            <p className="quick-card-desc">{t("patientDashboard.referralsCardDesc", "7-Stage continuum track")}</p>
          </div>
        </Link>
      </section>

      {/* 4. Main Two-Column Layout */}
      <div className="dashboard-split-layout">
        {/* Left Main Column */}
        <div className="dashboard-main-col">
          {/* Today's Medication Schedule */}
          <section className="dashboard-card-section">
            <div className="section-header-row">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <h2 className="section-heading-title" style={{ margin: 0 }}>
                    {t("patientDashboard.todayMedicineSchedule", "Today's Medicine Schedule")}
                  </h2>
                  <span className="appointment-chip-secondary" style={{ color: "var(--primary-color)", fontWeight: "700" }}>
                    <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
                    {medTaken ? t("patientDashboard.medTakenCount2", "2 of 3 taken") : t("patientDashboard.medTakenCount1", "1 of 3 taken")}
                  </span>
                </div>
                <p className="section-heading-sub">{t("patientDashboard.medicineScheduleSub", "Take prescribed medicines on time with warm water.")}</p>
              </div>
            </div>

            <div className="medicine-list">
              {/* Morning */}
              <div className="medicine-item-card">
                <div className="medicine-item-left">
                  <div className="medicine-time-icon">
                    <Sun className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="medicine-info">
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="medicine-timing-tag">{t("patientDashboard.morningTime", "Morning · 8:00 AM")}</span>
                      <span style={{ fontSize: "10px", fontWeight: "700", padding: "1px 6px", borderRadius: "4px", background: "var(--surface-container-high)", color: "var(--primary-color)" }}>
                        {t("patientDashboard.afterBreakfast", "After Breakfast")}
                      </span>
                    </div>
                    <span className="medicine-name">Telmisartan 40mg</span>
                    <span className="medicine-dosage">{t("patientDashboard.med1Desc", "For Blood Pressure regulation · 1 tablet")}</span>
                  </div>
                </div>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--surface-tint)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 className="w-4 h-4" />
                  {t("patientDashboard.takenAtTime", "Taken at 8:15 AM")}
                </span>
              </div>

              {/* Afternoon */}
              <div className="medicine-item-card current">
                <div className="medicine-item-left">
                  <div className="medicine-time-icon" style={{ background: "var(--secondary-container)", color: "var(--secondary-color)" }}>
                    <Sunset className="w-5 h-5" />
                  </div>
                  <div className="medicine-info">
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="medicine-timing-tag" style={{ color: "var(--secondary-color)" }}>{t("patientDashboard.afternoonTime", "Afternoon · 1:30 PM")}</span>
                      <span style={{ fontSize: "10px", fontWeight: "700", padding: "1px 6px", borderRadius: "4px", background: "var(--secondary-color)", color: "white" }}>
                        {t("patientDashboard.dueNow", "Due Now")}
                      </span>
                    </div>
                    <span className="medicine-name">Ecosprin AV 75/20</span>
                    <span className="medicine-dosage">{t("patientDashboard.med2Desc", "Blood thinner & vessel protector · 1 capsule")}</span>
                  </div>
                </div>
                {medTaken ? (
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--surface-tint)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 className="w-4 h-4" />
                    {t("patientDashboard.markedAsTaken", "Marked as Taken")}
                  </span>
                ) : (
                  <button
                    type="button"
                    className="btn-primary-action"
                    onClick={() => setMedTaken(true)}
                    style={{ padding: "8px 14px", fontSize: "12px" }}
                  >
                    <Check className="w-4 h-4" />
                    <span>{t("patientDashboard.markAsTaken", "Mark as Taken")}</span>
                  </button>
                )}
              </div>

              {/* Night */}
              <div className="medicine-item-card" style={{ opacity: 0.85 }}>
                <div className="medicine-item-left">
                  <div className="medicine-time-icon" style={{ background: "var(--surface-container-high)" }}>
                    <Moon className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="medicine-info">
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="medicine-timing-tag">{t("patientDashboard.nightTime", "Night · 9:00 PM")}</span>
                      <span style={{ fontSize: "10px", fontWeight: "700", padding: "1px 6px", borderRadius: "4px", background: "var(--surface-container-high)" }}>
                        {t("patientDashboard.afterDinner", "After Dinner")}
                      </span>
                    </div>
                    <span className="medicine-name">Atorvastatin 40mg</span>
                    <span className="medicine-dosage">{t("patientDashboard.med3Desc", "For Cholesterol maintenance · 1 tablet")}</span>
                  </div>
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  {t("patientDashboard.upcomingTonight", "Upcoming tonight")}
                </span>
              </div>
            </div>

            {/* Jan Aushadhi Refill Notice */}
            <div style={{ padding: "14px 18px", borderRadius: "var(--radius-md)", background: "var(--surface-container-low)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Pill className="w-5 h-5 text-primary-color" />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-color)" }}>{t("patientDashboard.janAushadhiTitle", "Jan Aushadhi Kendra Refill Status")}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{t("patientDashboard.janAushadhiDesc", "18 days of regular chronic medication remaining")}</div>
                </div>
              </div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--secondary-color)" }}>
                {t("patientDashboard.stockAvailablePhc", "Stock Available at PHC")}
              </span>
            </div>
          </section>

          {/* Recent Healthcare Activity Timeline */}
          <section className="dashboard-card-section">
            <div className="section-header-row">
              <div>
                <h2 className="section-heading-title">{t("patientDashboard.recentActivityTitle", "Recent Healthcare Activity")}</h2>
                <p className="section-heading-sub">{t("patientDashboard.recentActivitySub", "Synced records from government primary health centre network.")}</p>
              </div>
              <Link to="/medical-records" style={{ fontSize: "13px", fontWeight: "700", color: "var(--secondary-color)", display: "flex", alignItems: "center", gap: "4px" }}>
                <span>{t("patientDashboard.viewAll", "View All")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="timeline-activity-list">
              <div className="timeline-item">
                <div className="timeline-date-row">
                  <span>{t("patientDashboard.activity1Type", "Recent Consultation")}</span>
                  <span>{t("patientDashboard.activity1Facility", "Primary Health Centre")}</span>
                </div>
                <h3 className="timeline-title">{t("patientDashboard.activity1Title", "Routine Blood Pressure Assessment")}</h3>
                <p className="timeline-desc">
                  {t("patientDashboard.activity1Desc", "Recorded: 138 / 88 mmHg (Pulse 74 bpm). Classified as Stable. Doctor advised regular morning walk and low sodium diet.")}
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-date-row">
                  <span>{t("patientDashboard.activity2Type", "Diagnostic Report")}</span>
                  <span>{t("patientDashboard.activity2Facility", "District Hospital Laboratory")}</span>
                </div>
                <h3 className="timeline-title">{t("patientDashboard.activity2Title", "Complete Blood Count & Glucose Profile")}</h3>
                <p className="timeline-desc">
                  {t("patientDashboard.activity2Desc", "Fasting Blood Glucose: 98 mg/dL (Normal). Report approved by Medical Officer.")}
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-date-row">
                  <span>{t("patientDashboard.activity3Type", "Prescription Dispensed")}</span>
                  <span>{t("patientDashboard.activity3Facility", "Government Health Sub-Centre")}</span>
                </div>
                <h3 className="timeline-title">{t("patientDashboard.activity3Title", "Chronic Care Prescription Renewed (30 Days)")}</h3>
                <p className="timeline-desc">
                  {t("patientDashboard.activity3Desc", "Course issued under Free Medicine Distribution Scheme (Telmisartan & Atorvastatin).")}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Side Column */}
        <div className="dashboard-side-col">
          {/* Care Reminders */}
          <section className="dashboard-card-section">
            <div className="section-header-row">
              <h2 className="section-heading-title" style={{ fontSize: "18px" }}>{t("patientDashboard.careRemindersTitle", "Care Reminders")}</h2>
              <span className="w-2 h-2 rounded-full bg-secondary-color" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ padding: "12px", borderRadius: "var(--radius-md)", background: "var(--surface)", border: "1px solid var(--border-color)", display: "flex", gap: "10px" }}>
                <CheckCircle2 className="w-5 h-5 text-secondary-color shrink-0 mt-0.5" />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-color)" }}>{t("patientDashboard.reminder1Title", "Appointment Confirmed")}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {t("patientDashboard.reminder1Desc", { doctor: upcomingAppointment.doctor })}
                  </div>
                </div>
              </div>

              <div style={{ padding: "12px", borderRadius: "var(--radius-md)", background: "var(--surface)", border: "1px solid var(--border-color)", display: "flex", gap: "10px" }}>
                <Activity className="w-5 h-5 text-primary-color shrink-0 mt-0.5" />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-color)" }}>{t("patientDashboard.reminder2Title", "Vitals Synchronized")}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {t("patientDashboard.reminder2Desc", "Recent vitals recorded by field cadre uploaded to ABDM cloud repository.")}
                  </div>
                </div>
              </div>

              <div style={{ padding: "12px", borderRadius: "var(--radius-md)", background: "var(--surface)", border: "1px solid var(--border-color)", display: "flex", gap: "10px" }}>
                <HeartPulse className="w-5 h-5 text-surface-tint shrink-0 mt-0.5" />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-color)" }}>{t("patientDashboard.reminder3Title", "Daily Health Tip")}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {t("patientDashboard.reminder3Desc", "Drink 2 litres of water throughout the day. Take a gentle 20-minute walk after 5:30 PM.")}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Need Help / Emergency Call Card */}
          <section className="emergency-help-card">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <PhoneCall className="w-5 h-5" />
              <h3 style={{ fontSize: "17px", fontWeight: "800", color: "var(--on-primary)" }}>
                {t("patientDashboard.needHelpTitle", "Need Help or Advice?")}
              </h3>
            </div>
            <p style={{ fontSize: "13px", opacity: 0.9, lineHeight: 1.5 }}>
              {t("patientDashboard.needHelpDesc", "Toll-free government numbers and your primary medical center are ready 24 hours a day.")}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <a href="tel:104" className="emergency-call-row">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <PhoneCall className="w-4 h-4 text-primary-color" />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700" }}>{t("citizenHealthLine", "Citizen Health Line")}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{t("patientDashboard.doctorAdviceQueries", "24x7 Doctor Advice & Queries")}</div>
                  </div>
                </div>
                <span style={{ fontSize: "16px", fontWeight: "800", color: "var(--primary-color)" }}>104</span>
              </a>

              <a href="tel:108" className="emergency-call-row ambulance">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Ambulance className="w-4 h-4 text-rose-600" />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700" }}>{t("patientDashboard.freeEmergencyAmbulance", "Free Emergency Ambulance")}</div>
                    <div style={{ fontSize: "11px", opacity: 0.85 }}>{t("patientDashboard.immediateAlsDispatch", "Immediate ALS Dispatch")}</div>
                  </div>
                </div>
                <span style={{ fontSize: "16px", fontWeight: "800" }}>108</span>
              </a>

              <div style={{ padding: "14px", borderRadius: "var(--radius-md)", background: "var(--surface-container-low)", border: "1px solid var(--border-color)", color: "var(--text-color)", display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: "700", textTransform: "uppercase", color: "var(--primary-color)" }}>{t("patientDashboard.primaryHealthCentreLabel", "Primary Health Centre")}</span>
                  <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "var(--radius-full)", background: "var(--surface-tint)", color: "white", fontWeight: "700" }}>{t("patientDashboard.openNowLabel", "Open Now")}</span>
                </div>
                <span style={{ fontSize: "var(--text-sm)", fontWeight: "700", color: "var(--text-color)" }}>{upcomingAppointment.facility}</span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginTop: "2px" }}>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>{t("patientDashboard.puneDistrictGrid", "Pune District Grid")}</span>
                  <a
                    href="tel:+912137252100"
                    className="btn-call-desk"
                    aria-label={`${t("patientDashboard.callDesk", "Call Desk")} - ${upcomingAppointment.facility}`}
                  >
                    <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t("patientDashboard.callDesk", "Call Desk")}</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;