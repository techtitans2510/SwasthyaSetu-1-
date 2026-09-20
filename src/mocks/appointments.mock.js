const appointmentsMock = [
  {
    id: "APT-001",
    patientId: "PAT-001",
    doctor: "Dr. Sanjeev Thorat",
    specialty: "Chief Cardiologist (Heart Specialist)",
    status: "upcoming",
    facility: "Sassoon General Hospital (Cardiology Wing)",
    date: "2026-10-24",
    time: "10:30 AM",
    type: "In-Person OPD Consultation",
    reason: "Post-stabilization monthly follow-up & 12-Lead ECG progression check."
  },
  {
    id: "APT-002",
    patientId: "PAT-001",
    doctor: "Dr. Rajesh Kulkarni",
    specialty: "Senior Medical Officer",
    status: "upcoming",
    facility: "Shirur 24x7 Primary Health Centre",
    date: "2026-10-28",
    time: "02:00 PM",
    type: "Teleconsultation & Vitals Review",
    reason: "Routine chronic care medication renewal & blood pressure review."
  },
  {
    id: "APT-003",
    patientId: "PAT-001",
    doctor: "Dr. Ananya Mehta",
    specialty: "Consultant Physician",
    status: "completed",
    facility: "District Hospital, Pune",
    date: "2026-09-18",
    time: "11:00 AM",
    type: "In-Person OPD Consultation",
    reason: "Complete Blood Count analysis & diagnostic evaluation."
  },
  {
    id: "APT-004",
    patientId: "PAT-001",
    doctor: "Dr. Vikram Joshi",
    specialty: "Orthopedic Specialist",
    status: "completed",
    facility: "Taluka Health Complex",
    date: "2026-08-12",
    time: "09:30 AM",
    type: "In-Person Consultation",
    reason: "Joint mobility assessment and physiotherapy guidelines."
  },
  {
    id: "APT-005",
    patientId: "PAT-001",
    doctor: "Dr. Sneha Deshmukh",
    specialty: "General Physician",
    status: "cancelled",
    facility: "Primary Health Centre",
    date: "2026-07-20",
    time: "04:00 PM",
    type: "Teleconsultation",
    reason: "Rescheduled due to field camp immunization schedule."
  }
];

export default appointmentsMock;