import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function SideDrawer({ isOpen, onClose, darkMode, setDarkMode }) {
  const { logout } = useAuth();
  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className={`side-drawer ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="drawer-header">
          <div>
            <h2>Menu</h2>
            <p>Patient Portal</p>
          </div>

          <button
            className="drawer-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="drawer-navigation">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) =>
              `drawer-link ${isActive ? "active" : ""}`
            }
          >
            <span>🏠</span>
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/medical-records"
            onClick={onClose}
            className={({ isActive }) =>
              `drawer-link ${isActive ? "active" : ""}`
            }
          >
            <span>🩺</span>
            <span>Medical Records</span>
          </NavLink>

          <NavLink
            to="/facilities"
            onClick={onClose}
            className={({ isActive }) =>
              `drawer-link ${isActive ? "active" : ""}`
            }
          >
            <span>🏥</span>
            <span>Find Facility</span>
          </NavLink>

          <NavLink
            to="/appointments"
            onClick={onClose}
            className={({ isActive }) =>
              `drawer-link ${isActive ? "active" : ""}`
            }
          >
            <span>📅</span>
            <span>Appointments</span>
          </NavLink>

          <NavLink
            to="/notifications"
            onClick={onClose}
            className={({ isActive }) =>
              `drawer-link ${isActive ? "active" : ""}`
            }
          >
            <span>🔔</span>
            <span>Notifications</span>
          </NavLink>
        </nav>

        {/* Bottom section */}
        <div className="drawer-bottom">
          {/* Theme Toggle */}
          <div className="theme-row">
            <div className="theme-label">
              <span>{darkMode ? "🌙" : "☀️"}</span>

              <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
            </div>

            <button
              className={`theme-toggle ${darkMode ? "dark" : ""}`}
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
              aria-pressed={darkMode}
            >
              <span className="toggle-knob" />
            </button>
          </div>

          {/* Settings */}
          <NavLink to="/settings" onClick={onClose} className="drawer-link">
            <span>⚙️</span>
            <span>Settings</span>
          </NavLink>

          {/* Logout */}
          <button
            className="drawer-link logout-button"
            onClick={async () => {
              await logout();
              onClose();
            }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default SideDrawer;
