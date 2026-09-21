/**
 * SwasthyaSetu - ASHA Worker Referrals Mock Data
 * Canonical Backend Referral Lifecycle:
 * Primary: PENDING | ACCEPTED | SCHEDULED | PATIENT_ARRIVED | IN_PROGRESS | COMPLETED | CLOSED
 * Additional: REJECTED | CANCELLED
 */

export const CANONICAL_REFERRAL_STATUSES = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  SCHEDULED: "SCHEDULED",
  PATIENT_ARRIVED: "PATIENT_ARRIVED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CLOSED: "CLOSED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED"
};

export const REFERRAL_STATUS_CONFIG = {
  PENDING: {
    label: "Pending Review",
    badgeClass: "badge-pending",
    color: "#d97706",
    bg: "rgba(217, 119, 6, 0.12)",
    nextActionGuidance: "Waiting for acceptance: Facility triage desk is reviewing the clinical referral."
  },
  ACCEPTED: {
    label: "Accepted by Facility",
    badgeClass: "badge-accepted",
    color: "#2563eb",
    bg: "rgba(37, 99, 235, 0.12)",
    nextActionGuidance: "Await next scheduling/action: Facility accepted referral. Date & doctor slot will be assigned."
  },
  SCHEDULED: {
    label: "Appointment Scheduled",
    badgeClass: "badge-scheduled",
    color: "#7c3aed",
    bg: "rgba(124, 58, 237, 0.12)",
    nextActionGuidance: "Patient needs to attend: Appointment confirmed. Remind patient of time/fasting guidelines."
  },
  PATIENT_ARRIVED: {
    label: "Patient Arrived",
    badgeClass: "badge-arrived",
    color: "#0891b2",
    bg: "rgba(8, 145, 178, 0.12)",
    nextActionGuidance: "Await clinical processing: Patient arrived at facility OPD reception."
  },
  IN_PROGRESS: {
    label: "In Consultation",
    badgeClass: "badge-inprogress",
    color: "#0d9488",
    bg: "rgba(13, 148, 136, 0.12)",
    nextActionGuidance: "Await outcome: Patient currently in examination room with physician/specialist."
  },
  COMPLETED: {
    label: "Completed",
    badgeClass: "badge-completed",
    color: "#16a34a",
    bg: "rgba(22, 163, 74, 0.12)",
    nextActionGuidance: "Follow-up may be required: Consultation finished. Review prescription and schedule ASHA home check."
  },
  CLOSED: {
    label: "Closed",
    badgeClass: "badge-closed",
    color: "var(--text-secondary)",
    bg: "var(--bg-secondary)",
    nextActionGuidance: "Referral workflow complete: Continuity-of-care loop closed."
  },
  REJECTED: {
    label: "Rejected",
    badgeClass: "badge-rejected",
    color: "#dc2626",
    bg: "rgba(220, 38, 38, 0.12)",
    nextActionGuidance: "Referral rejected: Review reason and reschedule or choose alternate facility."
  },
  CANCELLED: {
    label: "Cancelled",
    badgeClass: "badge-cancelled",
    color: "#6b7280",
    bg: "rgba(107, 114, 128, 0.12)",
    nextActionGuidance: "Referral cancelled: Marked as cancelled."
  }
};

