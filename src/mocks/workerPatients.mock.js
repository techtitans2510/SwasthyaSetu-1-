const WORKER_PATIENTS = [
  {
    id: "PAT-1001",
    name: "Meena Kumari",
    age: 34,
    sex: "Female",
    riskLevel: "high",
    conditions: ["Type 2 Diabetes", "Hypertension"],
    lastVisit: "18 Sep 2026",
    nextFollowUp: "Today",
    primaryFacility: "Shirur PHC",
    location: "Talwade",
    tags: ["Chronic", "Follow-up"]
  },
  {
    id: "PAT-1002",
    name: "Ramesh Kumar",
    age: 52,
    sex: "Male",
    riskLevel: "stable",
    conditions: ["Hypertension"],
    lastVisit: "17 Sep 2026",
    nextFollowUp: "24 Sep 2026",
    primaryFacility: "Talwade PHC",
    location: "Shirur",
    tags: ["Chronic"]
  },
  {
    id: "PAT-1003",
    name: "Sunita Devi",
    age: 27,
    sex: "Female",
    riskLevel: "medium",
    conditions: ["Pregnancy"],
    lastVisit: "19 Sep 2026",
    nextFollowUp: "23 Sep 2026",
    primaryFacility: "Shirur PHC",
    location: "Talwade",
    tags: ["Pregnant", "Follow-up"]
  },
  {
    id: "PAT-1004",
    name: "Rajesh Patil",
    age: 61,
    sex: "Male",
    riskLevel: "high",
    conditions: ["Diabetes", "Hypertension"],
    lastVisit: "15 Sep 2026",
    nextFollowUp: "25 Sep 2026",
    primaryFacility: "Shirur PHC",
    location: "Shirur",
    tags: ["Chronic", "High Risk"]
  },
  {
    id: "PAT-1005",
    name: "Kavita More",
    age: 29,
    sex: "Female",
    riskLevel: "medium",
    conditions: ["Pregnancy"],
    lastVisit: "16 Sep 2026",
    nextFollowUp: "22 Sep 2026",
    primaryFacility: "Talwade PHC",
    location: "Talwade",
    tags: ["Pregnant"]
  },
  {
    id: "PAT-1006",
    name: "Mohan Jadhav",
    age: 46,
    sex: "Male",
    riskLevel: "stable",
    conditions: ["No chronic condition"],
    lastVisit: "12 Sep 2026",
    nextFollowUp: "30 Sep 2026",
    primaryFacility: "Shirur PHC",
    location: "Shirur",
    tags: []
  },
  {
    id: "PAT-1007",
    name: "Asha Pawar",
    age: 38,
    sex: "Female",
    riskLevel: "high",
    conditions: ["Diabetes"],
    lastVisit: "14 Sep 2026",
    nextFollowUp: "Today",
    primaryFacility: "Talwade PHC",
    location: "Talwade",
    tags: ["Chronic", "Follow-up", "High Risk"]
  },
  {
    id: "PAT-1008",
    name: "Vijay Shinde",
    age: 67,
    sex: "Male",
    riskLevel: "high",
    conditions: ["Hypertension", "Heart Disease"],
    lastVisit: "13 Sep 2026",
    nextFollowUp: "23 Sep 2026",
    primaryFacility: "Shirur PHC",
    location: "Shirur",
    tags: ["Chronic", "High Risk"]
  }
];

export function getMockWorkerPatients() {
  return WORKER_PATIENTS;
}