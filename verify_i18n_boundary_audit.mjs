import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("\n=======================================================");
console.log("SWASTHYASETU - AI ASSISTANT & I18N BOUNDARY AUDIT");
console.log("=======================================================\n");

const filesToAudit = [
  "src/components/AiAssistant/AiAssistant.jsx",
  "src/api/ai.api.js",
  "src/server/geminiService.js",
  "src/server/viteGeminiPlugin.js",
  "src/services/navigationRegistry.js"
];

const FORBIDDEN_PATTERNS = [
  { name: "translate(userMessage)", regex: /\btranslate\s*\(\s*(userMessage|userInput|inputQuery|textToSend|query|message)\s*[,)]/i },
  { name: "t(userMessage)", regex: /\bt\s*\(\s*(userMessage|userInput|inputQuery|textToSend|query|message)\s*[,)]/i },
  { name: "translateText(userInput)", regex: /\btranslateText\s*\(\s*(userMessage|userInput|inputQuery|textToSend|query|message)\s*[,)]/i },
  { name: "translateDynamicText(userInput)", regex: /\btranslateDynamicText\s*\(\s*(userMessage|userInput|inputQuery|textToSend|query|message)\s*[,)]/i },
  { name: "localize(userMessage)", regex: /\blocalize\s*\(\s*(userMessage|userInput|inputQuery|textToSend|query|message)\s*[,)]/i },
  { name: "translatedPrompt assignment", regex: /\btranslatedPrompt\s*=/i },
  { name: "translatedMessage assignment", regex: /\btranslatedMessage\s*=/i }
];

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

console.log("--- 1. Static Pattern & Anti-Pattern Codebase Audit ---");

for (const relPath of filesToAudit) {
  const fullPath = path.join(__dirname, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${relPath}`);
    failedChecks++;
    continue;
  }

  const content = fs.readFileSync(fullPath, "utf-8");
  console.log(`Auditing [${relPath}]...`);

  for (const pattern of FORBIDDEN_PATTERNS) {
    totalChecks++;
    const match = pattern.regex.exec(content);
    if (match) {
      console.error(`  ❌ FAILED: Found forbidden pattern "${pattern.name}" in ${relPath} (match: "${match[0]}")`);
      failedChecks++;
    } else {
      console.log(`  ✅ PASSED: No "${pattern.name}" found in ${relPath}`);
      passedChecks++;
    }
  }
}

// Check 2: Verify AiAssistant passes raw input to askAiAssistant
console.log("\n--- 2. Dataflow Verification in AiAssistant.jsx ---");
const aiAssistantCode = fs.readFileSync(path.join(__dirname, "src/components/AiAssistant/AiAssistant.jsx"), "utf-8");

totalChecks++;
const hasDirectTextToSend = /const\s+textToSend\s*=\s*\(typeof\s+queryText\s*===\s*"string"\s*\?\s*queryText\s*:\s*inputQuery\)\.trim\(\)/.test(aiAssistantCode);
if (hasDirectTextToSend) {
  console.log("  ✅ PASSED: textToSend directly captures raw input string without translation wrapper");
  passedChecks++;
} else {
  console.error("  ❌ FAILED: textToSend is not directly assigned from raw input");
  failedChecks++;
}

totalChecks++;
const sendsRawToApi = /askAiAssistant\s*\(\s*\{\s*message:\s*textToSend/m.test(aiAssistantCode);
if (sendsRawToApi) {
  console.log("  ✅ PASSED: askAiAssistant receives message: textToSend verbatim");
  passedChecks++;
} else {
  console.error("  ❌ FAILED: askAiAssistant does not receive raw message");
  failedChecks++;
}

totalChecks++;
const storesRawInHistory = /text:\s*textToSend/m.test(aiAssistantCode);
if (storesRawInHistory) {
  console.log("  ✅ PASSED: userMessage stores raw textToSend in chat history");
  passedChecks++;
} else {
  console.error("  ❌ FAILED: userMessage does not store raw text");
  failedChecks++;
}

console.log(`\n=======================================================`);
console.log(`TOTAL AUDIT CHECKS: ${totalChecks} | PASSED: ${passedChecks} | FAILED: ${failedChecks}`);
console.log(`=======================================================\n`);

if (failedChecks > 0) {
  process.exit(1);
}
