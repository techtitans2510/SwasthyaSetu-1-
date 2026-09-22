import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import {
  getRoutesForRole,
  normalizeRole,
  validateDecision,
  findRoutesByQuery
} from "../services/navigationRegistry.js";

/**
 * SwasthyaSetu - Gemini Navigation Intent Engine
 *
 * Primary Purpose:
 * USER NATURAL LANGUAGE (English / Hindi / Hinglish / Typos / Short Commands)
 *   → UNDERSTAND NAVIGATION INTENT
 *   → SELECT ONE EXISTING APPLICATION DESTINATION (FROM REGISTRY ONLY)
 *   → RETURN STRUCTURED SCHEMA RESULT
 *   → APPLICATION-LEVEL VALIDATION BEFORE NAVIGATION
 */

let genAIClient = null;

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[GeminiIntentEngine] GEMINI_API_KEY is not configured.");
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

/**
 * Executes the Gemini navigation intent classification.
 *
 * @param {object} params
 * @param {string} params.message - User natural language request
 * @param {string} [params.role='public'] - Current user authenticated role
 * @param {string} [params.currentPage='/'] - Current page route the user is on
 * @param {string} [params.language='en'] - User's selected language
 * @returns {Promise<{ action: string, intent: string, targetRole: string, routeKey: string|null, route: string|null, label: string|null, message: string, confidence: number, actions: Array<object> }>}
 */
