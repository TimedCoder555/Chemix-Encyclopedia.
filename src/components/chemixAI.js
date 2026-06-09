// ═══════════════════════════════════════════════════════
// chemixAI.js — Chemix AI Brain (FIXED + CLEAN VERSION)
// ═══════════════════════════════════════════════════════

import { detectFormula } from "./chemixParser";
import { searchInternet } from "./internetSearch";

// ─────────────────────────────────────────────
// REGEX
// ─────────────────────────────────────────────
const GREETING_REGEX = /^(hi+|hello+|hey+|heyy+|hii+|helo+|heya|yo+|ayo|sup)\b/i;
const HOW_ARE_YOU_REGEX = /how (r|are) (u|you)|kemon acho|kaisa ho/i;
const NAME_REGEX = /who (are|r) you|your name|introduce yourself/i;
const THANKS_REGEX = /^(thanks|thank you|thx|ty|tysm)\b/i;
const BYE_REGEX = /^(bye|goodbye|cya|see ya|ttyl)\b/i;
const OK_REGEX = /^(ok|okay|k|kk|cool|nice|great|wow|fr|bet)$/i;
const HELP_REGEX = /help|how to use/i;
const FEATURE_REGEX = /features|what can you do/i;

// ─────────────────────────────────────────────
// CHEMISTRY CHECK
// ─────────────────────────────────────────────
const CHEMISTRY_KEYWORDS = [
  "h2o","co2","nacl","nh3","ch4","hcl","h2so4","naoh","h2o2",
  "hydrogen","oxygen","nitrogen","carbon","iron","gold",
  "atom","molecule","compound","bond","reaction","chemistry","acid","base","formula"
];

export const isChemistryQuestion = (text = "") => {
  const low = text
    .toLowerCase()
    .replace(/₂/g, "2")
    .replace(/₃/g, "3")
    .replace(/₄/g, "4")
    .replace(/₅/g, "5")
    .replace(/₆/g, "6")
    .replace(/₇/g, "7")
    .replace(/₈/g, "8")
    .replace(/₉/g, "9")
    .replace(/₀/g, "0");

  return CHEMISTRY_KEYWORDS.some(k => low.includes(k));
};

// ─────────────────────────────────────────────
// KB
// ─────────────────────────────────────────────
const KB = [
  { k:["h2o","water"], a:"💧 Water (H₂O) — Universal solvent, essential for life." },
  { k:["co2","carbon dioxide"], a:"🌿 CO₂ — Greenhouse gas used in photosynthesis." },
  { k:["nacl","salt"], a:"🧂 NaCl — Sodium + Chloride ionic compound." },
  { k:["iron","fe2o3","ferric oxide"], a:"🧲 Fe₂O₃ — Ferric oxide (rust compound)." },
];

// ─────────────────────────────────────────────
// KB MATCH
// ─────────────────────────────────────────────
export const getKBAnswer = (q = "") => {
  const text = q.toLowerCase();
  for (const item of KB) {
    if (item.k.some(k => text.includes(k))) {
      return item.a;
    }
  }
  return null;
};

// ─────────────────────────────────────────────
// GREETING
// ─────────────────────────────────────────────
export const getGreetingAnswer = (q = "") => {
  const t = q.toLowerCase();

  if (GREETING_REGEX.test(t))
    return "👋 Hey! I'm Chemix AI ⚗️ Ask me chemistry questions!";

  if (HOW_ARE_YOU_REGEX.test(t))
    return "😊 I'm good! Ready for chemistry!";

  if (NAME_REGEX.test(t))
    return "🧠 I'm Chemix AI — Chemistry assistant ⚗️";

  if (THANKS_REGEX.test(t))
    return "😊 You're welcome!";

  if (BYE_REGEX.test(t))
    return "👋 Bye!";

  if (OK_REGEX.test(t))
    return "😄 Cool!";

  if (HELP_REGEX.test(t))
    return "🆘 Ask me chemistry questions!";

  if (FEATURE_REGEX.test(t))
    return "⚗️ I can explain compounds, elements & reactions!";

  return null;
};

// ─────────────────────────────────────────────
// GREETING CHECK
// ─────────────────────────────────────────────
export const isGreeting = (q = "") => {
  const t = q.toLowerCase();
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

// ─────────────────────────────────────────────
// AI (SAFE VERSION)
// ─────────────────────────────────────────────
export const askClaudeWithSearch = async (question, compoundContext) => {
  

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        system: "You are Chemix AI. Keep answers short and chemistry focused.",
        messages: [{ role: "user", content: question }],
      }),
    });

    clearTimeout(timeout);

    const data = await res.json();

    return (data?.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("\n");

  } catch (e) {
    clearTimeout(timeout);
    return null;
  }
};

// ─────────────────────────────────────────────
// MAIN FUNCTION
// ─────────────────────────────────────────────
export const getChemixAIReply = async (question, compoundContext) => {
  const q = (question || "").trim();

  // 1. FAST GREETING ⚡
  const greet = getGreetingAnswer(q);
  if (greet) {
    return { text: greet, source: "greeting" };
  }

  // 2. FORMULA DETECTION ⚗️
  const formula = detectFormula(q);
  if (formula) {
    return {
      text: `🧪 Formula detected: ${formula}`,
      source: "formula",
    };
  }

  // 3. KB FAST ⚡
  const kb = getKBAnswer(q);
  if (kb) {
    return { text: kb, source: "kb" };
  }

  // 4. INTERNET SEARCH 🌐
  try {
    const web = await searchInternet(q);
    if (web) {
      return {
        text: `🌐 Internet:\n\n${web}`,
        source: "internet",
      };
    }
  } catch (e) {}

  // 5. AI fallback 🤖
  try {
    const ai = await askClaudeWithSearch(q, compoundContext);
    if (ai) return { text: ai, source: "ai" };
  } catch (e) {}

  // 6. FINAL fallback
  return {
    text:
      "🧪 Try simpler chemistry terms:\nH2O, NaCl, Fe2O3, CO2 ⚗️",
    source: "offline",
  };
};

// ─────────────────────────────────────────────
// INTERNET SEARCH MODULE (SAFE)
// ─────────────────────────────────────────────
export const searchInternet = async (query) => {
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`
    );

    const data = await res.json();

    return data?.AbstractText || data?.Definition || data?.Answer || null;
  } catch (e) {
    return null;
  }
};