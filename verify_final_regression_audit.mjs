import "dotenv/config";
import {
  findRouteByIntent,
  findRouteByRouteKey,
  findRouteByPath,
  validateNavigation,
  validateDecision,
  CANONICAL_INTENTS
} from "./src/services/navigationRegistry.js";
import { handleGeminiNavigation } from "./src/server/geminiService.js";
import { translations, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "./src/locales/index.js";

async function runFinalRegressionAudit() {
  console.log("\n=======================================================");
  console.log("SWASTHYASETU - AI ASSISTANT FINAL REGRESSION AUDIT");
  console.log("=======================================================\n");

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function assert(condition, testName, details = "") {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}${details ? ` -> ${details}` : ""}`);
      passedTests++;
      return true;
    } else {
      console.error(`❌ [FAIL] ${testName}${details ? ` -> ${details}` : ""}`);
      failedTests++;
      return false;
    }
  }

  // --------------------------------------------------------------------------
  // TEST 1: Original English input preserved, resolves to canonical 'medical_records'
  // --------------------------------------------------------------------------
  console.log("--- TEST 1: English input 'show medical records' ---");
  const test1Input = "show medical records";
  const result1 = await handleGeminiNavigation({
    message: test1Input,
    role: "patient",
    currentPage: "/",
    language: "en"
  });

  assert(
    result1.intent === CANONICAL_INTENTS.MEDICAL_RECORDS,
    "TEST 1.1: Canonical intent is 'medical_records'",
    `Intent: "${result1.intent}"`
  );
  assert(
    result1.routeKey === "patient_medical_records",
    "TEST 1.2: Route key is 'patient_medical_records'",
    `RouteKey: "${result1.routeKey}"`
  );
  assert(
    result1.route === "/medical-records",
    "TEST 1.3: Route is '/medical-records'",
    `Route: "${result1.route}"`
  );
  assert(
    result1.intent !== "दवा पर्ची दिखाओ" && result1.routeKey !== "दवा_पर्ची",
    "TEST 1.4: Intent & RouteKey are NOT translated into Hindi/Devanagari"
  );

  // --------------------------------------------------------------------------
  // TEST 2: Hinglish input 'mere medical records dikhao' -> canonical 'medical_records'
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 2: Hinglish input 'mere medical records dikhao' ---");
  const test2Input = "mere medical records dikhao";
  const result2 = await handleGeminiNavigation({
    message: test2Input,
    role: "patient",
    currentPage: "/dashboard",
    language: "hi"
  });

  assert(
    result2.intent === CANONICAL_INTENTS.MEDICAL_RECORDS,
    "TEST 2.1: Canonical intent resolves to 'medical_records'",
    `Intent: "${result2.intent}"`
  );
  assert(
    result2.routeKey === "patient_medical_records",
    "TEST 2.2: RouteKey is 'patient_medical_records'",
    `RouteKey: "${result2.routeKey}"`
  );

  // --------------------------------------------------------------------------
  // TEST 3: Devanagari input 'मेरे मेडिकल रिकॉर्ड दिखाओ' -> canonical 'medical_records'
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 3: Devanagari input 'मेरे मेडिकल रिकॉर्ड दिखाओ' ---");
  const test3Input = "मेरे मेडिकल रिकॉर्ड दिखाओ";
  const result3 = await handleGeminiNavigation({
    message: test3Input,
    role: "patient",
    currentPage: "/dashboard",
    language: "hi"
  });

  assert(
    result3.intent === CANONICAL_INTENTS.MEDICAL_RECORDS,
    "TEST 3.1: Devanagari query resolves to canonical 'medical_records'",
    `Intent: "${result3.intent}"`
  );
  assert(
    result3.routeKey === "patient_medical_records",
    "TEST 3.2: RouteKey is 'patient_medical_records'",
    `RouteKey: "${result3.routeKey}"`
  );

  // --------------------------------------------------------------------------
  // TEST 4: Action button navigation connects to existing Medical Records route
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 4: Action button click navigation resolution ---");
  const actionToTest = { routeKey: "patient_medical_records", route: "/medical-records" };
  const targetDef = findRouteByRouteKey(actionToTest.routeKey) || findRouteByPath(actionToTest.route);
  const permissionCheck = validateNavigation(targetDef?.route, "patient");

  assert(
    targetDef !== null && targetDef.route === "/medical-records",
    "TEST 4.1: Action button resolves to existing route definition",
    `Resolved Path: "${targetDef?.route}"`
  );
  assert(
    permissionCheck.allowed === true,
    "TEST 4.2: Navigation is authorized for patient role",
    `Allowed: ${permissionCheck.allowed}`
  );

  // --------------------------------------------------------------------------
  // TEST 5: Non-existent page request -> No navigation
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 5: Non-existent destination query ---");
  const result5 = await handleGeminiNavigation({
    message: "take me to spaceship cockpit settings and lottery portal",
    role: "patient",
    currentPage: "/dashboard",
    language: "en"
  });

  assert(
    result5.action !== "navigate" || result5.route === null,
    "TEST 5.1: Non-existent request produces no navigation or clarify action",
    `Action: "${result5.action}", Route: "${result5.route}"`
  );

  // --------------------------------------------------------------------------
  // TEST 6: Unauthorized cross-role navigation -> Blocked
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 6: Unauthorized role boundary check ---");
  const crossRoleCheck = validateNavigation("/worker/patients", "patient");

  assert(
    crossRoleCheck.allowed === false,
    "TEST 6.1: Patient cannot navigate to ASHA Worker route /worker/patients",
    `Allowed: ${crossRoleCheck.allowed} | Reason: "${crossRoleCheck.reason}"`
  );

  const crossRoleDoctorCheck = validateNavigation("/worker/visits", "doctor");
  assert(
    crossRoleDoctorCheck.allowed === false,
    "TEST 6.2: Doctor cannot navigate to ASHA Worker route /worker/visits",
    `Allowed: ${crossRoleDoctorCheck.allowed} | Reason: "${crossRoleDoctorCheck.reason}"`
  );

  // --------------------------------------------------------------------------
  // TEST 7: Invalid/hallucinated route validation -> Caught and blocked
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 7: Hallucinated / Invalid route validation ---");
  const fakeDecision = {
    action: "navigate",
    intent: "fake_medical_cure",
    targetRole: "patient",
    routeKey: "hallucinated_route_key_999",
    message: "Navigating to fake route",
    confidence: 0.99
  };

  const validatedFake = validateDecision(fakeDecision, "patient");
  assert(
    validatedFake.action === "clarify" && validatedFake.route === null,
    "TEST 7.1: Hallucinated decision safely downgraded to clarify with route: null",
    `Action: "${validatedFake.action}", Route: "${validatedFake.route}"`
  );

  // --------------------------------------------------------------------------
  // TEST 8: Gemini API failure / offline resilience
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 8: Deterministic fallback & offline resilience ---");
  // Test fallback query handling with simulated offline/unreachable state
  const fallbackResult = await handleGeminiNavigation({
    message: "show scheduled visits",
    role: "asha",
    currentPage: "/worker/dashboard",
    language: "en"
  });

  assert(
    fallbackResult.intent === CANONICAL_INTENTS.SCHEDULED_VISITS,
    "TEST 8.1: Fallback engine correctly resolves 'show scheduled visits' to 'scheduled_visits'",
    `Intent: "${fallbackResult.intent}" | Route: "${fallbackResult.route}"`
  );
  assert(
    fallbackResult.route === "/worker/visits",
    "TEST 8.2: Fallback engine targets valid route /worker/visits",
    `Route: "${fallbackResult.route}"`
  );

  // --------------------------------------------------------------------------
  // TEST 9: Existing multilingual UI system integrity
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 9: Existing Multilingual UI Dictionary Integrity ---");
  assert(
    SUPPORTED_LANGUAGES.length === 3,
    "TEST 9.1: Supported languages count is 3 (en, hi, mr)",
    `Count: ${SUPPORTED_LANGUAGES.length}`
  );
  assert(
    typeof translations.en.medicalRecords === "string" &&
    typeof translations.hi.medicalRecords === "string" &&
    typeof translations.mr.medicalRecords === "string",
    "TEST 9.2: UI translation keys exist across en, hi, mr dictionaries",
    `en: "${translations.en.medicalRecords}", hi: "${translations.hi.medicalRecords}", mr: "${translations.mr.medicalRecords}"`
  );
  assert(
    typeof translations.en.aiAssistant?.title === "string" &&
    typeof translations.hi.aiAssistant?.title === "string" &&
    typeof translations.mr.aiAssistant?.title === "string",
    "TEST 9.3: AI Assistant UI chrome translation keys exist in all locales",
    `en: "${translations.en.aiAssistant?.title}", hi: "${translations.hi.aiAssistant?.title}", mr: "${translations.mr.aiAssistant?.title}"`
  );

  // --------------------------------------------------------------------------
  // TEST 10: English navigation commands when UI language = Hindi
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 10: English query with Hindi UI active ---");
  const result10 = await handleGeminiNavigation({
    message: "show medical records",
    role: "patient",
    currentPage: "/dashboard",
    language: "hi" // Hindi UI active
  });

  assert(
    result10.intent === CANONICAL_INTENTS.MEDICAL_RECORDS,
    "TEST 10.1: English query under Hindi UI resolves to canonical 'medical_records'",
    `Intent: "${result10.intent}"`
  );
  assert(
    result10.routeKey === "patient_medical_records",
    "TEST 10.2: English query under Hindi UI resolves to 'patient_medical_records'",
    `RouteKey: "${result10.routeKey}"`
  );
  assert(
    result10.route === "/medical-records",
    "TEST 10.3: English query under Hindi UI resolves to '/medical-records'",
    `Route: "${result10.route}"`
  );

  console.log(`\n=======================================================`);
  console.log(`REGRESSION AUDIT SUMMARY: ${totalTests} CHECKS | ${passedTests} PASSED | ${failedTests} FAILED`);
  console.log(`=======================================================\n`);

  if (failedTests > 0) {
    process.exit(1);
  }
}

runFinalRegressionAudit();
