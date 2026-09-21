import { en } from "./en";
import { hi } from "./hi";
import { mr } from "./mr";

export const SUPPORTED_LANGUAGES = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    flag: "EN"
  },
  {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    flag: "HI"
  },
  {
    code: "mr",
    label: "Marathi",
    nativeLabel: "मराठी",
    flag: "MR"
  }
];

export const translations = {
  en,
  hi,
  mr
};

export const DEFAULT_LANGUAGE = "en";
