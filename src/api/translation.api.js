/**
 * Translation Service Abstraction Layer
 *
 * Current Phase: Local / Mock Prototype
 * Future Phase: Connected to backend API gateway -> Google Cloud Translation API
 *
 * Architecture Rule:
 * UI components must ONLY interface with this service abstraction (or via useLanguage/useDynamicTranslation hook).
 * They should have zero knowledge of whether the translation was resolved locally, via mock data, or from the cloud.
 */

// Representative mock dictionary for dynamic medical/clinical payload strings
const MOCK_DYNAMIC_TRANSLATIONS = {
  hi: {
    // Clinical diagnoses & findings
    "Hypertension Stage 1": "उच्च रक्तचाप (हाइपरटेंशन) स्टेज 1",
    "Type 2 Diabetes Mellitus": "टाइप 2 मधुमेह (डायबिटीज)",
    "Acute Respiratory Infection": "तीव्र श्वसन संक्रमण (श्वसन नली संक्रमण)",
    "Normal Fetal Heart Rate": "सामान्य भ्रूण हृदय गति (142 bpm)",
    "High Risk Pregnancy - Severe Anemia": "उच्च जोखिम गर्भावस्था - गंभीर रक्ताल्पता (एनीमिया)",
    "Routine prenatal checkup": "नियमित प्रसवपूर्व जांच (एएनसी)",
    "Post-natal recovery check": "प्रसवोत्तर स्वास्थ्य एवं सुधार जांच",
    "Stable vital signs": "शारीरिक महत्वपूर्ण लक्षण स्थिर",
    "Fasting Blood Glucose: 98 mg/dL": "खाली पेट रक्त शर्करा: 98 mg/dL (सामान्य)",
    "Routine Blood Pressure Assessment": "नियमित रक्तचाप परीक्षण",
    "Low sodium diet and regular morning walk advised": "कम नमक वाला आहार और नियमित सुबह की सैर की सलाह",
    "Prescription Renewed (30 Days)": "दीर्घकालिक दवा पर्ची नवीनीकृत (30 दिन)",

    // Status & urgency descriptors
    "Urgent referral recommended": "अति आवश्यक रेफरल की सिफारिश की गई",
    "Routine checkup scheduled": "नियमित जांच निर्धारित",
    "Discharged with medication": "दवाओं के साथ छुट्टी दी गई",
    "Follow-up required in 7 days": "7 दिनों में फॉलो-अप आवश्यक"
  },
  mr: {
    // Clinical diagnoses & findings
    "Hypertension Stage 1": "उच्च रक्तदाब (हायपरटेंशन) स्टेज 1",
    "Type 2 Diabetes Mellitus": "टाइप 2 मधुमेह (डायबिटीज)",
    "Acute Respiratory Infection": "तीव्र श्वसन संसर्ग",
    "Normal Fetal Heart Rate": "सामान्य भ्रूण हृदय गती (142 bpm)",
    "High Risk Pregnancy - Severe Anemia": "उच्च जोखीम गर्भधारणा - तीव्र ॲनिमिया (रक्तक्षय)",
    "Routine prenatal checkup": "नियमित प्रसूतीपूर्व तपासणी (ANC)",
    "Post-natal recovery check": "प्रसूतीनंतरची आरोग्य तपासणी",
    "Stable vital signs": "शारीरिक मापदंड स्थिर",
    "Fasting Blood Glucose: 98 mg/dL": "उपाशीपोटी रक्त शर्करा: 98 mg/dL (सामान्य)",
    "Routine Blood Pressure Assessment": "नियमित रक्तदाब तपासणी",
    "Low sodium diet and regular morning walk advised": "कमी मिठाचा आहार आणि दररोज सकाळी चालण्याचा सल्ला",
    "Prescription Renewed (30 Days)": "औषधोपचार चिठ्ठी नूतनीकरण (30 दिवस)",

    // Status & urgency descriptors
    "Urgent referral recommended": "तातडीच्या रेफरलची शिफारस",
    "Routine checkup scheduled": "नियमित तपासणी नियोजित",
    "Discharged with medication": "औषधांसह डिस्चार्ज दिला",
    "Follow-up required in 7 days": "7 दिवसांत फॉलो-अप आवश्यक"
  }
};

// Client-side in-memory translation cache to avoid redundant calls
const translationCache = new Map();

function getCacheKey(text, targetLang, sourceLang) {
  return `${sourceLang}->${targetLang}:${text}`;
}

/**
 * Translates a single dynamic string to the target language.
 *
 * @param {string} text - The dynamic text to translate.
 * @param {string} targetLanguage - Target language code ('en', 'hi', 'mr').
 * @param {string} [sourceLanguage='en'] - Source language code.
 * @returns {Promise<string>} The translated text (or original text as fallback).
 */
export async function translateText(text, targetLanguage = "en", sourceLanguage = "en") {
  if (!text || typeof text !== "string") {
    return text || "";
  }

  // If target matches source or is default English, return immediately
  if (targetLanguage === sourceLanguage || targetLanguage === "en") {
    return text;
  }

  const cacheKey = getCacheKey(text, targetLanguage, sourceLanguage);
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  /**
   * =========================================================================
   * CURRENT MOCK IMPLEMENTATION:
   * Simulates an async service response and resolves via mock dictionary.
   *
   * FUTURE BACKEND / GOOGLE CLOUD INTEGRATION:
   * Replace the block below with:
   *
   * const response = await fetch('/api/v1/translate', {
   *   method: 'POST',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify({ text, targetLanguage, sourceLanguage })
   * });
   * const data = await response.json();
   * const translated = data.translatedText || text;
   * =========================================================================
   */
  await new Promise((resolve) => setTimeout(resolve, 30));

  const langDict = MOCK_DYNAMIC_TRANSLATIONS[targetLanguage];
  const translated = langDict?.[text] || text;

  // Cache result for future lookups
  translationCache.set(cacheKey, translated);

  return translated;
}

/**
 * Translates an array of dynamic strings in a single batch request.
 *
 * @param {string[]} texts - Array of strings to translate.
 * @param {string} targetLanguage - Target language code.
 * @param {string} [sourceLanguage='en'] - Source language code.
 * @returns {Promise<string[]>} Array of translated strings.
 */
export async function translateBatch(texts = [], targetLanguage = "en", sourceLanguage = "en") {
  if (!Array.isArray(texts) || texts.length === 0) {
    return [];
  }

  if (targetLanguage === sourceLanguage || targetLanguage === "en") {
    return texts;
  }

  return Promise.all(
    texts.map((item) => translateText(item, targetLanguage, sourceLanguage))
  );
}

/**
 * Clears the in-memory translation cache (useful for testing or logout).
 */
export function clearTranslationCache() {
  translationCache.clear();
}
