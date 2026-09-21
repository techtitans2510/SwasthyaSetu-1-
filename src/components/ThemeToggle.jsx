import { useTheme } from "../context/ThemeContext";
import useLanguage from "../hooks/useLanguage";

function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      className={`auth-theme-toggle ${
        darkMode ? "dark" : ""
      }`}
      onClick={toggleTheme}
      aria-label={
        darkMode
          ? t("lightMode", "Switch to Light Mode")
          : t("darkMode", "Switch to Dark Mode")
      }
      aria-pressed={darkMode}
    >
      <span className="auth-theme-icon">
        {darkMode ? "☀️" : "🌙"}
      </span>

      <span>
        {darkMode
          ? t("lightMode", "Light Mode")
          : t("darkMode", "Dark Mode")}
      </span>
    </button>
  );
}

export default ThemeToggle;