/**
 * SwasthyaSetu - ASHA Worker & Community Care Mock Data
 * Stable patient identities (e.g. PAT-1001, PAT-1002, etc.)
 * Shared across patients, visits, referrals, and follow-ups.
 */

export const workerPatientsMock = [
  {
    id: "PAT-1001",
    name: "Meena Kumari",
    age: 48,
    gender: "Female",
    phone: "+91 98231 44520",
    abhaNumber: "91-4029-1823-1001",
    village: "Talwade",
    address: "House 24, Near Gram Panchayat, Talwade",
    riskCategory: "High Risk",
    chronicConditions: ["Hypertension", "Type 2 Diabetes"],
    allergies: ["Penicillin"],
    bloodGroup: "B+",
    lastVisitDate: "2026-09-15",
    nextScheduledVisit: "2026-09-22",
    nextFollowUp: "2026-09-22",
    primaryFacility: "Shirur 24x7 Primary Health Centre",
    tags: ["High Risk", "Active Referral", "Follow-up Due", "ABDM Verified"],
    activeReferralId: "REF-10482",
    hasPendingFollowUp: true,
    isPregnant: false,
    hasChronicCondition: true,
    assignedWorkerId: "ASHA-001"
  },
  {
    id: "PAT-1002",
    name: "Ramesh Kumar",
    age: 54,
    gender: "Male",
    phone: "+91 94220 88192",
    abhaNumber: "91-7712-4590-1002",
    village: "Shirur",
    address: "Galli No. 3, Post Office Road, Shirur",
    riskCategory: "Moderate Risk",
    chronicConditions: ["Post-MI Cardiac Recovery", "Hypertension"],
    allergies: ["None known"],
    bloodGroup: "O+",
    lastVisitDate: "2026-09-10",
    nextScheduledVisit: "2026-09-22",
    nextFollowUp: "2026-09-22",
    primaryFacility: "Shirur 24x7 Primary Health Centre",
    tags: ["Cardiac Care", "Follow-up Due", "NCD Monitored"],
    activeReferralId: null,
    hasPendingFollowUp: true,
    isPregnant: false,
    hasChronicCondition: true,
    assignedWorkerId: "ASHA-001"
  },
  {
    id: "PAT-1003",
    name: "Sunita Devi",
    age: 24,
    gender: "Female",
    phone: "+91 91580 33412",
    abhaNumber: "91-3829-9012-1003",
    village: "Talwade",
    address: "Wadi No. 2, Talwade Shivar",
    riskCategory: "Maternal Care",
    chronicConditions: ["Pregnancy (2nd Trimester - 24 Weeks)", "Mild Anemia"],
    allergies: ["Sulfa drugs"],
    bloodGroup: "A+",
    lastVisitDate: "2026-09-08",
    nextScheduledVisit: "2026-09-22",
    nextFollowUp: "2026-09-22",
    primaryFacility: "Shirur 24x7 Primary Health Centre",
    tags: ["ANC 24 Weeks", "IFA Supplementation", "High Maternal Priority"],
    activeReferralId: "REF-10489",
    hasPendingFollowUp: false,
    isPregnant: true,
    hasChronicCondition: false,
    assignedWorkerId: "ASHA-001"
  },
  {
    id: "PAT-1004",
    name: "Balasaheb Patil",
    age: 68,
    gender: "Male",
    phone: "+91 97632 11045",
    abhaNumber: "91-6204-7718-1004",
    village: "Pabal",
    address: "Near Water Tank, Pabal",
    riskCategory: "Moderate Risk",
    chronicConditions: ["Chronic Osteoarthritis", "COPD / Asthmatic Bronchitis"],
    allergies: ["None known"],
    bloodGroup: "AB+",
    lastVisitDate: "2026-09-01",
    nextScheduledVisit: "2026-09-25",
    nextFollowUp: "2026-09-25",
    primaryFacility: "District Hospital, Pune",
    tags: ["Elderly Care", "Chronic Respiratory", "Discharged with Plan"],
    activeReferralId: null,
    hasPendingFollowUp: false,
    isPregnant: false,
    hasChronicCondition: true,
    assignedWorkerId: "ASHA-001"
  },
  {
    id: "PAT-1005",
    name: "Rekha Jadhav",
    age: 31,
    gender: "Female",
    phone: "+91 96041 99201",
    abhaNumber: "91-5510-6391-1005",
    village: "Talwade",
    address: "House 12, ZP School Road, Talwade",
    riskCategory: "Low Risk",
    chronicConditions: ["Postnatal Care (6 Weeks Postpartum)"],
    allergies: ["None known"],
    bloodGroup: "O+",
    lastVisitDate: "2026-09-12",
    nextScheduledVisit: "2026-09-28",
    nextFollowUp: "2026-09-28",
    primaryFacility: "Shirur 24x7 Primary Health Centre",
    tags: ["PNC Care", "Immunization Due", "Routine Postnatal"],
    activeReferralId: null,
    hasPendingFollowUp: true,
    isPregnant: false,
    hasChronicCondition: false,
    assignedWorkerId: "ASHA-001"
  }
];

