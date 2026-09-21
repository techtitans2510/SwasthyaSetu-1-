import {
  workerFollowUpsMock,
  FOLLOW_UP_OUTCOMES
} from "../mocks/workerFollowUps.mock";

const USE_MOCK_DATA = true;
const TODAY_DATE = "2026-09-22";

/**
 * Get follow-ups list with optional filtering by UI category, search query, or patientId
 */
export async function getWorkerFollowUps({
  category = "ALL",
  search = "",
  patientId = ""
} = {}) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let items = [...workerFollowUpsMock];

    // Filter by UI category
    if (category === "DUE_TODAY") {
      items = items.filter((f) => f.dueDate === TODAY_DATE && f.status !== "completed");
    } else if (category === "OVERDUE") {
      items = items.filter((f) => f.dueDate < TODAY_DATE && f.status !== "completed");
    } else if (category === "UPCOMING") {
      items = items.filter((f) => f.dueDate > TODAY_DATE && f.status !== "completed");
    } else if (category === "COMPLETED") {
      items = items.filter((f) => f.status === "completed");
    }

    // Filter by patient ID
    if (patientId) {
      items = items.filter((f) => f.patientId === patientId);
    }

    // Search query
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (f) =>
          f.id.toLowerCase().includes(q) ||
          f.patientName.toLowerCase().includes(q) ||
          f.patientId.toLowerCase().includes(q) ||
          f.reason.toLowerCase().includes(q) ||
          (f.type || "").toLowerCase().includes(q) ||
          (f.village || "").toLowerCase().includes(q) ||
          (f.linkedReferralId || "").toLowerCase().includes(q)
      );
    }

    return items;
  }

  const queryParams = new URLSearchParams();
  if (category && category !== "ALL") queryParams.append("category", category);
  if (search) queryParams.append("search", search);
  if (patientId) queryParams.append("patientId", patientId);

  const response = await fetch(`/api/worker/follow-ups?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch follow-ups list");
  }
  return response.json();
}

/**
 * Get summary counters for follow-ups metrics cards
 */
export async function getWorkerFollowUpSummary() {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const all = workerFollowUpsMock;

    const dueTodayCount = all.filter((f) => f.dueDate === TODAY_DATE && f.status !== "completed").length;
    const overdueCount = all.filter((f) => f.dueDate < TODAY_DATE && f.status !== "completed").length;
    const upcomingCount = all.filter((f) => f.dueDate > TODAY_DATE && f.status !== "completed").length;
    const completedCount = all.filter((f) => f.status === "completed").length;

    return {
      totalCount: all.length,
      dueTodayCount,
      overdueCount,
      upcomingCount,
      completedCount
    };
  }

  const response = await fetch("/api/worker/follow-ups/summary");
  if (!response.ok) {
    throw new Error("Failed to fetch follow-up summary");
  }
  return response.json();
}

/**
 * Get single follow-up details by ID
 */
export async function getWorkerFollowUpById(id) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const item = workerFollowUpsMock.find((f) => f.id === id);
    if (!item) {
      throw new Error(`Follow-up ${id} not found`);
    }
    return item;
  }

  const response = await fetch(`/api/worker/follow-ups/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch follow-up ${id}`);
  }
  return response.json();
}

/**
 * Complete a follow-up action with recorded outcome, notes, and optional next follow-up date
 */
export async function completeWorkerFollowUp(id, { outcome, notes, nextAction, nextFollowUpDate } = {}) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const item = workerFollowUpsMock.find((f) => f.id === id);
    if (!item) {
      throw new Error(`Follow-up ${id} not found`);
    }

    item.status = "completed";
    item.completedDate = TODAY_DATE;
    item.outcome = outcome || "Stable";
    item.notes = notes || "";
    if (nextAction) item.nextAction = nextAction;

    // If a next follow-up date is specified, schedule subsequent follow-up task
    let nextItem = null;
    if (nextFollowUpDate) {
      nextItem = {
        id: `FOL-${Math.floor(100 + Math.random() * 900)}`,
        patientId: item.patientId,
        patientName: item.patientName,
        patientAge: item.patientAge,
        patientGender: item.patientGender,
        village: item.village,
        type: `Subsequent: ${item.type}`,
        reason: nextAction || `Follow-up verification after ${outcome || "care"}`,
        dueDate: nextFollowUpDate,
        priority: outcome === "Needs further attention" || outcome === "Referred" ? "High" : "Normal",
        status: "pending",
        linkedReferralId: item.linkedReferralId,
        relatedVisitId: item.relatedVisitId,
        lastOutcome: `${outcome}: ${notes || "No additional notes"}`,
        nextAction: nextAction || "Routine surveillance check",
        completedDate: null,
        outcome: null,
        notes: ""
      };
      workerFollowUpsMock.unshift(nextItem);
    }

    return { completed: item, nextFollowUp: nextItem };
  }

  const response = await fetch(`/api/worker/follow-ups/${id}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ outcome, notes, nextAction, nextFollowUpDate })
  });
  if (!response.ok) {
    throw new Error("Failed to complete follow-up");
  }
  return response.json();
}

/**
 * Create a new follow-up task
 */
export async function createWorkerFollowUp(followUpData) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const newItem = {
      id: `FOL-${Math.floor(100 + Math.random() * 900)}`,
      dueDate: followUpData.dueDate || TODAY_DATE,
      priority: followUpData.priority || "Normal",
      status: "pending",
      completedDate: null,
      outcome: null,
      ...followUpData
    };
    workerFollowUpsMock.unshift(newItem);
    return newItem;
  }

  const response = await fetch("/api/worker/follow-ups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(followUpData)
  });
  if (!response.ok) {
    throw new Error("Failed to create follow-up");
  }
  return response.json();
}

export { FOLLOW_UP_OUTCOMES };
