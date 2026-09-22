import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { translations, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "../locales";
import { translateText } from "../api/translation.api";

const STORAGE_KEY = "swasthya_language";

const LanguageContext = createContext(null);

/**
 * Helper to retrieve a nested property via dot notation (e.g., "nav.home")
 * or directly at the top level (e.g., "home").
 */
/**
 * Helper to retrieve a nested property via dot notation (e.g., "nav.home")
 * or directly at the top level (e.g., "home"), with fallback to terms / domain dictionary.
 */
function resolvePath(obj, path) {
  if (!obj || typeof obj !== "object" || !path) return undefined;

  // 1. Direct top-level lookup
  if (Object.prototype.hasOwnProperty.call(obj, path)) {
    return obj[path];
  }

  // 2. Nested dot-notation lookup (e.g. "nav.home")
  if (typeof path === "string" && path.includes(".")) {
    const segments = path.split(".");
    let current = obj;
    let found = true;

    for (const segment of segments) {
      if (current && typeof current === "object" && segment in current) {
        current = current[segment];
      } else {
        found = false;
        break;
      }
    }

    if (found && current !== undefined) {
      return current;
    }
  }

  // 3. Lookup in 'terms' dictionary (for mock data and domain entities)
  if (obj.terms && typeof obj.terms === "object" && Object.prototype.hasOwnProperty.call(obj.terms, path)) {
    return obj.terms[path];
  }

  return undefined;
}

/**
 * Helper to interpolate dynamic parameters into a translated string.
 * Supports {key} and {{key}} placeholders.
 */
function interpolate(template, params) {
  if (typeof template !== "string" || !params || typeof params !== "object") {
    return template;
  }

  return template.replace(/\{\{?\s*([a-zA-Z0-9_]+)\s*\}?\}/g, (match, paramName) => {
    return paramName in params ? String(params[paramName]) : match;
  });
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY);
      const isSupported = SUPPORTED_LANGUAGES.some((item) => item.code === savedLang);
      return isSupported ? savedLang : DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });

  const setLanguage = useCallback((newLang) => {
    const isSupported = SUPPORTED_LANGUAGES.some((item) => item.code === newLang);
    const targetLang = isSupported ? newLang : DEFAULT_LANGUAGE;

    setLanguageState(targetLang);

    try {
      localStorage.setItem(STORAGE_KEY, targetLang);
      document.documentElement.setAttribute("lang", targetLang);
    } catch (err) {
      console.warn("Unable to persist language selection in localStorage:", err);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  /**
   * Universal translation function:
   * Usage:
   *   t("dashboard")
   *   t("bookAppointment")
   *   t("nav.home")
   *   t("patientDashboard.morningGreeting")
   *   t("Hypertension")
   *   t("Primary Health Centre")
   *   t("custom.key", "Default Fallback Text")
   *   t("welcomeUser", { name: "Aarush" })
   */
  const t = useCallback(
    (key, fallbackOrParams, maybeParams) => {
      if (!key && key !== 0) return "";
      const stringKey = typeof key === "string" ? key : String(key);

      let fallbackText = "";
      let params = null;

      if (typeof fallbackOrParams === "string") {
        fallbackText = fallbackOrParams;
        if (maybeParams && typeof maybeParams === "object") {
          params = maybeParams;
        }
      } else if (fallbackOrParams && typeof fallbackOrParams === "object") {
        params = fallbackOrParams;
      }

      const activeDict = translations[language] || translations[DEFAULT_LANGUAGE];
      const defaultDict = translations[DEFAULT_LANGUAGE];

      // 1. Try resolving in currently selected language
      let value = resolvePath(activeDict, stringKey);

      // 2. If not found or empty, fallback to English
      if (value === undefined || value === null) {
        value = resolvePath(defaultDict, stringKey);
      }

      // 3. If still not found, use provided explicit fallback string or key name
      if (value === undefined || value === null) {
        value = fallbackText || stringKey;
      }

      // 4. If value is a string and parameters were provided, interpolate
      if (typeof value === "string" && params) {
        return interpolate(value, params);
      }

      return typeof value === "string" ? value : String(value ?? stringKey);
    },
    [language]
  );

  const formatDate = useCallback(
    (date, options = {}) => {
      if (!date) return "";
      const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
      if (isNaN(d.getTime())) return String(date);
      const localeCode = language === "mr" ? "mr-IN" : language === "hi" ? "hi-IN" : "en-IN";
      return d.toLocaleDateString(localeCode, options);
    },
    [language]
  );

  const translateDynamicText = useCallback(
    (text, targetLang) => {
      return translateText(text, targetLang || language);
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      formatDate,
      translateDynamicText,
      languages: SUPPORTED_LANGUAGES,
      defaultLanguage: DEFAULT_LANGUAGE
    }),
    [language, setLanguage, t, formatDate, translateDynamicText]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageContext;


