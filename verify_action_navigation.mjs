import "dotenv/config";
import {
  findRouteByRouteKey,
  findRouteByPath,
  validateNavigation,
  getRoutesForRole,
  normalizeRole,
  findRoutesByQuery
} from "./src/services/navigationRegistry.js";
import { handleGeminiNavigation } from "./src/server/geminiService.js";

async function verifyActionNavigation() {
  console.log("\n=======================================================");
  console.log("SWASTHYASETU - ACTION CLICK & NAVIGATION PIPELINE TEST");
  console.log("=======================================================\n");

  const testCases = [
    // 1. "show medical records" (Patient)
    {
      query: "show medical records",
      role: "patient",
      expectedRouteKey: "patient_medical_records",
      expectedRoute: "/medical-records",
      expectedLabel: "Medical Records & EHR"
    },
    // 2. "show appointments" (Patient)
    {
      query: "show appointments",
      role: "patient",
      expectedRouteKey: "patient_appointments",
      expectedRoute: "/appointments",
      expectedLabel: "Appointments & Consultations"
    },
    // 3. "show my patients" (ASHA)
    {
      query: "show my patients",
      role: "asha",
      expectedRouteKey: "asha_patients",
      expectedRoute: "/worker/patients",
      expectedLabel: "My Patients & Village Registry"
    },
    // 4. "show referrals" (ASHA)
    {
      query: "show referrals",
      role: "asha",
      expectedRouteKey: "asha_referrals",
      expectedRoute: "/worker/referrals",
      expectedLabel: "Hospital Referrals Dashboard"
    },
    // 5. "open dashboard" (Patient)
    {
      query: "open dashboard",
      role: "patient",
      expectedRouteKey: "patient_dashboard",
      expectedRoute: "/dashboard",
      expectedLabel: "Citizen Health Dashboard"
    },
    // 6. "open dashboard" (ASHA)
    {
      query: "open dashboard",
      role: "asha",
      expectedRouteKey: "asha_dashboard",
      expectedRoute: "/worker/dashboard",
      expectedLabel: "ASHA Field Care Dashboard"
    }
  ];

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    console.log(`[Test ${i + 1}/${testCases.length}] Testing Navigation for: "${tc.query}" [Role: ${tc.role}]`);

    // Step 1: AI Intent & Decision Generation
    const decision = await handleGeminiNavigation({
      message: tc.query,
      role: tc.role,
      currentPage: "/",
      language: "en"
    });

    console.log(`  1. AI Decision: action="${decision.action}", routeKey="${decision.routeKey}"`);

    // Step 2: RouteKey resolution against registry
    const targetDef = findRouteByRouteKey(decision.routeKey) || findRouteByPath(decision.route);
    if (!targetDef) {
      console.error(`  ❌ Failed to resolve route definition for routeKey="${decision.routeKey}"`);
      failed++;
      continue;
    }
    console.log(`  2. Registry Resolution: Found "${targetDef.label}" with path "${targetDef.route}"`);

    // Step 3: Role-based navigation permission check
    const { allowed, reason } = validateNavigation(targetDef.route, tc.role);
    console.log(`  3. Role Permission Check: allowed=${allowed}`);

    // Step 4: Verify action button payload structure
    const primaryAction = decision.actions?.find(a => a.isPrimary) || decision.actions?.[0];
    console.log(`  4. Action Button Payload:`, primaryAction);

    let testOk = true;
    if (decision.routeKey !== tc.expectedRouteKey) {
      console.error(`  ❌ Expected routeKey "${tc.expectedRouteKey}", got "${decision.routeKey}"`);
      testOk = false;
    }
    if (targetDef.route !== tc.expectedRoute) {
      console.error(`  ❌ Expected route "${tc.expectedRoute}", got "${targetDef.route}"`);
      testOk = false;
    }
    if (!allowed) {
      console.error(`  ❌ Role permission check failed: ${reason}`);
      testOk = false;
    }
    if (!primaryAction || (primaryAction.routeKey !== tc.expectedRouteKey && primaryAction.route !== tc.expectedRoute)) {
      console.error(`  ❌ Primary action button does not match expected destination`);
      testOk = false;
    }

    if (testOk) {
      console.log(`  ✅ SUCCESS: Clickable action correctly resolves and validates "${tc.expectedRoute}" for ${tc.role}\n`);
      passed++;
    } else {
      console.log(`  ❌ TEST FAILED\n`);
      failed++;
    }
  }

  // Step 5: Security & Role Boundary Tests
  console.log("=======================================================");
  console.log("SECURITY & ROLE PERMISSION BOUNDARY TESTS");
  console.log("=======================================================\n");

  const securityTests = [
    {
      name: "Patient role blocked from accessing /worker/referrals/new",
      role: "patient",
      targetRoute: "/worker/referrals/new",
      shouldAllow: false
    },
    {
      name: "ASHA role blocked from accessing /medical-records",
      role: "asha",
      targetRoute: "/medical-records",
      shouldAllow: false
    },
    {
      name: "Unregistered fake route blocked from navigation",
      role: "patient",
      targetRoute: "/non-existent-fake-route",
      shouldAllow: false
    },
    {
      name: "Invalid routeKey rejected by findRouteByRouteKey",
      routeKey: "malicious_fake_route_key",
      role: "patient",
      shouldBeNull: true
    }
  ];

  for (const st of securityTests) {
    console.log(`[Security Test] ${st.name}`);
    if (st.routeKey) {
      const def = findRouteByRouteKey(st.routeKey);
      if (def === null) {
        console.log(`  ✅ PASSED: Invalid routeKey returned null as expected.`);
        passed++;
      } else {
        console.error(`  ❌ FAILED: Invalid routeKey unexpectedly resolved.`);
        failed++;
      }
    } else {
      const { allowed, reason } = validateNavigation(st.targetRoute, st.role);
      if (allowed === st.shouldAllow) {
        console.log(`  ✅ PASSED: validateNavigation returned allowed=${allowed} (${reason || "Allowed"}).`);
        passed++;
      } else {
        console.error(`  ❌ FAILED: validateNavigation returned allowed=${allowed}, expected ${st.shouldAllow}.`);
        failed++;
      }
    }
    console.log("-------------------------------------------------------");
  }

  console.log(`\n=======================================================`);
  console.log(`TOTAL TESTS: ${testCases.length + securityTests.length} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`=======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

verifyActionNavigation();
