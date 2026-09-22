import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";
import {
  normalizeRole,
  findRouteByPath,
  findRouteByRouteKey,
  validateNavigation
} from "../../services/navigationRegistry";
import { askAiAssistant } from "../../api/ai.api";
import "./AiAssistant.css";

import {
  Bot,
  Send,
  X,
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertCircle
} from "lucide-react";

/**
 * Suggested prompt chips tailored to user roles and interface language.
 * Queries are preserved exactly in natural language matching the user's interface.
 */
const ROLE_SUGGESTIONS_BY_LANG = {
  en: {
    patient: [
      { label: "🏥 Find Hospitals", query: "show healthcare facilities" },
      { label: "📋 Medical Records", query: "show medical records" },
      { label: "📅 Book Doctor", query: "book doctor appointment" },
      { label: "📊 Health Dashboard", query: "show health dashboard" }
    ],
    asha: [
      { label: "🗓️ Scheduled Visits", query: "show scheduled visits" },
      { label: "✍️ Record Visit", query: "record new home visit" },
      { label: "🚑 Hospital Referrals", query: "show hospital referrals" },
      { label: "👥 My Patients", query: "show my patients" },
      { label: "🔄 Follow-ups", query: "show follow ups" }
    ],
    doctor: [
      { label: "🏥 Search Facilities", query: "find healthcare facilities" },
      { label: "🔑 Switch Account", query: "login to another portal" }
    ],
    public: [
      { label: "🔑 Citizen Sign In", query: "login to my citizen account" },
      { label: "📝 Register ABHA", query: "register new abha account" },
      { label: "ℹ️ About Portal", query: "swasthyasetu portal home" }
    ]
  },
  hi: {
    patient: [
      { label: "🏥 अस्पताल खोजें", query: "अस्पताल खोजें" },
      { label: "📋 चिकित्सा रिकॉर्ड", query: "चिकित्सा रिकॉर्ड दिखाओ" },
      { label: "📅 डॉक्टर अपॉइंटमेंट", query: "डॉक्टर अपॉइंटमेंट बुक करें" },
      { label: "📊 स्वास्थ्य डैशबोर्ड", query: "मेरा स्वास्थ्य डैशबोर्ड खोलो" }
    ],
    asha: [
      { label: "🗓️ नियत दौरे", query: "नियत गृह दौरे दिखाओ" },
      { label: "✍️ नया दौरा", query: "नया दौरा दर्ज करें" },
      { label: "🚑 अस्पताल रेफरल", query: "अस्पताल रेफरल दिखाओ" },
      { label: "👥 मेरे मरीज़", query: "मेरे मरीज़ खोलो" },
      { label: "🔄 फॉलो-अप", query: "फॉलो-अप सूची दिखाओ" }
    ],
    doctor: [
      { label: "🏥 अस्पताल खोजें", query: "स्वास्थ्य केंद्र खोजें" },
      { label: "🔑 खाता बदलें", query: "लॉगिन पृष्ठ पर जाएं" }
    ],
    public: [
      { label: "🔑 नागरिक लॉगिन", query: "नागरिक लॉगिन खोलो" },
      { label: "📝 आभा पंजीकरण", query: "नया आभा खाता बनाएं" },
      { label: "ℹ️ पोर्टल जानकारी", query: "मुख्य पृष्ठ पर जाएं" }
    ]
  },
  mr: {
    patient: [
      { label: "🏥 रुग्णालय शोधा", query: "जवळचे रुग्णालय शोधा" },
      { label: "📋 वैद्यकीय नोंदी", query: "वैद्यकीय नोंदी दाखवा" },
      { label: "📅 डॉक्टर भेट", query: "डॉक्टर अपॉइंटमेंट बुक करा" },
      { label: "📊 आरोग्य डॅशबोर्ड", query: "आरोग्य डॅशबोर्ड उघडा" }
    ],
    asha: [
      { label: "🗓️ नियोजित भेटी", query: "नियोजित भेटी दाखवा" },
      { label: "✍️ नवीन भेट", query: "नवीन भेट नोंदवा" },
      { label: "🚑 रुग्णालय रेफरल", query: "रेफरल यादी दाखवा" },
      { label: "👥 माझे रुग्ण", query: "रुग्ण यादी उघडा" },
      { label: "🔄 फॉलो-अप", query: "फॉलो-अप यादी दाखवा" }
    ],
    doctor: [
      { label: "🏥 रुग्णालय शोधा", query: "रुग्णालय शोधा" },
      { label: "🔑 खाते बदला", query: "लॉगिन पृष्ठ" }
    ],
    public: [
      { label: "🔑 नागरिक लॉगिन", query: "नागरिक लॉगिन" },
      { label: "📝 आभा नोंदणी", query: "नवीन आभा खाते" },
      { label: "ℹ️ मुख्य पृष्ठ", query: "मुख्य पृष्ठ" }
    ]
  }
};

