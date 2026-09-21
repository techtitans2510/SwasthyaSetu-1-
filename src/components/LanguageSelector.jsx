import { useState, useRef, useEffect } from "react";
import useLanguage from "../hooks/useLanguage";
import { Globe, ChevronDown, Check } from "lucide-react";

function LanguageSelector({ variant = "default", className = "" }) {
  const { language, setLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeLang = languages.find((l) => l.code === language) || languages[0];

  // If variant is "pills" or "sidebar-row" (for sidebars/drawer)
  if (variant === "sidebar-row") {
    return (
      <div className={`lang-sidebar-wrapper ${className}`}>
        <div className="lang-sidebar-label">
          <Globe className="w-4 h-4 text-emerald-500" />
          <span>{t("language", "Language")}</span>
        </div>
        <div className="lang-pill-group">
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              className={`lang-pill-btn ${language === item.code ? "active" : ""}`}
              onClick={() => setLanguage(item.code)}
              title={item.label}
              aria-label={`Switch to ${item.label}`}
              aria-pressed={language === item.code}
            >
              {item.nativeLabel}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default compact dropdown suitable for headers, top bars, and cards
  return (
    <div
      ref={containerRef}
      className={`lang-selector-container ${isOpen ? "open" : ""} ${className}`}
    >
      <button
        type="button"
        className={`lang-selector-trigger ${variant === "auth" ? "auth-lang-btn" : "header-icon-btn"}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t("selectLanguage", "Select Language")}
        title={t("selectLanguage", "Select Language")}
      >
        <Globe className="w-4 h-4 text-primary-color" />
        <span className="lang-active-text">{activeLang.nativeLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 lang-chevron ${isOpen ? "rotate" : ""}`} />
      </button>

      {isOpen && (
        <ul className="lang-dropdown-menu" role="listbox">
          {languages.map((item) => {
            const isSelected = item.code === language;
            return (
              <li key={item.code} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  className={`lang-option-btn ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    setLanguage(item.code);
                    setIsOpen(false);
                  }}
                >
                  <span className="lang-option-flag">{item.flag}</span>
                  <div className="lang-option-text">
                    <span className="lang-option-native">{item.nativeLabel}</span>
                    <span className="lang-option-latin">{item.label}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 lang-check-icon" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default LanguageSelector;
