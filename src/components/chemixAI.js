// ═══════════════════════════════════════════════════════
// chemixAI.js — Chemix AI Hybrid Engine (Vite + Production Ready)
// ═══════════════════════════════════════════════════════

import { detectFormula } from "./chemixParser";

// ─────────────────────────────────────────────
// 1. ATOMIC DATA & LOCAL CALCULATIONS
// ─────────────────────────────────────────────

const ATOMIC_WEIGHTS = {
  H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011,
  N: 14.007, O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305,
  Al: 26.982, Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, Ar: 39.948,
  K: 39.098, Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996,
  Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38,
  Ga: 69.723, Ge: 72.63, As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798,
  Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224, Nb: 92.906, Mo: 95.95,
  Tc: 98, Ru: 101.07, Rh: 102.91, Pd: 106.42, Ag: 107.87, Cd: 112.41,
  In: 114.82, Sn: 118.71, Sb: 121.76, Te: 127.60, I: 126.90, Xe: 131.29,
  Cs: 132.91, Ba: 137.33, La: 138.91, Ce: 140.12, Pr: 140.91, Nd: 144.24,
  Pm: 145, Sm: 150.36, Eu: 151.96, Gd: 157.25, Tb: 158.93, Dy: 162.50,
  Ho: 164.93, Er: 167.26, Tm: 168.93, Yb: 173.05, Lu: 174.97, Hf: 178.49,
  Ta: 180.95, W: 183.84, Re: 186.21, Os: 190.23, Ir: 192.22, Pt: 195.08,
  Au: 196.97, Hg: 200.59, Tl: 204.38, Pb: 207.2, Bi: 208.98, Po: 209,
  At: 210, Rn: 222, Fr: 223, Ra: 226, Ac: 227, Th: 232.04, Pa: 231.04, U: 238.03
};

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
 * Parses chemical formulas containing elements, subscripts, and nested parentheses.
 * e.g., "Al2(SO4)3" -> { Al: 2, S: 3, O: 12 }
 */
const parseFormulaCounts = (formulaStr = "") => {
  try {
    const clean = normalizeSubscripts(formulaStr.trim()).replace(/\s+/g, "");
    if (!clean) return null;

    const stack = [{}];
    const regex = /([A-Z][a-z]*)(\d*)|(\()|(\))(\d*)/g;
    let match;
    let totalMatchedLength = 0;

    while ((match = regex.exec(clean)) !== null) {
      totalMatchedLength += match[0].length;
      const [, element, countStr, openParen, closeParen, groupCountStr] = match;

      if (element) {
        if (!ATOMIC_WEIGHTS[element]) return null;
        const count = countStr ? parseInt(countStr, 10) : 1;
        const top = stack[stack.length - 1];
        top[element] = (top[element] || 0) + count;
      } else if (openParen) {
        stack.push({});
      } else if (closeParen) {
        if (stack.length <= 1) return null;
        const groupCount = groupCountStr ? parseInt(groupCountStr, 10) : 1;
        const poppedGroup = stack.pop();
        const top = stack[stack.length - 1];

        for (const [el, count] of Object.entries(poppedGroup)) {
          top[el] = (top[el] || 0) + count * groupCount;
        }
      }
    }

    if (totalMatchedLength !== clean.length || stack.length !== 1) return null;
    const result = stack[0];
    return Object.keys(result).length > 0 ? result : null;
  } catch (e) {
    return null;
  }
};

/**
 * Calculates exact molar mass and element breakdown locally.
 */
const calculateMolarMass = (formulaStr = "") => {
  const counts = parseFormulaCounts(formulaStr);
  if (!counts) return null;

  let totalWeight = 0;
  const steps = [];

  for (const [element, count] of Object.entries(counts)) {
    const unitWeight = ATOMIC_WEIGHTS[element];
    if (!unitWeight) return null;
    const subtotal = unitWeight * count;
    totalWeight += subtotal;
    steps.push({ element, count, unitWeight, subtotal });
  }

  return {
    totalWeight: parseFloat(totalWeight.toFixed(3)),
    steps,
    counts
  };
};

// ─────────────────────────────────────────────
// 2. RESPONSE FORMATTERS
// ─────────────────────────────────────────────

