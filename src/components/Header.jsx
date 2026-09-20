import { useState } from "react";
import SideDrawer from "./SideDrawer";
import useAuth from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import logo from "../Assests/logo.svg";
import {
  Menu,
  Bell,
  PhoneCall,
  ShieldCheck,
  User,
  Moon,
  Sun,
  RefreshCw
} from "lucide-react";

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <>
      <header className="patient-header">
        {/* Mobile Brand / Menu Toggle */}
        <div className="header-left">
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="mobile-brand">
            <div className="brand-emblem-sm">
              <img
                src={logo}
                alt="SwasthyaSetu Logo"
                className="brand-logo-img"
              />
            </div>
            <span className="brand-title-sm">SwasthyaSetu</span>
          </div>

          {/* Desktop Badges */}
          <div className="header-badges">
            <div className="header-badge-abdm">
              <ShieldCheck className="w-4 h-4 text-primary-color" />
              <span className="badge-text-bold">Citizen Health Portal</span>
              <span className="badge-dot">•</span>
              <span className="badge-text-sub">ABDM Compliant</span>
            </div>

            <div className="header-badge-sync">
              <span className="sync-pulse-dot" />
              <span className="sync-text">Online · Synced</span>
              <RefreshCw className="w-3.5 h-3.5 text-muted-color" />
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="header-right">
          {/* Emergency 108 CTA */}
          <a
            href="tel:108"
            className="emergency-btn"
            title="Call 108 Emergency Ambulance"
          >
            <PhoneCall className="w-4 h-4 text-rose-600 animate-bounce" />
            <span className="emergency-text">Emergency 108</span>
          </a>

          {/* Theme Switcher Button */}
          <button
            type="button"
            className="header-icon-btn"
            onClick={toggleTheme}
            aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Notification Button */}
          <button
            type="button"
            className="header-icon-btn"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="notification-indicator" />
          </button>

          {/* Patient Profile Chip */}
          <div className="patient-profile-chip">
            <div className="profile-avatar">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="profile-info">
              <div className="profile-name-row">
                <span className="profile-name">{user?.name || "Patient"}</span>
                <span className="profile-badge">Citizen</span>
              </div>
              <span className="profile-id">{user?.email || "91-4029-1823-0192"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-over Drawer for Mobile */}
      <SideDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}

export default Header;