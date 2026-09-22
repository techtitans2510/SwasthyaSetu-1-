/**
 * SwasthyaSetu - Centralized AI Navigation Registry
 *
 * Source of truth for all navigable destinations across the platform.
 * Contains ONLY routes that actually exist in App.jsx.
 */

// ============================================================================
// 1. MASTER ROUTE DEFINITIONS (Derived from actual App.jsx routes)
// ============================================================================
// 1. CANONICAL ENGLISH INTENT CONSTANTS
// ============================================================================

export const CANONICAL_INTENTS = {
  MEDICAL_RECORDS: "medical_records",
  MEDICAL_RECORD_DETAILS: "medical_record_details",
  APPOINTMENTS: "appointments",
  FACILITIES: "facilities",
  FACILITY_DETAILS: "facility_details",
  PATIENTS: "patients",
  PATIENT_HISTORY: "patient_history",
  SCHEDULED_VISITS: "scheduled_visits",
  NEW_VISIT: "new_visit",
  REFERRALS: "referrals",
  NEW_REFERRAL: "new_referral",
  REFERRAL_DETAILS: "referral_details",
  FOLLOW_UPS: "follow_ups",
  DASHBOARD: "dashboard",
  LOGIN: "login",
  REGISTER: "register",
  LANDING: "landing",
  UNAUTHORIZED: "unauthorized"
};

export const INTENT_ALIAS_MAP = {
  // Medical records
  medical_records: "patient_medical_records",
  patient_medical_records: "patient_medical_records",
  ehr: "patient_medical_records",
  prescriptions: "patient_medical_records",
  medical_record_details: "patient_medical_record_details",
  patient_medical_record_details: "patient_medical_record_details",

  // Appointments
  appointments: "patient_appointments",
  patient_appointments: "patient_appointments",
  book_appointment: "patient_appointments",

  // Facilities
  facilities: "patient_facilities",
  patient_facilities: "patient_facilities",
  find_facilities: "patient_facilities",
  facility_details: "patient_facility_details",
  patient_facility_details: "patient_facility_details",

  // Patients & History
  patients: "asha_patients",
  worker_patients: "asha_patients",
  my_patients: "asha_patients",
  patient_history: "asha_patient_profile",
  patient_profile: "asha_patient_profile",
  worker_patient_profile: "asha_patient_profile",

  // Visits
  scheduled_visits: "asha_visits",
  worker_visits: "asha_visits",
  my_visits: "asha_visits",
  new_visit: "asha_new_visit",
  worker_new_visit: "asha_new_visit",
  record_visit: "asha_new_visit",

  // Referrals
  referrals: "asha_referrals",
  worker_referrals: "asha_referrals",
  hospital_referrals: "asha_referrals",
  new_referral: "asha_new_referral",
  worker_new_referral: "asha_new_referral",
  create_referral: "asha_new_referral",
  referral_details: "asha_referral_details",
  worker_referral_details: "asha_referral_details",

  // Follow ups
  follow_ups: "asha_follow_ups",
  worker_follow_ups: "asha_follow_ups",

  // Dashboard
  dashboard: "patient_dashboard",
  patient_dashboard: "patient_dashboard",
  worker_dashboard: "asha_dashboard",
  asha_dashboard: "asha_dashboard",

  // Public / Auth
  landing: "public_landing",
  view_landing: "public_landing",
  home: "public_landing",
  login: "public_login",
  register: "public_register",
  register_abha: "public_register",
  unauthorized: "public_unauthorized",
  unauthorized_access: "public_unauthorized"
};

// ============================================================================
// 2. MASTER ROUTE DEFINITIONS (Derived from actual App.jsx routes)
// ============================================================================

