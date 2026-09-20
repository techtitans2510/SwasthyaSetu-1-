import { useEffect, useState } from "react";
import { getDashboard } from "../api/dashboard.api";

function useDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);

        const data = await getDashboard();

        if (mounted) {
          setDashboard(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    dashboard,
    loading,
    error
  };
}

export default useDashboard;