import { useEffect, useState } from "react";
import { getFacilityById } from "../api/facilities.api";

function useFacility(id) {
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadFacility() {
      try {
        setLoading(true);
        setError(null);

        const data = await getFacilityById(id);

        if (mounted) {
          setFacility(data);
        }
      } catch (err) {
        if (mounted) {
          setFacility(null);
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadFacility();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  return {
    facility,
    loading,
    error
  };
}

export default useFacility;