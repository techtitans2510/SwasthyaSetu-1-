const recordsMock = [
  {
    id: "REC-001",
    patientId: "PAT-001",
    type: "Lab Report",
    title: "Complete Blood Count",
    description: "Routine CBC blood test",
    doctor: "Dr. Sharma",
    facility: "Primary Health Centre",
    recordDate: "2026-09-18",
    status: "available",
    offlineAvailable: true
  },
  {
    id: "REC-002",
    patientId: "PAT-001",
    type: "Prescription",
    title: "General Medication",
    description: "Prescription following consultation",
    doctor: "Dr. Sharma",
    facility: "Primary Health Centre",
    recordDate: "2026-09-15",
    status: "available",
    offlineAvailable: true
  },
  {
    id: "REC-003",
    patientId: "PAT-001",
    type: "Diagnosis",
    title: "Routine Health Assessment",
    description: "General health assessment",
    doctor: "Dr. Sharma",
    facility: "Primary Health Centre",
    recordDate: "2026-09-12",
    status: "available",
    offlineAvailable: true
  },
  {
    id: "REC-004",
    patientId: "PAT-001",
    type: "Imaging",
    title: "Chest X-Ray",
    description: "Chest radiography report",
    doctor: "Dr. Mehta",
    facility: "District Hospital",
    recordDate: "2026-09-05",
    status: "available",
    offlineAvailable: false
  },
  {
    id: "REC-005",
    patientId: "PAT-001",
    type: "Lab Report",
    title: "Blood Glucose Test",
    description: "Blood glucose laboratory report",
    doctor: "Dr. Sharma",
    facility: "Primary Health Centre",
    recordDate: "2026-08-28",
    status: "available",
    offlineAvailable: true
  },
  {
    id: "REC-006",
    patientId: "PAT-001",
    type: "Prescription",
    title: "Follow-up Prescription",
    description: "Medication prescribed during follow-up",
    doctor: "Dr. Mehta",
    facility: "District Hospital",
    recordDate: "2026-08-20",
    status: "available",
    offlineAvailable: false
  }
];

export default recordsMock;