/**
 * Worker Visits Mock Dataset
 * Reusable mock layer connecting scheduled visits and historical logs
 */

export {
  workerScheduledVisitsMock,
  workerVisitRecordsMock,
  workerPatientsMock,
  workerReferralsMock,
  workerFollowUpsMock,
  workerAlertsMock,
  workerActivityMock,
  workerStatsMock
} from "./worker.mock";

export const defaultVisits = [
  {
    id: "VIS-101",
    patientId: "PAT-1001",
    patientName: "Meena Kumari",
    time: "08:30 AM",
    date: "2026-09-22",
    purpose: "BP & diabetes screening follow-up",
    village: "Talwade",
    riskLevel: "High Risk",
    priority: "High",
    status: "scheduled"
  },
  {
    id: "VIS-102",
    patientId: "PAT-1002",
    patientName: "Ramesh Kumar",
    time: "10:00 AM",
    date: "2026-09-22",
    purpose: "Cardiac medication review & vitals check",
    village: "Shirur",
    riskLevel: "Moderate Risk",
    priority: "Normal",
    status: "scheduled"
  },
  {
    id: "VIS-103",
    patientId: "PAT-1003",
    patientName: "Sunita Devi",
    time: "11:30 AM",
    date: "2026-09-22",
    purpose: "Maternal health ANC check & IFA supply",
    village: "Talwade",
    riskLevel: "Maternal Care",
    priority: "High",
    status: "scheduled"
  }
];

export default defaultVisits;