export const workerReferralsMock = [
  {
    id: "REF-10482",
    patientId: "PAT-1001",
    patientName: "Meena Kumari",
    patientAge: 48,
    patientGender: "Female",
    village: "Talwade",
    reason: "Uncontrolled hypertension (158/96 mmHg) & elevated RBS (210 mg/dL) with recurring morning dizziness.",
    serviceRequired: "Internal Medicine / Hypertension Specialist",
    destinationFacility: "Shirur 24x7 Primary Health Centre",
    facilityId: "FAC-001",
    referringWorker: "Ananya Sharma (ASHA-001)",
    referringWorkerId: "ASHA-001",
    createdDate: "2026-09-15",
    lastUpdate: "2026-09-15 09:45 AM",
    status: "PENDING",
    urgency: "Urgent",
    acknowledgementStatus: "Awaiting Facility Review",
    transportArranged: false,
    outcome: null,
    notes: "Patient advised to attend morning OPD clinic on Wednesday. Bring recent BP screening logs.",
    statusHistory: [
      {
        status: "PENDING",
        timestamp: "2026-09-15 09:30 AM",
        actor: "Ananya Sharma (ASHA-001)",
        role: "ASHA Field Worker",
        note: "Referral generated during home screening visit. High BP detected (158/96 mmHg)."
      }
    ]
  },
  {
    id: "REF-10489",
    patientId: "PAT-1003",
    patientName: "Sunita Devi",
    patientAge: 24,
    patientGender: "Female",
    village: "Talwade",
    reason: "Second trimester anomaly ultrasound scan & maternal anemia review (Hb 9.8 g/dL).",
    serviceRequired: "Obstetrics & Gynecology (ANC 2nd Trimester Scan)",
    destinationFacility: "Shirur 24x7 Primary Health Centre",
    facilityId: "FAC-001",
    referringWorker: "Ananya Sharma (ASHA-001)",
    referringWorkerId: "ASHA-001",
    createdDate: "2026-09-08",
    lastUpdate: "2026-09-09 11:30 AM",
    status: "ACCEPTED",
    urgency: "Routine",
    acknowledgementStatus: "Confirmed by Dr. Kulkarni (OB/GYN)",
    transportArranged: true,
    outcome: null,
    notes: "Facility accepted referral; appointment queued for maternal health clinic.",
    statusHistory: [
      {
        status: "PENDING",
        timestamp: "2026-09-08 11:00 AM",
        actor: "Ananya Sharma (ASHA-001)",
        role: "ASHA Field Worker",
        note: "24-week ANC referral submitted for anomaly ultrasound and anemia check."
      },
      {
        status: "ACCEPTED",
        timestamp: "2026-09-09 11:30 AM",
        actor: "Dr. Kulkarni (OB/GYN)",
        role: "Facility Medical Officer",
        note: "Referral accepted. Scheduled for Thursday maternal clinic scan."
      }
    ]
  },
  {
    id: "REF-10501",
    patientId: "PAT-1002",
    patientName: "Ramesh Kumar",
    patientAge: 54,
    patientGender: "Male",
    village: "Shirur",
    reason: "Quarterly post-MI cardiac evaluation and resting 12-lead ECG review.",
    serviceRequired: "Cardiology Consultation & ECG",
    destinationFacility: "District Hospital, Pune",
    facilityId: "FAC-002",
    referringWorker: "Ananya Sharma (ASHA-001)",
    referringWorkerId: "ASHA-001",
    createdDate: "2026-09-18",
    lastUpdate: "2026-09-19 02:15 PM",
    status: "SCHEDULED",
    urgency: "Routine",
    acknowledgementStatus: "Appointment Fixed for 26 Sep 2026, 10:00 AM",
    transportArranged: false,
    outcome: null,
    notes: "Cardiology OPD Room 14. Patient instructed to fast from 8:00 AM for lipid profile.",
    statusHistory: [
      {
        status: "PENDING",
        timestamp: "2026-09-18 10:00 AM",
        actor: "Ananya Sharma (ASHA-001)",
        role: "ASHA Field Worker",
        note: "Post-MI quarterly cardiac evaluation referral created."
      },
      {
        status: "ACCEPTED",
        timestamp: "2026-09-18 03:00 PM",
        actor: "Cardiology Intake Desk",
        role: "Hospital Registrar",
        note: "Case accepted for Specialist Cardiology OPD."
      },
      {
        status: "SCHEDULED",
        timestamp: "2026-09-19 02:15 PM",
        actor: "OPD Scheduling System",
        role: "Automated Dispatch",
        note: "Appointment fixed for 26 Sep 2026, 10:00 AM. Token #CARD-14."
      }
    ]
  },
  {
    id: "REF-10515",
    patientId: "PAT-1005",
    patientName: "Rekha Jadhav",
    patientAge: 31,
    patientGender: "Female",
    village: "Talwade",
    reason: "6-week infant growth evaluation & neonatal reflex assessment.",
    serviceRequired: "Pediatrics & Neonatal Care",
    destinationFacility: "Shirur 24x7 Primary Health Centre",
    facilityId: "FAC-001",
    referringWorker: "Ananya Sharma (ASHA-001)",
    referringWorkerId: "ASHA-001",
    createdDate: "2026-09-20",
    lastUpdate: "2026-09-22 09:10 AM",
    status: "IN_PROGRESS",
    urgency: "Routine",
    acknowledgementStatus: "Patient in Pediatric Triage",
    transportArranged: false,
    outcome: null,
    notes: "Patient checked in at 08:50 AM with infant.",
    statusHistory: [
      {
        status: "PENDING",
        timestamp: "2026-09-20 02:00 PM",
        actor: "Ananya Sharma (ASHA-001)",
        role: "ASHA Field Worker",
        note: "PNC 6-week infant check referral logged."
      },
      {
        status: "ACCEPTED",
        timestamp: "2026-09-21 09:30 AM",
        actor: "Shirur PHC Staff",
        role: "Facility Staff",
        note: "Accepted for Pediatric Consultation."
      },
      {
        status: "PATIENT_ARRIVED",
        timestamp: "2026-09-22 08:50 AM",
        actor: "Reception Desk",
        role: "Hospital Reception",
        note: "Patient checked in with infant at OPD counter."
      },
      {
        status: "IN_PROGRESS",
        timestamp: "2026-09-22 09:10 AM",
        actor: "Dr. Deshmukh (Pediatrician)",
        role: "Attending Doctor",
        note: "Infant growth, reflex assessment, and immunization screening in progress."
      }
    ]
  },
  {
    id: "REF-10390",
    patientId: "PAT-1004",
    patientName: "Balasaheb Patil",
    patientAge: 68,
    patientGender: "Male",
    village: "Pabal",
    reason: "Spirometry evaluation for chronic bronchial asthma and inhaler prescription.",
    serviceRequired: "Pulmonology / Chest Clinic",
    destinationFacility: "District Hospital, Pune",
    facilityId: "FAC-002",
    referringWorker: "Ananya Sharma (ASHA-001)",
    referringWorkerId: "ASHA-001",
    createdDate: "2026-08-15",
    lastUpdate: "2026-08-18 04:30 PM",
    status: "COMPLETED",
    urgency: "Routine",
    acknowledgementStatus: "Discharged with Treatment Plan",
    transportArranged: false,
    outcome: "Inhaler (Budesonide+Formoterol) prescribed; dosage regimen instructed. Spirometry FEV1/FVC: 68%.",
    notes: "Worker checked inhaler technique during next home visit.",
    statusHistory: [
      {
        status: "PENDING",
        timestamp: "2026-08-15 09:00 AM",
        actor: "Ananya Sharma (ASHA-001)",
        role: "ASHA Field Worker",
        note: "Spirometry testing referral logged."
      },
      {
        status: "ACCEPTED",
        timestamp: "2026-08-16 10:00 AM",
        actor: "Chest Clinic Desk",
        role: "Department Registrar",
        note: "Case accepted."
      },
      {
        status: "SCHEDULED",
        timestamp: "2026-08-16 02:00 PM",
        actor: "Hospital Desk",
        role: "Hospital Registrar",
        note: "Scheduled for 18 Aug 2026, 11:00 AM."
      },
      {
        status: "PATIENT_ARRIVED",
        timestamp: "2026-08-18 10:45 AM",
        actor: "Hospital Reception",
        role: "Reception Clerk",
        note: "Patient arrived."
      },
      {
        status: "IN_PROGRESS",
        timestamp: "2026-08-18 11:15 AM",
        actor: "Dr. Joshi (Pulmonologist)",
        role: "Specialist Physician",
        note: "Spirometry performed; reversible airway obstruction diagnosed."
      },
      {
        status: "COMPLETED",
        timestamp: "2026-08-18 04:30 PM",
        actor: "Dr. Joshi (Pulmonologist)",
        role: "Specialist Physician",
        note: "Discharged with dual-agent inhaler plan. ASHA follow-up advised."
      }
    ]
  },
  {
    id: "REF-10310",
    patientId: "PAT-1001",
    patientName: "Meena Kumari",
    patientAge: 48,
    patientGender: "Female",
    village: "Talwade",
    reason: "Annual diabetic retinopathy fundus screening.",
    serviceRequired: "Ophthalmology Clinic",
    destinationFacility: "District Hospital, Pune",
    facilityId: "FAC-002",
    referringWorker: "Ananya Sharma (ASHA-001)",
    referringWorkerId: "ASHA-001",
    createdDate: "2026-06-10",
    lastUpdate: "2026-06-25 05:00 PM",
    status: "CLOSED",
    urgency: "Routine",
    acknowledgementStatus: "Discharged with Clinical Report",
    transportArranged: false,
    outcome: "Mild non-proliferative changes noted; annual re-check advised. Eye drops prescribed.",
    notes: "Case closed after post-visit ASHA follow-up completed.",
    statusHistory: [
      {
        status: "PENDING",
        timestamp: "2026-06-10 10:00 AM",
        actor: "Ananya Sharma (ASHA-001)",
        role: "ASHA Field Worker",
        note: "Annual eye screening referral created."
      },
      {
        status: "ACCEPTED",
        timestamp: "2026-06-11 11:00 AM",
        actor: "Eye Clinic Registrar",
        role: "Hospital Registrar",
        note: "Case accepted."
      },
      {
        status: "SCHEDULED",
        timestamp: "2026-06-12 09:00 AM",
        actor: "Hospital Desk",
        role: "OPD Desk",
        note: "Scheduled for 20 Jun 2026."
      },
      {
        status: "PATIENT_ARRIVED",
        timestamp: "2026-06-20 09:30 AM",
        actor: "Reception Desk",
        role: "Reception Clerk",
        note: "Patient checked in."
      },
      {
        status: "IN_PROGRESS",
        timestamp: "2026-06-20 10:15 AM",
        actor: "Dr. Nair (Ophthalmologist)",
        role: "Specialist Physician",
        note: "Dilated fundus examination conducted."
      },
      {
        status: "COMPLETED",
        timestamp: "2026-06-20 12:00 PM",
        actor: "Dr. Nair (Ophthalmologist)",
        role: "Specialist Physician",
        note: "Report issued: mild non-proliferative diabetic retinopathy."
      },
      {
        status: "CLOSED",
        timestamp: "2026-06-25 05:00 PM",
        actor: "Ananya Sharma (ASHA-001)",
        role: "ASHA Field Worker",
        note: "Follow-up visit verified eye drop usage and vision stability. Closed."
      }
    ]
  }
];
