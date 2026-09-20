import { useEffect, useState } from "react";
import { getFacilities } from "../api/facilities.api";

function useFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadFacilities() {
      try {
        setLoading(true);
        setError(null);

        const data = await getFacilities();

        if (!mounted) return;

        const facilitiesArray = Array.isArray(data)
          ? data
          : data?.facilities;

        if (!Array.isArray(facilitiesArray)) {
          throw new Error(
            "Invalid facilities response."
          );
        }

        setFacilities(facilitiesArray);
      } catch (err) {
        if (mounted) {
          setFacilities([]);
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadFacilities();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    facilities,
    loading,
    error
  };
}

export default useFacilities;