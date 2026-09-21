import { en } from "./src/locales/en.js";
import { hi } from "./src/locales/hi.js";
import { mr } from "./src/locales/mr.js";

function getKeys(obj, prefix = "") {
  let keys = [];
  for (const k of Object.keys(obj)) {
    const full = prefix ? prefix + "." + k : k;
    if (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getKeys(obj[k], full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

const enKeys = new Set(getKeys(en));
const hiKeys = new Set(getKeys(hi));
const mrKeys = new Set(getKeys(mr));

console.log("EN total keys:", enKeys.size);
console.log("HI total keys:", hiKeys.size);
console.log("MR total keys:", mrKeys.size);

const missingInHi = [...enKeys].filter((k) => !hiKeys.has(k));
const missingInMr = [...enKeys].filter((k) => !mrKeys.has(k));
const extraInHi = [...hiKeys].filter((k) => !enKeys.has(k));
const extraInMr = [...mrKeys].filter((k) => !enKeys.has(k));

console.log("Missing in HI:", missingInHi.length, missingInHi);
console.log("Missing in MR:", missingInMr.length, missingInMr);
console.log("Extra in HI:", extraInHi.length, extraInHi);
console.log("Extra in MR:", extraInMr.length, extraInMr);

if (missingInHi.length === 0 && missingInMr.length === 0 && extraInHi.length === 0 && extraInMr.length === 0) {
  console.log("SUCCESS: 100% Locale Parity Achieved!");
} else {
  console.error("FAILURE: Key mismatch detected");
  process.exit(1);
}
