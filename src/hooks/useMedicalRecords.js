import { useEffect, useState } from "react";
import { getMedicalRecords } from "../api/records.api";

function useMedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadRecords() {
      try {
        setLoading(true);
        setError(null);

        const data = await getMedicalRecords();

        if (!mounted) return;

        // Make sure the hook always stores an array
        const recordsArray = Array.isArray(data)
          ? data
          : data?.records;

        if (!Array.isArray(recordsArray)) {
          throw new Error(
            "Invalid medical records response."
          );
        }

        setRecords(recordsArray);
      } catch (err) {
        if (mounted) {
          setRecords([]);
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadRecords();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    records,
    loading,
    error
  };
}

export default useMedicalRecords;