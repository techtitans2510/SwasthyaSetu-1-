import { Link, useParams } from "react-router-dom";
import useMedicalRecord from "../hooks/useMedicalRecords";

function MedicalRecordDetails() {
  const { id } = useParams();

  const {
    record,
    loading,
    error
  } = useMedicalRecord(id);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }
    );
  };

  if (loading) {
    return (
      <div className="record-details">
        <div className="records-state">
          <div className="records-loader" />
          <p>Loading medical record...</p>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="record-details">
        <div className="records-state records-error">
          <span>⚠️</span>

          <h3>
            Record not found
          </h3>

          <p>
            The medical record you're looking
            for could not be found.
          </p>

          <Link
            to="/medical-records"
            className="record-back-button"
          >
            ← Back to Medical Records
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="record-details">

      {/* Page header */}
      <section className="page-header">
        <Link
          to="/medical-records"
          className="record-back-link"
        >
          ← Medical Records
        </Link>

        <p className="page-eyebrow">
          Medical Record
        </p>

        <h2>{record.title}</h2>

        <p>
          {record.description}
        </p>
      </section>

      {/* Main record */}
      <section className="record-details-card">

        <div className="record-details-top">

          <div className="record-details-icon">
            {record.type === "Lab Report" && "🧪"}
            {record.type === "Prescription" && "💊"}
            {record.type === "Diagnosis" && "🩺"}
            {record.type === "Imaging" && "🩻"}
          </div>

          <div>
            <span className="record-details-type">
              {record.type}
            </span>

            <h3>{record.title}</h3>
          </div>

        </div>

        {/* Information */}
        <div className="record-information">

          <div className="record-information-item">
            <span>Record Date</span>
            <strong>
              {formatDate(record.recordDate)}
            </strong>
          </div>

          <div className="record-information-item">
            <span>Doctor</span>
            <strong>{record.doctor}</strong>
          </div>

          <div className="record-information-item">
            <span>Healthcare Facility</span>
            <strong>{record.facility}</strong>
          </div>

          <div className="record-information-item">
            <span>Record ID</span>
            <strong>{record.id}</strong>
          </div>

        </div>

        {/* Offline status */}
        <div className="record-details-offline">
          {record.offlineAvailable ? (
            <>
              <span>✓</span>

              <div>
                <strong>
                  Available offline
                </strong>

                <p>
                  This record is available on
                  your device for offline access.
                </p>
              </div>
            </>
          ) : (
            <>
              <span>☁</span>

              <div>
                <strong>
                  Online access required
                </strong>

                <p>
                  Connect to the internet to
                  access this record.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Future document area */}
        <div className="record-document">

          <div className="record-document-icon">
            📄
          </div>

          <div>
            <h4>Medical Document</h4>

            <p>
              The actual report or document
              viewer will be connected here.
            </p>
          </div>

          <button
            className="record-document-button"
            disabled
          >
            View Document
          </button>

        </div>

      </section>

    </div>
  );
}

export default MedicalRecordDetails;