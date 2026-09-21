import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Search,
  MapPin,
  Building2,
  ArrowRight,
  Plus,
  X
} from "lucide-react";
import { getWorkerPatients } from "../api/workerPatients.api";

const FILTER_TABS = [
  { id: "all", label: "All Patients" },
  { id: "high_risk", label: "High Risk" },
  { id: "follow_up", label: "Follow-up Due" },
  { id: "pregnant", label: "Pregnant / ANC" },
  { id: "chronic", label: "Chronic (NCD)" }
];

function WorkerPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;
    async function loadPatients() {
      setLoading(true);
      try {
        const data = await getWorkerPatients({
          search,
          filter: activeFilter
        });
        if (isMounted) {
          setPatients(data);
        }
      } catch (err) {
        console.error("Failed to load patients", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadPatients();
    return () => {
      isMounted = false;
    };
  }, [search, activeFilter]);

  const handleClearSearch = () => {
    setSearch("");
  };

  return (
    <div className="worker-dashboard">
      {/* ==============================================================
          HEADER
      ============================================================== */}
      <header className="worker-page-header">
        <div>
          <span className="worker-eyebrow">Community Cohort Registry</span>
          <h1>My Assigned Patients</h1>
          <p>
            Manage individual patient profiles, triage high-risk maternal and
            chronic care cases, and initiate field screening visits.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link
            to="/worker/visits/new"
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
            Record New Visit
          </Link>
        </div>
      </header>

      {/* ==============================================================
          CONTROLS: SEARCH & CATEGORY FILTERS
      ============================================================== */}
      <div
        className="worker-panel"
        style={{
          marginBottom: "20px",
          padding: "16px 20px"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}
        >
          {/* SEARCH INPUT */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "600px"
            }}
          >
            <Search
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "16px",
                height: "16px",
                color: "var(--text-secondary)"
              }}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name, ID (e.g. PAT-1001), village, or ABHA..."
              style={{
                width: "100%",
                padding: "10px 36px 10px 38px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "13px",
                outline: "none"
              }}
            />

            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
                title="Clear search"
              >
                <X style={{ width: "14px", height: "14px" }} />
              </button>
            )}
          </div>

          {/* FILTER TABS */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap"
            }}
          >
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: isActive
                      ? "1px solid var(--primary-color)"
                      : "1px solid var(--border-color)",
                    background: isActive
                      ? "var(--primary-color)"
                      : "var(--bg-secondary)",
                    color: isActive ? "white" : "var(--text-secondary)",
                    transition: "all 0.15s ease"
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==============================================================
          PATIENTS LIST / CARDS
      ============================================================== */}
      <div className="worker-panel">
        <div className="worker-panel-header">
          <div>
            <span className="worker-section-label">Catchment Cohort</span>
            <h2>
              Assigned Patients{" "}
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "normal",
                  color: "var(--text-secondary)"
                }}
              >
                ({patients.length})
              </span>
            </h2>
          </div>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-secondary)", padding: "24px 0" }}>
            Loading assigned patient cohort...
          </p>
        ) : patients.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              No patients match the selected search or filter criteria.
            </p>
            {(search || activeFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveFilter("all");
                }}
                style={{
                  marginTop: "12px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "var(--card-bg)",
                  color: "var(--primary-color)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}
          >
            {patients.map((patient) => {
              const isHighRisk = patient.riskCategory === "High Risk";
              const isMaternal =
                patient.riskCategory === "Maternal Care" || patient.isPregnant;

              return (
                <article
                  key={patient.id}
                  style={{
                    padding: "16px 18px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    background: "var(--bg-secondary)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    transition: "border-color 0.15s ease"
                  }}
                >
                  {/* TOP ROW: NAME, ID, RISK BADGE, ACTIONS */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "12px",
                      flexWrap: "wrap"
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flexWrap: "wrap"
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: 700
                          }}
                        >
                          {patient.name}
                        </h3>

                        <span
                          style={{
                            fontSize: "11px",
                            padding: "2px 7px",
                            borderRadius: "4px",
                            background: "var(--card-bg)",
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
                          {patient.riskCategory}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginTop: "4px",
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          flexWrap: "wrap"
                        }}
                      >
                        <span>
                          {patient.age} yrs • {patient.gender} • Blood:{" "}
                          {patient.bloodGroup || "O+"}
                        </span>

                        <span>•</span>

                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px"
                          }}
                        >
                          <MapPin style={{ width: "13px", height: "13px" }} />
                          {patient.village} ({patient.address})
                        </span>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexShrink: 0
                      }}
                    >
                      <NavLink
                        to={`/worker/patients/${patient.id}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "8px 14px",
                          border: "1px solid var(--border-color)",
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                          fontSize: "12px",
                          fontWeight: 600,
                          textDecoration: "none",
                          background: "var(--card-bg)"
                        }}
                      >
                        View Patient
                        <ArrowRight style={{ width: "13px", height: "13px" }} />
                      </NavLink>

                      <NavLink
                        to={`/worker/visits/new?patientId=${patient.id}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "8px 14px",
                          background: "var(--primary-color)",
                          color: "white",
                          border: "1px solid var(--primary-color)",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 600,
                          textDecoration: "none"
                        }}
                      >
                        <Plus style={{ width: "14px", height: "14px" }} />
                        Record Visit
                      </NavLink>
                    </div>
                  </div>

                  {/* MIDDLE: CURRENT CONDITIONS & TAGS */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                      fontSize: "12px"
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: "var(--text-secondary)"
                      }}
                    >
                      Care Context:
                    </span>
                    <span style={{ fontWeight: 500 }}>
                      {patient.chronicConditions?.join(", ") || "Routine General Health"}
                    </span>

                    {/* TAGS */}
                    {patient.tags?.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "10px",
                          padding: "2px 7px",
                          borderRadius: "4px",
                          background: "var(--card-bg)",
                          border: "1px solid var(--border-color)",
                          color: "var(--text-secondary)"
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* BOTTOM: CLINICAL METADATA STRIP */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "18px",
                      paddingTop: "8px",
                      borderTop: "1px solid var(--border-color)",
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      flexWrap: "wrap"
                    }}
                  >
                    <div>
                      Last Visit:{" "}
                      <strong style={{ color: "var(--text-primary)" }}>
                        {patient.lastVisitDate || "None"}
                      </strong>
                    </div>

                    <div>
                      Next Follow-up / Visit:{" "}
                      <strong style={{ color: "var(--text-primary)" }}>
                        {patient.nextFollowUp ||
                          patient.nextScheduledVisit ||
                          "Not scheduled"}
                      </strong>
                    </div>

                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <Building2 style={{ width: "12px", height: "12px" }} />
                      Primary Facility:{" "}
                      <strong style={{ color: "var(--text-primary)" }}>
                        {patient.primaryFacility || "Shirur 24x7 PHC"}
                      </strong>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkerPatients;
