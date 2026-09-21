import {
  workerPatientsMock,
  workerVisitRecordsMock,
  workerScheduledVisitsMock,
  workerReferralsMock,
  workerFollowUpsMock
} from "../mocks/worker.mock";

const USE_MOCK_DATA = true;

/**
 * Fetch assigned community patients with search and category filtering
 * Filter options: "all" | "high_risk" | "follow_up" | "pregnant" | "chronic"
 */
export async function getWorkerPatients({
  search = "",
  filter = "all",
  village = ""
} = {}) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let patients = [...workerPatientsMock];

    // Search by Name, Patient ID, or Village / Location
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      patients = patients.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.village.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.abhaNumber.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (filter === "high_risk") {
      patients = patients.filter((p) => p.riskCategory === "High Risk");
    } else if (filter === "follow_up") {
      patients = patients.filter((p) => p.hasPendingFollowUp);
    } else if (filter === "pregnant") {
      patients = patients.filter(
        (p) => p.isPregnant || p.riskCategory === "Maternal Care"
      );
    } else if (filter === "chronic") {
      patients = patients.filter(
        (p) =>
          p.hasChronicCondition ||
          (p.chronicConditions && p.chronicConditions.length > 0)
      );
    }

    // Village filter
    if (village) {
      patients = patients.filter((p) => p.village === village);
    }

    return patients;
  }

  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  if (filter) queryParams.append("filter", filter);
  if (village) queryParams.append("village", village);

  const response = await fetch(`/api/worker/patients?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch assigned patients");
  }
  return response.json();
}

/**
 * Fetch detailed patient record by ID along with clinical history, referrals, and follow-ups
 */
export async function getWorkerPatientById(patientId) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const patient = workerPatientsMock.find((p) => p.id === patientId);
    if (!patient) {
      throw new Error(`Patient ${patientId} not found`);
    }

    const visitHistory = workerVisitRecordsMock.filter(
      (v) => v.patientId === patientId
    );
    const scheduledVisits = workerScheduledVisitsMock.filter(
      (v) => v.patientId === patientId
    );
    const referrals = workerReferralsMock.filter(
      (r) => r.patientId === patientId
    );
    const followUps = workerFollowUpsMock.filter(
      (f) => f.patientId === patientId
    );

    // Latest visit vitals
    const latestVisit = visitHistory.length > 0 ? visitHistory[0] : null;

    return {
      ...patient,
      visitHistory,
      scheduledVisits,
      referrals,
      followUps,
      latestVisit
    };
  }

  const response = await fetch(`/api/worker/patients/${patientId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch patient ${patientId}`);
  }
  return response.json();
}