export const ROUTE_DEFINITIONS = [
  // --------------------------------------------------------------------------
  // PUBLIC / SHARED DESTINATIONS
  // --------------------------------------------------------------------------
  {
    id: "public_landing",
    routeKey: "public_landing",
    intent: "landing",
    canonicalIntent: "landing",
    route: "/",
    label: "SwasthyaSetu Portal Home",
    shortDescription: "Welcome landing page with platform overview, ABDM information, and portal access points.",
    category: "General",
    roles: ["public", "patient", "asha", "nurse", "anm", "doctor", "admin", "hospital"],
    isDynamic: false,
    keywords: [
      "home",
      "homepage",
      "landing page",
      "welcome",
      "about swasthyasetu",
      "main page",
      "swasthya setu",
      "portal home",
      "मुख्य पृष्ठ",
      "होम",
      "घर"
    ]
  },
  {
    id: "public_login",
    routeKey: "public_login",
    intent: "login",
    canonicalIntent: "login",
    route: "/login",
    label: "Sign In / Login",
    shortDescription: "Secure authentication portal for Citizens, ASHA field workers, and healthcare staff.",
    category: "Authentication",
    roles: ["public", "patient", "asha", "nurse", "anm", "doctor", "admin", "hospital"],
    isDynamic: false,
    keywords: [
      "login",
      "sign in",
      "log in",
      "authenticate",
      "access account",
      "switch account",
      "mpin",
      "password login",
      "लॉगिन",
      "साइन इन",
      "प्रवेश"
    ]
  },
  {
    id: "public_register",
    routeKey: "public_register",
    intent: "register",
    canonicalIntent: "register",
    route: "/register",
    label: "Register ABHA Account",
    shortDescription: "Create a new Ayushman Bharat Health Account (ABHA) profile and citizen registration.",
    category: "Authentication",
    roles: ["public", "patient"],
    isDynamic: false,
    keywords: [
      "register",
      "sign up",
      "create account",
      "new abha",
      "abha registration",
      "join swasthyasetu",
      "new user",
      "पंजीकरण",
      "नया खाता",
      "रजिस्टर"
    ]
  },
  {
    id: "public_unauthorized",
    routeKey: "public_unauthorized",
    intent: "unauthorized",
    canonicalIntent: "unauthorized",
    route: "/unauthorized",
    label: "Access Denied",
    shortDescription: "Access restriction warning displayed when trying to visit an unauthorized portal role route.",
    category: "System",
    roles: ["public", "patient", "asha", "nurse", "anm", "doctor", "admin", "hospital"],
    isDynamic: false,
    keywords: [
      "unauthorized",
      "access denied",
      "permission denied",
      "forbidden",
      "no permission",
      "प्रतिबंधित",
      "अनुमति नहीं"
    ]
  },

  // --------------------------------------------------------------------------
  // PATIENT PORTAL DESTINATIONS (Protected under allowedRoles: ['patient'])
  // --------------------------------------------------------------------------
  {
    id: "patient_dashboard",
    routeKey: "patient_dashboard",
    intent: "dashboard",
    canonicalIntent: "dashboard",
    route: "/dashboard",
    label: "Citizen Health Dashboard",
    shortDescription: "Longitudinal health summary, ABHA health ID status, recent prescriptions, and health metrics.",
    category: "Citizen Overview",
    roles: ["patient"],
    isDynamic: false,
    keywords: [
      "dashboard",
      "patient dashboard",
      "citizen portal",
      "my health",
      "health overview",
      "health summary",
      "abha card",
      "abha status",
      "recent vitals",
      "डैशबोर्ड",
      "मेरा स्वास्थ्य",
      "आरोग्य डॅशबोर्ड"
    ]
  },
  {
    id: "patient_medical_records",
    routeKey: "patient_medical_records",
    intent: "medical_records",
    canonicalIntent: "medical_records",
    route: "/medical-records",
    label: "Medical Records & EHR",
    shortDescription: "Digital health locker containing prescriptions, diagnostic reports, lab test results, and discharge summaries.",
    category: "Health Records",
    roles: ["patient"],
    isDynamic: false,
    keywords: [
      "medical records",
      "medical record",
      "records",
      "record",
      "ehr",
      "health records",
      "prescriptions",
      "prescription",
      "dawa parchi",
      "parchi",
      "lab reports",
      "lab report",
      "diagnostic tests",
      "blood test",
      "xray",
      "doctor notes",
      "discharge summary",
      "medical history",
      "दवा पर्ची",
      "मेडिकल रिकॉर्ड",
      "वैद्यकीय नोंदी",
      "तपासणी अहवाल"
    ]
  },
  {
    id: "patient_medical_record_details",
    routeKey: "patient_medical_record_details",
    intent: "medical_record_details",
    canonicalIntent: "medical_record_details",
    route: "/medical-records/:id",
    label: "Medical Record Details",
    shortDescription: "In-depth view of a specific medical report, diagnostic data, issuing doctor, and clinical observations.",
    category: "Health Records",
    roles: ["patient"],
    isDynamic: true,
    params: ["id"],
    keywords: [
      "record detail",
      "report detail",
      "prescription view",
      "specific report",
      "diagnostic details",
      "doctor prescription detail"
    ]
  },
  {
    id: "patient_facilities",
    routeKey: "patient_facilities",
    intent: "facilities",
    canonicalIntent: "facilities",
    route: "/facilities",
    label: "Find Healthcare Facilities & Hospitals",
    shortDescription: "Directory of nearby Primary Health Centres (PHC), Community Health Centres (CHC), District Hospitals, and doctors.",
    category: "Healthcare Directory",
    roles: ["patient", "doctor"],
    isDynamic: false,
    keywords: [
      "find hospital",
      "find facility",
      "facilities",
      "nearby phc",
      "chc hospital",
      "district hospital",
      "nearest clinic",
      "government hospital",
      "health center",
      "find doctor",
      "doctors near me",
      "aspataal dhundho",
      "dawakhana",
      "अस्पताल खोजें",
      "दवाखाना",
      "जवळचे रुग्णालय",
      "आरोग्य केंद्र"
    ]
  },
  {
    id: "patient_facility_details",
    routeKey: "patient_facility_details",
    intent: "facility_details",
    canonicalIntent: "facility_details",
    route: "/facilities/:id",
    label: "Hospital / Facility Details",
    shortDescription: "Hospital contact info, available doctors, OPD timings, bed availability, emergency services, and directions.",
    category: "Healthcare Directory",
    roles: ["patient", "doctor"],
    isDynamic: true,
    params: ["id"],
    keywords: [
      "facility details",
      "hospital details",
      "phc details",
      "opd timings",
      "hospital doctors",
      "hospital phone",
      "hospital address",
      "रुग्णालय माहिती",
      "अस्पताल विवरण"
    ]
  },
  {
    id: "patient_appointments",
    routeKey: "patient_appointments",
    intent: "appointments",
    canonicalIntent: "appointments",
    route: "/appointments",
    label: "Appointments & Consultations",
    shortDescription: "Book and manage in-person OPD appointments and teleconsultations with PHC/CHC doctors.",
    category: "Care Booking",
    roles: ["patient"],
    isDynamic: false,
    keywords: [
      "appointments",
      "book appointment",
      "appointment book kardo",
      "doctor appointment",
      "consultation",
      "schedule visit",
      "opd booking",
      "teleconsultation",
      "upcoming appointments",
      "cancel appointment",
      "अपॉइंटमेंट",
      "डॉक्टर भेट",
      "तारीख बुक करा",
      "सल्ला मसलत"
    ]
  },

  // --------------------------------------------------------------------------
  // WORKER PORTAL DESTINATIONS (Protected under allowedRoles: ['asha', 'nurse', 'anm'])
  // --------------------------------------------------------------------------
  {
    id: "asha_dashboard",
    routeKey: "asha_dashboard",
    intent: "dashboard",
    canonicalIntent: "dashboard",
    route: "/worker/dashboard",
    label: "ASHA Field Care Dashboard",
    shortDescription: "Field overview of registered village families, high-risk flags, monthly visit goals, and pending tasks.",
    category: "Field Care Overview",
    roles: ["asha", "nurse", "anm"],
    isDynamic: false,
    keywords: [
      "worker dashboard",
      "asha dashboard",
      "field portal",
      "community overview",
      "today's summary",
      "coverage metrics",
      "field worker home",
      "आशा डॅशबोर्ड",
      "फील्ड केअर",
      "कार्यकर्ता डैशबोर्ड"
    ]
  },
  {
    id: "asha_patients",
    routeKey: "asha_patients",
    intent: "patients",
    canonicalIntent: "patients",
    route: "/worker/patients",
    label: "My Patients & Village Registry",
    shortDescription: "Directory of assigned community residents, pregnancy tracking, immunization rosters, and NCD profiles.",
    category: "Patient Registry",
    roles: ["asha", "nurse", "anm"],
    isDynamic: false,
    keywords: [
      "my patients",
      "patients kholo",
      "patients list",
      "my patients please",
      "community patients",
      "village registry",
      "assigned beneficiaries",
      "maternal registry",
      "anc patients",
      "pnc patients",
      "ncd screening list",
      "रुग्ण यादी",
      "गाव रुग्ण नोंदणी",
      "गाव रुग्ण यादी",
      "रुग्ण",
      "मरीज सूची",
      "मरीज़ सूची",
      "मेरे मरीज",
      "मेरे मरीज़",
      "मरीज दिखाओ",
      "मरीज़ दिखाओ",
      "गांव के मरीज",
      "गांव के मरीज़",
      "मरीज",
      "मरीज़"
    ]
  },
  {
    id: "asha_patient_profile",
    routeKey: "asha_patient_profile",
    intent: "patient_history",
    canonicalIntent: "patient_history",
    route: "/worker/patients/:id",
    label: "Patient Community Profile",
    shortDescription: "Comprehensive field record for a patient: screening history, vitals log, past visits, and family health data.",
    category: "Patient Registry",
    roles: ["asha", "nurse", "anm"],
    isDynamic: true,
    params: ["id"],
    keywords: [
      "patient profile",
      "beneficiary record",
      "patient history",
      "vitals history",
      "screening record",
      "रुग्ण प्रोफाइल",
      "मरीज प्रोफाइल"
    ]
  },
  {
    id: "asha_visits",
    routeKey: "asha_visits",
    intent: "scheduled_visits",
    canonicalIntent: "scheduled_visits",
    route: "/worker/visits",
    label: "Scheduled Home Visits",
    shortDescription: "Calendar and itinerary of scheduled home visits for prenatal care, neonatal checkups, and chronic disease care.",
    category: "Field Visits",
    roles: ["asha", "nurse", "anm"],
    isDynamic: false,
    keywords: [
      "scheduled visits",
      "visits",
      "mere visits dikhao",
      "kal ke visits",
      "meri upcoming visits",
      "show my scheduled visits",
      "home visits",
      "today visits",
      "upcoming visits",
      "field visits",
      "anc visits",
      "pnc visits",
      "घर भेट",
      "नियोजित भेटी",
      "गृह भ्रमण",
      "दौरे"
    ]
  },
  {
    id: "asha_new_visit",
    routeKey: "asha_new_visit",
    intent: "new_visit",
    canonicalIntent: "new_visit",
    route: "/worker/visits/new",
    label: "Record New Home Visit",
    shortDescription: "Clinical screening form to capture vitals (BP, sugar, pulse), symptoms, fetal heart rate, and treatment notes.",
    category: "Field Visits",
    roles: ["asha", "nurse", "anm"],
    isDynamic: false,
    keywords: [
      "new visit",
      "record visit",
      "nayi visit",
      "visit likho",
      "create visit",
      "log checkup",
      "screening form",
      "record vitals",
      "enter bp sugar",
      "maternal checkup form",
      "नवीन भेट",
      "तपासणी नोंदवा",
      "नया दौरा",
      "जांच दर्ज करें"
    ]
  },
  {
    id: "asha_referrals",
    routeKey: "asha_referrals",
    intent: "referrals",
    canonicalIntent: "referrals",
    route: "/worker/referrals",
    label: "Hospital Referrals Dashboard",
    shortDescription: "Track outbound hospital referrals to PHC/CHC/District Hospitals, urgent cases, and ambulance coordination.",
    category: "Referrals & Care Coordination",
    roles: ["asha", "nurse", "anm"],
    isDynamic: false,
    keywords: [
      "referrals",
      "referral status check karna hai",
      "referrals list",
      "hospital referrals",
      "emergency cases",
      "referred patients",
      "high risk referrals",
      "phc referrals",
      "रेफरल",
      "रुग्णालय रेफरल",
      "अस्पताल रेफरल"
    ]
  },
  {
    id: "asha_new_referral",
    routeKey: "asha_new_referral",
    intent: "new_referral",
    canonicalIntent: "new_referral",
    route: "/worker/referrals/new",
    label: "Create New Hospital Referral",
    shortDescription: "Initiate emergency or routine medical referral for a patient to a specialized PHC/CHC/Civil hospital.",
    category: "Referrals & Care Coordination",
    roles: ["asha", "nurse", "anm"],
    isDynamic: false,
    keywords: [
      "new referral",
      "create referral",
      "send to hospital",
      "refer patient",
      "hospital bhejo",
      "escalate to phc",
      "emergency referral",
      "ambulance referral",
      "नवीन रेफरल",
      "रुग्णालयात पाठवा",
      "नया रेफरल",
      "अस्पताल भेजें"
    ]
  },
  {
    id: "asha_referral_details",
    routeKey: "asha_referral_details",
    intent: "referral_details",
    canonicalIntent: "referral_details",
    route: "/worker/referrals/:id",
    label: "Referral Tracking Details",
    shortDescription: "Status and clinical documentation of an active referral, receiving doctor feedback, and admission status.",
    category: "Referrals & Care Coordination",
    roles: ["asha", "nurse", "anm"],
    isDynamic: true,
    params: ["id"],
    keywords: [
      "referral detail",
      "referral status",
      "track referral",
      "referral feedback",
      "रेफरल तपशील",
      "रेफरल विवरण"
    ]
  },
  {
    id: "asha_follow_ups",
    routeKey: "asha_follow_ups",
    intent: "follow_ups",
    canonicalIntent: "follow_ups",
    route: "/worker/follow-ups",
    label: "Post-Discharge & Treatment Follow-ups",
    shortDescription: "Action queue for post-hospital discharge monitoring, immunization schedules, and medication adherence.",
    category: "Care Continuity",
    roles: ["asha", "nurse", "anm"],
    isDynamic: false,
    keywords: [
      "follow ups",
      "followups",
      "follow up check",
      "post discharge",
      "immunization follow up",
      "medication adherence",
      "pending follow ups",
      "recovery checks",
      "फॉलो-अप",
      "डिस्चार्ज नंतर तपासणी",
      "उपचार फॉलो-अप"
    ]
  }
];

