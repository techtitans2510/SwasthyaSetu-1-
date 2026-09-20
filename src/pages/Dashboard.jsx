import useDashboard from "../hooks/useDashboard";

function Dashboard() {
  const {
    dashboard,
    loading,
    error
  } = useDashboard();

  if (loading) {
    return (
      <div className="dashboard">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <p>Unable to load dashboard.</p>
      </div>
    );
  }

  const { patient, stats, upcomingAppointment } = dashboard;

  const statCards = [
    {
      icon: "🩺",
      title: "Medical Records",
      value: stats.medicalRecords,
      description: "Available records"
    },
    {
      icon: "📅",
      title: "Appointments",
      value: stats.appointments,
      description: "Upcoming appointment"
    },
    {
      icon: "🔄",
      title: "Referrals",
      value: stats.referrals,
      description: "Active referrals"
    }
  ];

  return (
    <div className="dashboard">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-greeting">
            Good morning 👋
          </p>

          <h2>Welcome back, {patient.name}</h2>

          <p>
            Here's an overview of your healthcare journey.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        {statCards.map((stat) => (
          <div className="stat-card" key={stat.title}>
            <div className="stat-icon">
              {stat.icon}
            </div>

            <div className="stat-content">
              <p>{stat.title}</p>
              <strong>{stat.value}</strong>
              <span>{stat.description}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h3>Upcoming Appointment</h3>
        </div>

        <div className="appointment-card">
          <div className="appointment-date">
            <strong>
              {new Date(
                upcomingAppointment.date
              ).getDate()}
            </strong>

            <span>
              {new Date(
                upcomingAppointment.date
              )
                .toLocaleString("en-US", {
                  month: "short"
                })
                .toUpperCase()}
            </span>
          </div>

          <div className="appointment-info">
            <h4>{upcomingAppointment.doctor}</h4>

            <p>
              {upcomingAppointment.facility}
            </p>

            <span>
              {upcomingAppointment.time}
            </span>
          </div>

          <button>
            View Details →
          </button>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;