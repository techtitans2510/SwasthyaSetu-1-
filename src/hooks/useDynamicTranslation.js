import { useState, useEffect, useCallback } from "react";
import useLanguage from "./useLanguage";
import { translateText, translateBatch } from "../api/translation.api";

/**
 * Custom hook for translating dynamic, runtime-generated text.
 *
 * @param {string} [initialText] - Optional dynamic string to translate automatically.
 * @returns {Object} { translatedText, isTranslating, translate, translateMultiple }
 */
export function useDynamicTranslation(initialText = "") {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(initialText);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!initialText) {
      setTranslatedText("");
      return;
    }

    setIsTranslating(true);
    translateText(initialText, language)
      .then((res) => {
        if (isMounted) {
          setTranslatedText(res);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTranslatedText(initialText);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsTranslating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialText, language]);

  const translate = useCallback(
    async (text, customTargetLang) => {
      const target = customTargetLang || language;
      return translateText(text, target);
    },
    [language]
  );

  const translateMultiple = useCallback(
    async (texts, customTargetLang) => {
      const target = customTargetLang || language;
      return translateBatch(texts, target);
    },
    [language]
  );

  return {
    translatedText,
    isTranslating,
    translate,
    translateMultiple,
    currentLanguage: language
  };
}

export default useDynamicTranslation;
