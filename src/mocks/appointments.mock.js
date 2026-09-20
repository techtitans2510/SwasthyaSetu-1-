import { useEffect, useState } from "react";
import {
  getAppointments
} from "../api/appointments.api";

function useAppointments() {
  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadAppointments() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getAppointments();

        if (!mounted) return;

        const appointmentsArray =
          Array.isArray(data)
            ? data
            : data?.appointments;

        if (!Array.isArray(appointmentsArray)) {
          throw new Error(
            "Invalid appointments response."
          );
        }

        setAppointments(
          appointmentsArray
        );
      } catch (err) {
        if (mounted) {
          setAppointments([]);
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAppointments();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    appointments,
    loading,
    error
  };
}

export default useAppointments;