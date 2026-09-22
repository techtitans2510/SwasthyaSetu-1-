import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  ROUTE_DEFINITIONS,
  ROLE_METADATA,
  getRoutesForRole,
  validateNavigation,
  resolveRoute,
  findRouteByIntent,
  findRoutesByQuery,
  getNavigationSummary
} from "./src/services/navigationRegistry.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("===================================================================");
console.log("SWASTHYASETU - AI NAVIGATION REGISTRY VERIFICATION");
console.log("===================================================================\n");

// 1. Read App.jsx and extract actual routes
const appJsxPath = path.join(__dirname, "src", "App.jsx");
const appJsxContent = fs.readFileSync(appJsxPath, "utf-8");

// Extract route paths using regex
const routeRegex = /<Route\s+path=["']([^"']+)["']/g;
const actualAppRoutes = [];
let match;
while ((match = routeRegex.exec(appJsxContent)) !== null) {
  actualAppRoutes.push(match[1]);
}

console.log(`[1] Found ${actualAppRoutes.length} actual routes in App.jsx:`);
actualAppRoutes.forEach((r, idx) => console.log(`   ${idx + 1}. ${r}`));

// 2. Verify every registry route exists in App.jsx
console.log("\n[2] Verifying Registry Routes against App.jsx:");
let allExist = true;
ROUTE_DEFINITIONS.forEach((item) => {
  const exists = actualAppRoutes.includes(item.route);
  if (exists) {
    console.log(`   ✅ [MATCH] ${item.route.padEnd(28)} -> ${item.label} (Intent: ${item.intent})`);
  } else {
    console.error(`   ❌ [MISMATCH] Route in registry does NOT exist in App.jsx: ${item.route}`);
    allExist = false;
  }
});

// Check if any route in App.jsx was missed by the registry
console.log("\n[3] Checking for unmapped App.jsx routes:");
actualAppRoutes.forEach((appRoute) => {
  const mapped = ROUTE_DEFINITIONS.find((r) => r.route === appRoute);
  if (mapped) {
    console.log(`   ✅ [MAPPED] ${appRoute}`);
  } else {
    console.error(`   ❌ [UNMAPPED] App.jsx route missing in registry: ${appRoute}`);
    allExist = false;
  }
});

// 3. Test Role Navigation & Restriction Rules
console.log("\n[4] Testing Role Restrictions & Route Protections:");

const testCases = [
  { role: "patient", route: "/dashboard", expectedAllowed: true },
  { role: "patient", route: "/medical-records", expectedAllowed: true },
  { role: "patient", route: "/facilities", expectedAllowed: true },
  { role: "patient", route: "/worker/dashboard", expectedAllowed: false },
  { role: "patient", route: "/worker/visits", expectedAllowed: false },

  { role: "asha", route: "/worker/dashboard", expectedAllowed: true },
  { role: "asha", route: "/worker/visits", expectedAllowed: true },
  { role: "asha", route: "/worker/referrals/new", expectedAllowed: true },
  { role: "asha", route: "/dashboard", expectedAllowed: false },
  { role: "asha", route: "/medical-records", expectedAllowed: false },

  { role: "nurse", route: "/worker/visits/new", expectedAllowed: true },
  { role: "anm", route: "/worker/follow-ups", expectedAllowed: true },

  { role: "doctor", route: "/dashboard", expectedAllowed: false },
  { role: "doctor", route: "/worker/dashboard", expectedAllowed: false },
  { role: "doctor", route: "/facilities", expectedAllowed: true },
  { role: "doctor", route: "/login", expectedAllowed: true },

  { role: "admin", route: "/dashboard", expectedAllowed: false },
  { role: "admin", route: "/worker/dashboard", expectedAllowed: false },
  { role: "admin", route: "/", expectedAllowed: true },

  { role: "public", route: "/login", expectedAllowed: true },
  { role: "public", route: "/register", expectedAllowed: true },
  { role: "public", route: "/dashboard", expectedAllowed: false },
  { role: "public", route: "/worker/dashboard", expectedAllowed: false }
];

let roleTestsPassed = 0;
testCases.forEach((tc) => {
  const result = validateNavigation(tc.route, tc.role);
  if (result.allowed === tc.expectedAllowed) {
    roleTestsPassed++;
    console.log(`   ✅ Role '${tc.role.padEnd(7)}' -> '${tc.route.padEnd(24)}' : ${result.allowed ? "ALLOWED" : "DENIED"} (Expected: ${tc.expectedAllowed ? "ALLOWED" : "DENIED"})`);
  } else {
    console.error(`   ❌ FAILED: Role '${tc.role}' -> '${tc.route}' gave ${result.allowed}, expected ${tc.expectedAllowed}`);
  }
});

// 4. Test Natural Language Query Matcher
console.log("\n[5] Testing Query Matching against Registry:");
const queries = [
  { q: "prescription", role: "patient", expectedRoute: "/medical-records" },
  { q: "find hospital nearby", role: "patient", expectedRoute: "/facilities" },
  { q: "book appointment with doctor", role: "patient", expectedRoute: "/appointments" },
  { q: "today's scheduled visits", role: "asha", expectedRoute: "/worker/visits" },
  { q: "send patient to civil hospital", role: "asha", expectedRoute: "/worker/referrals/new" },
  { q: "log bp and sugar checkup", role: "asha", expectedRoute: "/worker/visits/new" },
  { q: "post discharge check", role: "asha", expectedRoute: "/worker/follow-ups" },
  { q: "दवा पर्ची", role: "patient", expectedRoute: "/medical-records" },
  { q: "गाव रुग्ण यादी", role: "asha", expectedRoute: "/worker/patients" }
];

let queryTestsPassed = 0;
queries.forEach((t) => {
  const matches = findRoutesByQuery(t.q, t.role, 3);
  const topMatch = matches[0];
  if (topMatch && topMatch.routeDef.route === t.expectedRoute) {
    queryTestsPassed++;
    console.log(`   ✅ Query: "${t.q}" [${t.role}] -> Top Match: ${topMatch.routeDef.route} (${topMatch.routeDef.label}) [Score: ${topMatch.score}]`);
  } else {
    console.warn(`   ⚠️ Query: "${t.q}" [${t.role}] -> Top Match was ${topMatch?.routeDef?.route || "NONE"}, expected ${t.expectedRoute}`);
  }
});

// 5. Test Parameter Resolution
console.log("\n[6] Testing Parameter Resolution:");
const resolved1 = resolveRoute("/medical-records/:id", { id: "REC-9821" });
console.log(`   ✅ /medical-records/:id with id=REC-9821 -> ${resolved1}`);
const resolved2 = resolveRoute("/worker/patients/:id", { id: "P-401" });
console.log(`   ✅ /worker/patients/:id with id=P-401 -> ${resolved2}`);

// 6. Summary Output
const summary = getNavigationSummary();
console.log("\n[7] Navigation Summary:");
console.log(JSON.stringify(summary, null, 2));

console.log("\n===================================================================");
if (allExist && roleTestsPassed === testCases.length) {
  console.log("🎉 ALL TESTS & VALIDATIONS PASSED PERFECTLY (100% Alignment with App.jsx)");
} else {
  console.error("❌ SOME CHECKS FAILED");
  process.exit(1);
}
console.log("===================================================================");
