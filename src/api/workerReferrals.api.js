import {
  workerReferralsMock,
  CANONICAL_REFERRAL_STATUSES,
  REFERRAL_STATUS_CONFIG
} from "../mocks/workerReferrals.mock";

const USE_MOCK_DATA = true;

/**
 * Get referrals list with optional filtering by canonical status, urgency, patient, or search keyword
 */
export async function getWorkerReferrals({
  status = "ALL",
  urgency = "",
  patientId = "",
  search = ""
} = {}) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let referrals = [...workerReferralsMock];

    // Canonical status filter
    if (status && status !== "ALL") {
      referrals = referrals.filter((r) => r.status === status);
    }

    // Urgency filter
    if (urgency) {
      referrals = referrals.filter((r) => r.urgency === urgency);
    }

    // Patient filter
    if (patientId) {
      referrals = referrals.filter((r) => r.patientId === patientId);
    }

    // Search filter
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      referrals = referrals.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.patientName.toLowerCase().includes(q) ||
          r.patientId.toLowerCase().includes(q) ||
          (r.destinationFacility || r.facilityName || "").toLowerCase().includes(q) ||
          (r.serviceRequired || r.specialtyRequired || "").toLowerCase().includes(q) ||
          (r.reason || "").toLowerCase().includes(q) ||
          (r.village || "").toLowerCase().includes(q)
      );
    }

    return referrals;
  }

  const queryParams = new URLSearchParams();
  if (status && status !== "ALL") queryParams.append("status", status);
  if (urgency) queryParams.append("urgency", urgency);
  if (patientId) queryParams.append("patientId", patientId);
  if (search) queryParams.append("search", search);

  const response = await fetch(`/api/worker/referrals?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch referrals list");
  }
  return response.json();
}

/**
 * Get referral summary counts for the metrics cards
 */
export async function getWorkerReferralSummary() {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const all = workerReferralsMock;

    const openStatuses = [
      CANONICAL_REFERRAL_STATUSES.PENDING,
      CANONICAL_REFERRAL_STATUSES.ACCEPTED,
      CANONICAL_REFERRAL_STATUSES.SCHEDULED,
      CANONICAL_REFERRAL_STATUSES.PATIENT_ARRIVED,
      CANONICAL_REFERRAL_STATUSES.IN_PROGRESS
    ];

    const openCount = all.filter((r) => openStatuses.includes(r.status)).length;
    const pendingCount = all.filter((r) => r.status === CANONICAL_REFERRAL_STATUSES.PENDING).length;
    const inProgressCount = all.filter(
      (r) =>
        r.status === CANONICAL_REFERRAL_STATUSES.IN_PROGRESS ||
        r.status === CANONICAL_REFERRAL_STATUSES.PATIENT_ARRIVED
    ).length;
    const completedCount = all.filter((r) => r.status === CANONICAL_REFERRAL_STATUSES.COMPLETED).length;

    return {
      totalCount: all.length,
      openCount,
      pendingCount,
      inProgressCount,
      completedCount
    };
  }

  const response = await fetch("/api/worker/referrals/summary");
  if (!response.ok) {
    throw new Error("Failed to fetch referral summary");
  }
  return response.json();
}

/**
 * Get individual referral details by referral ID
 */
export async function getWorkerReferralById(referralId) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const referral = workerReferralsMock.find((r) => r.id === referralId);
    if (!referral) {
      throw new Error(`Referral case ${referralId} not found`);
    }
    return referral;
  }

  const response = await fetch(`/api/worker/referrals/${referralId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch referral ${referralId}`);
  }
  return response.json();
}

/**
 * Create a new community referral (Defaults to canonical PENDING status)
 */
export async function createWorkerReferral(referralData) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newReferral = {
      id: `REF-${Math.floor(10000 + Math.random() * 90000)}`,
      createdDate: referralData.createdDate || dateStr,
      referralDate: referralData.createdDate || dateStr,
      lastUpdate: `${dateStr} ${timeStr}`,
      status: referralData.status || CANONICAL_REFERRAL_STATUSES.PENDING,
      urgency: referralData.urgency || "Routine",
      acknowledgementStatus: "Awaiting Facility Review",
      referringWorker: referralData.referringWorker || "Ananya Sharma (ASHA-001)",
      referringWorkerId: "ASHA-001",
      destinationFacility: referralData.destinationFacility || referralData.facilityName || "Shirur 24x7 Primary Health Centre",
      facilityName: referralData.destinationFacility || referralData.facilityName || "Shirur 24x7 Primary Health Centre",
      serviceRequired: referralData.serviceRequired || referralData.specialtyRequired || "General Medicine / OPD",
      specialtyRequired: referralData.serviceRequired || referralData.specialtyRequired || "General Medicine / OPD",
      transportArranged: false,
      outcome: null,
      ...referralData
    };

    workerReferralsMock.unshift(newReferral);
    return newReferral;
  }

  const response = await fetch("/api/worker/referrals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(referralData)
  });
  if (!response.ok) {
    throw new Error("Failed to create referral");
  }
  return response.json();
}

/**
 * Update referral status (e.g. from facility update simulation or ASHA closure)
 */
export async function updateWorkerReferralStatus(referralId, status, notes = "") {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const referral = workerReferralsMock.find((r) => r.id === referralId);
    if (!referral) {
      throw new Error(`Referral ${referralId} not found`);
    }
    referral.status = status;
    const now = new Date();
    referral.lastUpdate = `${now.toISOString().split("T")[0]} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    if (notes) referral.notes = notes;
    return referral;
  }

  const response = await fetch(`/api/worker/referrals/${referralId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, notes })
  });
  if (!response.ok) {
    throw new Error("Failed to update referral");
  }
  return response.json();
}

export { CANONICAL_REFERRAL_STATUSES, REFERRAL_STATUS_CONFIG };
