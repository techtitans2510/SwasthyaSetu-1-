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
  LogOut
} from "lucide-react";

function Sidebar() {
  const { logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <aside className="patient-sidebar">
      <div className="sidebar-top">
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-emblem">
            <img
              src={logo}
              alt="SwasthyaSetu Logo"
              className="brand-logo-img"
            />
          </div>
          <div className="brand-text">
            <span className="brand-title">{t("appName", "SwasthyaSetu")}</span>
            <span className="brand-subtitle">{t("taglineCitizen", "CITIZEN HEALTH")}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Home className="nav-icon" />
            <span>{t("home", "Home")}</span>
          </NavLink>

          <NavLink
            to="/facilities"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Search className="nav-icon" />
            <span>{t("findFacility", "Find Facility")}</span>
          </NavLink>

          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Calendar className="nav-icon" />
            <span>{t("appointments", "Appointments")}</span>
          </NavLink>

          <NavLink
            to="/medical-records"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? "active" : ""}`
            }
          >
            <FileText className="nav-icon" />
            <span>{t("medicalRecords", "Medical Records")}</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        {/* Citizen Health Line Card */}
        <div className="helpline-card">
          <div className="helpline-header">
            <PhoneCall className="w-4 h-4 text-secondary-color" />
            <span className="helpline-tag">{t("citizenHealthLine", "Citizen Health Line")}</span>
          </div>
          <div className="helpline-number">{t("helplineNumber", "104 / 14416")}</div>
          <p className="helpline-desc">{t("helplineDesc", "24x7 Tele-MANAS & Support")}</p>
        </div>

        {/* ABDM Compliance */}
        <div className="abdm-badge">
          <div className="abdm-status">
            <ShieldCheck className="w-4 h-4 text-primary-color" />
            <span>{t("abdmCompliant", "ABDM Compliant")}</span>
          </div>
          <span className="abdm-version">v2.4.1</span>
        </div>

        {/* Action Controls: Language, Theme & Logout */}
        <div className="sidebar-controls">
          <LanguageSelector variant="sidebar-row" />

          <button
            type="button"
            className="sidebar-control-btn"
            onClick={toggleTheme}
            aria-label={darkMode ? t("lightMode", "Switch to Light Mode") : t("darkMode", "Switch to Dark Mode")}
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>{t("lightMode", "Light Mode")}</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span>{t("darkMode", "Dark Mode")}</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="sidebar-control-btn logout"
            onClick={logout}
            aria-label={t("signOut", "Sign Out")}
          >
            <LogOut className="w-4 h-4" />
            <span>{t("signOut", "Sign Out")}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

