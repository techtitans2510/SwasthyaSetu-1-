import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
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
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

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
            <span className="brand-title">SwasthyaSetu</span>
            <span className="brand-subtitle">CITIZEN HEALTH</span>
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
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/facilities"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Search className="nav-icon" />
            <span>Find Facility</span>
          </NavLink>

          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Calendar className="nav-icon" />
            <span>Appointments</span>
          </NavLink>

          <NavLink
            to="/medical-records"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? "active" : ""}`
            }
          >
            <FileText className="nav-icon" />
            <span>Medical Records</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        {/* Citizen Health Line Card */}
        <div className="helpline-card">
          <div className="helpline-header">
            <PhoneCall className="w-4 h-4 text-secondary-color" />
            <span className="helpline-tag">Citizen Health Line</span>
          </div>
          <div className="helpline-number">104 / 14416</div>
          <p className="helpline-desc">24x7 Tele-MANAS & Support</p>
        </div>

        {/* ABDM Compliance */}
        <div className="abdm-badge">
          <div className="abdm-status">
            <ShieldCheck className="w-4 h-4 text-primary-color" />
            <span>ABDM Compliant</span>
          </div>
          <span className="abdm-version">v2.4.1</span>
        </div>

        {/* Action Controls: Theme & Logout */}
        <div className="sidebar-controls">
          <button
            type="button"
            className="sidebar-control-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="sidebar-control-btn logout"
            onClick={logout}
            aria-label="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