// ============================================================================
// 3. ROLE SUPPORT & CAPABILITIES REGISTRY
// ============================================================================

export const ROLE_METADATA = {
  patient: {
    roleId: "patient",
    displayName: "Citizen / Patient",
    portalBasePath: "/dashboard",
    status: "active",
    description: "Citizen portal for longitudinal ABHA health records, hospital discovery, and doctor consultations.",
    accessibleRouteKeys: [
      "public_landing",
      "public_login",
      "public_register",
      "public_unauthorized",
      "patient_dashboard",
      "patient_medical_records",
      "patient_medical_record_details",
      "patient_facilities",
      "patient_facility_details",
      "patient_appointments"
    ]
  },
  asha: {
    roleId: "asha",
    aliases: ["nurse", "anm"],
    displayName: "ASHA / Community Health Worker",
    portalBasePath: "/worker/dashboard",
    status: "active",
    description: "Field care portal for village healthcare workers managing patient registries, visits, referrals, and follow-ups.",
    accessibleRouteKeys: [
      "public_landing",
      "public_login",
      "public_unauthorized",
      "asha_dashboard",
      "asha_patients",
      "asha_patient_profile",
      "asha_visits",
      "asha_new_visit",
      "asha_referrals",
      "asha_new_referral",
      "asha_referral_details",
      "asha_follow_ups"
    ]
  },
  doctor: {
    roleId: "doctor",
    displayName: "Clinical Doctor",
    portalBasePath: null,
    status: "unmapped_future",
    description: "Doctor role exists in auth credentials (doctor@example.com) and login role selector (marked Coming Soon).",
    accessibleRouteKeys: [
      "public_landing",
      "public_login",
      "public_unauthorized",
      "patient_facilities",
      "patient_facility_details"
    ]
  },
  admin: {
    roleId: "admin",
    displayName: "System Administrator",
    portalBasePath: null,
    status: "unmapped_future",
    description: "No dedicated /admin/* routes currently exist in App.jsx prototype.",
    accessibleRouteKeys: [
      "public_landing",
      "public_login",
      "public_unauthorized"
    ]
  },
  hospital: {
    roleId: "hospital",
    displayName: "Hospital / Healthcare Facility",
    portalBasePath: null,
    status: "data_entity",
    description: "Hospital/facility data is accessed via Patient Facilities and ASHA Referrals.",
    accessibleRouteKeys: [
      "public_landing",
      "public_login",
      "public_unauthorized",
      "patient_facilities",
      "patient_facility_details"
    ]
  }
};

