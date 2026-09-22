import "dotenv/config";
import { handleGeminiNavigation } from "./src/server/geminiService.js";
import { findRoutesByQuery } from "./src/services/navigationRegistry.js";

async function verifyExactUserInput() {
  console.log("\n=======================================================");
  console.log("SWASTHYASETU - EXACT RAW USER INPUT PIPELINE VERIFICATION");
  console.log("=======================================================\n");

  const testCases = [
    {
      name: "Exact English 'show medical records'",
      query: "show medical records",
      role: "patient",
      expectedRouteKey: "patient_medical_records"
    },
    {
      name: "Exact English 'show appointments'",
      query: "show appointments",
      role: "patient",
      expectedRouteKey: "patient_appointments"
    },
    {
      name: "Exact English 'show my patients'",
      query: "show my patients",
      role: "asha",
      expectedRouteKey: "asha_patients"
    },
    {
      name: "Exact English 'show scheduled visits'",
      query: "show scheduled visits",
      role: "asha",
      expectedRouteKey: "asha_visits"
    },
    {
      name: "Exact English 'show hospital referrals'",
      query: "show hospital referrals",
      role: "asha",
      expectedRouteKey: "asha_referrals"
    },
    {
      name: "Preserved Hinglish 'mere medical records dikhao'",
      query: "mere medical records dikhao",
      role: "patient",
      expectedRouteKey: "patient_medical_records"
    },
    {
      name: "Preserved Hindi 'दवा पर्ची दिखाओ'",
      query: "दवा पर्ची दिखाओ",
      role: "patient",
      expectedRouteKey: "patient_medical_records"
    },
    {
      name: "Preserved Marathi 'रुग्ण यादी दाखवा'",
      query: "रुग्ण यादी दाखवा",
      role: "asha",
      expectedRouteKey: "asha_patients"
    }
  ];

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    console.log(`[Test ${i + 1}/${testCases.length}] Testing: "${tc.query}" (${tc.name})`);

    // 1. Check direct query matching pipeline
    const queryMatches = findRoutesByQuery(tc.query, tc.role, 1);
    const topRouteKey = queryMatches[0]?.routeDef?.routeKey;

    if (topRouteKey === tc.expectedRouteKey) {
      console.log(`  ✅ Registry Query Match: "${tc.query}" -> ${topRouteKey}`);
    } else {
      console.error(`  ❌ Registry Query Match Failed: Expected "${tc.expectedRouteKey}", got "${topRouteKey}"`);
      failed++;
      continue;
    }

    // 2. Check full navigation engine pipeline
    try {
      const decision = await handleGeminiNavigation({
        message: tc.query,
        role: tc.role,
        currentPage: "/",
        language: "en"
      });

      console.log(`  -> Action: ${decision.action}, RouteKey: ${decision.routeKey}, Route: ${decision.route}`);
      if (decision.routeKey === tc.expectedRouteKey && decision.action === "navigate") {
        console.log(`  ✅ Pipeline Success: Exactly resolved "${tc.query}" to ${decision.route}`);
        passed++;
      } else {
        console.error(`  ❌ Pipeline Failed: Expected "${tc.expectedRouteKey}", got "${decision.routeKey}"`);
        failed++;
      }
    } catch (err) {
      console.error(`  ❌ Pipeline Error:`, err.message);
      failed++;
    }

    console.log("-------------------------------------------------------");
  }

  console.log(`\n=======================================================`);
  console.log(`TOTAL TESTS: ${testCases.length} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`=======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

verifyExactUserInput();
