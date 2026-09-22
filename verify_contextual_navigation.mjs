import "dotenv/config";
import { handleGeminiNavigation } from "./src/server/geminiService.js";
import { validateNavigation } from "./src/services/navigationRegistry.js";

console.log("===================================================================");
console.log("SWASTHYASETU - LIGHTWEIGHT CONTEXT DISAMBIGUATION TEST");
console.log("===================================================================\n");

const contextualScenarios = [
  {
    name: "User on Scheduled Visits asking for history (ASHA)",
    role: "asha",
    currentPage: "/worker/visits",
    currentSection: "Scheduled Home Visits",
    query: "history bhi dikhao",
    expectedRouteOptions: ["/worker/patients", "/worker/patients/:id", "/worker/follow-ups"]
  },
  {
    name: "User on Facility Directory asking for doctor appointment (Patient)",
    role: "patient",
    currentPage: "/facilities",
    currentSection: "Find Healthcare Facilities & Hospitals",
    query: "doctor se milna hai appointment lo",
    expectedRouteOptions: ["/appointments"]
  },
  {
    name: "User on Referral Dashboard asking for a new one (ASHA)",
    role: "asha",
    currentPage: "/worker/referrals",
    currentSection: "Hospital Referrals Dashboard",
    query: "naya wala banao",
    expectedRouteOptions: ["/worker/referrals/new"]
  },
  {
    name: "User on Citizen Dashboard asking for prescriptions/reports (Patient)",
    role: "patient",
    currentPage: "/dashboard",
    currentSection: "Citizen Health Dashboard",
    query: "reports aur parchi dikhao",
    expectedRouteOptions: ["/medical-records"]
  }
];

async function runContextualTests() {
  let passed = 0;
  const total = contextualScenarios.length;

  for (let i = 0; i < total; i++) {
    const sc = contextualScenarios[i];
    console.log(`[Scenario ${i + 1}/${total}] ${sc.name}`);
    console.log(`   Context -> Role: "${sc.role}", Current Page: "${sc.currentPage}" (${sc.currentSection})`);
    console.log(`   User Query: "${sc.query}"`);

    try {
      const decision = await handleGeminiNavigation({
        message: sc.query,
        role: sc.role,
        currentPage: sc.currentPage,
        currentSection: sc.currentSection,
        language: "en"
      });

      console.log(`   Decision -> Action: "${decision.action}", RouteKey: "${decision.routeKey}", Route: "${decision.route}"`);
      console.log(`   Message: "${decision.message}"`);

      // Verify route is authorized
      const authCheck = validateNavigation(decision.route, sc.role);
      if (!authCheck.allowed && decision.route) {
        console.error(`   ❌ SECURITY VIOLATION: Route ${decision.route} not permitted for role ${sc.role}`);
        continue;
      }

      // Check if resolved route matches expected contextual options
      const matchesOption = sc.expectedRouteOptions.includes(decision.route);
      if (matchesOption) {
        console.log(`   ✅ PASSED: Contextual query resolved to valid destination: ${decision.route}`);
        passed++;
      } else {
        console.warn(`   ⚠️ Did not match target options [${sc.expectedRouteOptions.join(", ")}], got ${decision.route}`);
      }
    } catch (err) {
      console.error(`   ❌ Error during test:`, err.message);
    }

    console.log("");
    // Pacing delay
    await new Promise((r) => setTimeout(r, 3500));
  }

  console.log("===================================================================");
  console.log(`SUMMARY: ${passed} of ${total} contextual scenarios passed.`);
  if (passed === total) {
    console.log("🎉 ALL LIGHTWEIGHT CONTEXT DISAMBIGUATION TESTS PASSED PERFECTLY!");
  }
  console.log("===================================================================");
}

runContextualTests();
