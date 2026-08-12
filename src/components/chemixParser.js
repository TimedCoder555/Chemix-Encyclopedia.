// ═══════════════════════════════════════════════════════
// chemixParser.js — Validated Chemical Formula Parser
// ═══════════════════════════════════════════════════════

// Official periodic table element symbols for validation
const VALID_ELEMENTS = new Set([
  "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg",
  "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr",
  "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr",
  "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd",
  "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd",
  "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf",
  "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po",
  "At", "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U"
]);

// Non-formula English and Banglish words to prevent false positives
const COMMON_NON_FORMULA_WORDS = new Set([
  "WHAT", "WHY", "HOW", "CAN", "PLEASE", "IS", "IT", "ARE", "IN", "OF", "TO", "FOR",
  "THIS", "THAT", "THE", "THEY", "YOU", "ME", "WE", "MY", "HER", "HIS", "HAVE", "HAS",
  "EXPLAIN", "CALCULATE", "FIND", "TELL", "WHO", "WHEN", "WHERE", "WHICH", "AND", "OR",
  "KETO", "KOTO", "KENO", "KOR", "KI", "KORBE", "BANGLISH", "HELP", "ACID", "BASE",
  "ABOUT", "USED", "USE", "POLAR", "IONIC", "BOND", "STATE", "WATER", "SALT", "RUST"
]);

/**
 * Normalizes Unicode subscript characters (₀-₉) to ASCII digits.
 */
export const normalizeSubscripts = (str = "") => {
  return str
    .replace(/₀/g, "0")
    .replace(/₁/g, "1")
    .replace(/₂/g, "2")
    .replace(/₃/g, "3")
    .replace(/₄/g, "4")
    .replace(/₅/g, "5")
    .replace(/₆/g, "6")
    .replace(/₇/g, "7")
    .replace(/₈/g, "8")
    .replace(/₉/g, "9");
};

/**
 * Smart contextual normalization for typos like "Co2", "co2", "h2o", "caco3".
 * Fixes lowercase or incorrect-case common typos without breaking valid elements like "CoCl2".
 */
export const normalizeFormulaTokenCase = (token = "") => {
  if (!token) return "";
  let clean = normalizeSubscripts(token.trim());

  // If already valid as-is, keep original case (e.g. CoCl2, CO2)
  if (validateChemicalFormula(clean)) return clean;

  // Case 1: "co2" / "caco3" / "h2o" / "nacl" / "fe2o3" -> capitalized element symbols
  const autoCapitalized = clean.replace(/([a-z])([a-z]?)/gi, (m, p1, p2) => {
    const symbol = p1.toUpperCase() + (p2 ? p2.toLowerCase() : "");
    if (VALID_ELEMENTS.has(symbol)) return symbol;
    return p1.toUpperCase() + (p2 ? p2.toUpperCase() : "");
  });

  if (validateChemicalFormula(autoCapitalized)) {
    return autoCapitalized;
  }

  // Case 2: "Co2" -> If followed by a digit and not another element, user almost certainly meant "CO2"
  if (/^Co\d+/i.test(clean) && !validateChemicalFormula(clean)) {
    const fixedCo = clean.replace(/^Co/i, "CO");
    if (validateChemicalFormula(fixedCo)) return fixedCo;
  }

  return clean;
};

/**
 * Strictly validates whether a string represents a valid chemical formula.
 */
export const validateChemicalFormula = (formulaStr = "") => {
  if (!formulaStr) return false;
  const clean = normalizeSubscripts(formulaStr.trim()).replace(/[.,?!:;]/g, "");
  if (!clean || COMMON_NON_FORMULA_WORDS.has(clean.toUpperCase())) return false;

  const elementRegex = /([A-Z][a-z]*)(\d*)|(\()|(\))(\d*)/g;
  let match;
  let matchedLength = 0;
  let elementCount = 0;
  let parenDepth = 0;

  while ((match = elementRegex.exec(clean)) !== null) {
    matchedLength += match[0].length;
    
    if (match[1]) {
      if (!VALID_ELEMENTS.has(match[1])) return false;
      elementCount++;
    } else if (match[3]) {
      parenDepth++;
    } else if (match[4]) {
      parenDepth--;
      if (parenDepth < 0) return false;
    }
  }

  return matchedLength === clean.length && elementCount > 0 && parenDepth === 0;
};

/**
 * Detects and extracts valid chemical formulas from a natural language string.
 * Preserves export contract.
 */
export const detectFormula = (text = "") => {
  if (!text || typeof text !== "string") return null;

  const normalized = normalizeSubscripts(text);
  
  // Clean punctuation attached to candidate words
  const words = normalized.split(/\s+/).map(w => w.replace(/^[^\w()]+|[^\w()]+$/g, ""));
  const validFound = [];

  for (const word of words) {
    if (!word) continue;
    
    // Check original case
    if (validateChemicalFormula(word)) {
      validFound.push(word);
      continue;
    }

    // Try contextual case normalization
    const fixedToken = normalizeFormulaTokenCase(word);
    if (fixedToken !== word && validateChemicalFormula(fixedToken)) {
      validFound.push(fixedToken);
    }
  }

  return validFound.length > 0 ? validFound.join(" ") : null;
};

/**
 * Checks if a question is chemistry-related based on formula or chemistry terms.
 * Preserves export contract.
 */
export const isFormulaQuestion = (text = "") => {
  if (!text || typeof text !== "string") return false;
  const t = text.toLowerCase();
  
  return (
    Boolean(detectFormula(text)) ||
    /[a-z][0-9]/i.test(text) ||
    t.includes("formula") ||
    t.includes("compound") ||
    t.includes("chemical") ||
    t.includes("reaction") ||
    t.includes("bond")
  );
};
