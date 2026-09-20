import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ThemeToggle from "../components/ThemeToggle";
import logo from "../Assests/logo.svg";
import { ArrowLeft, ShieldCheck } from "lucide-react";

function Register() {
  const { register, isAuthenticated } = useAuth();

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
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
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
      setError(err.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Top Floating Controls */}
      <div className="auth-top-bar">
        <Link to="/" className="auth-back-btn" title="Back to Home">
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <ThemeToggle />
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
            <h1>SwasthyaSetu</h1>
            <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--secondary-color)" }}>
              Citizen Health Portal
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h2>Create ABHA Account</h2>
          <p>Register to connect your health records across public clinics & hospitals.</p>
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
            <label htmlFor="name">Full Name (As per Aadhaar / ABHA)</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ramesh Patil"
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. ramesh@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Create Security Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Creating ABHA Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p className="auth-register-prompt">
            Already have an account?{" "}
            <Link to="/login" className="auth-link-bold">
              Sign In to Portal
            </Link>
          </p>
        </div>

        {/* ABDM Trust Footer Strip */}
        <div className="auth-trust-strip">
          <div className="trust-item">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-color" />
            <span>ABDM Compliant</span>
          </div>
          <span className="trust-dot">•</span>
          <div className="trust-item">
            <span>24x7 Helpline: 104 / 14416</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;