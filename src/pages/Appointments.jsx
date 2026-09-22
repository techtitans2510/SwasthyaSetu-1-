import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAppointments from "../hooks/useAppointments";
import useLanguage from "../hooks/useLanguage";
import {
  Calendar,
  Clock,
  Building2,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Activity,
  FolderOpen,
  Plus,
  ArrowRight,
  ShieldCheck,
  Phone,
  FileText,
  MapPin,
  X
} from "lucide-react";

function Appointments() {
  const { appointments, loading, error } = useAppointments();
  const { t, formatDate } = useLanguage();

  const [activeFilter, setActiveFilter] = useState("all");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({
    doctor: "Dr. Sanjeev Thorat",
    facility: "Shirur 24x7 Primary Health Centre",
    date: "",
    time: "10:30 AM",
    reason: ""
  });

  const filteredAppointments = useMemo(() => {
    if (!Array.isArray(appointments)) {
      return [];
    }

    if (activeFilter === "all") {
      return appointments;
    }

    return appointments.filter(
      (appointment) => appointment.status === activeFilter
    );
  }, [appointments, activeFilter]);

  const counts = useMemo(() => {
    if (!Array.isArray(appointments)) return { all: 0, upcoming: 0, completed: 0, cancelled: 0 };
    return {
      all: appointments.length,
      upcoming: appointments.filter((a) => a.status === "upcoming").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length
    };
  }, [appointments]);

  const getStatusLabel = (status) => {
    switch (status) {
      case "upcoming":
        return t("patientDashboard.nextAppointmentConfirmed", "Upcoming · Confirmed");
      case "completed":
        return t("completed", "Completed");
      case "cancelled":
        return t("cancelled", "Cancelled");
      case "pending":
        return t("pending", "Pending Confirmation");
      default:
        return t(status, status);
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowBookingModal(false);
    }, 2000);
  };

  return (
    <div className="appointments-page-container">
      {/* 1. Page Header & Primary Action */}
      <section className="dashboard-hero-card" style={{ padding: "24px 28px" }}>
        <div className="hero-welcome-section">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--secondary-color)", letterSpacing: "0.06em" }}>
              {t("patientDashboard.careContinuityTitle", "Healthcare Continuity")}
            </span>
            <span style={{ color: "var(--muted-color)" }}>•</span>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--surface-tint)" }}>
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
              {t("appointmentsPage.title", "Appointments & Consultations")}
            </span>
          </div>
          <h1 className="hero-greeting-title" style={{ fontSize: "26px" }}>
            {t("appointmentsPage.title", "Appointments & Consultations")}
          </h1>
          <p className="hero-greeting-desc" style={{ fontSize: "14px" }}>
            {t("appointmentsPage.subtitle", "Manage your scheduled clinic consultations, doctor visits, and digital OPD tokens.")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowBookingModal(true)}
          className="btn-primary-action"
          style={{ padding: "12px 20px", whiteSpace: "nowrap" }}
        >
          <Plus className="w-4 h-4" />
          <span>{t("appointmentsPage.bookNewBtn", "Book New Appointment")}</span>
        </button>
      </section>

      {/* 2. Filter Tabs */}
      <div className="filter-tabs-container">
        <button
          type="button"
          className={`filter-tab-pill ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          <span>{t("appointmentsPage.allTab", "All")}</span>
          <span className="count-badge">{counts.all}</span>
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${activeFilter === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveFilter("upcoming")}
        >
          <span>{t("appointmentsPage.upcomingTab", "Upcoming")}</span>
          <span className="count-badge">{counts.upcoming}</span>
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${activeFilter === "completed" ? "active" : ""}`}
          onClick={() => setActiveFilter("completed")}
        >
          <span>{t("appointmentsPage.completedTab", "Completed")}</span>
          <span className="count-badge">{counts.completed}</span>
        </button>
        <button
          type="button"
          className={`filter-tab-pill ${activeFilter === "cancelled" ? "active" : ""}`}
          onClick={() => setActiveFilter("cancelled")}
        >
          <span>{t("appointmentsPage.cancelledTab", "Cancelled")}</span>
          <span className="count-badge">{counts.cancelled}</span>
        </button>
      </div>

      {/* 3. Loading State */}
      {loading && (
        <div className="state-container-card">
          <Activity className="w-10 h-10 text-primary-color animate-spin" />
          <h3 className="state-title">{t("appointmentsPage.loadingTitle", "Loading Appointments...")}</h3>
          <p className="state-subtitle">
            {t("appointmentsPage.loadingSubtitle", "Fetching scheduled OPD visits, tokens, and doctor availability slots.")}
          </p>
        </div>
      )}

      {/* 4. Error State */}
      {!loading && error && (
        <div className="state-container-card" style={{ borderColor: "var(--error-color)" }}>
          <AlertCircle className="w-10 h-10 text-rose-600" />
          <h3 className="state-title" style={{ color: "var(--error-color)" }}>
            {t("appointmentsPage.unableToLoad", "Unable to Load Appointments")}
          </h3>
          <p className="state-subtitle">
            {t("appointmentsPage.errorSubtitle", "An error occurred while fetching your appointment schedule. Please try again.")}
          </p>
        </div>
      )}

      {/* 5. Empty State */}
      {!loading && !error && filteredAppointments.length === 0 && (
        <div className="state-container-card">
          <FolderOpen className="w-10 h-10 text-muted-color" />
          <h3 className="state-title">{t("appointmentsPage.noAppointmentsFound", "No Appointments Found")}</h3>
          <p className="state-subtitle">
            {t("appointmentsPage.noAppointmentsStatusDesc", { filter: activeFilter }, `There are no appointments under the "${activeFilter}" status.`)}
          </p>
          <button
            type="button"
            className="btn-primary-action"
            onClick={() => setShowBookingModal(true)}
            style={{ marginTop: "12px", padding: "10px 18px", fontSize: "13px" }}
          >
            <Plus className="w-4 h-4" />
            <span>{t("appointmentsPage.bookAppointmentBtn", "Book an Appointment")}</span>
          </button>
        </div>
      )}

      {/* 6. Appointments Cards List */}
      {!loading && !error && filteredAppointments.length > 0 && (
        <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredAppointments.map((appointment) => {
            const dateObj = new Date(appointment.date);
            const dayNumber = isNaN(dateObj.getTime()) ? "24" : dateObj.getDate();
            const monthText = isNaN(dateObj.getTime())
              ? "OCT"
              : formatDate(dateObj, { month: "short" }).toUpperCase();

            return (
              <article className="appointment-full-card" key={appointment.id}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", flex: 1, minWidth: "280px" }}>
                  {/* Large Calendar Date Block */}
                  <div className="appointment-date-block">
                    <span className="appointment-date-day">{dayNumber}</span>
                    <span className="appointment-date-month">{monthText}</span>
                  </div>

                  {/* Appointment Details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-color)" }}>
                        {t(appointment.doctor)}
                      </h3>
                      <span className={`status-badge-pill ${appointment.status}`}>
                        {getStatusLabel(appointment.status)}
                      </span>
                    </div>

                    <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--secondary-color)" }}>
                      {t(appointment.specialty)}
                    </span>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", marginTop: "6px", fontSize: "12px", color: "var(--text-secondary)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Building2 className="w-3.5 h-3.5 text-primary-color" />
                        {t(appointment.facility)}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock className="w-3.5 h-3.5 text-primary-color" />
                        {appointment.time}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <FileText className="w-3.5 h-3.5 text-secondary-color" />
                        {t(appointment.type)}
                      </span>
                    </div>

                    {appointment.reason && (
                      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "8px", background: "var(--surface)", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                        <strong>{t("appointmentsPage.reasonLabel", "Reason:")}</strong> {t(appointment.reason)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <Link
                    to="/facilities"
                    className="btn-secondary-action"
                    style={{ padding: "8px 14px", fontSize: "13px" }}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{t("appointmentsPage.facilityInfoBtn", "Facility Info")}</span>
                  </Link>
                  <a
                    href="tel:104"
                    className="btn-primary-action"
                    style={{ padding: "8px 14px", fontSize: "13px" }}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t("appointmentsPage.helpline104Btn", "Helpline 104")}</span>
                  </a>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="drawer-overlay active" style={{ zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div className="auth-card" style={{ maxWidth: "520px", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Stethoscope className="w-5 h-5 text-primary-color" />
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-color)" }}>
                  {t("appointmentsPage.bookingModalTitle", "Request OPD Consultation")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="drawer-close"
                style={{ width: "32px", height: "32px" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bookingSuccess ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 style={{ fontSize: "18px", fontWeight: "800", marginTop: "12px", color: "var(--primary-color)" }}>
                  {t("appointmentsPage.appointmentRequestedTitle", "Appointment Requested!")}
                </h4>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {t("appointmentsPage.appointmentRequestedDesc", "Your request has been forwarded to the primary health center desk. Token #15 will be sent via SMS.")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="auth-form" style={{ marginTop: "12px" }}>
                <div className="form-group">
                  <label htmlFor="booking-doctor">{t("appointmentsPage.selectDoctorSpecialty", "Select Doctor / Specialty")}</label>
                  <input
                    id="booking-doctor"
                    type="text"
                    value={bookingData.doctor}
                    onChange={(e) => setBookingData({ ...bookingData, doctor: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="booking-facility">{t("appointmentsPage.primaryHealthFacility", "Primary Health Facility")}</label>
                  <input
                    id="booking-facility"
                    type="text"
                    value={bookingData.facility}
                    onChange={(e) => setBookingData({ ...bookingData, facility: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label htmlFor="booking-date">{t("appointmentsPage.preferredDate", "Preferred Date")}</label>
                    <input
                      id="booking-date"
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="booking-time">{t("appointmentsPage.timeSlot", "Time Slot")}</label>
                    <input
                      id="booking-time"
                      type="text"
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="booking-reason">{t("appointmentsPage.symptomsReason", "Symptoms / Reason for Visit")}</label>
                  <input
                    id="booking-reason"
                    type="text"
                    placeholder={t("appointmentsPage.symptomsPlaceholder", "e.g. Regular blood pressure check, fever, follow-up")}
                    value={bookingData.reason}
                    onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="auth-submit" style={{ marginTop: "10px" }}>
                  {t("appointmentsPage.confirmRequestBtn", "Confirm Consultation Request")}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;