const formatMolarMassResponse = (formulaStr, calcResult) => {
  const { totalWeight, steps } = calcResult;
  let response = `🧪 **Molar Mass Calculation for ${formulaStr}**\n\n`;
  response += `**Given**\nChemical Formula: \`${formulaStr}\`\n\n`;
  response += `**Element Breakdown**\n`;

  steps.forEach(({ element, count, unitWeight, subtotal }) => {
    response += `• ${element}: ${unitWeight} g/mol × ${count} = ${subtotal.toFixed(3)} g/mol\n`;
  });

  response += `\n**Answer**\nTotal Molar Mass ($M$) = **${totalWeight} g/mol**`;
  return response;
};

const formatMassToMolesResponse = (massGrams, formulaStr, calcResult) => {
  const { totalWeight } = calcResult;
  const moles = massGrams / totalWeight;
  const formattedMoles = moles < 0.0001 ? moles.toExponential(4) : moles.toFixed(4);

  return `🧪 **Mass to Moles Calculation**\n\n` +
    `**Given**\n` +
    `• Mass ($m$) = ${massGrams} g\n` +
    `• Formula = \`${formulaStr}\` (Molar Mass $M$ = ${totalWeight} g/mol)\n\n` +
    `**Formula**\n` +
    `$$n = \\frac{m}{M}$$\n\n` +
    `**Working**\n` +
    `$$n = \\frac{${massGrams}\\text{ g}}{${totalWeight}\\text{ g/mol}} = ${formattedMoles}\\text{ mol}$$\n\n` +
    `**Answer**\n` +
    `Amount of substance ($n$) = **${formattedMoles} mol** of ${formulaStr}`;
};

const formatMolesToMassResponse = (moles, formulaStr, calcResult) => {
  const { totalWeight } = calcResult;
  const massGrams = moles * totalWeight;
  const formattedMass = massGrams.toFixed(3);

  return `🧪 **Moles to Mass Calculation**\n\n` +
    `**Given**\n` +
    `• Amount ($n$) = ${moles} mol\n` +
    `• Formula = \`${formulaStr}\` (Molar Mass $M$ = ${totalWeight} g/mol)\n\n` +
    `**Formula**\n` +
    `$$m = n \\times M$$\n\n` +
    `**Working**\n` +
    `$$m = ${moles}\\text{ mol} \\times ${totalWeight}\\text{ g/mol} = ${formattedMass}\\text{ g}$$\n\n` +
    `**Answer**\n` +
    `Mass ($m$) = **${formattedMass} g** of ${formulaStr}`;
};

const formatPercentCompositionResponse = (formulaStr, calcResult) => {
  const { totalWeight, steps } = calcResult;
  let response = `🧪 **Percentage Composition for ${formulaStr}**\n\n`;
  response += `**Given**\nTotal Molar Mass = ${totalWeight} g/mol\n\n`;
  response += `**Working**\n`;

  steps.forEach(({ element, subtotal }) => {
    const percentage = ((subtotal / totalWeight) * 100).toFixed(2);
    response += `• ${element}: \\frac{${subtotal.toFixed(3)}}{${totalWeight}} \\times 100\\% = **${percentage}%**\n`;
  });

  return response;
};

// ─────────────────────────────────────────────
// 3. REGEX PATTERNS & KEYWORDS
// ─────────────────────────────────────────────

const GREETING_REGEX = /^(hi+|hello+|hey+|heyy+|hii+|yo+|ayo|sup)\b/i;
const HOW_ARE_YOU_REGEX = /how (r|are) (u|you)|kemon acho|kaisa ho/i;
const NAME_REGEX = /who (are|r) you|your name|introduce yourself|tmr nam ki/i;
const THANKS_REGEX = /^(thanks|thank you|thx|ty|tysm|dhonnobad)\b/i;
const BYE_REGEX = /^(bye|goodbye|cya|see ya|ttyl|allah hafiz)\b/i;
const OK_REGEX = /^(ok|okay|k|kk|cool|nice|great|wow|fr|bet|thik ache)$/i;
const HELP_REGEX = /help|how to use|sahajjo|kemne chalam/i;
const FEATURE_REGEX = /features|what can you do|ki korte paro/i;

const MOLAR_MASS_PATTERNS = /molar mass|molecular weight|molecular mass|gram molecular|molar ভর|mass koto|ভর কত/i;
const PERCENT_COMP_PATTERNS = /percent|percentage|composition|percent composition|কত শতাংশ/i;