export function AiAssistant() {
  const { user, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeRole = normalizeRole(user?.role || (isAuthenticated ? "patient" : "public"));
  const currentRouteDef = findRouteByPath(location.pathname);
  const currentSection = currentRouteDef?.label || "General";

  const initialGreeting = {
    id: "msg-0",
    sender: "assistant",
    timestamp: new Date(),
    text: user?.name
      ? t("aiAssistant.greetingNamed", { name: t(user.name) })
      : t("aiAssistant.greetingDefault", "Namaste! I am your SwasthyaSetu AI navigation guide. Where would you like to navigate today?"),
    actions: []
  };

  const [messages, setMessages] = useState([initialGreeting]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of message stream
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  // Focus input on open & attach Escape key listener
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Submit query to Gemini Server API with lightweight navigation context
  const handleSend = async (queryText) => {
    const textToSend = (typeof queryText === "string" ? queryText : inputQuery).trim();
    if (!textToSend || loading) return;

    const userMessage = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      timestamp: new Date(),
      text: textToSend
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setError(null);
    setLoading(true);

    try {
      const response = await askAiAssistant({
        message: textToSend,
        role: activeRole,
        currentPage: location.pathname || "/",
        currentSection,
        language
      });

      const botMessage = {
        id: `msg-${Date.now()}-bot`,
        sender: "assistant",
        timestamp: new Date(),
        text: response.text || response.message,
        actions: response.actions || []
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError(err.message || "An error occurred while resolving navigation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleNavigate = (actionItem) => {
    if (!actionItem) return;

    // Resolve target route definition using local navigation registry
    let targetDef = null;

    if (typeof actionItem === "object") {
      if (actionItem.routeKey) {
        targetDef = findRouteByRouteKey(actionItem.routeKey);
      }
      if (!targetDef && actionItem.route) {
        targetDef = findRouteByPath(actionItem.route);
      }
    } else if (typeof actionItem === "string") {
      targetDef = findRouteByPath(actionItem) || findRouteByRouteKey(actionItem);
    }

    if (!targetDef) {
      console.warn("[AiAssistant] Cannot navigate: Destination is not in the navigation registry.", actionItem);
      setError("Unable to navigate: destination is not a registered application route.");
      return;
    }

    // Validate active role permissions before navigating
    const { allowed, reason } = validateNavigation(targetDef.route, activeRole);
    if (!allowed) {
      console.warn(`[AiAssistant] Navigation denied: ${reason}`);
      setError(`Access denied: Your current role (${activeRole}) cannot access ${targetDef.label}.`);
      return;
    }

    // Programmatic single-page navigation via the existing React Router instance
    navigate(targetDef.route);

    // On small mobile screens, close panel after clicking a route
    if (window.innerWidth < 640) {
      setIsOpen(false);
    }
  };

  const handleReset = () => {
    setMessages([initialGreeting]);
    setError(null);
  };

  const langMap = ROLE_SUGGESTIONS_BY_LANG[language] || ROLE_SUGGESTIONS_BY_LANG.en;
  const suggestions = langMap[activeRole] || langMap.public || ROLE_SUGGESTIONS_BY_LANG.en.public;

  return (
    <>
      {/* 1. Floating Action Trigger Button */}
      <div className="swasthya-ai-trigger-wrap">
        <button
          type="button"
          className="swasthya-ai-trigger-btn"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? t("aiAssistant.closeAria", "Close AI Navigation Assistant") : t("aiAssistant.openAria", "Open AI Navigation Assistant")}
          title={t("aiAssistant.triggerTitle", "SwasthyaSetu AI Navigation Assistant")}
        >
          <div className="swasthya-ai-icon-badge">
            <Sparkles className="w-4 h-4 text-emerald-300" />
          </div>
          <span className="swasthya-ai-trigger-label">{t("aiAssistant.triggerLabel", "Setu AI")}</span>
          <span className="swasthya-ai-pulse-dot" />
        </button>
      </div>

      {/* 2. Floating AI Assistant Chat Panel */}
      {isOpen && (
        <aside
          className="swasthya-ai-panel"
          role="dialog"
          aria-label={t("aiAssistant.triggerTitle", "SwasthyaSetu AI Navigation Assistant")}
        >
          {/* Header */}
          <header className="swasthya-ai-header">
            <div className="swasthya-ai-header-left">
              <div className="swasthya-ai-avatar">
                <Bot className="w-4 h-4" />
              </div>
              <div className="swasthya-ai-header-info">
                <span className="swasthya-ai-title">{t("aiAssistant.title", "Setu AI Navigator")}</span>
                <div className="swasthya-ai-subtitle-row">
                  <span className="swasthya-ai-role-badge">
                    {activeRole === "asha"
                      ? t("aiAssistant.roleBadge.asha", "ASHA Field Care")
                      : activeRole === "patient"
                      ? t("aiAssistant.roleBadge.patient", "Citizen")
                      : t(`aiAssistant.roleBadge.${activeRole}`, activeRole.toUpperCase())}
                  </span>
                  <span className="swasthya-ai-lang-badge">
                    • {language.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="swasthya-ai-header-actions">
              <button
                type="button"
                className="swasthya-ai-header-btn"
                onClick={handleReset}
                title={t("aiAssistant.resetConversation", "Reset conversation")}
                aria-label={t("aiAssistant.resetConversation", "Reset conversation")}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="swasthya-ai-header-btn"
                onClick={() => setIsOpen(false)}
                title={t("aiAssistant.closeButton", "Close assistant (Esc)")}
                aria-label={t("aiAssistant.closeButton", "Close assistant (Esc)")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Role Suggestions Quick Chips */}
          <div className="swasthya-ai-suggestions" aria-label="Suggested navigation prompts">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="swasthya-ai-chip"
                onClick={() => handleSend(item.query)}
                disabled={loading}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="swasthya-ai-messages" tabIndex={0} aria-live="polite">
            {messages.map((msg) => (
              <div key={msg.id} className={`swasthya-ai-msg ${msg.sender}`}>
                <div className="swasthya-ai-msg-bubble">
                  <p style={{ whiteSpace: "pre-line" }}>{msg.text}</p>

                  {/* Navigation Action Buttons if intent matched */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="swasthya-ai-nav-card">
                      <span className="swasthya-ai-nav-card-label">{t("aiAssistant.directNavigation", "Direct Navigation:")}</span>
                      {msg.actions.map((act, actIdx) => (
                        <button
                          key={actIdx}
                          type="button"
                          className="swasthya-ai-nav-btn"
                          onClick={() => handleNavigate(act)}
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="swasthya-ai-msg-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            ))}

            {/* Loading / Typing State */}
            {loading && (
              <div className="swasthya-ai-msg assistant">
                <div className="swasthya-ai-typing" aria-label={t("aiAssistant.resolving", "Setu AI is resolving navigation...")}>
                  <span className="swasthya-ai-typing-dot" />
                  <span className="swasthya-ai-typing-dot" />
                  <span className="swasthya-ai-typing-dot" />
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="swasthya-ai-error-banner" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer & Input Form */}
          <footer className="swasthya-ai-footer">
            <form className="swasthya-ai-form" onSubmit={handleFormSubmit}>
              <input
                ref={inputRef}
                type="text"
                className="swasthya-ai-input"
                placeholder={t("aiAssistant.inputPlaceholder", "Ask for navigation, records, visits...")}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={loading}
                aria-label="Message Setu AI Assistant"
              />
              <button
                type="submit"
                className="swasthya-ai-send-btn"
                disabled={loading || !inputQuery.trim()}
                aria-label="Send query"
                title="Send query (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </footer>
        </aside>
      )}
    </>
  );
}

export default AiAssistant;