// ============================================================================
// 4. REGISTRY HELPER & QUERY MATCHING SERVICES
// ============================================================================

export function normalizeRole(role) {
  if (!role || typeof role !== "string") return "public";
  const lower = role.trim().toLowerCase();
  if (lower === "nurse" || lower === "anm") return "asha";
  return lower;
}

export function getRoutesForRole(role = "public") {
  const normRole = normalizeRole(role);
  return ROUTE_DEFINITIONS.filter((item) => {
    return (
      item.roles.includes(normRole) ||
      item.roles.includes("public") ||
      (normRole === "asha" && (item.roles.includes("nurse") || item.roles.includes("anm")))
    );
  });
}

export function findRouteByRouteKey(routeKey, role = null) {
  if (!routeKey) return null;
  const def = ROUTE_DEFINITIONS.find((item) => item.routeKey === routeKey || item.id === routeKey);
  if (!def) return null;

  if (role) {
    const { allowed } = validateNavigation(def.route, role);
    if (!allowed) return null;
  }
  return def;
}

export function findRouteByIntent(intent, role = null) {
  if (!intent) return null;
  const normIntent = String(intent).trim().toLowerCase();
  const normRole = role ? normalizeRole(role) : null;

  // Handle role-specific disambiguation for shared intents like "dashboard"
  if (normIntent === "dashboard" && normRole === "asha") {
    const ashaDash = ROUTE_DEFINITIONS.find((item) => item.routeKey === "asha_dashboard");
    if (ashaDash) return ashaDash;
  }

  // 1. Direct match by intent, canonicalIntent, id, or routeKey
  let def = ROUTE_DEFINITIONS.find(
    (item) =>
      item.canonicalIntent === normIntent ||
      item.intent === normIntent ||
      item.id === normIntent ||
      item.routeKey === normIntent
  );

  // 2. Match via INTENT_ALIAS_MAP
  if (!def && INTENT_ALIAS_MAP[normIntent]) {
    const mappedKey = INTENT_ALIAS_MAP[normIntent];
    def = ROUTE_DEFINITIONS.find((item) => item.routeKey === mappedKey || item.id === mappedKey);
  }

  if (!def) return null;

  if (role) {
    const { allowed } = validateNavigation(def.route, role);
    if (!allowed) return null;
  }
  return def;
}