const MASS_TO_MOLES_REGEX = /(\d+(\.\d+)?)\s*(g|grams?)\s*(of)?\s*([A-Za-z0-9()]+)/i;
const MOLES_TO_MASS_REGEX = /(\d+(\.\d+)?)\s*(moles?|mol)\s*(of)?\s*([A-Za-z0-9()]+)/i;

const CHEMISTRY_KEYWORDS = [
  "h2o","co2","nacl","nh3","ch4","hcl","h2so4","naoh","h2o2","caco3",
  "hydrogen","oxygen","nitrogen","carbon","iron","gold","sodium","chlorine",
  "atom","molecule","compound","bond","reaction","chemistry","molar",
  "acid","base","formula","fe2o3","ferric oxide","ph","valence","valency",
  "oxidation","reduction","solubility","solution","cation","anion","ion",
  "mole","stoichiometry","periodic table","element","isotope","electronegativity"
];

// ─────────────────────────────────────────────
// 4. PUBLIC UTILITY EXPORTS (Preserved API)
// ─────────────────────────────────────────────

export const isChemistryQuestion = (text = "") => {
  if (!text || typeof text !== "string") return false;

  const low = normalizeSubscripts(text.toLowerCase());
  const hasKeyword = CHEMISTRY_KEYWORDS.some(k => low.includes(k));
  const detected = detectFormula(text);

  return hasKeyword || Boolean(detected);
};

export const isGreeting = (q = "") => {
  if (!q) return false;
  const t = q.toLowerCase().trim();

  return (
    GREETING_REGEX.test(t) ||
    HOW_ARE_YOU_REGEX.test(t) ||
    NAME_REGEX.test(t) ||
    THANKS_REGEX.test(t) ||
    BYE_REGEX.test(t) ||
    OK_REGEX.test(t) ||
    HELP_REGEX.test(t) ||
    FEATURE_REGEX.test(t)
  );
};

export const getGreetingAnswer = (q = "") => {
  if (!q) return null;
  const t = q.toLowerCase().trim();

  if (GREETING_REGEX.test(t))
    return "👋 Hey! I'm Chemix AI ⚗️ Ask me chemistry questions or enter chemical formulas!";

  if (HOW_ARE_YOU_REGEX.test(t))
    return "😊 I'm doing great! Ready to solve chemistry problems and explore compounds with you!";

  if (NAME_REGEX.test(t))
    return "🧠 I'm Chemix AI — Your intelligent chemistry assistant inside Chemix-Encyclopedia ⚗️";

  if (THANKS_REGEX.test(t))
    return "😊 You're very welcome! Let me know if you need help with any other compounds or reactions!";

  if (BYE_REGEX.test(t))
    return "👋 Goodbye! Keep exploring the world of chemistry!";

  if (OK_REGEX.test(t))
    return "😄 Awesome! What chemical formula or concept shall we examine next?";

  if (HELP_REGEX.test(t))
    return "🆘 **How to use Chemix AI:**\n" +
           "• Molar Mass: `molar mass of CaCO3` or `Al2(SO4)3 molar mass`\n" +
           "• Stoichiometry: `18g H2O` or `2 mol NaCl`\n" +
           "• Composition: `percentage composition of H2O`\n" +
           "• Concepts: `Why is NaCl ionic?` or `Is H2O polar?`\n" +
           "• Active Compound: Ask `what is its use?` when inspecting a compound!";

  if (FEATURE_REGEX.test(t))
    return "⚗️ **Features:**\n" +
           "• Local Deterministic Molar Mass & Stoichiometry Engine\n" +
           "• Formula Parsing with Parentheses & Subscripts\n" +
           "• Active View Context Resolution\n" +
           "• English & Banglish Conceptual Chemistry Reasoning";

  return null;
};