export const workerScheduledVisitsMock = [
  {
    id: "VIS-101",
    patientId: "PAT-1001",
    patientName: "Meena Kumari",
    time: "08:30 AM",
    date: "2026-09-22",
    purpose: "BP & diabetes screening follow-up",
    village: "Talwade",
    address: "House 24, Near Gram Panchayat",
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
    address: "Galli No. 3, Post Office Road",
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
    address: "Wadi No. 2, Talwade Shivar",
    riskLevel: "Maternal Care",
    priority: "High",
    status: "scheduled"
  },
  {
    id: "VIS-104",
    patientId: "PAT-1004",
    patientName: "Balasaheb Patil",
    time: "09:30 AM",
    date: "2026-09-23",
    purpose: "Respiratory status review & mobility check",
    village: "Pabal",
    address: "Near Water Tank, Pabal",
    riskLevel: "Moderate Risk",
    priority: "Normal",
    status: "scheduled"
  },
  {
    id: "VIS-105",
    patientId: "PAT-1005",
    patientName: "Rekha Jadhav",
    time: "02:30 PM",
    date: "2026-09-24",
    purpose: "PNC 6-week infant immunization verification",
    village: "Talwade",
    address: "House 12, ZP School Road",
    riskLevel: "Low Risk",
    priority: "Normal",
    status: "scheduled"
  },
  {
    id: "VIS-106",
    patientId: "PAT-1001",
    patientName: "Meena Kumari",
    time: "09:00 AM",
    date: "2026-09-21",
    purpose: "Routine vitals screening & dietary counseling",
    village: "Talwade",
    address: "House 24, Near Gram Panchayat",
    riskLevel: "High Risk",
    priority: "Normal",
    status: "completed"
  },
  {
    id: "VIS-107",
    patientId: "PAT-1002",
    patientName: "Ramesh Kumar",
    time: "04:00 PM",
    date: "2026-09-20",
    purpose: "Post-discharge rehabilitation review",
    village: "Shirur",
    address: "Galli No. 3, Post Office Road",
    riskLevel: "Moderate Risk",
    priority: "Normal",
    status: "missed"
  }
];

