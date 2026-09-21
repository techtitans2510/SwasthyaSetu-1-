import {
  workerPatientsMock,
  workerScheduledVisitsMock,
  workerVisitRecordsMock,
  workerReferralsMock,
  workerFollowUpsMock,
  workerAlertsMock,
  workerActivityMock,
  workerStatsMock
} from "../mocks/worker.mock";

const USE_MOCK_DATA = true;

/**
 * Worker Dashboard Summary & Stats
 */
export async function getWorkerDashboardSummary() {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return {
      stats: workerStatsMock,
      todayVisits: workerScheduledVisitsMock.filter(
        (v) => v.date === "2026-09-22"
      ),
      urgentReferrals: workerReferralsMock.filter(
        (r) => r.urgency === "Urgent" || r.status === "PENDING"
      ),
      pendingFollowUps: workerFollowUpsMock.filter(
        (f) => f.status === "pending"
      ),
      alerts: workerAlertsMock,
      recentActivity: workerActivityMock
    };
  }

  const response = await fetch("/api/worker/dashboard");
  if (!response.ok) {
    throw new Error("Failed to fetch worker dashboard data");
  }
  return response.json();
}

/**
 * Get assigned patients list with optional search and filter
 */
export async function getWorkerPatients({
  search = "",
  filter = "all",
  riskCategory = "",
  village = ""
} = {}) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    let patients = [...workerPatientsMock];

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

    if (riskCategory) {
      patients = patients.filter((p) => p.riskCategory === riskCategory);
    }

    if (village) {
      patients = patients.filter((p) => p.village === village);
    }

    return patients;
  }

  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  if (riskCategory) queryParams.append("riskCategory", riskCategory);
  if (village) queryParams.append("village", village);

  const response = await fetch(`/api/worker/patients?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch assigned patients");
  }
  return response.json();
}

/**
 * Get patient profile details by patientId
 */
export async function getWorkerPatientById(patientId) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const patient = workerPatientsMock.find((p) => p.id === patientId);
    if (!patient) {
      throw new Error(`Patient ${patientId} not found`);
    }

    const visitHistory = workerVisitRecordsMock.filter((v) => v.patientId === patientId);
    const scheduledVisits = workerScheduledVisitsMock.filter((v) => v.patientId === patientId);
    const referrals = workerReferralsMock.filter((r) => r.patientId === patientId);
    const followUps = workerFollowUpsMock.filter((f) => f.patientId === patientId);

    return {
      ...patient,
      visitHistory,
      scheduledVisits,
      referrals,
      followUps
    };
  }

  const response = await fetch(`/api/worker/patients/${patientId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch patient details for ${patientId}`);
  }
  return response.json();
}

/**
 * Get scheduled visits list with timeframe and status filters
 * Timeframe options: "today" | "tomorrow" | "this_week" | "all"
 * Status options: "all" | "scheduled" | "completed" | "missed"
 */
export async function getWorkerScheduledVisits({
  timeframe = "all",
  status = "all",
  date = "",
  search = ""
} = {}) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let visits = [...workerScheduledVisitsMock];

    // Reference today date in mock system: 2026-09-22
    const todayStr = "2026-09-22";
    const tomorrowStr = "2026-09-23";
    const weekEndStr = "2026-09-28";

    // Filter by timeframe
    if (timeframe === "today") {
      visits = visits.filter((v) => v.date === todayStr);
    } else if (timeframe === "tomorrow") {
      visits = visits.filter((v) => v.date === tomorrowStr);
    } else if (timeframe === "this_week") {
      visits = visits.filter((v) => v.date >= todayStr && v.date <= weekEndStr);
    } else if (date) {
      visits = visits.filter((v) => v.date === date);
    }

    // Filter by status
    if (status && status !== "all") {
      visits = visits.filter((v) => v.status === status);
    }

    // Search
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      visits = visits.filter(
        (v) =>
          v.patientName.toLowerCase().includes(q) ||
          v.patientId.toLowerCase().includes(q) ||
          v.purpose.toLowerCase().includes(q) ||
          v.village.toLowerCase().includes(q)
      );
    }

    return visits;
  }

  const queryParams = new URLSearchParams();
  if (timeframe) queryParams.append("timeframe", timeframe);
  if (status) queryParams.append("status", status);
  if (date) queryParams.append("date", date);
  if (search) queryParams.append("search", search);

  const response = await fetch(`/api/worker/visits?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch scheduled visits");
  }
  return response.json();
}