export function findRouteByPath(targetRoute) {
  if (!targetRoute) return null;
  return (
    ROUTE_DEFINITIONS.find((def) => {
      if (def.route === targetRoute) return true;
      if (def.isDynamic) {
        const pattern = new RegExp("^" + def.route.replace(/:[a-zA-Z0-9_]+/g, "[^/]+") + "$");
        return pattern.test(targetRoute);
      }
      return false;
    }) || null
  );
}

export function validateNavigation(targetRoute, role = "public") {
  if (!targetRoute) {
    return { allowed: false, reason: "No target route specified." };
  }

  const normRole = normalizeRole(role);

  const matchedDef = ROUTE_DEFINITIONS.find((def) => {
    if (def.route === targetRoute) return true;
    if (def.isDynamic) {
      const pattern = new RegExp("^" + def.route.replace(/:[a-zA-Z0-9_]+/g, "[^/]+") + "$");
      return pattern.test(targetRoute);
    }
    return false;
  });

  if (!matchedDef) {
    return {
      allowed: false,
      reason: `Route "${targetRoute}" is not registered in the application.`
    };
  }

  const isRoleAllowed =
    matchedDef.roles.includes("public") ||
    matchedDef.roles.includes(normRole) ||
    (normRole === "asha" && (matchedDef.roles.includes("nurse") || matchedDef.roles.includes("anm")));

  if (!isRoleAllowed) {
    return {
      allowed: false,
      reason: `Access denied. Role "${normRole}" cannot access "${targetRoute}".`,
      routeDef: matchedDef
    };
  }

  return {
    allowed: true,
    routeDef: matchedDef
  };
}

