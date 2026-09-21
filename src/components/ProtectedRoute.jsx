import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLanguage from "../hooks/useLanguage";

function ProtectedRoute({ allowedRoles }) {
  const {
    isAuthenticated,
    loading,
    user
  } = useAuth();
  const { t } = useLanguage();

  const location = useLocation();

  // Wait until authentication state is restored
  if (loading) {
    return (
      <div className="auth-loading">
        <p>{t("loading", "Loading...")}</p>
      </div>
    );
  }

  // User isn't logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // User doesn't have permission for this route
  if (
    allowedRoles &&
    !allowedRoles.includes(user?.role)
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;