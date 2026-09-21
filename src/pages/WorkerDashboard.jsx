import { NavLink } from "react-router-dom";

import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  GitBranch,
  MapPin,
  Users
} from "lucide-react";

const stats = [
  {
    label: "Assigned Patients",
    value: "48",
    icon: Users
  },
  {
    label: "Today's Visits",
    value: "6",
    icon: CalendarDays
  },
  {
    label: "Follow-ups Due",
    value: "4",
    icon: ClipboardList
  },
  {
    label: "Active Referrals",
    value: "3",
    icon: GitBranch
  }
];

const visits = [
  {
    time: "08:30 AM",
    patient: "Meena Kumari",
    purpose: "BP & diabetes follow-up",
    location: "Talwade"
  },
  {
    time: "10:00 AM",
    patient: "Ramesh Kumar",
    purpose: "Medication review",
    location: "Shirur"
  },
  {
    time: "11:30 AM",
    patient: "Sunita Devi",
    purpose: "Maternal health follow-up",
    location: "Talwade"
  }
];

const alerts = [
  {
    title: "Follow-up due today",
    detail:
      "2 patients have pending post-referral follow-ups.",
    type: "warning"
  },
  {
    title: "Referral awaiting facility",
    detail:
      "REF-10482 has not yet received a facility response.",
    type: "info"
  }
];

function WorkerDashboard() {
  return (
    <div className="worker-dashboard">

      {/* Page Header */}
      <header className="worker-page-header">

        <div>
          <span className="worker-eyebrow">
            Field Care Workspace
          </span>

          <h1>
            Good morning, Field Worker
          </h1>

          <p>
            Manage community visits, identify care
            needs, and keep referrals moving until
            the patient receives care.
          </p>
        </div>

        <div className="worker-location-badge">
          <MapPin />

          <span>
            Assigned catchment area
          </span>
        </div>

      </header>

      {/* Statistics */}
      <section className="worker-stat-grid">

        {stats.map(
          ({ label, value, icon: Icon }) => (
            <article
              className="worker-stat-card"
              key={label}
            >
              <div className="worker-stat-icon">
                <Icon />
              </div>

              <div>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            </article>
          )
        )}

      </section>

      {/* Main Dashboard */}
      <section className="worker-dashboard-grid">

        {/* Scheduled Visits */}
        <div className="worker-panel">

          <div className="worker-panel-header">

            <div>
              <span className="worker-section-label">
                Today's work
              </span>

              <h2>
                Scheduled Visits
              </h2>
            </div>

            <NavLink to="/worker/patients">
              View patients
              <ArrowRight />
            </NavLink>

          </div>

          <div className="worker-visit-list">

            {visits.map((visit) => (
              <article
                className="worker-visit-item"
                key={`${visit.time}-${visit.patient}`}
              >

                <div className="worker-visit-time">
                  {visit.time}
                </div>

                <div className="worker-visit-main">

                  <strong>
                    {visit.patient}
                  </strong>

                  <span>
                    {visit.purpose}
                  </span>

                  <small>
                    <MapPin />
                    {visit.location}
                  </small>

                </div>

                <button type="button">
                  Start visit
                </button>

              </article>
            ))}

          </div>

        </div>

        {/* Alerts */}
        <div className="worker-panel">

          <div className="worker-panel-header">

            <div>
              <span className="worker-section-label">
                Needs attention
              </span>

              <h2>
                Care Alerts
              </h2>
            </div>

            <AlertTriangle />

          </div>

          <div className="worker-alert-list">

            {alerts.map((alert) => (
              <article
                className={`worker-alert ${alert.type}`}
                key={alert.title}
              >

                {alert.type === "warning" ? (
                  <AlertTriangle />
                ) : (
                  <GitBranch />
                )}

                <div>
                  <strong>
                    {alert.title}
                  </strong>

                  <p>
                    {alert.detail}
                  </p>
                </div>

              </article>
            ))}

          </div>

          {/* Care Continuity */}
          <div className="worker-care-loop">

            <CheckCircle2 />

            <div>
              <strong>
                Care continuity
              </strong>

              <span>
                Every referral stays visible until
                an outcome is recorded.
              </span>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default WorkerDashboard;