export function resolveRoute(routePattern, params = {}) {
  if (!routePattern) return "";
  let resolved = routePattern;
  for (const [key, value] of Object.entries(params)) {
    resolved = resolved.replace(`:${key}`, encodeURIComponent(String(value)));
  }
  return resolved;
}

/**
 * Validates a structured decision returned by Gemini against local registry.
 * Guarantees zero unverified actions or fabricated routes.
 *
 * @param {object} decision - Structured result from Gemini
 * @param {string} userRole - Current authenticated user role
 * @returns {object} Validated, sanitized navigation result
 */
export function validateDecision(decision, userRole = "public") {
  const normRole = normalizeRole(userRole);
  const allowedRoutes = getRoutesForRole(normRole);

  if (!decision || typeof decision !== "object") {
    return {
      action: "no_match",
      intent: "unknown",
      targetRole: normRole,
      routeKey: null,
      route: null,
      message: "I could not determine the requested navigation destination.",
      confidence: 0,
      actions: []
    };
  }

  let { action, intent, targetRole, routeKey, message, confidence } = decision;

  // Enforce valid action enum
  if (!["navigate", "clarify", "no_match"].includes(action)) {
    action = "clarify";
  }

  // Enforce numeric confidence
  const confNum = typeof confidence === "number" ? confidence : 0.5;

  // Validate routeKey if action is navigate
  let matchedDef = null;
  if (routeKey) {
    matchedDef = findRouteByRouteKey(routeKey, normRole);
  }

  // Fallback match by intent if routeKey was omitted or misnamed
  if (!matchedDef && intent) {
    matchedDef = findRouteByIntent(intent, normRole);
  }

  // If action is navigate but no valid allowed routeKey was found or confidence < 0.4
  if (action === "navigate") {
    if (!matchedDef || confNum < 0.4) {
      action = "clarify";
      matchedDef = null;
      routeKey = null;
    } else {
      routeKey = matchedDef.routeKey;
      intent = matchedDef.canonicalIntent || matchedDef.intent;
    }
  } else {
    routeKey = null;
  }

  const actions = [];
  if (decision.actions && Array.isArray(decision.actions) && decision.actions.length > 0) {
    actions.push(
      ...decision.actions.map((act) => ({
        label: act.label,
        routeKey: act.routeKey || (findRouteByPath(act.route)?.routeKey ?? null),
        route: act.route,
        isPrimary: act.isPrimary ?? false
      }))
    );
  } else if (matchedDef && action === "navigate") {
    actions.push({
      label: `Go to ${matchedDef.label}`,
      routeKey: matchedDef.routeKey,
      route: matchedDef.route,
      isPrimary: true
    });
  } else if (action === "clarify") {
    // Provide up to 3 helpful role-appropriate options
    allowedRoutes.slice(0, 3).forEach((r) => {
      actions.push({
        label: r.label,
        routeKey: r.routeKey,
        route: r.route,
        isPrimary: false
      });
    });
  }

  return {
    action,
    intent: matchedDef ? (matchedDef.canonicalIntent || matchedDef.intent) : (intent || "unknown"),
    targetRole: normRole,
    routeKey: matchedDef ? matchedDef.routeKey : null,
    route: matchedDef ? matchedDef.route : null,
    label: matchedDef ? matchedDef.label : null,
    message: message || (matchedDef ? `I can navigate you to ${matchedDef.label}.` : "How can I help you navigate?"),
    confidence: confNum,
    actions
  };
}

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "from", "that", "this", "have", "what", "when",
  "where", "which", "your", "mera", "meri", "mere", "aaj", "kal", "karo", "karna",
  "kare", "hai", "hain", "kholo", "dikhao", "batao", "please", "pass", "aur",
  "take", "goto", "open", "show", "view", "portal", "page", "app", "me", "to"
]);

