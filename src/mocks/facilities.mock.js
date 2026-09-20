const facilitiesMock = [
  {
    id: "FAC-001",
    name: "Primary Health Centre",
    type: "Primary Health Centre",
    address: "Main Road, Village Health Centre",
    district: "Pune",
    distance: "2.4 km",
    phone: "+91 98765 43210",
    services: [
      "General Consultation",
      "Vaccination",
      "Maternal Care",
      "Basic Diagnostics"
    ],
    openNow: true
  },
  {
    id: "FAC-002",
    name: "District Hospital",
    type: "District Hospital",
    address: "Civil Hospital Road",
    district: "Pune",
    distance: "8.7 km",
    phone: "+91 98765 12345",
    services: [
      "Emergency Care",
      "General Medicine",
      "Surgery",
      "Diagnostics",
      "Pharmacy"
    ],
    openNow: true
  },
  {
    id: "FAC-003",
    name: "Community Health Centre",
    type: "Community Health Centre",
    address: "Taluka Health Complex",
    district: "Pune",
    distance: "12.1 km",
    phone: "+91 98765 67890",
    services: [
      "General Consultation",
      "Maternal Care",
      "Child Healthcare",
      "Laboratory"
    ],
    openNow: false
  },
  {
    id: "FAC-004",
    name: "Rural Wellness Clinic",
    type: "Clinic",
    address: "Village Market Road",
    district: "Pune",
    distance: "15.3 km",
    phone: "+91 98765 24680",
    services: [
      "General Consultation",
      "Pharmacy",
      "Basic Diagnostics"
    ],
    openNow: true
  }
];

export default facilitiesMock;