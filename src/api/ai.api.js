import {
  findRoutesByQuery,
  getRoutesForRole,
} from "../services/navigationRegistry";

/**
 * Client-Side AI Assistant API
 *
 * Calls the secure backend endpoint /api/ai/navigate.
 * Note: Contains ZERO API keys or credentials.
 */

export async function askAiAssistant({
  message,
  role = "public",
  currentPage = "/",
  currentSection = "General",
  language = "en",
}) {
  if (!message || typeof message !== "string") {
    throw new Error("Message is required.");
  }

  try {
    const response = await fetch("/api/ai/navigate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        role,
        currentPage,
        currentSection,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    if (data.success) {
      return {
        action: data.action,
        intent: data.intent,
        targetRole: data.targetRole,
        routeKey: data.routeKey,
        route: data.route,
        label: data.label,
        message: data.message || data.text,
        text: data.message || data.text,
        confidence: data.confidence,
        actions: data.actions || [],
      };
    }

    throw new Error(data.error || "Failed to resolve navigation decision.");
  } catch (networkError) {
    console.warn(
      "[ai.api.js] Backend /api/ai/navigate unreachable, using client fallback:",
      networkError.message,
    );
    return clientSideFallback(message, role, language);
  }
}

/**
 * Client-side fallback if server endpoint is temporarily unavailable
 */
function clientSideFallback(query, role, language) {
  const normRole = (role || "public").toLowerCase();

  // Safety check for medical advice / diagnosis queries in client fallback
  const isDocLookup =
    /(dawa parchi|parchi dikhao|purani parchi|view prescription|records|reports|ehr|lab report|blood report|discharge summary)/i.test(
      query,
    );
  const isMedQuery =
    !isDocLookup &&
    /(prescrib|diagnos|what disease|kya bimari|cure for|remedy|treatment|symptom|chest pain|fever for|difficulty breathing|paracetamol|crocin|azithromycin|amoxicillin|dosage|kitni goli|dawa batao|dawa suggest|dawai batao|ilaj batao)/i.test(
      query,
    );

  if (isMedQuery) {
    const safetyDisclaimer =
      {
        hi: "SwasthyaSetu सहायक केवल ऐप नेविगेशन और सहायता के लिए है और चिकित्सकीय सलाह, निदान या दवा की सिफारिश नहीं कर सकता। कृपया डॉक्टर से परामर्श लें या नजदीकी स्वास्थ्य केंद्र जाएं।",
        mr: "SwasthyaSetu सहाय्यक केवळ ॲप नेव्हिगेशनसाठी आहे आणि वैद्यकीय सल्ला, निदान किंवा औषध देऊ शकत नाही. कृपया डॉक्टरांचा सल्ला घ्या किंवा जवळच्या आरोग्य केंद्राला भेट द्या.",
        en: "The SwasthyaSetu assistant is designed for navigating the platform and cannot provide medical advice, diagnoses, or prescriptions. Please consult a qualified doctor or visit a nearby healthcare facility.",
      }[language] ||
      "The SwasthyaSetu assistant is designed for navigating the platform and cannot provide medical advice, diagnoses, or prescriptions. Please consult a qualified doctor or visit a nearby healthcare facility.";

    const fallbackActions =
      normRole === "asha"
        ? [
            {
              label: "Create Hospital Referral",
              routeKey: "asha_new_referral",
              route: "/worker/referrals/new",
              isPrimary: true,
            },
            {
              label: "Scheduled Home Visits",
              routeKey: "asha_visits",
              route: "/worker/visits",
              isPrimary: false,
            },
          ]
        : [
            {
              label: "Book Doctor Appointment",
              routeKey: "patient_appointments",
              route: "/appointments",
              isPrimary: true,
            },
            {
              label: "Find Healthcare Facilities",
              routeKey: "patient_facilities",
              route: "/facilities",
              isPrimary: false,
            },
          ];

    return {
      action: "clarify",
      intent: "medical_safety_boundary_enforced",
      routeKey: null,
      route: null,
      message: safetyDisclaimer,
      text: safetyDisclaimer,
      actions: fallbackActions,
    };
  }

  const matched = findRoutesByQuery(query, role, 3);

  if (!matched || matched.length === 0) {
    const defaultText =
      {
        hi: "मुझे आपकी खोज से संबंधित कोई सीधा पृष्ठ नहीं मिला। आप नीचे दिए गए मुख्य पृष्ठों पर जा सकते हैं:",
        mr: "मला तुमच्या विनंतीनुसार थेट पृष्ठ सापडले नाही. आपण खालील पर्यायांचा वापर करू शकता:",
        en: "I couldn't locate an exact page for that request. Here are relevant sections accessible for your role:",
      }[language] || "Here are relevant sections accessible for your role:";

    return {
      action: "clarify",
      intent: "no_direct_match",
      routeKey: null,
      route: null,
      message: defaultText,
      text: defaultText,
      actions: getRoutesForRole(role)
        .slice(0, 3)
        .map((r) => ({
          label: r.label,
          routeKey: r.routeKey,
          route: r.route,
          isPrimary: false,
        })),
    };
  }

  const primary = matched[0].routeDef;
  const introText =
    {
      hi: `मैंने आपके लिए **${primary.label}** खोजा है।\n\n${primary.shortDescription}`,
      mr: `मला आपल्यासाठी **${primary.label}** सापडले आहे.\n\n${primary.shortDescription}`,
      en: `I found **${primary.label}** for your request.\n\n${primary.shortDescription}`,
    }[language] ||
    `I found **${primary.label}** for your request.\n\n${primary.shortDescription}`;

  return {
    action: "navigate",
    intent: primary.intent,
    routeKey: primary.routeKey,
    route: primary.route,
    label: primary.label,
    message: introText,
    text: introText,
    actions: [
      {
        label: `Go to ${primary.label}`,
        routeKey: primary.routeKey,
        route: primary.route,
        isPrimary: true,
      },
      ...matched.slice(1).map((m) => ({
        label: m.routeDef.label,
        route: m.routeDef.route,
        isPrimary: false,
      })),
    ],
  };
}

export default {
  askAiAssistant,
};