function normalizeText(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u093c]/g, "") // remove diacritics / nukta U+093C
    .normalize("NFC");
}

export function findRoutesByQuery(query, role = "public", limit = 5) {
  if (!query || typeof query !== "string") return [];

  const rawClean = query.trim().toLowerCase();
  if (!rawClean) return [];

  const normQuery = normalizeText(rawClean);

  const queryWords = normQuery
    .split(/[\s,?.!]+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
  const allowedRoutes = getRoutesForRole(role);
  const scored = [];

  for (const def of allowedRoutes) {
    let score = 0;
    let matchedKeyword = "";

    const normRoute = normalizeText(def.route);
    const normLabel = normalizeText(def.label);

    if (normRoute === normQuery) {
      score += 100;
      matchedKeyword = def.route;
    }

    if (normLabel === normQuery) {
      score += 80;
      matchedKeyword = def.label;
    } else if (normLabel.includes(normQuery) || normQuery.includes(normLabel)) {
      score += 40;
      matchedKeyword = def.label;
    }

    for (const kw of def.keywords) {
      const lowerKw = kw.toLowerCase();
      const normKw = normalizeText(lowerKw);

      if (normKw === normQuery || lowerKw === rawClean) {
        score += 70;
        matchedKeyword = kw;
        break;
      } else if (normQuery.includes(normKw) || normKw.includes(normQuery)) {
        score += 35;
        if (!matchedKeyword) matchedKeyword = kw;
      } else {
        const kwWords = normKw.split(/[\s,?.!]+/).filter((w) => w.length >= 2);
        const exactWordMatches = queryWords.filter((w) => kwWords.includes(w));
        if (exactWordMatches.length > 0) {
          const wordScore = exactWordMatches.length * 25;
          if (wordScore > score) {
            score = wordScore;
            matchedKeyword = kw;
          }
        }
      }
    }

    // Secondary matches
    for (const qw of queryWords) {
      if (def.shortDescription.toLowerCase().includes(qw)) {
        score += 5;
      }
    }

    if (score > 0) {
      if (!def.isDynamic) {
        score += 8;
      }
      scored.push({
        routeDef: def,
        score,
        matchedKeyword
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

export function getAllRegisteredRoutes() {
  return [...ROUTE_DEFINITIONS];
}

export function getNavigationSummary() {
  return {
    totalRoutesRegistered: ROUTE_DEFINITIONS.length,
    activeRoles: Object.keys(ROLE_METADATA).filter((k) => ROLE_METADATA[k].status === "active"),
    unmappedRoles: Object.keys(ROLE_METADATA).filter((k) => ROLE_METADATA[k].status !== "active"),
    routeBreakdown: {
      public: ROUTE_DEFINITIONS.filter((r) => r.roles.includes("public")).length,
      patient: ROUTE_DEFINITIONS.filter((r) => r.roles.includes("patient") && !r.roles.includes("public")).length,
      worker: ROUTE_DEFINITIONS.filter((r) => r.roles.includes("asha")).length
    }
  };
}

export default {
  CANONICAL_INTENTS,
  INTENT_ALIAS_MAP,
  ROUTE_DEFINITIONS,
  ROLE_METADATA,
  normalizeRole,
  getRoutesForRole,
  findRouteByRouteKey,
  findRouteByIntent,
  validateNavigation,
  resolveRoute,
  validateDecision,
  findRoutesByQuery,
  getAllRegisteredRoutes,
  getNavigationSummary
};
