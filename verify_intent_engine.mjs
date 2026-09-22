import "dotenv/config";
import { handleGeminiNavigation } from "./src/server/geminiService.js";
import { validateDecision, ROUTE_DEFINITIONS } from "./src/services/navigationRegistry.js";

console.log("===================================================================");
console.log("SWASTHYASETU - GEMINI NAVIGATION INTENT ENGINE VERIFICATION");
console.log("===================================================================\n");

const testCases = [
  // --------------------------------------------------------------------------
  // ASHA WORKER HINGLISH & CONVERSATIONAL PHRASES
  // --------------------------------------------------------------------------
  {
    query: "mere visits dikhao",
    role: "asha",
    expectedAction: "navigate",
    expectedRouteKey: "asha_visits",
    expectedRoute: "/worker/visits"
  },
  {
    query: "show my scheduled visits",
    role: "asha",
    expectedAction: "navigate",
    expectedRouteKey: "asha_visits",
    expectedRoute: "/worker/visits"
  },
  {
    query: "kal ke visits",
    role: "asha",
    expectedAction: "navigate",
    expectedRouteKey: "asha_visits",
    expectedRoute: "/worker/visits"
  },
  {
    query: "meri upcoming visits",
    role: "asha",
    expectedAction: "navigate",
    expectedRouteKey: "asha_visits",
    expectedRoute: "/worker/visits"
  },
  {
    query: "patients kholo",
    role: "asha",
    expectedAction: "navigate",
    expectedRouteKey: "asha_patients",
    expectedRoute: "/worker/patients"
  },
  {
    query: "my patients please",
    role: "asha",
    expectedAction: "navigate",
    expectedRouteKey: "asha_patients",
    expectedRoute: "/worker/patients"
  },
  {
    query: "referral status check karna hai",
    role: "asha",
    expectedAction: "navigate",
    expectedRouteKey: "asha_referrals",
    expectedRoute: "/worker/referrals"
  },
  {
    query: "nayi home visit likho",
    role: "asha",
    expectedAction: "navigate",
    expectedRouteKey: "asha_new_visit",
    expectedRoute: "/worker/visits/new"
  },

  // --------------------------------------------------------------------------
  // CITIZEN / PATIENT HINGLISH & CONVERSATIONAL PHRASES
  // --------------------------------------------------------------------------
  {
    query: "dawa parchi dekhni hai",
    role: "patient",
    expectedAction: "navigate",
    expectedRouteKey: "patient_medical_records",
    expectedRoute: "/medical-records"
  },
  {
    query: "aspataal dhundho",
    role: "patient",
    expectedAction: "navigate",
    expectedRouteKey: "patient_facilities",
    expectedRoute: "/facilities"
  },
  {
    query: "appointment book karni hai",
    role: "patient",
    expectedAction: "navigate",
    expectedRouteKey: "patient_appointments",
    expectedRoute: "/appointments"
  },
  {
    query: "mera dashboard kholo",
    role: "patient",
    expectedAction: "navigate",
    expectedRouteKey: "patient_dashboard",
    expectedRoute: "/dashboard"
  },

  // --------------------------------------------------------------------------
  // SECURITY & ROLE ISOLATION: Cross-role and Ambiguous requests
  // --------------------------------------------------------------------------
  {
    query: "show village patients roster and screening",
    role: "patient", // Citizen should NOT be routed to worker patient registry
    expectedActionNot: "/worker/patients",
    roleIsolationTest: true
  },
  {
    query: "kya chal raha hai bhai",
    role: "patient",
    expectedAction: "clarify",
    ambiguityTest: true
  }
];

async function runIntentEngineTests() {
  let passed = 0;
  let total = testCases.length;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    console.log(`[Test ${i + 1}/${total}] Query: "${tc.query}" (Role: ${tc.role})`);

    try {
      const decision = await handleGeminiNavigation({
        message: tc.query,
        role: tc.role,
        currentPage: tc.role === "asha" ? "/worker/dashboard" : "/dashboard",
        language: "en"
      });

      console.log(`   Result -> Action: "${decision.action}", RouteKey: "${decision.routeKey}", Route: "${decision.route}", Confidence: ${decision.confidence}`);
      console.log(`   Message: "${decision.message}"`);

      // 1. Schema check
      if (!decision.action || typeof decision.confidence !== "number" || !decision.message) {
        console.error(`   ❌ Failed schema validation!`);
        continue;
      }

      // 2. Role Isolation test
      if (tc.roleIsolationTest) {
        if (decision.route && decision.route.startsWith("/worker/")) {
          console.error(`   ❌ FAILED: Worker route leaked to patient!`);
        } else {
          console.log(`   ✅ PASSED: Role isolation enforced (no worker route given to patient)`);
          passed++;
        }
        console.log("");
        continue;
      }

      // 3. Ambiguity test
      if (tc.ambiguityTest) {
        if (decision.action === "clarify" || decision.action === "no_match") {
          console.log(`   ✅ PASSED: Ambiguous query correctly identified as '${decision.action}'`);
          passed++;
        } else {
          console.warn(`   ⚠️ Expected clarify/no_match for ambiguous query, got '${decision.action}'`);
        }
        console.log("");
        continue;
      }

      // 4. Concrete Route & RouteKey Matching test
      const actionMatches = decision.action === tc.expectedAction;
      const routeKeyMatches = decision.routeKey === tc.expectedRouteKey;
      const routeMatches = decision.route === tc.expectedRoute;

      if (actionMatches && routeKeyMatches && routeMatches) {
        console.log(`   ✅ PASSED: Successfully resolved to ${tc.expectedRouteKey} (${tc.expectedRoute})`);
        passed++;
      } else {
        console.warn(`   ⚠️ Mismatch: Expected [${tc.expectedAction}, ${tc.expectedRouteKey}, ${tc.expectedRoute}], got [${decision.action}, ${decision.routeKey}, ${decision.route}]`);
      }
    } catch (err) {
      console.error(`   ❌ Error during test:`, err.message);
    }

    console.log("");
    // Pacing delay to adhere to Gemini free-tier RPM limit
    await new Promise((r) => setTimeout(r, 3500));
  }

  console.log("===================================================================");
  console.log(`SUMMARY: ${passed} of ${total} tests passed.`);
  if (passed === total) {
    console.log("🎉 ALL INTENT ENGINE & HINGLISH PHRASE TESTS PASSED PERFECTLY!");
  }
  console.log("===================================================================");
}

runIntentEngineTests();
