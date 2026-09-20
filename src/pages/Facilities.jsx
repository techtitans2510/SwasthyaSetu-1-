import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useFacilities from "../hooks/useFacilities";

function Facilities() {
  const {
    facilities,
    loading,
    error
  } = useFacilities();

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
    <div className="facilities-page">

      {/* Header */}
      <section className="page-header">
        <div>
          <p className="page-eyebrow">
            Healthcare Access
          </p>

          <h2>Find a Facility</h2>

          <p>
            Find nearby healthcare facilities,
            available services, and essential
            care information.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="facilities-toolbar">

        <div className="facilities-search">
          <span>🔍</span>

          <input
            type="search"
            placeholder="Search facilities, services..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        {/* Filters */}
        <div className="facility-filters">
          {facilityTypes.map((item) => (
            <button
              key={item}
              className={
                type === item
                  ? "facility-filter active"
                  : "facility-filter"
              }
              onClick={() => setType(item)}
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
          <p>
            Finding healthcare facilities...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="records-state records-error">
          <span>⚠️</span>

          <h3>
            Unable to load facilities
          </h3>

          <p>
            Please try again later.
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        filteredFacilities.length === 0 && (
          <div className="records-state">
            <span>🏥</span>

            <h3>
              No facilities found
            </h3>

            <p>
              Try changing your search or filter.
            </p>
          </div>
        )}

      {/* Facility Cards */}
      {!loading &&
        !error &&
        filteredFacilities.length > 0 && (
          <section className="facilities-grid">

            {filteredFacilities.map((facility) => (
              <article
                className="facility-card"
                key={facility.id}
              >

                <div className="facility-card-header">

                  <div className="facility-icon">
                    🏥
                  </div>

                  <span
                    className={
                      facility.openNow
                        ? "facility-status open"
                        : "facility-status closed"
                    }
                  >
                    <span className="status-dot" />
                    {facility.openNow
                      ? "Open"
                      : "Closed"}
                  </span>

                </div>

                <div className="facility-content">

                  <span className="facility-type">
                    {facility.type}
                  </span>

                  <h3>
                    {facility.name}
                  </h3>

                  <p className="facility-address">
                    📍 {facility.address}
                  </p>

                  <p className="facility-distance">
                    📏 {facility.distance} away
                  </p>

                  <div className="facility-services">
                    {facility.services
                      .slice(0, 3)
                      .map((service) => (
                        <span key={service}>
                          {service}
                        </span>
                      ))}

                    {facility.services.length > 3 && (
                      <span>
                        +{facility.services.length - 3}
                      </span>
                    )}
                  </div>

                </div>

                <div className="facility-card-footer">

                  <a
                    href={`tel:${facility.phone}`}
                    className="facility-call-button"
                  >
                    📞 Call
                  </a>

                  <Link
                    to={`/facilities/${facility.id}`}
                    className="facility-view-button"
                  >
                    View Details →
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