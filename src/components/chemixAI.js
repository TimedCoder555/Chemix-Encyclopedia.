// ═══════════════════════════════════════════════════════
// chemixAI.js  —  Chemix AI Brain (FIXED VERSION)
// ═══════════════════════════════════════════════════════

// ── Regex ───────────────────────────────────────────────
const GREETING_REGEX = /^(hi+|hello+|hey+|heyy+|hii+|helo+|heya|howdy|sup|yo+|ayo|wassup|wsp|hola|namaste|salam|hiii+|hewwo|hewwoo)\b/i;

const HOW_ARE_YOU_REGEX = /how (r|are) (u|you)|hows it|how's it|u ok|you ok|kemon acho|kemon|kaisa ho/i;

const NAME_REGEX = /\b(ur|your|whats|what's|what is|wats|whts|wts)\s+(ur|your)?\s*(name|nam|naem|nme)\b|\bwho\s+r\s+u\b|\bwho\s+are\s+you\b|\bintroduce\s+(ur|your)self\b|\btell\s+me\s+about\s+(ur|your)self\b/i;

const THANKS_REGEX = /^(thanks|thank you|thx|ty|tysm|thank u|thnx|thanku)\b/i;

const BYE_REGEX = /^(bye|goodbye|bb|cya|see ya|see you|later|ttyl|gtg)\b/i;

const CREATOR_REGEX = /who (made|built|created|coded|developed) (you|u|this)/i;

const HELP_REGEX = /^(help|help me|how to use|tutorial)\b/i;

const FEATURE_REGEX = /what (can you|u can|do you|features)/i;

const OK_REGEX = /^(ok|okay|k|kk|cool|nice|great|awesome|wow|fr|bet)$/i;

// ── Chemistry keywords ────────────────────────────────
const CHEMISTRY_KEYWORDS = [
  "h2o","co2","nacl","nh3","ch4","hcl","h2so4","naoh","h2o2",
  "hydrogen","oxygen","nitrogen","carbon","iron","gold","silver",
  "atom","molecule","compound","bond","periodic table","ph",
  "reaction","chemistry","acid","base"
];

// ── Chemistry detector ────────────────────────────────
export const isChemistryQuestion = (text = "") => {
  const low = text.toLowerCase();
  return CHEMISTRY_KEYWORDS.some(k => low.includes(k));
};

// ── KB ────────────────────────────────────────────────
const KB = [
  { k:["h2o","water"], a:"💧 Water (H₂O) — Universal solvent, bent shape, essential for life." },
  { k:["co2","carbon dioxide"], a:"🌿 CO₂ — Greenhouse gas, used in photosynthesis." },
  { k:["n2","nitrogen"], a:"🔵 Nitrogen (N₂) — 78% of air, very stable triple bond." },
  { k:["o2","oxygen"], a:"🔴 Oxygen (O₂) — Needed for respiration." },
  { k:["nacl","salt"], a:"🧂 NaCl — Ionic compound of sodium + chloride." },
];

// ── KB match ─────────────────────────────────────────
export const getKBAnswer = (q = "") => {
  const text = q.toLowerCase();

  for (const item of KB) {
    if (item.k.some(k => text.includes(k))) {
      return item.a;
    }
  }
  return null;
};

// ── Greeting ─────────────────────────────────────────
export const getGreetingAnswer = (q = "") => {
  const text = q.toLowerCase();

  if (GREETING_REGEX.test(text))
    return "👋 Hey! I'm Chemix AI ⚗️ Ask me chemistry questions!";

  if (HOW_ARE_YOU_REGEX.test(text))
    return "😊 I'm good! Ready for chemistry!";

  if (NAME_REGEX.test(text))
    return "🧠 I'm Chemix AI — Chemistry assistant ⚗️";

  if (CREATOR_REGEX.test(text))
    return "👨‍💻 Made by TimedCoder555";

  if (THANKS_REGEX.test(text))
    return "😊 You're welcome!";

  if (BYE_REGEX.test(text))
    return "👋 Bye!";

  if (OK_REGEX.test(text))
    return "😄 Cool!";

  if (HELP_REGEX.test(text))
    return "🆘 Ask me chemistry questions!";

  if (FEATURE_REGEX.test(text))
    return "⚗️ Chemistry AI features: elements, compounds, reactions";

  return null;
};

// ── Greeting checker ────────────────────────────────
export const isGreeting = (q = "") => {
  const text = q.toLowerCase();
  return (
    GREETING_REGEX.test(text) ||
    HOW_ARE_YOU_REGEX.test(text) ||
    NAME_REGEX.test(text) ||
    CREATOR_REGEX.test(text) ||
    THANKS_REGEX.test(text) ||
    BYE_REGEX.test(text) ||
    OK_REGEX.test(text) ||
    HELP_REGEX.test(text) ||
    FEATURE_REGEX.test(text)
  );
};

// ── Claude API ───────────────────────────────────────
export const askClaudeWithSearch = async (question, compoundContext) => {

  if (!isChemistryQuestion(question)) {
    throw new Error("Not chemistry");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        system: `You are Chemix AI (chemistry assistant). Keep answers short.`,
        messages: [{ role: "user", content: question }],
      }),
    });

    clearTimeout(timeout);

    const data = await res.json();

    const text = (data?.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("\n");

    return text || null;

  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
};

// ── MAIN FUNCTION ────────────────────────────────────
export const getChemixAIReply = async (question, compoundContext) => {
  const q = (question || "").trim();

  // 1. Greeting (FAST)
  if (isGreeting(q)) {
    return { text: getGreetingAnswer(q), source: "greeting" };
  }

  // 2. KB (FAST)
  const kb = getKBAnswer(q);
  if (kb) {
    return { text: kb, source: "kb" };
  }

  // 3. Not chemistry
  if (!isChemistryQuestion(q)) {
    return {
      text: "🧪 I'm a chemistry-focused AI! Ask chemistry questions only.",
      source: "offline"
    };
  }

  // 4. AI
  try {
    const reply = await askClaudeWithSearch(q, compoundContext);
    if (reply) return { text: reply, source: "claude" };
  } catch (e) {}

  // 5. fallback
  return {
    text: "🔬 Try asking about H₂O, CO₂, NaCl, pH, atoms ⚗️",
    source: "offline"
  };
};