/**
 * Record a new visit entry (Vitals screening & notes)
 */
export async function recordWorkerVisit(visitData) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newRecord = {
      id: `VR-${Date.now()}`,
      visitDate: visitData.visitDate || new Date().toISOString().split("T")[0],
      visitTime:
        visitData.visitTime ||
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      workerId: "ASHA-001",
      ...visitData
    };

    workerVisitRecordsMock.unshift(newRecord);

    // If follow-up required, record in follow-ups queue
    if (visitData.followUp && visitData.followUp.required) {
      workerFollowUpsMock.unshift({
        id: `FOL-${Math.floor(100 + Math.random() * 900)}`,
        patientId: visitData.patientId,
        patientName: visitData.patientName,
        village: visitData.village || "Talwade",
        dueDate: visitData.followUp.dueDate || "2026-09-29",
        type: visitData.followUp.type || "Post-Visit Check",
        priority: visitData.followUp.priority || "Normal",
        status: "pending",
        linkedReferralId: visitData.referral?.id || null,
        reason: visitData.followUp.reason || "Scheduled follow-up after home screening",
        notes: visitData.followUp.notes || ""
      });
    }

    // If referral required, record in referrals registry
    if (visitData.referral && visitData.referral.required) {
      const now = new Date();
      workerReferralsMock.unshift({
        id: `REF-${Math.floor(10000 + Math.random() * 90000)}`,
        patientId: visitData.patientId,
        patientName: visitData.patientName,
        village: visitData.village || "Talwade",
        createdDate: visitData.visitDate || now.toISOString().split("T")[0],
        referralDate: visitData.visitDate || now.toISOString().split("T")[0],
        lastUpdate: `${visitData.visitDate || now.toISOString().split("T")[0]} ${visitData.visitTime || "09:30 AM"}`,
        urgency: visitData.referral.urgency || "Routine",
        serviceRequired: visitData.referral.specialty || "General Medicine / OPD",
        specialtyRequired: visitData.referral.specialty || "General Medicine / OPD",
        facilityId: "FAC-001",
        destinationFacility: visitData.referral.facilityName || "Shirur 24x7 Primary Health Centre",
        facilityName: visitData.referral.facilityName || "Shirur 24x7 Primary Health Centre",
        reason: visitData.referral.reason || "Referred following field screening",
        referringWorker: "Ananya Sharma (ASHA-001)",
        referringWorkerId: "ASHA-001",
        status: "PENDING",
        acknowledgementStatus: "Awaiting Facility Review",
        transportArranged: false,
        outcome: null,
        notes: visitData.observations || ""
      });
    }

    // Mark today's scheduled visit as completed if present
    const scheduledVisit = workerScheduledVisitsMock.find(
      (v) => v.patientId === visitData.patientId && v.date === "2026-09-22"
    );
    if (scheduledVisit) {
      scheduledVisit.status = "completed";
    }

    return newRecord;
  }

  const response = await fetch("/api/worker/visits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(visitData)
  });
  if (!response.ok) {
    throw new Error("Failed to record visit");
  }
  return response.json();
}

/**
 * Re-export Referrals API functions
 */
export {
  getWorkerReferrals,
  getWorkerReferralSummary,
  getWorkerReferralById,
  createWorkerReferral,
  updateWorkerReferralStatus
} from "./workerReferrals.api";

/**
 * Re-export Follow-ups API functions
 */
export {
  getWorkerFollowUps,
  getWorkerFollowUpSummary,
  getWorkerFollowUpById,
  completeWorkerFollowUp,
  createWorkerFollowUp
} from "./workerFollowUps.api";