export async function handleGeminiNavigation({
  message,
  role = "public",
  currentPage = "/",
  currentSection = "General",
  language = "en"
}) {
  if (!message || typeof message !== "string") {
    throw new Error("Invalid request: 'message' must be a non-empty string.");
  }

  const cleanMessage = message.trim().slice(0, 500);
  const normalizedRole = normalizeRole(role);
  const allowedRoutes = getRoutesForRole(normalizedRole);

  // Prepare destination catalogue for the intent engine
  const destinationCatalogue = allowedRoutes.map((r) => ({
    routeKey: r.routeKey,
    intent: r.intent,
    route: r.route,
    label: r.label,
    description: r.shortDescription,
    category: r.category,
    keywords: r.keywords.slice(0, 8)
  }));

  const client = getGenAIClient();

  // If Gemini client unavailable, use local deterministic engine
  if (!client) {
    return fallbackDeterministicNavigation(cleanMessage, normalizedRole, currentPage, currentSection, language);
  }

  const systemInstruction = `You are the SwasthyaSetu AI Navigation-Intent Engine for a rural and civic healthcare platform in India (ABDM compliant).

YOUR SOLE PURPOSE:
Understand the user's natural-language request (in English, Hindi, Hinglish, transliterated Hindi/Marathi, colloquial phrases, slang, or with spelling mistakes) and select ONE valid navigation destination from the allowed registry list below.

MANDATORY MEDICAL & CLINICAL SAFETY BOUNDARIES:
The SwasthyaSetu assistant's current purpose is application navigation and UI assistance ONLY.
It is NOT a clinical tool, diagnostic engine, or prescribing system.

YOU MUST NOT:
1. Diagnose diseases, medical conditions, or analyze clinical symptoms (e.g., chest pain, breathing difficulty, fever, skin rash).
2. Prescribe medicines, recommend pharmaceuticals, suggest drug dosages, or advise on home remedies.
3. Recommend clinical treatments, surgical procedures, or therapies.
4. Replace a doctor, physician, or certified healthcare professional.
5. Generate clinical decisions, medical triage ratings, or diagnostic judgments.
6. Fabricate patient records, EHR files, test results, lab reports, or vitals data.
7. Fabricate appointments, dates, or pretend an appointment has been booked.
8. Fabricate referral statuses, hospital acceptances, or ambulance dispatches.
9. Invent medical or clinical information.
10. Claim that a medical action was completed unless the application actually completed it.

HANDLING MEDICAL & CLINICAL QUESTIONS OUTSIDE NAVIGATION SCOPE:
If a user asks a medical question outside the assistant's navigation scope (such as asking for a diagnosis, medicine prescription, disease treatment, drug dosage, or symptom evaluation):
- DO NOT provide any medical advice, clinical diagnosis, treatment plan, or medication recommendation.
- Set action: "clarify" (or "navigate" if the user also asked to see a doctor or hospital).
- Respond briefly in the "message" field that the current assistant is designed for navigating the SwasthyaSetu platform and cannot provide medical advice, and direct them to consult a qualified doctor or visit a nearby healthcare facility.
- Example message (English): "The SwasthyaSetu assistant is designed for navigating the platform and cannot provide medical advice. Please consult a qualified doctor or book an appointment."
- Example message (Hindi/Hinglish): "SwasthyaSetu सहायक केवल ऐप नेविगेशन और सहायता के लिए है और चिकित्सकीय सलाह या दवा नहीं दे सकता। कृपया डॉक्टर से परामर्श के लिए अपॉइंटमेंट बुक करें या नजदीकी स्वास्थ्य केंद्र जाएं।"

LIGHTWEIGHT CONTEXT (FOR CONTEXTUAL DISAMBIGUATION ONLY):
- Current User Role: "${normalizedRole}"
- Current Route: "${currentPage}"
- Current Active Section: "${currentSection}"
- Interface Language: "${language}"

ALLOWED NAVIGATION DESTINATIONS (STRICT REGISTRY FOR THIS ROLE):
${JSON.stringify(destinationCatalogue, null, 2)}

MANDATORY CANONICAL ENGLISH INTENTS & ROUTE KEYS:
The assistant accepts multilingual natural-language inputs, but ALL INTERNAL INTENTS AND ROUTE KEYS MUST REMAIN IN CANONICAL ENGLISH.
Regardless of user language (English, Hindi, Hinglish, Marathi, etc.):
- Set 'intent' to the stable canonical English identifier (e.g. "medical_records", "appointments", "patients", "scheduled_visits", "referrals", "dashboard", "facilities", "new_visit", "new_referral", "follow_ups", "patient_history").
- Set 'routeKey' to the canonical English routeKey from the allowed registry (e.g. "patient_medical_records", "patient_appointments", "asha_patients", "asha_visits", "asha_referrals", "asha_dashboard", "patient_dashboard").
- NEVER translate 'intent' or 'routeKey' into Hindi/Devanagari (e.g., NEVER return intent: "चिकित्सा_रिकॉर्ड" or routeKey: "दवा_पर्ची").
- The original user message must be preserved separately from any UI display translation.

Examples:
* "show medical records" -> intent: "medical_records", routeKey: "patient_medical_records"
* "mere medical records dikhao" -> intent: "medical_records", routeKey: "patient_medical_records"
* "मेरे मेडिकल रिकॉर्ड दिखाओ" -> intent: "medical_records", routeKey: "patient_medical_records"
* "medical records kholo" -> intent: "medical_records", routeKey: "patient_medical_records"
* "show appointments" / "doctor appointment" / "डॉक्टर अपॉइंटमेंट" -> intent: "appointments", routeKey: "patient_appointments"
* "show my patients" / "patients kholo" / "मेरे मरीज़" -> intent: "patients", routeKey: "asha_patients"
* "show scheduled visits" / "mere visits dikhao" / "नियत गृह दौरे" -> intent: "scheduled_visits", routeKey: "asha_visits"
* "show hospital referrals" / "referral status" / "अस्पताल रेफरल" -> intent: "referrals", routeKey: "asha_referrals"
* "show health dashboard" / "मेरा डैशबोर्ड" -> intent: "dashboard", routeKey: "patient_dashboard"

INTENT RESOLUTION & CONTEXTUAL DISAMBIGUATION RULES:
1. USE CURRENT PAGE CONTEXT TO DISAMBIGUATE RELATIVE REQUESTS:
   - If on "Scheduled Visits" (/worker/visits) and user says "history bhi dikhao" or "past records", resolve to "asha_patients" (My Patients & Village Registry) or "asha_follow_ups".
   - If on "Hospital Referrals Dashboard" (/worker/referrals) and user says "naya banana hai" or "send to hospital", resolve to "asha_new_referral" (Create New Hospital Referral).
   - If on "Find Healthcare Facilities" (/facilities) and user says "doctor se milna hai" or "appointment", resolve to "patient_appointments" (Appointments & Consultations).
   - If on "Citizen Health Dashboard" (/dashboard) and user says "dawa ya reports", resolve to "patient_medical_records" (Medical Records & EHR).

2. ACTION SELECTION CRITERIA:
   - "navigate": Clear intent matching ONE allowed destination for this role (confidence >= 0.70). Set routeKey to the exact routeKey string.
   - "clarify": Ambiguous request, multiple possible destinations, medical advice question outside scope, or confidence < 0.70. Set routeKey: null.
   - "no_match": Request cannot be satisfied within the allowed destinations for this role (e.g. user asks for another role's private features, unrelated general trivia, or invalid operations). Set routeKey: null.

3. STRICT SECURITY & INTEGRITY RULES:
   - NEVER invent or hallucinate a routeKey, route path, or external URL.
   - NEVER output executable JavaScript or HTML.
   - NEVER claim that an appointment was confirmed or a referral was processed.
   - Keep the 'message' field concise, polite, empathetic, and UI-friendly (1-2 sentences).
   - If user speaks in Hindi/Hinglish, write 'message' in natural conversational Hindi/Hinglish.

OUTPUT SPECIFICATION:
You MUST return ONLY a JSON object strictly matching this schema:
{
  "action": "navigate" | "clarify" | "no_match",
  "intent": "canonical_english_intent",
  "targetRole": "${normalizedRole}",
  "routeKey": "canonical_english_route_key_or_null",
  "message": "Short friendly navigation guidance message",
  "confidence": 0.95
}`;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User Natural Language Input: "${cleanMessage}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            action: {
              type: "STRING",
              enum: ["navigate", "clarify", "no_match"]
            },
            intent: {
              type: "STRING"
            },
            targetRole: {
              type: "STRING"
            },
            routeKey: {
              type: "STRING",
              nullable: true
            },
            message: {
              type: "STRING"
            },
            confidence: {
              type: "NUMBER"
            }
          },
          required: ["action", "intent", "targetRole", "message", "confidence"]
        },
        temperature: 0.1
      }
    });

    const rawJson = response.text;
    let parsedDecision;

    try {
      parsedDecision = JSON.parse(rawJson);
    } catch {
      const jsonMatch = rawJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedDecision = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse Gemini decision schema.");
      }
    }

    // Check for medical advice query to guarantee disclaimer presence
    if (isMedicalAdviceQuery(cleanMessage)) {
      parsedDecision = applyMedicalSafetyGuardrail(parsedDecision, cleanMessage, normalizedRole, language);
    }

    // MANDATORY APPLICATION-SIDE VALIDATION AGAINST LOCAL REGISTRY
    // Gemini output is NEVER trusted blindly.
    const validatedResult = validateDecision(parsedDecision, normalizedRole);
    return validatedResult;
  } catch (err) {
    console.error("[GeminiIntentEngine] Error during Gemini inference:", err.message);
    return fallbackDeterministicNavigation(cleanMessage, normalizedRole, currentPage, currentSection, language);
  }
}

