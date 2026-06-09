// ═══════════════════════════════════════════════════════
// chemixAI.js  —  Chemix AI Brain
// Place this file in:  src/components/chemixAI.js
// ═══════════════════════════════════════════════════════

// ── Gen-Z / greeting pattern detector ──────────────────
const GREETING_REGEX = /^(hi+|hello+|hey+|heyy+|hii+|helo+|heya|howdy|sup|yo+|ayo|wassup|wsp|hola|namaste|salam|hiii+|hewwo|hewwoo)\b/i;
const HOW_ARE_YOU_REGEX = /how (r|are) (u|you)|hows it|how's it|u ok|you ok|kemon acho|kemon|kaisa ho/i;
const NAME_REGEX = /\b(ur|your|whats|what's|what is|wats|whts|wts)\s+(ur|your)?\s*(name|nam|naem|nme)\b|\bwho\s+r\s+u\b|\bwho\s+are\s+you\b|\bintroduce\s+(ur|your)self\b|\bintroduce\s+yourself\b|\btell\s+me\s+about\s+(ur|your)self\b/i;
const THANKS_REGEX = /^(thanks|thank you|thx|ty|tysm|thank u|thnx|thanku|dhanyabad|shukriya)\b/i;
const BYE_REGEX = /^(bye|goodbye|bb|cya|see ya|see you|later|ttyl|gtg|alvida)\b/i;
const CREATOR_REGEX = /who (made|built|created|coded|developed) (you|u|this)|who is (ur|your) (creator|developer|maker|owner|dad|boss)/i;
const HELP_REGEX = /^(help|help me|how to use|how do i use|tutorial)\b/i;
const FEATURE_REGEX = /what (can you|u can|do you|r ur|are your) (do|does|features|capabilities)/i;
const OK_REGEX = /^(ok|okay|k|kk|got it|cool|nice|great|awesome|wow|noice|lit|fire|based|fr|ngl|lowkey|bet|ight|aight|alr|alright)$/i;

// ── Chemistry topic detector ────────────────────────────
const CHEMISTRY_KEYWORDS = [
  // compounds & formulas
  "h2o","co2","nacl","nh3","ch4","c2h5oh","hcl","h2so4","naoh","h2o2",
  "glucose","ethanol","methane","ammonia","benzene","acetylene","propane",
  "sucrose","urea","aspirin","acetic acid","vinegar","ozone",
  // elements
  "hydrogen","helium","lithium","carbon","nitrogen","oxygen","fluorine",
  "neon","sodium","magnesium","aluminum","silicon","phosphorus","sulfur",
  "chlorine","argon","potassium","calcium","iron","copper","zinc","bromine",
  "silver","iodine","gold","mercury","platinum","uranium","lead","tin",
  // concepts
  "atom","molecule","element","compound","bond","ionic","covalent","metallic",
  "periodic table","electron","proton","neutron","isotope","acid","base",
  "ph scale","oxidation","reduction","redox","catalyst","polymer","enzyme",
  "dna","protein","reaction","combustion","molarity","mole","titration",
  "enthalpy","entropy","thermodynamics","spectroscopy","electrochemistry",
  "organic","inorganic","chemistry","chemical","formula","molecular weight",
  "molar mass","valence","orbital","bond angle","polarity","solvent",
  "solubility","precipitation","electrolyte","buffer","indicator",
];

export const isChemistryQuestion = (text) => {
  const low = text.toLowerCase();
  return CHEMISTRY_KEYWORDS.some(kw => low.includes(kw));
};

// ── Local knowledge base ────────────────────────────────
const KB = [
  { k:["h2o","water","h₂o"], a:"💧 **Water (H₂O)** — Universal solvent, polar molecule, bent shape (104.5°). BP 100°C, MW 18.02 g/mol. Essential for all life." },
  { k:["co2","carbon dioxide","co₂"], a:"🌿 **Carbon Dioxide (CO₂)** — Linear triatomic, MW 44.01 g/mol. Greenhouse gas, produced by combustion & respiration, used in photosynthesis." },
  { k:["n2","nitrogen gas","n₂","dinitrogen"], a:"🔵 **Nitrogen gas (N₂)** — 78% of atmosphere, triple bond (N≡N), MW 28.02 g/mol. Inert at room temp. Liquid N₂ = -196°C coolant." },
  { k:["o2","oxygen gas","o₂","dioxygen"], a:"🔴 **Oxygen gas (O₂)** — 21% of atmosphere, double bond. MW 32.00 g/mol. Essential for respiration & combustion." },
  { k:["nacl","sodium chloride","table salt"], a:"🧂 **NaCl** — Ionic compound (Na⁺ + Cl⁻). MW 58.44, MP 801°C. Common table salt." },
  { k:["nh3","ammonia","nh₃"], a:"🌱 **Ammonia (NH₃)** — Trigonal pyramidal, MW 17.03. Key in fertilizers (Haber process), BP -33°C." },
  { k:["ch4","methane","ch₄"], a:"🔥 **Methane (CH₄)** — Simplest alkane, tetrahedral. MW 16.04. Main component of natural gas, BP -161°C." },
  { k:["glucose","c6h12o6","c₆h₁₂o₆"], a:"⚡ **Glucose (C₆H₁₂O₆)** — Primary cellular energy. MW 180.16. Broken down in glycolysis → ATP." },
  { k:["ethanol","c2h5oh","c₂h₅oh","ethyl alcohol"], a:"🧪 **Ethanol (C₂H₅OH)** — 2-carbon alcohol, MW 46.07, BP 78.37°C. Used in beverages, disinfectants, biofuel." },
  { k:["hcl","hydrochloric acid"], a:"⚗️ **HCl** — Strong acid, fully dissociates. MW 36.46. Found in stomach acid. Highly corrosive." },
  { k:["h2so4","sulfuric acid"], a:"⚠️ **H₂SO₄** — Most produced industrial chemical, MW 98.08. Used in batteries, fertilizers. Highly corrosive." },
  { k:["naoh","sodium hydroxide","caustic soda","lye"], a:"🔵 **NaOH** — Strong base, MW 40.00. Used in soap, paper, drain cleaners." },
  { k:["h2o2","hydrogen peroxide"], a:"💊 **H₂O₂** — Mild antiseptic, MW 34.01. Decomposes to H₂O + O₂. Used as bleach & disinfectant." },
  { k:["co","carbon monoxide"], a:"⚠️ **CO** — Colorless, odorless toxic gas. MW 28.01. Binds hemoglobin 200× stronger than O₂." },
  { k:["o3","ozone","o₃"], a:"🌍 **Ozone (O₃)** — MW 48.00. Stratosphere: absorbs UV. Ground level: pollutant." },
  { k:["ch3cooh","acetic acid","ethanoic acid","vinegar"], a:"🍶 **Acetic acid (CH₃COOH)** — Weak organic acid, MW 60.05. Main component of vinegar (~5%)." },
  { k:["c6h6","benzene","c₆h₆"], a:"🔵 **Benzene (C₆H₆)** — Aromatic hydrocarbon, MW 78.11. Planar ring with delocalized electrons. Carcinogen." },
  { k:["c3h8","propane","lpg"], a:"⛽ **Propane (C₃H₈)** — 3-carbon alkane, MW 44.10, BP -42°C. Main component of LPG." },
  { k:["aspirin","c9h8o4","acetylsalicylic acid"], a:"💊 **Aspirin (C₉H₈O₄)** — MW 180.16. Analgesic, antipyretic, anti-inflammatory. Inhibits COX enzymes." },
  // elements
  { k:["hydrogen","element hydrogen"], a:"⚛️ **Hydrogen (H)** — Atomic №1, lightest element. Most abundant in universe. Explosive with air." },
  { k:["oxygen element","element oxygen"], a:"🔴 **Oxygen (O)** — Atomic №8. 21% of atmosphere. Essential for respiration & combustion." },
  { k:["carbon","element carbon"], a:"⬛ **Carbon (C)** — Atomic №6. Basis of organic chemistry. Forms diamond, graphite, fullerenes. Makes millions of compounds." },
  { k:["nitrogen element","element nitrogen"], a:"🔵 **Nitrogen (N)** — Atomic №7. 78% of atmosphere. Essential for proteins & DNA." },
  { k:["sodium","element sodium"], a:"🟡 **Sodium (Na)** — Atomic №11. Reacts violently with water. Essential electrolyte." },
  { k:["iron","element iron"], a:"⚙️ **Iron (Fe)** — Atomic №26. Most used metal. Forms steel. Essential in hemoglobin." },
  { k:["gold","element gold"], a:"🥇 **Gold (Au)** — Atomic №79. Noble metal, doesn't corrode. Excellent conductor." },
  { k:["silver","element silver"], a:"⚪ **Silver (Ag)** — Atomic №47. Best electrical conductor. Antibacterial properties." },
  { k:["copper","element copper"], a:"🟤 **Copper (Cu)** — Atomic №29. Excellent conductor. Used in wiring. Alloys: bronze, brass." },
  { k:["calcium","element calcium"], a:"🦴 **Calcium (Ca)** — Atomic №20. Most abundant mineral in body. Essential for bones (Ca₃(PO₄)₂)." },
  { k:["helium","element helium"], a:"🎈 **Helium (He)** — Atomic №2. Noble gas. Doesn't react. Used in MRI & balloons." },
  { k:["iodine","element iodine"], a:"🟣 **Iodine (I)** — Atomic №53. Essential for thyroid hormones. Used as antiseptic. Added to table salt." },
  { k:["uranium","element uranium"], a:"☢️ **Uranium (U)** — Atomic №92. Radioactive. U-235 used in nuclear reactors. Half-life 4.47 billion years." },
  { k:["mercury element","element mercury","quicksilver"], a:"🌡️ **Mercury (Hg)** — Atomic №80. Only liquid metal at room temp. Highly toxic neurotoxin." },
  { k:["platinum","element platinum"], a:"💍 **Platinum (Pt)** — Atomic №78. Precious, corrosion-resistant catalyst. Used in catalytic converters." },
  { k:["fluorine","element fluorine"], a:"⚠️ **Fluorine (F)** — Atomic №9. Most electronegative element. Used in Teflon, toothpaste." },
  { k:["chlorine element","element chlorine"], a:"🟢 **Chlorine (Cl)** — Atomic №17. Toxic yellow-green gas. Used in water purification & bleach." },
  { k:["zinc","element zinc"], a:"🔩 **Zinc (Zn)** — Atomic №30. Galvanizes steel. Essential trace element for immune function." },
  { k:["aluminum","aluminium","element aluminum"], a:"✈️ **Aluminium (Al)** — Atomic №13. Most abundant metal in crust. Lightweight & corrosion-resistant." },
  { k:["magnesium","element magnesium"], a:"✨ **Magnesium (Mg)** — Atomic №12. Center of chlorophyll. Burns with brilliant white flame." },
  { k:["potassium","element potassium"], a:"🔋 **Potassium (K)** — Atomic №19. Essential for nerve signals & heart rhythm. Found in bananas." },
  { k:["phosphorus","element phosphorus"], a:"🔶 **Phosphorus (P)** — Atomic №15. Essential for DNA, RNA, ATP. Used in fertilizers." },
  { k:["sulfur","sulphur","element sulfur"], a:"🟡 **Sulfur (S)** — Atomic №16. Forms SO₂, H₂SO₄. Essential in amino acids cysteine & methionine." },
  { k:["bromine","element bromine"], a:"🟤 **Bromine (Br)** — Atomic №35. Only non-metal liquid at room temp. Used in flame retardants." },
  { k:["neon","element neon"], a:"💡 **Neon (Ne)** — Atomic №10. Noble gas. Glows orange-red in neon signs." },
  { k:["argon","element argon"], a:"💨 **Argon (Ar)** — Atomic №18. Most abundant noble gas (~1% atmosphere). Used in welding." },
  // concepts
  { k:["ph","ph scale","ph level"], a:"⚗️ **pH** — Measures acidity (0–14). pH<7=acidic, 7=neutral, >7=basic. Formula: pH=-log[H⁺]. Stomach acid ≈ pH 1.5." },
  { k:["ionic bond","ionic bonding"], a:"⚡ **Ionic bonds** — Form between metals & non-metals via electron transfer. Na⁺ + Cl⁻ → NaCl." },
  { k:["covalent bond","covalent bonding"], a:"🔗 **Covalent bonds** — Atoms share electron pairs. Single, double (C=C), triple (C≡C) bonds possible." },
  { k:["hydrogen bond","hydrogen bonding"], a:"💧 **Hydrogen bonds** — Weak intermolecular attraction (H bonded to N,O,F). Crucial for water & DNA." },
  { k:["metallic bond"], a:"🔩 **Metallic bonds** — 'Sea of electrons' shared by metal atoms. Gives metals conductivity & malleability." },
  { k:["periodic table","mendeleev"], a:"📊 **Periodic Table** — 118 elements organized by atomic number. Groups share properties. Created by Mendeleev 1869." },
  { k:["atom","atomic structure"], a:"⚛️ **Atom** — Nucleus (protons+neutrons) + electrons. Protons = atomic number = element identity." },
  { k:["electron","electrons"], a:"⚡ **Electrons** — Negatively charged (-1). Fill orbitals by energy level. Valence electrons determine reactions." },
  { k:["proton","protons"], a:"🔴 **Protons** — Positively charged (+1) in nucleus. Count = atomic number." },
  { k:["neutron","neutrons"], a:"⚪ **Neutrons** — Neutral (0) in nucleus. Different neutron counts = isotopes." },
  { k:["isotope","isotopes"], a:"☢️ **Isotopes** — Same element, different neutron count. Example: C-12 vs C-14 (radioactive)." },
  { k:["acid","acids"], a:"🧪 **Acids** — Donate H⁺ (Brønsted-Lowry). Strong: HCl, H₂SO₄. Weak: CH₃COOH. pH<7." },
  { k:["base","bases","alkali"], a:"🔵 **Bases** — Accept H⁺ or donate OH⁻. Strong: NaOH, KOH. pH>7. Feel slippery." },
  { k:["organic chemistry"], a:"🌿 **Organic chemistry** — Study of carbon compounds. Includes alkanes, alkenes, alcohols, acids, amines, esters." },
  { k:["molar mass","molecular weight","molar"], a:"⚖️ **Molar mass** = mass of 1 mole (6.022×10²³) in g/mol. H₂O = 18.02 g/mol." },
  { k:["catalyst","catalysis"], a:"🚀 **Catalyst** — Speeds up reaction without being consumed. Lowers activation energy. Example: enzymes, platinum." },
  { k:["redox","oxidation","reduction"], a:"🔋 **Redox**: OIL RIG — Oxidation Is Loss (electrons), Reduction Is Gain. Example: Zn+CuSO₄→ZnSO₄+Cu." },
  { k:["combustion","burning"], a:"🔥 **Combustion** — Fuel + O₂ → CO₂ + H₂O (complete). Incomplete → CO + soot." },
  { k:["polymer","polymers"], a:"🔗 **Polymers** — Long chains of repeating monomers. Natural: DNA, protein. Synthetic: polyethylene, nylon, PVC." },
  { k:["dna","rna","nucleic acid"], a:"🧬 **DNA** — Double helix of nucleotides (A-T, G-C). Carries genetic info. RNA is single-stranded." },
  { k:["protein","proteins","amino acid"], a:"🥩 **Proteins** — Polymers of 20 amino acids linked by peptide bonds. Functions: enzymes, hormones, structural." },
  { k:["enzyme","enzymes"], a:"🔬 **Enzymes** — Biological catalysts (proteins). Highly specific (lock-and-key). Affected by temp & pH." },
  { k:["molarity","concentration"], a:"🧪 **Molarity (M)** = moles/liter. 1M HCl = 1 mol per liter. Uses Avogadro's number: 6.022×10²³." },
  { k:["gas law","boyle","charles","ideal gas"], a:"💨 **Gas Laws**: Boyle: P₁V₁=P₂V₂. Charles: V/T=constant. Ideal: PV=nRT (R=8.314 J/mol·K)." },
  { k:["titration"], a:"🧫 **Titration** — Adding known solution to unknown until equivalence point. Used in acid-base analysis." },
  { k:["thermodynamics","enthalpy","entropy"], a:"🌡️ **Thermodynamics**: ΔH=enthalpy (exo: <0, endo: >0). ΔS=entropy. ΔG=ΔH-TΔS (spontaneity)." },
];

// ── Exact word boundary match helper ───────────────────
const wordMatch = (text, keyword) => {
  if (keyword.length <= 2) {
    // single/double char: only exact full-word match
    return new RegExp(`(?<![a-z])${keyword}(?![a-z])`, "i").test(text);
  }
  return text.includes(keyword);
};

// ── Main lookup ─────────────────────────────────────────
export const getKBAnswer = (question) => {
  const qFull = question.toLowerCase().trim();
  const q = qFull
    .replace(/^(what is|what are|tell me about|explain|describe|define|how does|what does|info on|about)\s+/i, "")
    .trim();

  for (const entry of KB) {
    if (entry.k.some(k => wordMatch(q, k) || wordMatch(qFull, k))) {
      return entry.a;
    }
  }
  return null;
};

// ── Greeting handler ────────────────────────────────────
export const getGreetingAnswer = (question) => {
  const q = question.toLowerCase().trim();

  if (GREETING_REGEX.test(q))
    return "👋 Hey! I'm **Chemix AI** — your chemistry assistant inside Chemix-Encyclopedia!\n\nAsk me anything about chemicals, compounds, elements, or reactions. Let's explore chemistry together! ⚗️";

  if (HOW_ARE_YOU_REGEX.test(q))
    return "😊 I'm doing great, thanks for asking! Ready to answer your chemistry questions anytime.\n\nWhat would you like to know today? ⚗️";

  if (NAME_REGEX.test(q))
    return "🧠 I'm **Chemix AI** — a futuristic chemistry assistant built into the **Chemix-Encyclopedia** app!\n\n**What I can do:**\n• Answer questions about compounds & elements\n• Explain chemistry concepts\n• Help with molecular structures\n• Support PubChem search for 100M+ compounds\n\nMade with 💚 by **TimedCoder555**";

  if (CREATOR_REGEX.test(q))
    return "👨‍💻 I was created by **TimedCoder555** — a passionate developer who built the Chemix-Encyclopedia app.\n\nI'm powered by a local chemistry knowledge base and Claude AI. Ask me any chemistry question! ⚗️";

  if (THANKS_REGEX.test(q))
    return "😊 You're welcome! Feel free to ask me more chemistry questions anytime. That's what I'm here for! 💚";

  if (BYE_REGEX.test(q))
    return "👋 Goodbye! Keep exploring the world of chemistry. Come back anytime! 🧪";

  if (OK_REGEX.test(q))
    return "😄 Got it! Got any chemistry questions? Ask away — I'm always here! ⚗️";

  if (HELP_REGEX.test(q))
    return "🆘 **How to use Chemix AI:**\n\n• Ask about any **compound** → 'What is H₂O?'\n• Ask about any **element** → 'Tell me about Iron'\n• Ask **concepts** → 'Explain ionic bonds'\n• Use **search bar** above for 100M+ compounds\n\nWhat would you like to explore? 😊";

  if (FEATURE_REGEX.test(q))
    return "🧠 **Chemix AI Features:**\n\n• 🔬 Chemistry compound info\n• ⚛️ Element details\n• ⚗️ Chemistry concept explanations\n• 🌐 Web search for unknown questions\n• 💬 Friendly conversation\n\nJust ask me anything! 😊";

  return null;
};

// ── Check if it's a greeting ────────────────────────────
export const isGreeting = (question) => {
  const q = question.toLowerCase().trim();
  return (
    GREETING_REGEX.test(q) ||
    HOW_ARE_YOU_REGEX.test(q) ||
    NAME_REGEX.test(q) ||
    CREATOR_REGEX.test(q) ||
    THANKS_REGEX.test(q) ||
    BYE_REGEX.test(q) ||
    OK_REGEX.test(q) ||
    HELP_REGEX.test(q) ||
    FEATURE_REGEX.test(q)
  );
};

// ── Claude API call (web search enabled) ───────────────
export const askClaudeWithSearch = async (question, compoundContext) => {
  const systemPrompt = `You are Chemix AI, a chemistry assistant inside the Chemix-Encyclopedia app made by TimedCoder555.

Your job:
1. If the question is about chemistry (compounds, elements, reactions, molecules, periodic table, etc.) → Answer accurately and concisely (under 120 words). Use emojis sparingly.
2. If the question is NOT about chemistry → Politely say: "🧪 I'm a chemistry-focused AI! That question is outside my specialty. Try asking me about compounds, elements, or reactions instead!"
3. Never answer questions about politics, news, celebrities, or unrelated topics.

${compoundContext ? `Current compound context: ${compoundContext}` : ""}

Always respond in a friendly, futuristic chemistry style. Keep answers under 120 words.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 14000);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: question }],
      }),
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error("API error");

    const data = await res.json();
    // Extract text from response (may include tool_use blocks)
    const textBlocks = (data?.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("\n");

    return textBlocks || null;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
};

// ── Master reply function ───────────────────────────────
// Returns { text, source: "greeting"|"kb"|"claude"|"offline" }
export const getChemixAIReply = async (question, compoundContext) => {
  const q = question.trim();

  // 1. Greeting / small talk (no internet needed)
  if (isGreeting(q)) {
    return { text: getGreetingAnswer(q), source: "greeting" };
  }

  // 2. Local knowledge base (instant)
  const kbAnswer = getKBAnswer(q);
  if (kbAnswer) {
    return { text: kbAnswer, source: "kb" };
  }

  // 3. Try Claude API with web search
  try {
    const reply = await askClaudeWithSearch(q, compoundContext);
    if (reply) return { text: reply, source: "claude" };
    throw new Error("empty reply");
  } catch (_) {
    // 4. Offline fallback — check KB one more time with looser match
    const retry = getKBAnswer(q);
    if (retry) return { text: retry, source: "kb" };

    // 5. Final fallback
    return {
      text: "🔬 I couldn't find a specific answer right now.\n\nTry asking about:\n• **Compounds**: H₂O, CO₂, NaCl, glucose\n• **Elements**: Iron, Gold, Carbon\n• **Concepts**: pH, ionic bonds, molar mass\n\nOr use the **search bar above** to look up any compound in PubChem's 100M+ database! ⚗️",
      source: "offline",
    };
  }
};
