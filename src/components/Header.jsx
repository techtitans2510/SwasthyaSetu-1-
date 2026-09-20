import { useState } from "react";
import SideDrawer from "./SideDrawer";
import { useTheme } from "../context/ThemeContext";

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    darkMode,
    setDarkMode
  } = useTheme();

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <span className="logo-mark">M</span>

          <div>
            <h1>MahaSwasthya</h1>
            <span>Connect</span>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Notifications"
          >
            🔔
          </button>

          <button
            className="icon-button menu-button"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>

      <SideDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    </>
  );
}

export default Header;