const KB = [
  { k: ["h2o", "water", "পানি"], a: "💧 **Water (H₂O)**\n• **Molar Mass:** 18.015 g/mol\n• **Type:** Polar covalent solvent\n• **Key Properties:** Universal solvent, high specific heat, forms hydrogen bonds." },
  { k: ["co2", "carbon dioxide"], a: "🌿 **Carbon Dioxide (CO₂)**\n• **Molar Mass:** 44.01 g/mol\n• **Type:** Linear non-polar gas\n• **Key Properties:** Respiration product, reactant in photosynthesis." },
  { k: ["nacl", "salt", "table salt", "লবণ"], a: "🧂 **Sodium Chloride (NaCl)**\n• **Molar Mass:** 58.44 g/mol\n• **Type:** Ionic crystal lattice (Na⁺ & Cl⁻)\n• **Key Properties:** Soluble in water, essential biological electrolyte." },
  { k: ["fe2o3", "ferric oxide", "rust", "মরিচা"], a: "🧲 **Ferric Oxide (Fe₂O₃)**\n• **Molar Mass:** 159.69 g/mol\n• **Type:** Inorganic iron oxide\n• **Key Properties:** Principal component of rust formed via iron oxidation." },
  { k: ["hcl", "hydrochloric acid"], a: "🧪 **Hydrochloric Acid (HCl)**\n• **Molar Mass:** 36.46 g/mol\n• **Type:** Strong mineral acid\n• **Key Properties:** Completely dissociates in water into H⁺ and Cl⁻." },
  { k: ["naoh", "sodium hydroxide", "caustic soda"], a: "🧼 **Sodium Hydroxide (NaOH)**\n• **Molar Mass:** 40.00 g/mol\n• **Type:** Strong base\n• **Key Properties:** Caustic, dissociates into Na⁺ and OH⁻ in aqueous solutions." },
  { k: ["ch4", "methane"], a: "🔥 **Methane (CH₄)**\n• **Molar Mass:** 16.04 g/mol\n• **Type:** Non-polar alkane hydrocarbon\n• **Key Properties:** Main constituent of natural gas." },
  { k: ["caco3", "calcium carbonate", "limestone"], a: "🪨 **Calcium Carbonate (CaCO₃)**\n• **Molar Mass:** 100.09 g/mol\n• **Type:** Insoluble carbonate salt\n• **Key Properties:** Primary component of limestone, marble, and eggshells." },
  { k: ["ph", "what is ph"], a: "📊 **pH Scale**\n• Definition: Logarithmic measure of hydrogen ion concentration ($pH = -\\log[H^+]$).\n• Range: Acidic (pH < 7), Neutral (pH = 7), Basic/Alkaline (pH > 7)." },
  { k: ["ionic bond", "ionic bonding"], a: "⚡ **Ionic Bond**\nElectrostatic force of attraction between oppositely charged ions (cation + anion) formed via electron transfer." },
  { k: ["covalent bond", "covalent bonding"], a: "🤝 **Covalent Bond**\nChemical linkage formed by the mutual sharing of electron pairs between non-metal atoms." }
];

export const getKBAnswer = (q = "") => {
  if (!q) return null;
  const text = q.toLowerCase().trim();

  for (const item of KB) {
    if (item.k.some(k => text.includes(k))) {
      return item.a;
    }
  }
  return null;
};

// ─────────────────────────────────────────────
// 5. EXTERNAL SEARCH & BACKEND AI INTEGRATION (Vite Env)
// ─────────────────────────────────────────────

