/**
 * Worker Visits API Layer
 * Service abstraction for scheduled visits, field screenings, and visit history
 */

export {
  getWorkerDashboardSummary,
  getWorkerScheduledVisits,
  recordWorkerVisit,
  getWorkerPatients,
  getWorkerPatientById,
  getWorkerReferrals,
  getWorkerFollowUps
} from "./worker.api";
