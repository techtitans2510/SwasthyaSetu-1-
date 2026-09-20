import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAppointments from "../hooks/useAppointments";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );
}

function getStatusLabel(status) {
  switch (status) {
    case "upcoming":
      return "Upcoming";

    case "completed":
      return "Completed";

    case "cancelled":
      return "Cancelled";

    case "pending":
      return "Pending";

    default:
      return status;
  }
}

function Appointments() {
  const {
    appointments,
    loading,
    error
  } = useAppointments();

  const [activeFilter, setActiveFilter] =
    useState("all");

  const filteredAppointments = useMemo(() => {
    if (!Array.isArray(appointments)) {
      return [];
    }

    if (activeFilter === "all") {
      return appointments;
    }

    return appointments.filter(
      (appointment) =>
        appointment.status === activeFilter
    );
  }, [appointments, activeFilter]);

  if (loading) {
    return (
      <div className="appointments-page">
        <div className="appointments-state">
          <h3>Loading appointments...</h3>
          <p>
            Please wait while we load your
            appointments.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="appointments-page">
        <div className="appointments-state error">
          <h3>
            Unable to load appointments
          </h3>

          <p>
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="appointments-page">

      {/* PAGE HEADER */}

      <section className="page-header">
        <div>
          <p className="page-eyebrow">
            Healthcare
          </p>

          <h2>Appointments</h2>

          <p>
            View and manage your healthcare
            appointments.
          </p>
        </div>

        <button
          className="primary-button"
          type="button"
        >
          + Request Appointment
        </button>
      </section>

      {/* FILTERS */}

      <section className="appointment-filters">
        <button
          className={`appointment-filter ${
            activeFilter === "all"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveFilter("all")
          }
        >
          All
        </button>

        <button
          className={`appointment-filter ${
            activeFilter === "upcoming"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveFilter("upcoming")
          }
        >
          Upcoming
        </button>

        <button
          className={`appointment-filter ${
            activeFilter === "completed"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveFilter("completed")
          }
        >
          Completed
        </button>

        <button
          className={`appointment-filter ${
            activeFilter === "cancelled"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveFilter("cancelled")
          }
        >
          Cancelled
        </button>
      </section>

      {/* APPOINTMENTS */}

      {filteredAppointments.length === 0 ? (
        <div className="appointments-state">
          <div className="state-icon">
            📅
          </div>

          <h3>No appointments found</h3>

          <p>
            There are no appointments in
            this category.
          </p>
        </div>
      ) : (
        <section className="appointments-list">

          {filteredAppointments.map(
            (appointment) => (
              <article
                className="appointment-card-full"
                key={appointment.id}
              >

                {/* DATE */}

                <div className="appointment-date-large">
                  <strong>
                    {new Date(
                      appointment.date
                    ).getDate()}
                  </strong>

                  <span>
                    {new Date(
                      appointment.date
                    )
                      .toLocaleString(
                        "en-US",
                        {
                          month: "short"
                        }
                      )
                      .toUpperCase()}
                  </span>
                </div>

                {/* INFO */}

                <div className="appointment-main-info">

                  <div className="appointment-top-row">
                    <div>
                      <h3>
                        {appointment.doctor}
                      </h3>

                      <p>
                        {appointment.specialty}
                      </p>
                    </div>

                    <span
                      className={`appointment-status ${appointment.status}`}
                    >
                      {getStatusLabel(
                        appointment.status
                      )}
                    </span>
                  </div>

                  <div className="appointment-meta">

                    <span>
                      🏥{" "}
                      {appointment.facility}
                    </span>

                    <span>
                      🕐{" "}
                      {appointment.time}
                    </span>

                    <span>
                      📋{" "}
                      {appointment.type}
                    </span>

                  </div>

                  <p className="appointment-reason">
                    {appointment.reason}
                  </p>

                </div>

                {/* ACTION */}

                <div className="appointment-action">
                  <Link
                    to={`/appointments/${appointment.id}`}
                    className="secondary-button"
                  >
                    View Details →
                  </Link>
                </div>

              </article>
            )
          )}

        </section>
      )}

    </div>
  );
}

export default Appointments;