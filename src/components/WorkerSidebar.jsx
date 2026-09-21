import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import useLanguage from "../hooks/useLanguage";
import LanguageSelector from "./LanguageSelector";
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
  const { t } = useLanguage();

  const links = [
    {
      to: "/worker/dashboard",
      label: t("dashboard", "Dashboard"),
      icon: LayoutDashboard
    },
    {
      to: "/worker/patients",
      label: t("myPatients", "My Patients"),
      icon: Users
    },
    {
      to: "/worker/visits",
      label: t("scheduledVisits", "Scheduled Visits"),
      icon: CalendarDays
    },
    {
      to: "/worker/visits/new",
      label: t("newVisit", "New Visit"),
      icon: ClipboardPlus
    },
    {
      to: "/worker/referrals",
      label: t("referrals", "Referrals"),
      icon: GitBranch
    },
    {
      to: "/worker/follow-ups",
      label: t("followUps", "Follow-ups"),
      icon: ListChecks
    }
  ];

  const workerRole =
    user?.role === "asha"
      ? t("auth.ashaRole", "ASHA Worker")
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
            <span className="brand-title">{t("appName", "SwasthyaSetu")}</span>
            <span className="brand-subtitle">{t("taglineWorker", "Field Care Portal")}</span>
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
        {/* Language Selector */}
        <LanguageSelector variant="sidebar-row" />

        {/* Offline Status */}
        <div className="worker-sync-card">
          <span className="sync-pulse-dot" />

          <div>
            <strong>{t("offlineReady", "Offline-ready")}</strong>
            <span>
              {t("offlineSubtext", "Changes sync when online")}
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
              ? t("lightMode", "Light Mode")
              : t("darkMode", "Dark Mode")}
          </span>
        </button>

        {/* Logout */}
        <button
          type="button"
          className="worker-control worker-logout"
          onClick={logout}
        >
          <LogOut />

          <span>{t("signOut", "Sign Out")}</span>
        </button>
      </div>
    </aside>
  );
}

export default WorkerSidebar;