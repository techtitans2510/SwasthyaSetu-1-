import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

function Landing() {
  return (
    <div className="landing-page">

      <ThemeToggle />

      <div className="landing-content">

        <div className="landing-badge">
          Healthcare • Connected
        </div>

        <h1>
          Your healthcare,
          <span> connected.</span>
        </h1>

        <p>
          Access your medical records, find healthcare
          facilities, manage appointments, and stay
          connected with your care journey.
        </p>

        <div className="landing-actions">

          <Link
            to="/login"
            className="primary-button"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="secondary-button"
          >
            Create Account
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Landing;