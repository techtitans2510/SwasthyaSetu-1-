import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import LanguageSelector from "../components/LanguageSelector";
import useLanguage from "../hooks/useLanguage";
import logo from "../Assests/logo.svg";
import { ArrowRight, ShieldCheck } from "lucide-react";

function Landing() {
  const { t } = useLanguage();

  return (
    <div className="landing-page">
      {/* Top Navigation Bar with Language Selector & Theme Toggle */}
      <div className="landing-top-bar" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <LanguageSelector variant="auth" />
        <ThemeToggle />
      </div>

      <div className="landing-content">
        <div className="landing-brand">
          <div className="brand-emblem-hero">
            <img src={logo} alt="SwasthyaSetu Logo" className="brand-logo-img" />
          </div>
          <span className="landing-brand-name">
            {t("appName", "SwasthyaSetu")}
          </span>
        </div>

        <div className="landing-badge">
          <ShieldCheck className="w-4 h-4 inline mr-1 text-primary-color" />
          {t("landing.badge", "SwasthyaSetu • ABDM Citizen Network")}
        </div>

        <h1>
          {t("landing.heroTitle", "Your healthcare,")}
          <span>{t("landing.heroTitleHighlight", " connected.")}</span>
        </h1>

        <p>
          {t(
            "landing.heroSubtitle",
            "Access your longitudinal ABHA medical records, find verified public health facilities, schedule outpatient consultations, and stay connected with your care continuum."
          )}
        </p>

        <div className="landing-actions">
          <Link
            to="/login"
            className="btn-primary-action"
          >
            <span>{t("landing.signInBtn", "Sign In to Portal")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/register"
            className="btn-secondary-action"
          >
            <span>{t("landing.registerBtn", "Create ABHA Account")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;