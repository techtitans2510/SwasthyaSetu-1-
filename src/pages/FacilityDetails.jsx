import { Link, useParams } from "react-router-dom";
import useFacility from "../hooks/useFacility";
import useLanguage from "../hooks/useLanguage";
import {
  ArrowLeft,
  Building2,
  Phone,
  MapPin,
  Navigation,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Activity,
  Calendar,
  Share2,
  Stethoscope
} from "lucide-react";

function FacilityDetails() {
  const { id } = useParams();
  const { facility, loading, error } = useFacility(id);
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="state-container-card">
        <Activity className="w-10 h-10 text-primary-color animate-spin" />
        <h3 className="state-title">{t("facilities.loadingProfileTitle", "Loading Healthcare Facility Profile...")}</h3>
        <p className="state-subtitle">
          {t("facilities.loadingProfileSubtitle", "Retrieving clinic operational hours, doctors on duty, and ABDM registry details.")}
        </p>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="state-container-card" style={{ borderColor: "var(--error-color)" }}>
        <AlertCircle className="w-10 h-10 text-rose-600" />
        <h3 className="state-title" style={{ color: "var(--error-color)" }}>
          {t("facilities.facilityNotFound", "Healthcare Facility Not Found")}
        </h3>
        <p className="state-subtitle">
          {t("facilities.facilityNotFoundDesc", { id }, `The requested health center ID (${id}) could not be located in the district registry.`)}
        </p>
        <Link to="/facilities" className="btn-secondary-action" style={{ marginTop: "12px" }}>
          <ArrowLeft className="w-4 h-4" />
          <span>{t("facilities.backToFacilities", "Back to Facilities")}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="record-details-container">
      {/* 1. Header Navigation */}
      <div className="record-details-header">
        <Link
          to="/facilities"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "700",
            color: "var(--primary-color)",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("facilities.backToDirectory", "Back to Facility Directory")}</span>
        </Link>

        <span
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: "var(--surface-tint)",
            background: "var(--surface-container-low)",
            padding: "6px 12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <ShieldCheck className="w-4 h-4 text-primary-color" />
          <span>{t("facilities.abdmVerifiedRegistry", "ABDM Verified Facility Registry")}</span>
        </span>
      </div>

      {/* 2. Facility Details Main Card */}
      <section className="record-details-main-card">
        <div className="record-profile-row">
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "var(--radius-lg)",
              background: "var(--surface-container-low)",
              color: "var(--primary-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <Building2 className="w-8 h-8" />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
              <span className="record-type-pill">
                {t(facility.type)}
              </span>
              <span className={`facility-status-pill ${facility.openNow ? "open" : "closed"}`}>
                <span className="sync-pulse-dot" style={{ background: facility.openNow ? "var(--surface-tint)" : "var(--muted-color)" }} />
                <span>{facility.openNow ? t("facilities.openNowServices", "Open Now (24x7 Services)") : t("facilities.currentlyClosed", "Currently Closed")}</span>
              </span>
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-color)" }}>
              {t(facility.name)}
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
              {t("facilities.publicHealthNode", "Public Health Network Node · Pune District Health Grid")}
            </p>
          </div>
        </div>

        {/* 4-Key Metrics Grid */}
        <div className="details-meta-grid">
          <div className="details-meta-item">
            <span className="meta-label">{t("facilities.facilityCategory", "Facility Category")}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
              <Building2 className="w-4 h-4 text-primary-color" />
              <span className="meta-val">{t(facility.type)}</span>
            </div>
          </div>

          <div className="details-meta-item">
            <span className="meta-label">{t("facilities.approxDistance", "Approximate Distance")}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
              <Navigation className="w-4 h-4 text-secondary-color" />
              <span className="meta-val">{t("facilities.distanceFromLocation", { distance: facility.distance }, `${facility.distance} from your location`)}</span>
            </div>
          </div>

          <div className="details-meta-item">
            <span className="meta-label">{t("facilities.districtRegion", "District / Administrative Region")}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
              <MapPin className="w-4 h-4 text-primary-color" />
              <span className="meta-val">{t(facility.district)}</span>
            </div>
          </div>

          <div className="details-meta-item">
            <span className="meta-label">{t("facilities.directPhone", "Direct Contact Phone")}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
              <Phone className="w-4 h-4 text-secondary-color" />
              <span className="meta-val">{facility.phone}</span>
            </div>
          </div>
        </div>

        {/* Address & Direction Section */}
        <div style={{ padding: "18px 20px", borderRadius: "var(--radius-lg)", background: "var(--surface-container-low)", border: "1px solid var(--border-color)" }}>
          <h4 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-color)", marginBottom: "6px" }}>
            {t("facilities.physicalAddress", "Physical Address")}
          </h4>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
            <MapPin className="w-4 h-4 text-primary-color shrink-0" />
            <span>{t(facility.address)}, {t(facility.district)}</span>
          </p>
        </div>

        {/* Available Services Section */}
        <div>
          <h4 style={{ fontSize: "15px", fontWeight: "800", color: "var(--text-color)", marginBottom: "12px" }}>
            {t("facilities.availableServicesTitle", "Available Clinical Services & Schemes")}
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {facility.services.map((service) => (
              <span
                key={service}
                style={{
                  padding: "8px 14px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--surface-container-low)",
                  border: "1px solid var(--border-color)",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-color)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <CheckCircle2 className="w-4 h-4 text-surface-tint" />
                <span>{t(service)}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            paddingTop: "18px",
            borderTop: "1px solid var(--border-color)",
            flexWrap: "wrap"
          }}
        >
          <a
            href={`tel:${facility.phone}`}
            className="btn-primary-action"
            style={{ padding: "12px 24px" }}
          >
            <Phone className="w-4 h-4" />
            <span>{t("facilities.callFacilityBtn", { phone: facility.phone }, `Call Facility (${facility.phone})`)}</span>
          </a>

          <Link
            to="/appointments"
            className="btn-secondary-action"
            style={{ padding: "12px 20px" }}
          >
            <Calendar className="w-4 h-4" />
            <span>{t("facilities.requestOpdAppointment", "Request OPD Appointment")}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default FacilityDetails;