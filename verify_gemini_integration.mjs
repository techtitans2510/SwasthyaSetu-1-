import "dotenv/config";
import { handleGeminiNavigation } from "./src/server/geminiService.js";
import { ROUTE_DEFINITIONS, validateNavigation } from "./src/services/navigationRegistry.js";

console.log("===================================================================");
console.log("SWASTHYASETU - GOOGLE GEMINI AI NAVIGATION INTEGRATION TEST");
console.log("===================================================================\n");

async function runGeminiIntegrationTests() {
  const testScenarios = [
    {
      name: "Patient Doctor Appointment Query (English)",
      role: "patient",
      language: "en",
      message: "I need to schedule a consultation with a doctor for my routine checkup.",
      expectedRoute: "/appointments"
    },
    {
      name: "Patient Prescription & EHR Query (Hindi)",
      role: "patient",
      language: "hi",
      message: "मुझे अपनी पिछली डॉक्टर की दवा पर्ची और लैब टेस्ट की रिपोर्ट देखनी है।",
      expectedRoute: "/medical-records"
    },
    {
      name: "Patient Nearby Hospital Query (Marathi)",
      role: "patient",
      language: "mr",
      message: "माझ्या घराजवळचे प्राथमिक आरोग्य केंद्र (PHC) आणि रुग्णालय कुठे आहे?",
      expectedRoute: "/facilities"
    },
    {
      name: "ASHA Worker Home Visit Checkup Query",
      role: "asha",
      language: "en",
      message: "I need to record blood pressure and vitals for a pregnant mother in village ward 4.",
      expectedRoute: "/worker/visits/new"
    },
    {
      name: "ASHA Worker Hospital Emergency Referral Query",
      role: "asha",
      language: "en",
      message: "Patient has severe complication, need to initiate an urgent referral to District Civil Hospital.",
      expectedRoute: "/worker/referrals/new"
    },
    {
      name: "Role Security Boundary: Patient requesting worker village roster",
      role: "patient",
      language: "en",
      message: "Show me all village patients and their health cards.",
      expectNotWorkerRoute: true
    }
  ];

  let passedTests = 0;

  for (let i = 0; i < testScenarios.length; i++) {
    const sc = testScenarios[i];
    console.log(`[Test ${i + 1}/${testScenarios.length}] ${sc.name}`);
    console.log(`   User Query: "${sc.message}"`);
    console.log(`   Role: ${sc.role}, Lang: ${sc.language}`);

    try {
      const response = await handleGeminiNavigation({
        message: sc.message,
        role: sc.role,
        language: sc.language
      });

      console.log(`   🤖 Gemini Response: "${response.text.slice(0, 100)}..."`);
      console.log(`   🎯 Suggested Actions:`, response.actions.map((a) => `${a.label} -> ${a.route}`));

      // Verify safety: All action routes must be valid and allowed for the role
      let allAllowed = true;
      for (const act of response.actions) {
        const check = validateNavigation(act.route, sc.role);
        if (!check.allowed) {
          console.error(`   ❌ SECURITY VIOLATION: Route ${act.route} is not allowed for role ${sc.role}!`);
          allAllowed = false;
        }
      }

      if (sc.expectedRoute) {
        const matchesPrimary = response.actions.some((a) => a.route === sc.expectedRoute);
        if (matchesPrimary && allAllowed) {
          console.log(`   ✅ PASSED: Matched expected route ${sc.expectedRoute}`);
          passedTests++;
        } else {
          console.warn(`   ⚠️ Did not match primary route ${sc.expectedRoute}`);
        }
      } else if (sc.expectNotWorkerRoute) {
        const leakedWorker = response.actions.some((a) => a.route.startsWith("/worker/"));
        if (!leakedWorker && allAllowed) {
          console.log(`   ✅ PASSED: Patient role isolation preserved (zero worker routes leaked)`);
          passedTests++;
        } else {
          console.error(`   ❌ FAILED: Worker route leaked to patient!`);
        }
      }
    } catch (err) {
      console.error(`   ❌ Test encountered an error:`, err);
    }
    console.log("");
  }

  console.log("===================================================================");
  console.log(`SUMMARY: ${passedTests} of ${testScenarios.length} tests passed successfully.`);
  if (passedTests === testScenarios.length) {
    console.log("🎉 ALL GEMINI INTEGRATION & ROLE SAFETY TESTS PASSED!");
  }
  console.log("===================================================================");
}

runGeminiIntegrationTests();
