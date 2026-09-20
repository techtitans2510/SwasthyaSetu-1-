import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const {
    darkMode,
    toggleTheme
  } = useTheme();

  return (
    <button
      type="button"
      className={`auth-theme-toggle ${
        darkMode ? "dark" : ""
      }`}
      onClick={toggleTheme}
      aria-label={
        darkMode
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      aria-pressed={darkMode}
    >
      <span className="auth-theme-icon">
        {darkMode ? "☀️" : "🌙"}
      </span>

      <span>
        {darkMode
          ? "Light Mode"
          : "Dark Mode"}
      </span>
    </button>
  );
}

export default ThemeToggle;