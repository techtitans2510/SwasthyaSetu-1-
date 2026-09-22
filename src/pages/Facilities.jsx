import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useFacilities from "../hooks/useFacilities";
import useLanguage from "../hooks/useLanguage";
import {
  Search,
  MapPin,
  Phone,
  ArrowRight,
  Activity,
  AlertCircle,
  FolderOpen,
  Navigation,
  Stethoscope
} from "lucide-react";

function Facilities() {
  const { facilities, loading, error } = useFacilities();
  const { t } = useLanguage();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const facilityTypes = [
    { key: "All", label: t("facilities.allTypes", "All Facilities") },
    { key: "Primary Health Centre", label: t("facilities.phc", "Primary Health Centre") },
    { key: "District Hospital", label: t("facilities.dh", "District Hospital") },
    { key: "Community Health Centre", label: t("facilities.chc", "Community Health Centre") },
    { key: "Clinic", label: t("facilities.clinic", "Clinic") }
  ];

  const filteredFacilities = useMemo(() => {
    return (facilities || []).filter((facility) => {
      const matchesType =
        type === "All" ||
        facility.type === type;

      const searchText = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchText ||
        facility.name
          .toLowerCase()
          .includes(searchText) ||
        facility.type
          .toLowerCase()
          .includes(searchText) ||
        facility.address
          .toLowerCase()
          .includes(searchText) ||
        facility.district
          .toLowerCase()
          .includes(searchText) ||
        facility.services.some((service) =>
          service
            .toLowerCase()
            .includes(searchText)
        );

      return matchesType && matchesSearch;
    });
  }, [facilities, search, type]);

  return (
    <div className="facilities-page-container">
      {/* 1. Assisted Citizen Assist Banner */}
      <section className="assisted-booking-ribbon">
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "var(--primary-container)",
              color: "var(--on-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--primary-color)" }}>
                {t("facilities.title", "Find Healthcare Facilities")}
              </span>
              <span style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", padding: "1px 6px", borderRadius: "4px", background: "var(--surface-tint)", color: "white" }}>
                {t("facilities.ayushmanActiveBadge", "Ayushman Bharat Active")}
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              {t("facilities.subtitle", "Locate verified Public Health Centres (PHCs), Community Health Centres (CHCs), and District Hospitals.")}
            </p>
          </div>
        </div>

        <Link
          to="/appointments"
          className="btn-primary-action"
          style={{ whiteSpace: "nowrap", padding: "8px 16px", fontSize: "13px" }}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{t("appointmentsPage.bookNewBtn", "Book OPD Appointment")}</span>
        </Link>
      </section>

      {/* 2. Search and Category Filter Toolbar */}
      <section className="records-toolbar-card">
        <div className="records-search-wrapper">
          <Search className="records-search-icon" />
          <input
            type="text"
            className="records-search-input"
            placeholder={t("facilities.searchPlaceholder", "Search by facility name, specialty, district, or pin code...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-pills-row">
          {facilityTypes.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`category-pill-btn ${type === item.key ? "active" : ""}`}
              onClick={() => setType(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Loading State */}
      {loading && (
        <div className="state-container-card">
          <Activity className="w-10 h-10 text-primary-color animate-spin" />
          <h3 className="state-title">{t("facilities.loadingTitle", "Locating Healthcare Facilities...")}</h3>
          <p className="state-subtitle">
            {t("facilities.loadingSubtitle", "Fetching verified public hospitals and primary health centers in your area.")}
          </p>
        </div>
      )}

      {/* 4. Error State */}
      {!loading && error && (
        <div className="state-container-card" style={{ borderColor: "var(--error-color)" }}>
          <AlertCircle className="w-10 h-10 text-rose-600" />
          <h3 className="state-title" style={{ color: "var(--error-color)" }}>
            {t("facilities.unableToLoad", "Unable to Load Facilities")}
          </h3>
          <p className="state-subtitle">
            {t("facilities.errorSubtitle", "Could not fetch health center directory from the network. Please retry shortly.")}
          </p>
        </div>
      )}

      {/* 5. Empty State */}
      {!loading && !error && filteredFacilities.length === 0 && (
        <div className="state-container-card">
          <FolderOpen className="w-10 h-10 text-muted-color" />
          <h3 className="state-title">{t("facilities.noFacilitiesFound", "No Healthcare Facilities Found")}</h3>
          <p className="state-subtitle">
            {t("facilities.noFacilitiesDesc", { query: search || type }, `No health centres matched "${search || type}". Try expanding your search terms.`)}
          </p>
        </div>
      )}

      {/* 6. Facilities Grid */}
      {!loading && !error && filteredFacilities.length > 0 && (
        <section className="facilities-grid-container">
          {filteredFacilities.map((facility) => (
            <article className="facility-entry-card" key={facility.id}>
              <div>
                {/* Header Row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      color: "var(--primary-color)",
                      background: "var(--surface-container-low)",
                      padding: "3px 8px",
                      borderRadius: "var(--radius-sm)"
                    }}
                  >
                    {t(facility.type)}
                  </span>

                  <span className={`facility-status-pill ${facility.openNow ? "open" : "closed"}`}>
                    <span className="sync-pulse-dot" style={{ background: facility.openNow ? "var(--surface-tint)" : "var(--muted-color)" }} />
                    <span>{facility.openNow ? t("facilities.openNow24x7", "Open 24x7 / Available") : t("facilities.closed", "Closed")}</span>
                  </span>
                </div>

                {/* Facility Name & Location */}
                <h3 style={{ fontSize: "19px", fontWeight: "800", color: "var(--text-color)" }}>
                  {t(facility.name)}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <MapPin className="w-4 h-4 text-primary-color shrink-0" />
                    <span>{t(facility.address)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Navigation className="w-4 h-4 text-secondary-color shrink-0" />
                    <span>{t("facilities.distanceAway", { distance: facility.distance }, `Distance: ${facility.distance} away`)}</span>
                  </div>
                </div>

                {/* Services Tags */}
                <div className="facility-services-cloud">
                  {facility.services.slice(0, 4).map((service) => (
                    <span className="service-tag-pill" key={service}>
                      ✓ {t(service)}
                    </span>
                  ))}
                  {facility.services.length > 4 && (
                    <span className="service-tag-pill" style={{ background: "var(--surface-container)" }}>
                      {t("facilities.moreServices", { count: facility.services.length - 4 }, `+${facility.services.length - 4} more services`)}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "14px",
                  borderTop: "1px solid var(--border-color)",
                  gap: "10px",
                  flexWrap: "wrap"
                }}
              >
                <a
                  href={`tel:${facility.phone}`}
                  className="btn-secondary-action"
                  style={{ padding: "8px 14px", fontSize: "13px" }}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t("facilities.callFacility", { phone: facility.phone }, `Call ${facility.phone}`)}</span>
                </a>

                <Link
                  to={`/facilities/${facility.id}`}
                  className="btn-primary-action"
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  <span>{t("facilities.viewDetails", "View Details")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default Facilities;