/**
 * Detects whether the query is seeking medical diagnosis, drug prescription, dosage, or clinical advice.
 */
export function isMedicalAdviceQuery(query) {
  if (!query || typeof query !== "string") return false;
  const lower = query.toLowerCase();

  // If query is specifically looking for existing record documents (e.g., "dawa parchi", "test report", "prescriptions list")
  const isDocumentLookup = /(dawa parchi|parchi dikhao|purani parchi|view prescription|records|reports|ehr|lab report|blood report|discharge summary)/i.test(lower);
  if (isDocumentLookup && !/(kya dawa lu|kitni dosage|dosage batao|medicine suggest|cure for|cure\b|treatment\b|remedy|diagnos)/i.test(lower)) {
    return false;
  }

  // Clinical symptom / diagnosis / disease queries
  const diagnosisPatterns = /(diagnos|what disease|kya bimari|bimari bat|symptom|chest pain|heart attack|stroke|fever|cough|infection|blood pressure|hypertension|diabetes|sugar bimari|difficulty breathing|sans lene me taklif|pet me dard)/i;

  // Medicine prescription / dosage / treatment / remedy / cure patterns
  const treatmentPatterns = /(prescrib|prescribe|what medicine|konsi dawa|dawa batao|dawa suggest|dawai batao|medicine|tablet|dosage|dose|how many mg|kitni goli|kitna dose|treatment|cure|remedy|home remedy|ilaj|upchar|totke|nuskhe|gharelu upchar)/i;

  // Specific common drug names in query asking for usage/dose
  const drugUsagePatterns = /(paracetamol|crocin|azithromycin|amoxicillin|combiflam|ibuprofen|metformin|atenolol|cetirizine|aspirin|cough syrup)/i;

  return diagnosisPatterns.test(lower) || treatmentPatterns.test(lower) || drugUsagePatterns.test(lower);
}

