import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import useMedicalRecords from "../hooks/useMedicalRecords";

function MedicalRecords() {
  const { records, loading, error } = useMedicalRecords();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Lab Report",
    "Prescription",
    "Diagnosis",
    "Imaging",
  ];

  const filteredRecords = useMemo(() => {
    return (records || []).filter((record) => {
      const matchesCategory = category === "All" || record.type === category;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        record.title.toLowerCase().includes(searchText) ||
        record.description.toLowerCase().includes(searchText) ||
        record.doctor.toLowerCase().includes(searchText) ||
        record.facility.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [records, search, category]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="medical-records">
      {/* Header */}
      <section className="page-header">
        <div>
          <p className="page-eyebrow">Healthcare Records</p>

          <h2>Medical Records</h2>

          <p>
            View and manage your medical history, reports, prescriptions, and
            diagnoses.
          </p>
        </div>
      </section>

      {/* Search + Filter */}
      <section className="records-toolbar">
        <div className="records-search">
          <span>🔍</span>

          <input
            type="search"
            placeholder="Search medical records..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="records-filters">
          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item ? "record-filter active" : "record-filter"
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="records-state">
          <div className="records-loader" />
          <p>Loading medical records...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="records-state records-error">
          <span>⚠️</span>

          <h3>Unable to load records</h3>

          <p>Please try again later.</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filteredRecords.length === 0 && (
        <div className="records-state">
          <span>📂</span>

          <h3>No records found</h3>

          <p>Try changing your search or filter.</p>
        </div>
      )}

      {/* Records */}
      {!loading && !error && filteredRecords.length > 0 && (
        <section className="records-grid">
          {filteredRecords.map((record) => (
            <article className="record-card" key={record.id}>
              <div className="record-card-top">
                <div
                  className={`record-icon ${record.type
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {record.type === "Lab Report" && "🧪"}

                  {record.type === "Prescription" && "💊"}

                  {record.type === "Diagnosis" && "🩺"}

                  {record.type === "Imaging" && "🩻"}
                </div>

                <span className="record-type">{record.type}</span>
              </div>

              <div className="record-content">
                <h3>{record.title}</h3>

                <p>{record.description}</p>

                <div className="record-meta">
                  <span>👨‍⚕️ {record.doctor}</span>

                  <span>🏥 {record.facility}</span>

                  <span>📅 {formatDate(record.recordDate)}</span>
                </div>
              </div>

              <div className="record-footer">
                <span
                  className={
                    record.offlineAvailable
                      ? "offline-status available"
                      : "offline-status online-only"
                  }
                >
                  {record.offlineAvailable
                    ? "✓ Available offline"
                    : "☁ Online only"}
                </span>
                <Link
                  to={`/medical-records/${record.id}`}
                  className="record-view-button"
                >
                  View →
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default MedicalRecords;
