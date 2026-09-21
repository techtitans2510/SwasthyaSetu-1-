import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLanguage from "../hooks/useLanguage";
import ThemeToggle from "../components/ThemeToggle";
import LanguageSelector from "../components/LanguageSelector";
import logo from "../Assests/logo.svg";
import { ArrowLeft, ShieldCheck } from "lucide-react";

function Register() {
  const { register, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.errPasswordMismatch", "Passwords do not match."));
      return;
    }

    if (formData.password.length < 6) {
      setError(t("auth.errPasswordLength", "Password must be at least 6 characters long."));
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || t("auth.errUnableToCreate", "Unable to create your account."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Top Floating Controls */}
      <div className="auth-top-bar">
        <Link to="/" className="auth-back-btn" title={t("home", "Back to Home")}>
          <ArrowLeft className="w-4 h-4" />
          <span>{t("home", "Home")}</span>
        </Link>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <LanguageSelector variant="auth" />
          <ThemeToggle />
        </div>
      </div>

      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="brand-emblem">
            <img
              src={logo}
              alt="SwasthyaSetu Logo"
              className="brand-logo-img"
            />
          </div>

          <div>
            <h1>{t("appName", "SwasthyaSetu")}</h1>
            <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--secondary-color)" }}>
              {t("portalTitle", "Citizen Health Portal")}
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h2>{t("auth.registerTitle", "Create ABHA Account")}</h2>
          <p>{t("auth.registerSubtitle", "Register to connect your health records across public clinics & hospitals.")}</p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-error" style={{ padding: "12px", borderRadius: "8px", background: "var(--error-container)", color: "var(--on-error-container)", fontSize: "13px", marginTop: "14px" }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{t("auth.fullNameLabel", "Full Name (As per Aadhaar / ABHA)")}</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("auth.fullNamePlaceholder", "e.g. Ramesh Patil")}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">{t("auth.registerEmailLabel", "Email Address")}</label>
            <input
              id="register-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("auth.registerEmailPlaceholder", "e.g. ramesh@example.com")}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">{t("auth.createPasswordLabel", "Create Security Password")}</label>
            <input
              id="register-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("auth.createPasswordPlaceholder", "Minimum 6 characters")}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{t("auth.confirmPasswordLabel", "Confirm Password")}</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t("auth.confirmPasswordPlaceholder", "Re-enter your password")}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? t("auth.creatingAccountBtn", "Creating ABHA Account...") : t("auth.registerSubmitBtn", "Create Account")}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p className="auth-register-prompt">
            {t("auth.alreadyHaveAccount", "Already have an account?")}{" "}
            <Link to="/login" className="auth-link-bold">
              {t("auth.signInToPortal", "Sign In to Portal")}
            </Link>
          </p>
        </div>

        {/* ABDM Trust Footer Strip */}
        <div className="auth-trust-strip">
          <div className="trust-item">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-color" />
            <span>{t("abdmCompliant", "ABDM Compliant")}</span>
          </div>
          <span className="trust-dot">•</span>
          <div className="trust-item">
            <span>{t("auth.nationalHelpline", "24x7 Helpline:")} 104 / 14416</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;