import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLanguage from "../hooks/useLanguage";
import ThemeToggle from "../components/ThemeToggle";
import LanguageSelector from "../components/LanguageSelector";
import logo from "../Assests/logo.svg";

import {
  ArrowLeft,
  ShieldCheck,
  User,
  Stethoscope,
  HeartHandshake,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  PhoneCall,
  Info,
  CheckCircle2,
  X,
  KeyRound,
  FileCheck2,
  Building2,
  LockKeyhole
} from "lucide-react";

// =========================================================================
// ROLE CONFIGURATION
// =========================================================================

const PORTAL_ROLES = [
  {
    id: "patient",
    icon: User,
    isAvailable: true
  },
  {
    id: "doctor",
    icon: Stethoscope,
    isAvailable: false
  },
  {
    id: "asha",
    icon: HeartHandshake,
    isAvailable: true
  }
];

function Login() {
  const { login, isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeRole, setActiveRole] = useState("patient");

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =======================================================================
  // ALREADY AUTHENTICATED
  // =======================================================================

  if (isAuthenticated) {
    const currentRole = user?.role;

    if (location.state?.from?.pathname) {
      if (
        currentRole === "patient" &&
        !location.state.from.pathname.startsWith("/worker")
      ) {
        return (
          <Navigate
            to={location.state.from.pathname}
            replace
          />
        );
      }

      if (
        ["asha", "nurse", "anm"].includes(currentRole) &&
        location.state.from.pathname.startsWith("/worker")
      ) {
        return (
          <Navigate
            to={location.state.from.pathname}
            replace
          />
        );
      }
    }

    if (currentRole === "patient") {
      return <Navigate to="/dashboard" replace />;
    }

    if (["asha", "nurse", "anm"].includes(currentRole)) {
      return <Navigate to="/worker/dashboard" replace />;
    }

    return <Navigate to="/unauthorized" replace />;
  }

  // =======================================================================
  // INPUT HANDLER
  // =======================================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // =======================================================================
  // PATIENT DEMO AUTOFILL
  // =======================================================================

  const handleAutofillPatientDemo = () => {
    setFormData({
      email: "patient@example.com",
      password: "patient123"
    });

    setError("");
  };

  // =======================================================================
  // ASHA DEMO AUTOFILL
  // =======================================================================

  const handleAutofillAshaDemo = () => {
    setFormData({
      email: "asha@example.com",
      password: "asha123"
    });

    setError("");
  };

  // =======================================================================
  // PATIENT LOGIN
  // =======================================================================

  const handlePatientSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(
        formData.email,
        formData.password
      );

      const destination =
        location.state?.from?.pathname || "/dashboard";

      navigate(destination, {
        replace: true
      });
    } catch (err) {
      setError(
        err.message || t("auth.errUnableToSignIn", "Unable to sign in.")
      );
    } finally {
      setLoading(false);
    }
  };

  // =======================================================================
  // ASHA LOGIN
  // =======================================================================

  const handleWorkerSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(
        formData.email,
        formData.password
      );

      // Make sure this login actually belongs to a worker account.
      if (
        !["asha", "nurse", "anm"].includes(
          loggedInUser?.role
        )
      ) {
        throw new Error(
          t("auth.errNotAshaAccount", "This account is not registered as a field worker.")
        );
      }

      navigate("/worker/dashboard", {
        replace: true
      });
    } catch (err) {
      setError(
        err.message || t("auth.errUnableToSignIn", "Unable to sign in.")
      );
    } finally {
      setLoading(false);
    }
  };

  // =======================================================================
  // SWITCH ROLE
  // =======================================================================

  const handleRoleChange = (role) => {
    setActiveRole(role);

    setError("");

    setFormData({
      email: "",
      password: ""
    });

    setShowPassword(false);
  };

  return (
    <div className="auth-page">

      {/* ================================================================
          TOP CONTROLS
      ================================================================ */}

      <div className="auth-top-bar">
        <Link
          to="/"
          className="auth-back-btn"
          title={t("home", "Back to Home")}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("home", "Home")}</span>
        </Link>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <LanguageSelector variant="auth" />
          <ThemeToggle />
        </div>
      </div>


      {/* ================================================================
          AUTH SPLIT LAYOUT
      ================================================================ */}

      <div className="auth-container-split">

        {/* ==============================================================
            LEFT / HERO PANEL
        ============================================================== */}

        <div className="auth-hero-panel">

          <div className="auth-hero-brand">

            <div className="brand-emblem-hero">
              <img
                src={logo}
                alt="SwasthyaSetu Logo"
                className="brand-logo-img"
              />
            </div>

            <div>
              <span className="hero-brand-name">
                {t("appName", "SwasthyaSetu")}
              </span>

              <span className="hero-brand-badge">
                {t("portalTitle", "Citizen Health Portal")}
              </span>
            </div>

          </div>

          <div className="auth-hero-content">

            <h1 className="auth-hero-title">
              {t("auth.signInTitle", "Welcome to SwasthyaSetu")}
            </h1>

            <p className="auth-hero-tagline">
              {t("auth.tagline", "Your healthcare, connected.")}
            </p>

            <p className="auth-hero-desc">
              {t(
                "auth.description",
                "Securely access your longitudinal ABHA medical records, manage outpatient consultations, and stay connected with verified public healthcare providers nationwide."
              )}
            </p>

            <div className="auth-hero-features">

              <div className="hero-feature-pill">

                <div className="feature-icon-circle">
                  <ShieldCheck className="w-4 h-4 text-primary-color" />
                </div>

                <div>
                  <strong>
                    {t("auth.featureAbdmTitle", "ABDM & M3 Compliant")}
                  </strong>

                  <span>
                    {t("auth.featureAbdmDesc", "Consent-driven health data exchange")}
                  </span>
                </div>

              </div>

              <div className="hero-feature-pill">

                <div className="feature-icon-circle">
                  <FileCheck2 className="w-4 h-4 text-primary-color" />
                </div>

                <div>
                  <strong>
                    {t("auth.featureEhrTitle", "Unified Longitudinal EHR")}
                  </strong>

                  <span>
                    {t("auth.featureEhrDesc", "Diagnostic reports & prescriptions")}
                  </span>
                </div>

              </div>

              <div className="hero-feature-pill">

                <div className="feature-icon-circle">
                  <Building2 className="w-4 h-4 text-primary-color" />
                </div>

                <div>
                  <strong>
                    {t("auth.featureNetworkTitle", "National PHC Network")}
                  </strong>

                  <span>
                    {t("auth.featureNetworkDesc", "Connected primary & community health centers")}
                  </span>
                </div>

              </div>

            </div>

          </div>

          <div className="auth-hero-footer">

            <div className="hero-helpline">

              <PhoneCall className="w-4 h-4 text-secondary-color" />

              <span>
                {t("auth.nationalHelpline", "National Health Helpline:")}
                {" "}
                <strong>
                  104 / 14416
                </strong>
                {" "}
                (24x7)
              </span>

            </div>

          </div>

        </div>

        {/* ==============================================================
            RIGHT / AUTH CARD
        ============================================================== */}

        <div className="auth-card">

          {/* ============================================================
              MOBILE BRAND
          ============================================================ */}

          <div className="auth-brand-mobile">

            <div className="brand-emblem">

              <img
                src={logo}
                alt="SwasthyaSetu Logo"
                className="brand-logo-img"
              />

            </div>

            <div>

              <h1 className="auth-brand-title">
                {t("appName", "SwasthyaSetu")}
              </h1>

              <span className="auth-brand-subtitle">
                {t("portalTitle", "Citizen Health Portal")}
              </span>

            </div>

          </div>

          {/* ============================================================
              ROLE SELECTOR
          ============================================================ */}

          <div className="auth-role-section">

            <label className="auth-role-label">
              {t("auth.selectRoleLabel", "Select Your Portal Role")}
            </label>

            <div className="auth-role-selector">

              {PORTAL_ROLES.map((role) => {

                const RoleIcon = role.icon;

                const isActive =
                  activeRole === role.id;

                const roleTitle =
                  role.id === "patient"
                    ? t("auth.patientRoleTitle", "Sign in as Patient")
                    : role.id === "doctor"
                    ? t("auth.doctorRoleTitle", "Sign in as Doctor")
                    : t("auth.ashaRoleTitle", "Sign in as ASHA Worker");

                const roleSubtitle =
                  role.id === "patient"
                    ? t("auth.patientRoleDesc", "Citizen ABHA Records")
                    : role.id === "doctor"
                    ? t("auth.doctorRoleDesc", "Clinical Provider & e-Rx")
                    : t("auth.ashaRoleDesc", "Field Community Care");

                const roleBadgeText =
                  role.isAvailable
                    ? t("auth.activeBadge", "Active")
                    : t("auth.comingSoonBadge", "Coming Soon");

                return (
                  <button
                    key={role.id}
                    type="button"
                    className={`auth-role-tab ${
                      isActive ? "active" : ""
                    } ${
                      !role.isAvailable
                        ? "role-future-tab"
                        : ""
                    }`}
                    onClick={() => {

                      if (role.isAvailable) {
                        handleRoleChange(
                          role.id
                        );
                      }

                    }}
                    aria-pressed={isActive}
                    title={
                      role.isAvailable
                        ? roleTitle
                        : `${roleTitle} (${roleBadgeText})`
                    }
                  >

                    <RoleIcon className="w-4 h-4 shrink-0" />

                    <div className="role-tab-text">

                      <span className="role-tab-title">
                        {roleTitle}
                      </span>

                      <span className="role-tab-sub">
                        {roleSubtitle}
                      </span>

                    </div>

                    <span
                      className={`role-badge-pill ${
                        role.isAvailable
                          ? "active-badge"
                          : "soon-badge"
                      }`}
                    >
                      {roleBadgeText}
                    </span>

                  </button>
                );

              })}

            </div>

          </div>

          {/* ============================================================
              PATIENT LOGIN
          ============================================================ */}

          {activeRole === "patient" && (

            <>

              <div className="auth-heading">

                <h2>
                  {t("auth.patientSignInHeading", "Citizen Sign In")}
                </h2>

                <p>
                  {t(
                    "auth.patientSignInSubheading",
                    "Enter your registered ABHA ID or email to access your health portal."
                  )}
                </p>

              </div>

              {error && (

                <div className="auth-error">

                  <Info className="w-4 h-4 shrink-0" />

                  <span>
                    {error}
                  </span>

                </div>

              )}

              <form
                className="auth-form"
                onSubmit={handlePatientSubmit}
              >

                {/* EMAIL */}

                <div className="form-group">

                  <label htmlFor="email">
                    {t("auth.emailLabel", "ABHA Number or Registered Email")}
                  </label>

                  <div className="auth-input-wrapper">

                    <Mail className="auth-input-icon" />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("auth.emailPlaceholder", "patient@example.com")}
                      autoComplete="email"
                      required
                      className="auth-input-with-icon"
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div className="form-group">

                  <div className="auth-label-row">

                    <label htmlFor="password">
                      {t("auth.passwordLabel", "Security Password / MPIN")}
                    </label>

                    <button
                      type="button"
                      className="auth-forgot-link"
                      onClick={() =>
                        setShowForgotModal(true)
                      }
                    >
                      {t("auth.forgotPassword", "Forgot password?")}
                    </button>

                  </div>

                  <div className="auth-input-wrapper">

                    <Lock className="auth-input-icon" />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={t("auth.passwordPlaceholder", "Enter your security password")}
                      autoComplete="current-password"
                      required
                      className="auth-input-with-icon pr-10"
                    />

                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      aria-label={
                        showPassword
                          ? t("auth.hidePassword", "Hide password")
                          : t("auth.showPassword", "Show password")
                      }
                    >

                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}

                    </button>

                  </div>

                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >

                  {loading ? (

                    <span className="flex items-center justify-center gap-2">

                      <span className="auth-spinner" />

                      <span>
                        {t("auth.loggingInAbdm", "Authenticating with ABDM...")}
                      </span>

                    </span>

                  ) : (
                    t("auth.loginPatientSubmit", "Sign in as Patient")
                  )}

                </button>

              </form>

              {/* REGISTER */}

              <div className="auth-footer">

                <p className="auth-register-prompt">
                  {t("auth.createAccountPrompt", "Don't have an ABHA profile?")}
                </p>

                <Link
                  to="/register"
                  className="btn-create-abha"
                >
                  {t("auth.createAccountLink", "Create ABHA Account")}
                </Link>

              </div>

              {/* PATIENT DEMO */}

              <div className="demo-credentials-card">

                <div className="demo-header">

                  <span className="demo-badge">
                    {t("auth.verifiedTestAccount", "Verified Test Account")}
                  </span>

                  <button
                    type="button"
                    className="demo-use-btn"
                    onClick={
                      handleAutofillPatientDemo
                    }
                  >
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    {t("auth.autofillDemo", "Auto-fill Demo")}
                  </button>

                </div>

                <div className="demo-grid">

                  <div>
                    <span className="demo-label">
                      {t("auth.loginLabel", "Login:")}
                    </span>

                    <span className="demo-val">
                      patient@example.com
                    </span>
                  </div>

                  <div>
                    <span className="demo-label">
                      {t("auth.workerPasswordLabel", "Password:")}
                    </span>

                    <span className="demo-val">
                      patient123
                    </span>
                  </div>

                </div>

              </div>

            </>

          )}

          {/* ============================================================
              ASHA LOGIN
          ============================================================ */}

          {activeRole === "asha" && (

            <>

              <div className="auth-heading">

                <h2>
                  {t("auth.ashaSignInHeading", "ASHA Worker Sign In")}
                </h2>

                <p>
                  {t(
                    "auth.ashaSignInSubheading",
                    "Sign in to manage community visits, patient screening, referrals, and follow-ups."
                  )}
                </p>

              </div>

              {error && (

                <div className="auth-error">

                  <Info className="w-4 h-4 shrink-0" />

                  <span>
                    {error}
                  </span>

                </div>

              )}

              <form
                className="auth-form"
                onSubmit={handleWorkerSubmit}
              >

                {/* EMAIL */}

                <div className="form-group">

                  <label htmlFor="worker-email">
                    {t("auth.workerEmailLabel", "Registered Email")}
                  </label>

                  <div className="auth-input-wrapper">

                    <Mail className="auth-input-icon" />

                    <input
                      id="worker-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("auth.workerEmailPlaceholder", "asha@example.com")}
                      autoComplete="email"
                      required
                      className="auth-input-with-icon"
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div className="form-group">

                  <div className="auth-label-row">

                    <label htmlFor="worker-password">
                      {t("auth.workerPasswordLabel", "Password")}
                    </label>

                  </div>

                  <div className="auth-input-wrapper">

                    <Lock className="auth-input-icon" />

                    <input
                      id="worker-password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={t("auth.workerPasswordPlaceholder", "Enter your password")}
                      autoComplete="current-password"
                      required
                      className="auth-input-with-icon pr-10"
                    />

                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      aria-label={
                        showPassword
                          ? t("auth.hidePassword", "Hide password")
                          : t("auth.showPassword", "Show password")
                      }
                    >

                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}

                    </button>

                  </div>

                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >

                  {loading ? (

                    <span className="flex items-center justify-center gap-2">

                      <span className="auth-spinner" />

                      <span>
                        {t("auth.loggingInWorker", "Signing in...")}
                      </span>

                    </span>

                  ) : (
                    t("auth.loginWorkerSubmit", "Sign in as ASHA Worker")
                  )}

                </button>

              </form>

              {/* ASHA DEMO CREDENTIALS */}

              <div className="demo-credentials-card">

                <div className="demo-header">

                  <span className="demo-badge">
                    {t("auth.ashaTestAccount", "ASHA Test Account")}
                  </span>

                  <button
                    type="button"
                    className="demo-use-btn"
                    onClick={
                      handleAutofillAshaDemo
                    }
                  >
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    {t("auth.autofillDemo", "Auto-fill Demo")}
                  </button>

                </div>

                <div className="demo-grid">

                  <div>
                    <span className="demo-label">
                      {t("auth.loginLabel", "Login:")}
                    </span>

                    <span className="demo-val">
                      asha@example.com
                    </span>
                  </div>

                  <div>
                    <span className="demo-label">
                      {t("auth.workerPasswordLabel", "Password:")}
                    </span>

                    <span className="demo-val">
                      asha123
                    </span>
                  </div>

                </div>

              </div>

              {/* SWITCH BACK */}

              <div className="auth-footer">

                <button
                  type="button"
                  className="btn-return-patient"
                  onClick={() => {
                    setActiveRole("patient");
                    setError("");

                    setFormData({
                      email: "",
                      password: ""
                    });
                  }}
                >
                  {t("auth.switchToPatient", "Switch to Patient Sign In")}
                </button>

              </div>

            </>

          )}

          {/* ============================================================
              DOCTOR COMING SOON
          ============================================================ */}

          {activeRole === "doctor" && (

            <div className="auth-inactive-role-card">

              <div className="inactive-icon-box">

                <Stethoscope className="w-8 h-8 text-secondary-color" />

              </div>

              <h3>
                {t("auth.doctorPortalHeading", "Clinical Doctor Portal")}
              </h3>

              <p>
                {t(
                  "auth.doctorPortalDesc",
                  "The Clinical Provider module is scheduled for a future release. Doctor authentication will link directly to the healthcare professional registry."
                )}
              </p>

              <div className="inactive-features-list">

                <div className="inactive-feature-item">

                  <CheckCircle2 className="w-4 h-4 text-primary-color shrink-0" />

                  <span>
                    {t("auth.doctorFeature1", "Verified professional credentials")}
                  </span>

                </div>

                <div className="inactive-feature-item">

                  <CheckCircle2 className="w-4 h-4 text-primary-color shrink-0" />

                  <span>
                    {t("auth.doctorFeature2", "Longitudinal OPD & e-Prescription")}
                  </span>

                </div>

              </div>

              <button
                type="button"
                className="btn-return-patient"
                onClick={() => {
                  setActiveRole("patient");
                  setError("");
                }}
              >
                {t("auth.switchToPatient", "Switch to Patient Sign In")}
              </button>

            </div>

          )}

          {/* ============================================================
              TRUST FOOTER
          ============================================================ */}

          <div className="auth-trust-strip">

            <div className="trust-item">

              <ShieldCheck className="w-3.5 h-3.5 text-primary-color" />

              <span>
                {t("auth.abdmEncrypted", "ABDM Encrypted")}
              </span>

            </div>

            <span className="trust-dot">
              •
            </span>

            <div className="trust-item">

              <LockKeyhole className="w-3.5 h-3.5 text-muted-color" />

              <span>
                {t("auth.sslSecurity", "256-Bit SSL Security")}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ================================================================
          FORGOT PASSWORD MODAL
      ================================================================ */}

      {showForgotModal && (

        <div
          className="forgot-modal-overlay"
          onClick={() =>
            setShowForgotModal(false)
          }
        >

          <div
            className="forgot-modal-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="forgot-modal-header">

              <div className="forgot-icon-wrap">

                <KeyRound className="w-5 h-5 text-primary-color" />

              </div>

              <div>

                <h3>
                  {t("auth.resetPasswordTitle", "Reset Security Password / MPIN")}
                </h3>

                <p>
                  {t("auth.resetPasswordSubtitle", "Ayushman Bharat Digital Health Account")}
                </p>

              </div>

              <button
                type="button"
                className="forgot-close-btn"
                onClick={() =>
                  setShowForgotModal(false)
                }
                aria-label={t("closeMenu", "Close")}
              >

                <X className="w-5 h-5" />

              </button>

            </div>

            <div className="forgot-modal-body">

              <p>
                {t(
                  "auth.resetPasswordNotice",
                  "Self-service password recovery via Aadhaar OTP / ABHA authentication is scheduled for an upcoming release."
                )}
              </p>

              <div className="forgot-help-card">

                <strong>
                  {t("auth.needImmediateAssistance", "Need immediate assistance?")}
                </strong>

                <p>
                  {t(
                    "auth.helplineNotice",
                    "Contact the 24x7 Citizen Health Helpline at 104 or 14416, or visit your nearest Primary Health Centre (PHC)."
                  )}
                </p>

              </div>

            </div>

            <div className="forgot-modal-actions">

              <button
                type="button"
                className="btn-modal-close"
                onClick={() =>
                  setShowForgotModal(false)
                }
              >
                {t("auth.understoodReturn", "Understood, Return to Sign In")}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Login;