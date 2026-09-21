import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import logo from "../Assests/logo.svg";

import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardPlus,
  GitBranch,
  ListChecks,
  Sun,
  Moon,
  LogOut
} from "lucide-react";

function WorkerSidebar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const links = [
    {
      to: "/worker/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard
    },
    {
      to: "/worker/patients",
      label: "My Patients",
      icon: Users
    },
    {
      to: "/worker/visits",
      label: "Scheduled Visits",
      icon: CalendarDays
    },
    {
      to: "/worker/visits/new",
      label: "New Visit",
      icon: ClipboardPlus
    },
    {
      to: "/worker/referrals",
      label: "Referrals",
      icon: GitBranch
    },
    {
      to: "/worker/follow-ups",
      label: "Follow-ups",
      icon: ListChecks
    }
  ];

  const workerRole =
    user?.role === "asha"
      ? "ASHA Worker"
      : "ANM / Nurse";

  return (
    <aside className="worker-sidebar">
      <div>
        {/* Brand */}
        <div className="worker-brand">
          <div className="brand-emblem">
            <img
              src={logo}
              alt="SwasthyaSetu Logo"
              className="brand-logo-img"
            />
          </div>

          <div className="brand-text">
            <span className="brand-title">SwasthyaSetu</span>
            <span className="brand-subtitle">FIELD CARE PORTAL</span>
          </div>
        </div>

        {/* Worker Profile */}
        <div className="worker-profile">
          <div className="worker-avatar">
            {(user?.name || "W")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <strong>
              {user?.name || "Field Worker"}
            </strong>

            <span>{workerRole}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="worker-nav">
          {links.map(
            ({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `worker-nav-item ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon />
                <span>{label}</span>
              </NavLink>
            )
          )}
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="worker-sidebar-bottom">

        {/* Offline Status */}
        <div className="worker-sync-card">
          <span className="sync-pulse-dot" />

          <div>
            <strong>Offline-ready</strong>
            <span>
              Changes sync when online
            </span>
          </div>
        </div>

        {/* Theme */}
        <button
          type="button"
          className="worker-control"
          onClick={toggleTheme}
        >
          {darkMode ? <Sun /> : <Moon />}

          <span>
            {darkMode
              ? "Light Mode"
              : "Dark Mode"}
          </span>
        </button>

        {/* Logout */}
        <button
          type="button"
          className="worker-control worker-logout"
          onClick={logout}
        >
          <LogOut />

          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default WorkerSidebar;