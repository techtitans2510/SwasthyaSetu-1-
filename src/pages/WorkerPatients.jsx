import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  Users,
  UserRound,
  CalendarDays,
  MapPin,
  ArrowRight,
  Plus,
  AlertTriangle,
  Clock,
  Activity,
  Baby
} from "lucide-react";

import { getWorkerPatients } from "../api/workerPatients.api";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "high", label: "High Risk" },
  { id: "follow-up", label: "Follow-up" },
  { id: "pregnant", label: "Pregnant" },
  { id: "chronic", label: "Chronic" }
];

function WorkerPatients() {
  const [patients, setPatients] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadPatients() {
      try {
        setLoading(true);
        setError("");

        const data = await getWorkerPatients();

        if (mounted) {
          setPatients(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err.message || "Unable to load patients."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPatients();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredPatients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return patients.filter((patient) => {
      const matchesSearch =
        !query ||
        patient.name.toLowerCase().includes(query) ||
        patient.id.toLowerCase().includes(query) ||
        patient.location.toLowerCase().includes(query);

      let matchesFilter = true;

      if (activeFilter === "high") {
        matchesFilter = patient.riskLevel === "high";
      }

      if (activeFilter === "follow-up") {
        matchesFilter =
          patient.tags.includes("Follow-up");
      }

      if (activeFilter === "pregnant") {
        matchesFilter =
          patient.tags.includes("Pregnant");
      }

      if (activeFilter === "chronic") {
        matchesFilter =
          patient.tags.includes("Chronic");
      }

      return matchesSearch && matchesFilter;
    });
  }, [patients, activeFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: patients.length,

      high: patients.filter(
        (patient) => patient.riskLevel === "high"
      ).length,

      followUp: patients.filter(
        (patient) => patient.tags.includes("Follow-up")
      ).length,

      pregnant: patients.filter(
        (patient) => patient.tags.includes("Pregnant")
      ).length,

      chronic: patients.filter(
        (patient) => patient.tags.includes("Chronic")
      ).length
    };
  }, [patients]);

  return (
    <div className="worker-page">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="worker-page-header">

        <div>
          <span className="worker-eyebrow">
            Community Care
          </span>

          <h1>
            My Patients
          </h1>

          <p>
            View and manage patients assigned to your
            catchment area.
          </p>
        </div>

        <Link
          to="/worker/visits/new"
          className="worker-primary-action"
        >
          <Plus />
          <span>Record New Visit</span>
        </Link>

      </header>

      {/* =========================================================
          SUMMARY
      ========================================================= */}

      <section className="worker-patient-summary">

        <div className="worker-patient-summary-icon">
          <Users />
        </div>

        <div>
          <strong>
            {counts.all}
          </strong>

          <span>
            Assigned patients
          </span>
        </div>

      </section>

      {/* =========================================================
          SEARCH
      ========================================================= */}

      <section className="worker-patient-toolbar">

        <div className="worker-search-box">

          <Search />

          <input
            type="search"
            placeholder="Search by patient name, ID or location..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
          />

        </div>

      </section>

      {/* =========================================================
          FILTERS
      ========================================================= */}

      <section className="worker-patient-filters">

        {FILTERS.map((filter) => {

          let count = counts.all;

          if (filter.id === "high") {
            count = counts.high;
          }

          if (filter.id === "follow-up") {
            count = counts.followUp;
          }

          if (filter.id === "pregnant") {
            count = counts.pregnant;
          }

          if (filter.id === "chronic") {
            count = counts.chronic;
          }

          return (
            <button
              key={filter.id}
              type="button"
              className={
                activeFilter === filter.id
                  ? "worker-filter active"
                  : "worker-filter"
              }
              onClick={() =>
                setActiveFilter(filter.id)
              }
            >
              <span>{filter.label}</span>
              <strong>{count}</strong>
            </button>
          );
        })}

      </section>

      {/* =========================================================
          ERROR
      ========================================================= */}

      {error && (
        <div className="worker-page-message error">
          <AlertTriangle />
          <span>{error}</span>
        </div>
      )}

      {/* =========================================================
          LOADING
      ========================================================= */}

      {loading && (
        <div className="worker-page-message">
          <Activity className="worker-loading-icon" />
          <span>
            Loading assigned patients...
          </span>
        </div>
      )}

      {/* =========================================================
          EMPTY
      ========================================================= */}

      {!loading &&
        !error &&
        filteredPatients.length === 0 && (
          <div className="worker-empty-state">

            <div>
              <Users />
            </div>

            <h2>
              No patients found
            </h2>

            <p>
              Try changing your search or filter.
            </p>

          </div>
        )}

      {/* =========================================================
          PATIENT LIST
      ========================================================= */}

      {!loading &&
        !error &&
        filteredPatients.length > 0 && (

          <section className="worker-patient-list">

            {filteredPatients.map((patient) => (

              <article
                className="worker-patient-card"
                key={patient.id}
              >

                {/* PATIENT IDENTITY */}

                <div className="worker-patient-identity">

                  <div className="worker-patient-avatar">
                    {patient.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>

                    <div className="worker-patient-name-row">

                      <h2>
                        {patient.name}
                      </h2>

                      <span
                        className={`worker-risk-badge ${patient.riskLevel}`}
                      >
                        {patient.riskLevel === "high"
                          ? "High Risk"
                          : patient.riskLevel === "medium"
                            ? "Needs Attention"
                            : "Stable"}
                      </span>

                    </div>

                    <span className="worker-patient-id">
                      {patient.id}
                    </span>

                    <div className="worker-patient-basic">

                      <span>
                        <UserRound />
                        {patient.sex}
                      </span>

                      <span>
                        {patient.age} years
                      </span>

                      <span>
                        <MapPin />
                        {patient.location}
                      </span>

                    </div>

                  </div>

                </div>

                {/* CONDITION */}

                <div className="worker-patient-condition">

                  <span className="worker-card-label">
                    Current concern
                  </span>

                  <strong>
                    {patient.conditions.join(" • ")}
                  </strong>

                  <div className="worker-patient-tags">

                    {patient.tags.map((tag) => (

                      <span key={tag}>
                        {tag === "Pregnant" && (
                          <Baby />
                        )}

                        {tag}
                      </span>

                    ))}

                  </div>

                </div>

                {/* CARE INFORMATION */}

                <div className="worker-patient-care">

                  <div>

                    <span className="worker-card-label">
                      Last visit
                    </span>

                    <strong>
                      <CalendarDays />
                      {patient.lastVisit}
                    </strong>

                  </div>

                  <div>

                    <span className="worker-card-label">
                      Next follow-up
                    </span>

                    <strong
                      className={
                        patient.nextFollowUp === "Today"
                          ? "follow-up-due"
                          : ""
                      }
                    >
                      <Clock />
                      {patient.nextFollowUp}
                    </strong>

                  </div>

                  <div>

                    <span className="worker-card-label">
                      Primary facility
                    </span>

                    <strong>
                      <MapPin />
                      {patient.primaryFacility}
                    </strong>

                  </div>

                </div>

                {/* ACTION */}

                <Link
                  to={`/worker/patients/${patient.id}`}
                  className="worker-patient-view"
                >
                  <span>
                    View Patient
                  </span>

                  <ArrowRight />
                </Link>

              </article>

            ))}

          </section>

        )}

    </div>
  );
}

export default WorkerPatients;