export const searchInternet = async (query) => {
  if (!query || !query.trim()) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`,
      { signal: controller.signal }
    );

    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();

    return (
      data?.AbstractText ||
      data?.Answer ||
      data?.Definition ||
      null
    );
  } catch (e) {
    clearTimeout(timeout);
    return null;
  }
};

const formatCompoundContext = (context) => {
  if (!context) return null;
  if (typeof context === "string") return context;

  const parts = [];
  if (context.title || context.name) parts.push(`Name: ${context.title || context.name}`);
  if (context.molecularFormula || context.formula) parts.push(`Formula: ${context.molecularFormula || context.formula}`);
  if (context.molecularWeight || context.weight) parts.push(`Molar Mass: ${context.molecularWeight || context.weight} g/mol`);
  if (context.iupacName) parts.push(`IUPAC: ${context.iupacName}`);
  if (context.cid) parts.push(`PubChem CID: ${context.cid}`);

  return parts.length > 0 ? parts.join(" | ") : JSON.stringify(context);
};

export const askClaudeWithSearch = async (question, compoundContext) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  const formattedContext = formatCompoundContext(compoundContext);

  // Vite environment variable configuration for secure backend endpoint proxy
  const targetEndpoint = import.meta.env?.VITE_CHEMIX_AI_ENDPOINT;

  if (!targetEndpoint) {
    clearTimeout(timeout);
    return null;
  }

  try {
    const res = await fetch(targetEndpoint, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        context: formattedContext
      }),
    });

    clearTimeout(timeout);
    if (!res.ok) return null;

    const data = await res.json();
    return data?.text || data?.reply || null;

  } catch (e) {
    clearTimeout(timeout);
    return null;
  }
};

// ─────────────────────────────────────────────
// 6. MAIN ENGINE DISPATCHER
// ─────────────────────────────────────────────

export const getChemixAIReply = async (question = "", compoundContext = null) => {
  const q = (question || "").trim();

  // 1. Empty input
  if (!q) {
    return {
      text: "❓ Please ask a chemistry question or enter a chemical formula!",
      source: "empty"
    };
  }

  // 2. Greetings
  if (isGreeting(q)) {
    const greet = getGreetingAnswer(q);
    return { text: greet, source: "greeting" };
  }

  // Formula detection using chemixParser.js
  const validatedFormula = detectFormula(q);

  // 3. Mass to Moles Calculation
  const massMatch = q.match(MASS_TO_MOLES_REGEX);
  if (massMatch) {
    const massVal = parseFloat(massMatch[1]);
    const matchedToken = massMatch[5];
    const formula = detectFormula(matchedToken) || validatedFormula;

    if (formula && massVal > 0) {
      const calc = calculateMolarMass(formula);
      if (calc) {
        return {
          text: formatMassToMolesResponse(massVal, formula, calc),
          source: "stoichiometry_calc"
        };
      }
    }
  }

  // 4. Moles to Mass Calculation
  const molesMatch = q.match(MOLES_TO_MASS_REGEX);
  if (molesMatch) {
    const molesVal = parseFloat(molesMatch[1]);
    const matchedToken = molesMatch[5];
    const formula = detectFormula(matchedToken) || validatedFormula;

    if (formula && molesVal > 0) {
      const calc = calculateMolarMass(formula);
      if (calc) {
        return {
          text: formatMolesToMassResponse(molesVal, formula, calc),
          source: "stoichiometry_calc"
        };
      }
    }
  }

  // 5. Molar Mass Calculation
  const isMolarMassQuery = MOLAR_MASS_PATTERNS.test(q);
  if (isMolarMassQuery && validatedFormula) {
    const calc = calculateMolarMass(validatedFormula);
    if (calc) {
      return {
        text: formatMolarMassResponse(validatedFormula, calc),
        source: "molar_mass_calc"
      };
    }
  }

  // 6. Percentage Composition Calculation
  const isPercentComp = PERCENT_COMP_PATTERNS.test(q);
  if (isPercentComp && validatedFormula) {
    const calc = calculateMolarMass(validatedFormula);
    if (calc) {
      return {
        text: formatPercentCompositionResponse(validatedFormula, calc),
        source: "composition_calc"
      };
    }
  }

  // 7. Pure Formula Query
  if (validatedFormula && q.replace(validatedFormula, "").trim().length < 3) {
    const calc = calculateMolarMass(validatedFormula);
    if (calc) {
      return {
        text: `🧪 **Chemical Formula Detected:** \`${validatedFormula}\`\n• **Molar Mass:** ${calc.totalWeight} g/mol\n\nYou can ask about its bonding, reactions, or usage!`,
        source: "formula_calc"
      };
    }
  }

  // 8. Active Compound Context Resolution
  const formattedContext = formatCompoundContext(compoundContext);
  const isContextQuery = /this compound|its use|used for|eta ki|eta keno|is it acidic|tell me about this/i.test(q);
  if (formattedContext && isContextQuery) {
    return {
      text: `🧪 **Active Compound Context:**\n${formattedContext}\n\nYou can ask specific questions about its chemical properties or usage!`,
      source: "app_context"
    };
  }

  // 9. Fast Local Knowledge Base Search
  const kbAnswer = getKBAnswer(q);
  if (kbAnswer) {
    return { text: kbAnswer, source: "kb" };
  }

  // 10. AI Backend Proxy Fallback
  const aiReply = await askClaudeWithSearch(q, compoundContext);
  if (aiReply) {
    return { text: aiReply, source: "ai" };
  }

  // 11. Internet Search Fallback
  const searchResult = await searchInternet(q);
  if (searchResult) {
    return { text: `🌐 **Search Information:**\n${searchResult}`, source: "search" };
  }

  // 12. Safe Default Chemistry Response
  return {
    text: "🔍 I couldn't resolve a precise answer. Try entering a chemical formula (e.g., `CaCO3`, `Al2(SO4)3`), asking for a molar mass, or inquiring about a specific concept like 'pH' or 'Ionic Bond'.",
    source: "default"
  };
};
