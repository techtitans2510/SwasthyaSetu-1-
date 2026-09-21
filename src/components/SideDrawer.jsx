import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import useLanguage from "../hooks/useLanguage";
import LanguageSelector from "./LanguageSelector";
import logo from "../Assests/logo.svg";
import {
  Home,
  Search,
  Calendar,
  FileText,
  PhoneCall,
  ShieldCheck,
  Moon,
  Sun,
  LogOut,
  X
} from "lucide-react";

function SideDrawer({ isOpen, onClose }) {
  const { logout, user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <aside className={`side-drawer ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-brand">
            <div className="brand-emblem-sm">
              <img
                src={logo}
                alt="SwasthyaSetu Logo"
                className="brand-logo-img"
              />
            </div>
            <div>
              <h2 className="drawer-title">{t("appName", "SwasthyaSetu")}</h2>
              <p className="drawer-subtitle">{t("portalTitle", "Citizen Health Portal")}</p>
            </div>
          </div>

          <button
            className="drawer-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Strip in Drawer */}
        <div className="drawer-user-card">
          <div className="drawer-avatar">
            {user?.name ? user.name[0].toUpperCase() : "P"}
          </div>
          <div className="drawer-user-meta">
            <span className="drawer-user-name">{user?.name || t("patient", "Patient")}</span>
            <span className="drawer-user-role">ABHA ID: 91-4029-1823-0192</span>
          </div>
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
            <Home className="w-5 h-5" />
            <span>{t("home", "Home")}</span>
          </NavLink>

          <NavLink
            to="/facilities"
            onClick={onClose}
            className={({ isActive }) =>
              `drawer-link ${isActive ? "active" : ""}`
            }
          >
            <Search className="w-5 h-5" />
            <span>{t("findFacility", "Find Facility / Doctor")}</span>
          </NavLink>

          <NavLink
            to="/appointments"
            onClick={onClose}
            className={({ isActive }) =>
              `drawer-link ${isActive ? "active" : ""}`
            }
          >
            <Calendar className="w-5 h-5" />
            <span>{t("appointments", "Appointments")}</span>
          </NavLink>

          <NavLink
            to="/medical-records"
            onClick={onClose}
            className={({ isActive }) =>
              `drawer-link ${isActive ? "active" : ""}`
            }
          >
            <FileText className="w-5 h-5" />
            <span>{t("medicalRecords", "Medical Records")}</span>
          </NavLink>
        </nav>

        {/* Bottom section */}
        <div className="drawer-bottom">
          {/* Language Selector */}
          <LanguageSelector variant="sidebar-row" />

          {/* Helpline */}
          <div className="helpline-card-drawer">
            <div className="helpline-header">
              <PhoneCall className="w-3.5 h-3.5 text-secondary-color" />
              <span className="helpline-tag">{t("citizenHealthLine", "Citizen Health Line")}</span>
            </div>
            <div className="helpline-number-sm">{t("helplineNumber", "104 / 14416 (24x7)")}</div>
          </div>

          {/* Theme Toggle */}
          <div className="theme-row">
            <div className="theme-label">
              {darkMode ? (
                <Moon className="w-4 h-4 text-emerald-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span>{darkMode ? t("darkMode", "Dark Mode") : t("lightMode", "Light Mode")}</span>
            </div>

            <button
              className={`theme-toggle ${darkMode ? "dark" : ""}`}
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              aria-pressed={darkMode}
              type="button"
            >
              <span className="toggle-knob" />
            </button>
          </div>

          {/* ABDM Badge */}
          <div className="abdm-drawer-badge">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-color" />
            <span>{t("abdmNetwork", "ABDM National Health Network")}</span>
          </div>

          {/* Logout */}
          <button
            type="button"
            className="drawer-link logout-button"
            onClick={async () => {
              await logout();
              onClose();
            }}
          >
            <LogOut className="w-5 h-5" />
            <span>{t("signOut", "Sign Out")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default SideDrawer;

