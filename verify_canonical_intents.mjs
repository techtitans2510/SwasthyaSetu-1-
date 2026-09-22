import "dotenv/config";
import {
  findRouteByIntent,
  findRouteByRouteKey,
  validateDecision,
  CANONICAL_INTENTS
} from "./src/services/navigationRegistry.js";
import { handleGeminiNavigation } from "./src/server/geminiService.js";

async function verifyCanonicalIntents() {
  console.log("\n=======================================================");
  console.log("SWASTHYASETU - CANONICAL ENGLISH INTENT LAYER TEST");
  console.log("=======================================================\n");

  const testGroups = [
    {
      group: "Medical Records Multilingual Variations -> Canonical 'medical_records'",
      expectedCanonicalIntent: CANONICAL_INTENTS.MEDICAL_RECORDS,
      expectedRouteKey: "patient_medical_records",
      role: "patient",
      inputs: [
        "show medical records",
        "mere medical records dikhao",
        "मेरे मेडिकल रिकॉर्ड दिखाओ",
        "medical records kholo"
      ]
    },
    {
      group: "Appointments Multilingual Variations -> Canonical 'appointments'",
      expectedCanonicalIntent: CANONICAL_INTENTS.APPOINTMENTS,
      expectedRouteKey: "patient_appointments",
      role: "patient",
      inputs: [
        "show appointments",
        "doctor appointment book karni hai",
        "डॉक्टर अपॉइंटमेंट बुक करें",
        "doctor se appointment lo"
      ]
    },
    {
      group: "Patients Multilingual Variations -> Canonical 'patients'",
      expectedCanonicalIntent: CANONICAL_INTENTS.PATIENTS,
      expectedRouteKey: "asha_patients",
      role: "asha",
      inputs: [
        "show my patients",
        "patients kholo",
        "मेरे मरीज़ दिखाओ",
        "गाव रुग्ण यादी"
      ]
    },
    {
      group: "Scheduled Visits Multilingual Variations -> Canonical 'scheduled_visits'",
      expectedCanonicalIntent: CANONICAL_INTENTS.SCHEDULED_VISITS,
      expectedRouteKey: "asha_visits",
      role: "asha",
      inputs: [
        "show scheduled visits",
        "mere visits dikhao",
        "नियत गृह दौरे दिखाओ",
        "आजच्या नियोजित भेटी"
      ]
    },
    {
      group: "Referrals Multilingual Variations -> Canonical 'referrals'",
      expectedCanonicalIntent: CANONICAL_INTENTS.REFERRALS,
      expectedRouteKey: "asha_referrals",
      role: "asha",
      inputs: [
        "show hospital referrals",
        "referral status check karna hai",
        "अस्पताल रेफरल सूची"
      ]
    },
    {
      group: "Dashboard Multilingual Variations -> Canonical 'dashboard'",
      expectedCanonicalIntent: CANONICAL_INTENTS.DASHBOARD,
      expectedRouteKey: "patient_dashboard",
      role: "patient",
      inputs: [
        "show health dashboard",
        "mera dashboard kholo",
        "स्वास्थ्य डैशबोर्ड"
      ]
    }
  ];

  let totalTests = 0;
  let passed = 0;
  let failed = 0;

  for (const group of testGroups) {
    console.log(`\n--- ${group.group} ---`);

    for (const input of group.inputs) {
      totalTests++;
      console.log(`Testing query: "${input}" [Role: ${group.role}]`);

      try {
        const result = await handleGeminiNavigation({
          message: input,
          role: group.role,
          currentPage: "/",
          language: "en"
        });

        console.log(`  -> Intent: "${result.intent}" | RouteKey: "${result.routeKey}" | Route: "${result.route}"`);

        // Check 1: Intent is in English characters only (no Devanagari or translated Hindi strings)
        const isEnglishIntent = /^[a-z0-9_]+$/i.test(result.intent);
        const isEnglishRouteKey = /^[a-z0-9_]+$/i.test(result.routeKey);

        if (!isEnglishIntent) {
          console.error(`  ❌ Intent contains non-English characters: "${result.intent}"`);
        }
        if (!isEnglishRouteKey) {
          console.error(`  ❌ RouteKey contains non-English characters: "${result.routeKey}"`);
        }

        // Check 2: Intent matches canonical intent
        const intentMatches = result.intent === group.expectedCanonicalIntent;
        const routeKeyMatches = result.routeKey === group.expectedRouteKey;

        if (isEnglishIntent && isEnglishRouteKey && intentMatches && routeKeyMatches) {
          console.log(`  ✅ PASSED: Resolved to canonical English "${result.intent}" -> ${result.routeKey}`);
          passed++;
        } else {
          console.error(`  ❌ FAILED: Expected canonical intent "${group.expectedCanonicalIntent}" & routeKey "${group.expectedRouteKey}", got intent="${result.intent}", routeKey="${result.routeKey}"`);
          failed++;
        }
      } catch (err) {
        console.error(`  ❌ ERROR:`, err.message);
        failed++;
      }
    }
  }

  // Intent Registry & Lookup Resolution Tests
  console.log("\n=======================================================");
  console.log("CANONICAL INTENT REGISTRY LOOKUP TESTS");
  console.log("=======================================================\n");

  const registryLookups = [
    { intent: "medical_records", expectedRouteKey: "patient_medical_records" },
    { intent: "appointments", expectedRouteKey: "patient_appointments" },
    { intent: "patients", expectedRouteKey: "asha_patients" },
    { intent: "scheduled_visits", expectedRouteKey: "asha_visits" },
    { intent: "referrals", expectedRouteKey: "asha_referrals" },
    { intent: "dashboard", role: "patient", expectedRouteKey: "patient_dashboard" },
    { intent: "dashboard", role: "asha", expectedRouteKey: "asha_dashboard" },
    { intent: "patient_history", expectedRouteKey: "asha_patient_profile" }
  ];

  for (const rl of registryLookups) {
    totalTests++;
    console.log(`Lookup Intent: "${rl.intent}" [Role: ${rl.role || "any"}]`);
    const def = findRouteByIntent(rl.intent, rl.role);
    if (def && def.routeKey === rl.expectedRouteKey) {
      console.log(`  ✅ PASSED: findRouteByIntent("${rl.intent}") -> ${def.routeKey} (${def.route})`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: Expected "${rl.expectedRouteKey}", got "${def?.routeKey}"`);
      failed++;
    }
  }

  console.log(`\n=======================================================`);
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`=======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

verifyCanonicalIntents();
