import { Link, useParams } from "react-router-dom";
import useFacility from "../hooks/useFacility";

function FacilityDetails() {
  const { id } = useParams();

  const {
    facility,
    loading,
    error
  } = useFacility(id);

  if (loading) {
    return (
      <div className="facility-details">
        <div className="records-state">
          <div className="records-loader" />
          <p>Loading facility...</p>
        </div>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="facility-details">
        <div className="records-state records-error">
          <span>⚠️</span>

          <h3>Facility not found</h3>

          <p>
            The healthcare facility could not be found.
          </p>

          <Link
            to="/facilities"
            className="record-back-button"
          >
            ← Back to Facilities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="facility-details">

      <section className="page-header">

        <Link
          to="/facilities"
          className="record-back-link"
        >
          ← Find a Facility
        </Link>

        <p className="page-eyebrow">
          Healthcare Facility
        </p>

        <h2>{facility.name}</h2>

        <p>
          {facility.type}
        </p>

      </section>

      <section className="facility-details-card">

        <div className="facility-details-header">

          <div className="facility-details-icon">
            🏥
          </div>

          <div>
            <span
              className={
                facility.openNow
                  ? "facility-status open"
                  : "facility-status closed"
              }
            >
              <span className="status-dot" />

              {facility.openNow
                ? "Open now"
                : "Currently closed"}
            </span>

            <h3>{facility.name}</h3>
          </div>

        </div>

        <div className="facility-details-grid">

          <div className="facility-detail-item">
            <span>Facility Type</span>
            <strong>{facility.type}</strong>
          </div>

          <div className="facility-detail-item">
            <span>Distance</span>
            <strong>{facility.distance}</strong>
          </div>

          <div className="facility-detail-item">
            <span>Location</span>
            <strong>{facility.district}</strong>
          </div>

          <div className="facility-detail-item">
            <span>Phone</span>
            <strong>{facility.phone}</strong>
          </div>

        </div>

        <div className="facility-address-section">

          <h4>Address</h4>

          <p>
            📍 {facility.address}
          </p>

        </div>

        <div className="facility-services-section">

          <h4>Available Services</h4>

          <div className="facility-service-list">
            {facility.services.map((service) => (
              <span key={service}>
                ✓ {service}
              </span>
            ))}
          </div>

        </div>

        <div className="facility-actions">

          <a
            href={`tel:${facility.phone}`}
            className="facility-action-primary"
          >
            📞 Call Facility
          </a>

          <button
            className="facility-action-secondary"
            disabled
          >
            📍 Get Directions
          </button>

        </div>

      </section>

    </div>
  );
}

export default FacilityDetails;