/**
 * Applies strict medical safety guardrails to assistant decisions.
 */
export function applyMedicalSafetyGuardrail(decision, query, role, language = "en") {
  const normRole = normalizeRole(role);

  const safetyDisclaimer = {
    hi: "SwasthyaSetu सहायक केवल ऐप नेविगेशन और सहायता के लिए है और चिकित्सकीय सलाह, निदान या दवा की सिफारिश नहीं कर सकता। कृपया डॉक्टर से परामर्श लें या नजदीकी स्वास्थ्य केंद्र जाएं।",
    mr: "SwasthyaSetu सहाय्यक केवळ ॲप नेव्हिगेशनसाठी आहे आणि वैद्यकीय सल्ला, निदान किंवा औषध देऊ शकत नाही. कृपया डॉक्टरांचा सल्ला घ्या किंवा जवळच्या आरोग्य केंद्राला भेट द्या.",
    en: "The SwasthyaSetu assistant is designed for navigating the platform and cannot provide medical advice, diagnoses, or prescriptions. Please consult a qualified doctor or visit a nearby healthcare facility."
  }[language] || "The SwasthyaSetu assistant is designed for navigating the platform and cannot provide medical advice, diagnoses, or prescriptions. Please consult a qualified doctor or visit a nearby healthcare facility.";

  const careActions = [];
  if (normRole === "patient" || normRole === "public" || normRole === "doctor") {
    careActions.push({
      label: "Book Doctor Appointment",
      route: "/appointments",
      isPrimary: true
    });
    careActions.push({
      label: "Find Healthcare Facilities",
      route: "/facilities",
      isPrimary: false
    });
  } else if (normRole === "asha") {
    careActions.push({
      label: "Create Hospital Referral",
      route: "/worker/referrals/new",
      isPrimary: true
    });
    careActions.push({
      label: "Scheduled Home Visits",
      route: "/worker/visits",
      isPrimary: false
    });
  }

  return {
    action: "clarify",
    intent: "medical_safety_boundary_enforced",
    targetRole: normRole,
    routeKey: null,
    route: null,
    label: null,
    message: safetyDisclaimer,
    confidence: 1.0,
    actions: careActions
  };
}

/**
 * Deterministic local navigation engine fallback.
 */