export const workerVisitRecordsMock = [
  {
    id: "VR-201",
    patientId: "PAT-1001",
    patientName: "Meena Kumari",
    visitDate: "2026-09-15",
    visitTime: "09:00 AM",
    workerId: "ASHA-001",
    vitals: {
      bpSystolic: 158,
      bpDiastolic: 96,
      bloodSugar: 210,
      bloodSugarType: "Random",
      spo2: 98,
      pulse: 82,
      temperature: 98.4,
      weightKg: 64
    },
    symptoms: "Mild morning dizziness, headache",
    observations: "Elevated BP despite medication. Diet adherence needs improvement.",
    treatmentGiven: "Diet counseling, advised rest, created facility referral.",
    followUpRequired: true,
    followUpDueDate: "2026-09-22",
    referredToFacility: "Shirur 24x7 Primary Health Centre",
    referralId: "REF-10482"
  },
  {
    id: "VR-202",
    patientId: "PAT-1002",
    patientName: "Ramesh Kumar",
    visitDate: "2026-09-10",
    visitTime: "10:30 AM",
    workerId: "ASHA-001",
    vitals: {
      bpSystolic: 134,
      bpDiastolic: 84,
      bloodSugar: 128,
      bloodSugarType: "Fasting",
      spo2: 97,
      pulse: 74,
      temperature: 98.6,
      weightKg: 72
    },
    symptoms: "No chest discomfort, mild fatigue on exertion",
    observations: "Vitals stable within acceptable post-cardiac limits.",
    treatmentGiven: "Verified drug adherence for beta-blockers and statins.",
    followUpRequired: true,
    followUpDueDate: "2026-09-22",
    referredToFacility: null,
    referralId: null
  },
  {
    id: "VR-203",
    patientId: "PAT-1003",
    patientName: "Sunita Devi",
    visitDate: "2026-09-08",
    visitTime: "11:00 AM",
    workerId: "ASHA-001",
    vitals: {
      bpSystolic: 112,
      bpDiastolic: 72,
      bloodSugar: 94,
      bloodSugarType: "Fasting",
      spo2: 99,
      pulse: 78,
      temperature: 98.2,
      weightKg: 52
    },
    symptoms: "Mild pedal edema, mild fatigue",
    observations: "Hb report indicated 9.8 g/dL (Mild Anemia). Fundal height consistent with gestational age.",
    treatmentGiven: "Provided 30 Iron Folic Acid (IFA) tablets and Calcium supplements.",
    followUpRequired: true,
    followUpDueDate: "2026-09-22",
    referredToFacility: "Shirur 24x7 Primary Health Centre (ANC Specialist Clinic)",
    referralId: "REF-10489"
  }
];

export {
  CANONICAL_REFERRAL_STATUSES,
  REFERRAL_STATUS_CONFIG,
  workerReferralsMock
} from "./workerReferrals.mock";

export {
  FOLLOW_UP_OUTCOMES,
  workerFollowUpsMock
} from "./workerFollowUps.mock";

export const workerAlertsMock = [
  {
    id: "ALT-01",
    title: "Overdue Post-Referral Follow-up",
    detail: "FOL-301 for Meena Kumari (PAT-1001) due today. Verify PHC consultation outcome & BP.",
    type: "warning",
    linkTo: "/worker/follow-ups",
    patientId: "PAT-1001"
  },
  {
    id: "ALT-02",
    title: "Referral Awaiting Facility Review",
    detail: "REF-10482 for Meena Kumari (PAT-1001) pending acknowledgement from Shirur 24x7 PHC.",
    type: "info",
    linkTo: "/worker/referrals/REF-10482",
    patientId: "PAT-1001"
  },
  {
    id: "ALT-03",
    title: "High-Risk Maternal Screening Due",
    detail: "Sunita Devi (PAT-1003) 24-week ANC check & IFA distribution scheduled today.",
    type: "warning",
    linkTo: "/worker/patients/PAT-1003",
    patientId: "PAT-1003"
  }
];

export const workerActivityMock = [
  {
    id: "ACT-01",
    type: "visit_recorded",
    title: "Visit Recorded",
    description: "Vitals screening logged for Meena Kumari (PAT-1001) • BP 158/96 mmHg",
    timeAgo: "Today, 09:15 AM",
    patientId: "PAT-1001"
  },
  {
    id: "ACT-02",
    type: "referral_created",
    title: "Referral Created",
    description: "REF-10482 created for Meena Kumari to Shirur 24x7 PHC (Internal Medicine)",
    timeAgo: "15 Sep 2026",
    patientId: "PAT-1001"
  },
  {
    id: "ACT-03",
    type: "followup_completed",
    title: "Follow-up Completed",
    description: "FOL-304 ANC IFA adherence verified for Sunita Devi (PAT-1003)",
    timeAgo: "18 Sep 2026",
    patientId: "PAT-1003"
  },
  {
    id: "ACT-04",
    type: "referral_updated",
    title: "Referral Status Updated",
    description: "REF-10489 confirmed & accepted by Dr. Kulkarni at Shirur PHC",
    timeAgo: "08 Sep 2026",
    patientId: "PAT-1003"
  }
];

export const workerStatsMock = {
  assignedPatients: 48,
  todaysVisits: 3,
  followUpsDue: 2,
  activeReferrals: 2,
  highRiskCount: 8,
  catchmentArea: "Talwade & Shirur Rural Catchment (Sub-Centre 4)"
};
