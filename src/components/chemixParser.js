// ═══════════════════════════════════════════════════════
// chemixParser.js — Reliable Chemical Formula Parser
// ═══════════════════════════════════════════════════════

// বৈধ পর্যায় সারণীর উপাদানসমূহ (False Positive রোখার জন্য)
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

// সাধারণ শব্দ যা রাসায়নিক সংকেত নয়
const COMMON_NON_FORMULA_WORDS = new Set([
  "WHAT", "WHY", "HOW", "CAN", "PLEASE", "IS", "IT", "ARE", "IN", "OF", "TO", "FOR",
  "THIS", "THAT", "THE", "THEY", "YOU", "ME", "WE", "MY", "HER", "HIS", "HAVE", "HAS",
  "EXPLAIN", "CALCULATE", "FIND", "TELL", "WHO", "WHEN", "WHERE", "WHICH", "AND", "OR",
  "KETO", "KOTO", "KENO", "KOR", "KI", "KORBE", "BANGLISH", "HELP", "ACID", "BASE"
]);

/**
 * Unicode Subscript (₂ ₃ ₄) কে সাধারণ সংখ্যায় পরিবর্তন করে
 */
const normalizeSubscripts = (str = "") => {
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
 * একটি টোকেন বা শব্দ রাসায়নিক সংকেত কি না তা ভ্যালিডেট করে
 */
const isValidChemicalFormulaToken = (token = "") => {
  if (!token) return false;
  const clean = normalizeSubscripts(token.trim()).replace(/[.,?!]/g, "");
  if (!clean || COMMON_NON_FORMULA_WORDS.has(clean.toUpperCase())) return false;

  // ব্র্যাকেটযুক্ত বা ব্র্যাকেট ছাড়া এলিমেন্ট ফিল্টার
  const elementRegex = /([A-Z][a-z]*)(\d*)|(\()|(\))(\d*)/g;
  let match;
  let matchedLength = 0;
  let elementCount = 0;

  while ((match = elementRegex.exec(clean)) !== null) {
    matchedLength += match[0].length;
    if (match[1]) {
      if (!VALID_ELEMENTS.has(match[1])) return false;
      elementCount++;
    }
  }

  return matchedLength === clean.length && elementCount > 0;
};

/**
 * ইনপুট টেক্সট থেকে প্রকৃত রাসায়নিক সংকেত খুঁজে বের করে (Preserved API Export)
 */
export const detectFormula = (text = "") => {
  if (!text || typeof text !== "string") return null;

  const normalized = normalizeSubscripts(text);
  // ব্র্যাকেট এবং এলিমেন্ট সংকেতযুক্ত প্যাটার্ন
  const candidatePattern = /\b([A-Z][a-z]?\d*)+|\b([A-Z][a-z]?\d*)*\(([A-Z][a-z]?\d*)+\)\d*/g;
  const matches = normalized.match(candidatePattern);

  if (!matches) return null;

  const validFormulas = matches.filter(isValidChemicalFormulaToken);
  return validFormulas.length > 0 ? validFormulas.join(" ") : null;
};

/**
 * প্রশ্নটিতে কোনো সংকেত বা কেমিস্ট্রি সম্পর্কিত বিষয় আছে কিনা যাচাই করে (Preserved API Export)
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
