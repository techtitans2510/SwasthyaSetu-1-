import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useFacilities from "../hooks/useFacilities";
import useAuth from "../hooks/useAuth";
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Check,
  ArrowRight,
  Activity,
  AlertCircle,
  FolderOpen,
  Navigation,
  Sparkles,
  Stethoscope
} from "lucide-react";

function Facilities() {
  const { facilities, loading, error } = useFacilities();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const facilityTypes = [
    "All",
    "Primary Health Centre",
    "District Hospital",
    "Community Health Centre",
    "Clinic"
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
                Verified Public Healthcare Network
              </span>
              <span style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", padding: "1px 6px", borderRadius: "4px", background: "var(--surface-tint)", color: "white" }}>
                Ayushman Bharat Active
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Find nearby Primary Health Centres, Community Hospitals, and Ayushman Bharat Arogya Mandirs with 100% cashless care.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary-color)", background: "var(--surface-container-lowest)", padding: "6px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            Pune District Network
          </span>
        </div>
      </section>

      {/* 2. Search and Category Filter Toolbar */}
      <section className="records-toolbar-card">
        <div className="search-input-wrapper">
          <Search className="w-5 h-5 search-input-icon" />
          <input
            type="search"
            placeholder="Search by facility name, service (e.g. Vaccination, ECG, Maternal), or address..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="category-pills-row">
          {facilityTypes.map((item) => (
            <button
              key={item}
              type="button"
              className={`category-pill-btn ${type === item ? "active" : ""}`}
              onClick={() => setType(item)}
            >
              {item === "All" ? "All Facilities" : item}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Loading State */}
      {loading && (
        <div className="state-container-card">
          <Activity className="w-10 h-10 text-primary-color animate-spin" />
          <h3 className="state-title">Locating Healthcare Facilities...</h3>
          <p className="state-subtitle">
            Fetching verified public hospitals and primary health centers in your area.
          </p>
        </div>
      )}

      {/* 4. Error State */}
      {!loading && error && (
        <div className="state-container-card" style={{ borderColor: "var(--error-color)" }}>
          <AlertCircle className="w-10 h-10 text-rose-600" />
          <h3 className="state-title" style={{ color: "var(--error-color)" }}>
            Unable to Load Facilities
          </h3>
          <p className="state-subtitle">
            Could not fetch health center directory from the network. Please retry shortly.
          </p>
        </div>
      )}

      {/* 5. Empty State */}
      {!loading && !error && filteredFacilities.length === 0 && (
        <div className="state-container-card">
          <FolderOpen className="w-10 h-10 text-muted-color" />
          <h3 className="state-title">No Healthcare Facilities Found</h3>
          <p className="state-subtitle">
            No health centres matched "{search || type}". Try expanding your search terms.
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
                    {facility.type}
                  </span>

                  <span className={`facility-status-pill ${facility.openNow ? "open" : "closed"}`}>
                    <span className="sync-pulse-dot" style={{ background: facility.openNow ? "var(--surface-tint)" : "var(--muted-color)" }} />
                    <span>{facility.openNow ? "Open 24x7 / Available" : "Closed"}</span>
                  </span>
                </div>

                {/* Facility Name & Location */}
                <h3 style={{ fontSize: "19px", fontWeight: "800", color: "var(--text-color)" }}>
                  {facility.name}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <MapPin className="w-4 h-4 text-primary-color shrink-0" />
                    <span>{facility.address}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Navigation className="w-4 h-4 text-secondary-color shrink-0" />
                    <span>Distance: <strong>{facility.distance}</strong> away</span>
                  </div>
                </div>

                {/* Services Tags */}
                <div className="facility-services-cloud">
                  {facility.services.slice(0, 4).map((service) => (
                    <span className="service-tag-pill" key={service}>
                      ✓ {service}
                    </span>
                  ))}
                  {facility.services.length > 4 && (
                    <span className="service-tag-pill" style={{ background: "var(--surface-container)" }}>
                      +{facility.services.length - 4} more services
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
                  <span>Call {facility.phone}</span>
                </a>

                <Link
                  to={`/facilities/${facility.id}`}
                  className="btn-primary-action"
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  <span>View Details</span>
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