function fallbackDeterministicNavigation(query, role, currentPage, currentSection = "General", language = "en") {
  const cleanLower = query.toLowerCase();

  // Safety boundary check in fallback engine
  if (isMedicalAdviceQuery(query)) {
    return applyMedicalSafetyGuardrail({ action: "clarify" }, query, role, language);
  }

  // Context-aware relative intent disambiguation
  if (role === "asha") {
    if (currentPage === "/worker/visits" && (cleanLower.includes("history") || cleanLower.includes("past") || cleanLower.includes("purani"))) {
      const def = getRoutesForRole(role).find((r) => r.routeKey === "asha_patients");
      if (def) {
        return validateDecision({
          action: "navigate",
          intent: def.intent,
          targetRole: role,
          routeKey: def.routeKey,
          message: `I can navigate you to **${def.label}** to view patient screening and community records.`,
          confidence: 0.88
        }, role);
      }
    }
    if (currentPage === "/worker/referrals" && (cleanLower.includes("naya") || cleanLower.includes("new") || cleanLower.includes("banao") || cleanLower.includes("create"))) {
      const def = getRoutesForRole(role).find((r) => r.routeKey === "asha_new_referral");
      if (def) {
        return validateDecision({
          action: "navigate",
          intent: def.intent,
          targetRole: role,
          routeKey: def.routeKey,
          message: `I can navigate you to **${def.label}** to initiate a new hospital referral.`,
          confidence: 0.9
        }, role);
      }
    }
  }

  const matched = findRoutesByQuery(query, role, 3);

  if (!matched || matched.length === 0) {
    const defaultMsg = {
      hi: "मुझे आपकी खोज के लिए कोई सटीक पृष्ठ नहीं मिला। आप नीचे दिए गए मुख्य पृष्ठों पर जा सकते हैं:",
      mr: "मला तुमच्या विनंतीनुसार थेट पृष्ठ सापडले नाही. आपण खालील पर्यायांचा वापर करू शकता:",
      en: "I couldn't find an exact destination for that request. Here are accessible sections for your role:"
    }[language] || "Here are accessible sections for your role:";

    const decision = {
      action: "clarify",
      intent: "no_direct_match",
      targetRole: role,
      routeKey: null,
      message: defaultMsg,
      confidence: 0.2
    };

    return validateDecision(decision, role);
  }

  const primary = matched[0];
  const primaryDef = primary.routeDef;

  const isStrongMatch = primary.score >= 40;

  const introMsg = isStrongMatch
    ? ({
        hi: `मैं आपको **${primaryDef.label}** पर ले जा सकता हूँ।\n${primaryDef.shortDescription}`,
        mr: `मी आपल्याला **${primaryDef.label}** येथे घेऊन जाऊ शकतो.\n${primaryDef.shortDescription}`,
        en: `I can navigate you to **${primaryDef.label}**.\n${primaryDef.shortDescription}`
      }[language] || `I can navigate you to **${primaryDef.label}**.\n${primaryDef.shortDescription}`)
    : ({
        hi: `मुझे कोई सटीक पृष्ठ नहीं मिला। क्या आप **${primaryDef.label}** पर जाना चाहते हैं?`,
        mr: `मला अचूक पृष्ठ सापडले नाही. आपल्याला **${primaryDef.label}** येथे जायचे आहे का?`,
        en: `I couldn't find an exact match. Did you mean **${primaryDef.label}**?`
      }[language] || `I couldn't find an exact match. Did you mean **${primaryDef.label}**?`);

  const decision = {
    action: isStrongMatch ? "navigate" : "clarify",
    intent: isStrongMatch ? primaryDef.intent : "clarify_navigation",
    targetRole: role,
    routeKey: isStrongMatch ? primaryDef.routeKey : null,
    message: introMsg,
    confidence: isStrongMatch ? Math.min(0.95, Math.max(0.7, primary.score / 100)) : 0.35
  };

  return validateDecision(decision, role);
}

export default {
  handleGeminiNavigation,
  isMedicalAdviceQuery,
  applyMedicalSafetyGuardrail
};
