import React, { useState, useEffect, useRef, useCallback } from "react";
import logo from "../img/logo.png";
import heroBg from "../img/bg.jpg";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const CARD_GRADS = [
  "linear-gradient(135deg,#1a3d2b,#0d2b1a)",
  "linear-gradient(135deg,#1a2b3d,#0d1a2b)",
  "linear-gradient(135deg,#3d2b1a,#2b1a0d)",
  "linear-gradient(135deg,#2b2010,#1a1408)",
  "linear-gradient(135deg,#2b1a3d,#1a0d2b)",
  "linear-gradient(135deg,#0d2d22,#071a14)",
  "linear-gradient(135deg,#3d1a2b,#2b0d1a)",
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const TECHNICAL_PATTERNS = [
  /^\d/, /^[A-Z]{2,}-\d/, /\d{4,}/, /\(.*\)/,
  /yl\b|ane\b|ene\b|yne\b|oic acid\b|ate\b|ide\b/i,
  /^[A-Z][a-z]?\d/, /inchi/i, /smiles/i,
];
const isTechnical = (s) => TECHNICAL_PATTERNS.some(p => p.test(s));

const pickCommonName = (synonyms, iupac) => {
  if (!synonyms?.length) return null;
  const candidates = synonyms.filter(s =>
    s !== iupac && s.length > 1 && s.length < 40 &&
    !/^[0-9\-]+$/.test(s) &&
    !/^InChI=/i.test(s) &&
    !/^[A-Z]{14,}/.test(s) &&
    !isTechnical(s)
  );
  return candidates[0] || null;
};

// Convert plain formulas like H2O → "water" style query normalization
// PubChem accepts H2O directly — just trim & encode
const normalizeQuery = (q) => q.trim();

// Safe JSON parse
const safeJson = async (res) => {
  try { return await res.json(); } catch { return null; }
};

// ─────────────────────────────────────────────
// LOCAL AI — chemistry knowledge base fallback
// (used when Anthropic API is unavailable in browser)
// ─────────────────────────────────────────────
const LOCAL_ANSWERS = [
  { keys: ["h2o","water","h₂o"], answer: "💧 **Water (H₂O)** is the universal solvent. It's a polar molecule with a bent shape, boiling point 100°C, and essential for all life on Earth. It has a high specific heat capacity which helps regulate temperature." },
  { keys: ["co2","carbon dioxide","co₂"], answer: "🌿 **Carbon Dioxide (CO₂)** is a linear triatomic molecule. It's produced by combustion and respiration, used in photosynthesis, and is a major greenhouse gas. Molecular weight: 44.01 g/mol." },
  { keys: ["nacl","sodium chloride","salt","table salt"], answer: "🧂 **Sodium Chloride (NaCl)** is an ionic compound formed by Na⁺ and Cl⁻ ions. It's common table salt, melts at 801°C, and is essential for biological functions." },
  { keys: ["nh3","ammonia","nh₃"], answer: "🌱 **Ammonia (NH₃)** has a trigonal pyramidal shape. It's a key component in fertilizers, produced by the Haber process, and is an important industrial chemical with a pungent smell." },
  { keys: ["ch4","methane","ch₄"], answer: "🔥 **Methane (CH₄)** is the simplest hydrocarbon with tetrahedral geometry. It's the main component of natural gas, a potent greenhouse gas, and used as fuel worldwide." },
  { keys: ["glucose","c6h12o6","c₆h₁₂o₆"], answer: "⚡ **Glucose (C₆H₁₂O₆)** is the primary energy source for cells. It's broken down in glycolysis and cellular respiration to produce ATP. Molecular weight: 180.16 g/mol." },
  { keys: ["ethanol","c2h5oh","alcohol","c₂h₅oh"], answer: "🧪 **Ethanol (C₂H₅OH)** is a 2-carbon alcohol. It's used in beverages, disinfectants, and fuel. Boiling point: 78.37°C. It acts as a CNS depressant in the human body." },
  { keys: ["ph","ph scale"], answer: "⚗️ **pH** measures acidity/basicity on a 0–14 scale. pH < 7 = acidic, pH 7 = neutral, pH > 7 = basic. It's the negative log of hydrogen ion concentration: pH = -log[H⁺]." },
  { keys: ["ionic bond","ionic"], answer: "⚡ **Ionic bonds** form between metals and non-metals through electron transfer. The resulting ions are held together by electrostatic attraction. Example: NaCl (Na⁺ + Cl⁻)." },
  { keys: ["covalent bond","covalent"], answer: "🔗 **Covalent bonds** form when atoms share electron pairs. They occur between non-metal atoms. Example: H₂O, where oxygen shares electrons with two hydrogen atoms." },
  { keys: ["periodic table","elements"], answer: "📊 The **Periodic Table** organizes 118 elements by atomic number. Elements in the same group share similar properties. Periods represent electron shells. Created by Mendeleev in 1869." },
  { keys: ["atom","atoms"], answer: "⚛️ An **atom** is the smallest unit of an element. It consists of a nucleus (protons + neutrons) surrounded by electrons. Proton count = atomic number = element identity." },
  { keys: ["molecule","molecules"], answer: "🔬 A **molecule** is two or more atoms bonded together. It can be a single element (O₂) or a compound (H₂O). Molecules are the smallest unit that retains chemical properties." },
  { keys: ["acid","acids"], answer: "🧪 **Acids** donate protons (H⁺) in solution (Brønsted-Lowry definition). Strong acids (HCl, H₂SO₄) fully dissociate. Weak acids (CH₃COOH) partially dissociate. pH < 7." },
  { keys: ["base","bases","alkali"], answer: "🔵 **Bases** accept protons or donate OH⁻ ions. Strong bases (NaOH) fully dissociate. They feel slippery, taste bitter, and have pH > 7. React with acids in neutralization." },
  { keys: ["organic chemistry","organic"], answer: "🌿 **Organic chemistry** studies carbon-containing compounds. Carbon's ability to form 4 bonds creates millions of compounds including proteins, fats, DNA, and medicines." },
  { keys: ["molar mass","molecular weight"], answer: "⚖️ **Molar mass** is the mass of one mole (6.022×10²³ particles) of a substance in g/mol. It equals the sum of atomic masses. Example: H₂O = 2(1) + 16 = 18 g/mol." },
  { keys: ["reaction","chemical reaction"], answer: "⚗️ A **chemical reaction** transforms reactants into products by breaking and forming chemical bonds. Types include synthesis, decomposition, single/double displacement, and redox reactions." },
];

const getLocalAnswer = (question) => {
  const q = question.toLowerCase();
  for (const entry of LOCAL_ANSWERS) {
    if (entry.keys.some(k => q.includes(k))) return entry.answer;
  }
  return null;
};

const OFFLINE_RESPONSES = [
  "🧪 That's a great chemistry question! While I'm in offline mode, I can tell you: chemistry is the study of matter, its properties, and how substances interact through chemical reactions.",
  "⚗️ Interesting question! In offline mode, I recommend searching the specific compound name above to get its molecular formula, weight, and IUPAC name from PubChem.",
  "🔬 I'm currently running in offline mode. For detailed answers, try searching the compound directly using the search bar above — it pulls live data from PubChem's 100M+ database!",
  "🌿 Great chemistry curiosity! My AI features need internet connectivity. Meanwhile, use the Quick Search buttons below to explore common compounds instantly.",
];

let offlineIdx = 0;
const getOfflineResponse = () => {
  const r = OFFLINE_RESPONSES[offlineIdx % OFFLINE_RESPONSES.length];
  offlineIdx++;
  return r;
};

// ─────────────────────────────────────────────
// CHEMIX AI MODAL
// ─────────────────────────────────────────────
const ChemixAIModal = ({ onClose, compoundData }) => {
  const [input, setInput]       = useState("");
  const [messages, setMessages] = useState(() => {
    const welcome = {
      role: "ai",
      text: "👋 Hello! I'm **Chemix AI**, your chemistry assistant.\n\nAsk me about any chemical, compound, reaction, or element!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    if (compoundData) {
      return [
        welcome,
        {
          role: "ai",
          text: `🔬 I see you searched **${compoundData.searchName}** (${compoundData.MolecularFormula}). Ask me anything about it!`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ];
    }
    return [welcome];
  });
  const [thinking, setThinking] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const isSending      = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // Focus input after open
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 400);
  }, []);

  const addAIMessage = (text) => {
    setMessages(prev => [...prev, {
      role: "ai", text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
  };

  const sendMessage = async () => {
    const q = input.trim();
    if (!q || thinking || isSending.current) return;
    isSending.current = true;
    setInput("");

    setMessages(prev => [...prev, {
      role: "user", text: q,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    setThinking(true);

    // 1. Try local knowledge base first (instant, no network needed)
    const localAnswer = getLocalAnswer(q);
    if (localAnswer) {
      await new Promise(r => setTimeout(r, 600)); // feel natural
      addAIMessage(localAnswer);
      setThinking(false);
      isSending.current = false;
      return;
    }

    // 2. Try Anthropic API (only works if deployed with proxy / API key available)
    try {
      const controller = new AbortController();
      const timeout    = setTimeout(() => controller.abort(), 12000); // 12s timeout

      const systemPrompt = `You are Chemix AI, a friendly and accurate chemistry assistant inside the Chemix-Encyclopedia app.
Help users with chemical compounds, elements, reactions, molecular structures, and chemistry concepts.
Be concise (under 100 words), accurate, and use emojis sparingly.
${compoundData ? `Context: User searched "${compoundData.searchName}" (${compoundData.MolecularFormula}, MW: ${compoundData.MolecularWeight} g/mol, IUPAC: ${compoundData.IUPACName}).` : ""}`;

      // Build message history (last 6 messages only to avoid token bloat)
      const history = messages.slice(-6).map(m => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [...history, { role: "user", content: q }],
        }),
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const reply = data?.content?.[0]?.text;
        if (reply) {
          setIsOnline(true);
          addAIMessage(reply);
          setThinking(false);
          isSending.current = false;
          return;
        }
      }

      // API returned error (likely CORS / no key in browser)
      throw new Error("API unavailable");

    } catch (err) {
      // 3. Graceful offline fallback
      setIsOnline(false);
      const fallback = getOfflineResponse();
      addAIMessage(
        `🌐 **Chemix AI — Offline Mode**\n\n${fallback}\n\n*Tip: Try asking about H₂O, pH, ionic bonds, or any compound name!*`
      );
    }

    setThinking(false);
    isSending.current = false;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatText = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>");

  const QUICK_PROMPTS = [
    "What is H₂O?",
    "Explain ionic bonds",
    "What is pH?",
    compoundData ? `Tell me about ${compoundData.searchName}` : "What is organic chemistry?",
    "Explain molar mass",
  ];

  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:2000,
      background:"rgba(0,0,0,0.85)",
      backdropFilter:"blur(14px)",
      display:"flex", alignItems:"flex-end", justifyContent:"center",
      animation:"fadeIn 0.2s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width:"100%", maxWidth:500,
        height:"90vh",
        background:"linear-gradient(170deg,#030d07 0%,#04091a 55%,#07030f 100%)",
        borderRadius:"26px 26px 0 0",
        border:"1px solid rgba(0,229,255,0.18)",
        borderBottom:"none",
        display:"flex", flexDirection:"column",
        overflow:"hidden",
        animation:"slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow:"0 -12px 60px rgba(0,180,255,0.18), 0 -4px 20px rgba(124,77,255,0.12)",
      }}>

        {/* Handle */}
        <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 2px", flexShrink:0 }}>
          <div style={{ width:38, height:4, borderRadius:2, background:"rgba(255,255,255,0.15)" }} />
        </div>

        {/* Header */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"8px 16px 12px", flexShrink:0,
          borderBottom:"1px solid rgba(0,229,255,0.08)",
          background:"linear-gradient(90deg,rgba(0,229,255,0.05),rgba(124,77,255,0.05))",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:11 }}>
            <div style={{
              width:40, height:40, borderRadius:13, flexShrink:0,
              background:"linear-gradient(135deg,#00e5ff,#7c4dff)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:19, animation:"aiGlow 2.5s ease-in-out infinite",
            }}>🧠</div>
            <div>
              <div style={{
                fontSize:16, fontWeight:900, lineHeight:1.1,
                background:"linear-gradient(90deg,#00e5ff,#7c4dff,#00bcd4,#00e5ff)",
                backgroundSize:"250% auto",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                backgroundClip:"text",
                animation:"aiTextFlow 3s linear infinite",
              }}>Chemix AI</div>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
                <div style={{
                  width:6, height:6, borderRadius:"50%",
                  background: isOnline ? "#00e676" : "#ffb300",
                  boxShadow: isOnline ? "0 0 6px #00e676" : "0 0 6px #ffb300",
                }} />
                <span style={{ color:"rgba(255,255,255,0.45)", fontSize:10 }}>
                  {isOnline ? "Online · Chemistry Assistant" : "Offline Mode · Local Answers"}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:50, width:32, height:32, color:"rgba(255,255,255,0.65)",
            cursor:"pointer", fontSize:17, display:"flex", alignItems:"center", justifyContent:"center",
          }}>×</button>
        </div>

        {/* Messages area */}
        <div style={{
          flex:1, overflowY:"auto", padding:"12px 14px",
          display:"flex", flexDirection:"column", gap:10,
          scrollBehavior:"smooth",
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display:"flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              alignItems:"flex-end", gap:7,
              animation:"fadeUp 0.28s ease both",
            }}>
              {msg.role === "ai" && (
                <div style={{
                  width:28, height:28, borderRadius:9, flexShrink:0,
                  background:"linear-gradient(135deg,#00e5ff,#7c4dff)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:13,
                }}>🧠</div>
              )}
              <div style={{ maxWidth:"80%", display:"flex", flexDirection:"column", alignItems: msg.role==="user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  padding:"9px 13px",
                  borderRadius: msg.role==="user" ? "17px 17px 4px 17px" : "17px 17px 17px 4px",
                  background: msg.role==="user"
                    ? "linear-gradient(135deg,#00c853,#00e676)"
                    : "rgba(255,255,255,0.055)",
                  border: msg.role==="user" ? "none" : "1px solid rgba(0,229,255,0.12)",
                  color: msg.role==="user" ? "#001a00" : "rgba(255,255,255,0.85)",
                  fontSize:13, lineHeight:1.6,
                  boxShadow: msg.role==="user"
                    ? "0 3px 12px rgba(0,200,83,0.22)"
                    : "0 2px 10px rgba(0,0,0,0.25)",
                }} dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
                <span style={{ color:"rgba(255,255,255,0.2)", fontSize:9.5, marginTop:3, paddingLeft:2, paddingRight:2 }}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {/* Thinking dots */}
          {thinking && (
            <div style={{ display:"flex", alignItems:"flex-end", gap:7, animation:"fadeUp 0.28s ease both" }}>
              <div style={{ width:28, height:28, borderRadius:9, background:"linear-gradient(135deg,#00e5ff,#7c4dff)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>🧠</div>
              <div style={{ padding:"12px 15px", borderRadius:"17px 17px 17px 4px", background:"rgba(255,255,255,0.055)", border:"1px solid rgba(0,229,255,0.12)", display:"flex", gap:5, alignItems:"center" }}>
                {[0,1,2].map(d => (
                  <div key={d} style={{ width:6, height:6, borderRadius:"50%", background:"rgba(0,229,255,0.65)", animation:`thinkDot 1.2s ease-in-out ${d*0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} style={{ height:1 }} />
        </div>

        {/* Quick prompts */}
        <div style={{ padding:"6px 12px 2px", flexShrink:0 }}>
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4, msOverflowStyle:"none", scrollbarWidth:"none" }}>
            {QUICK_PROMPTS.map(p => (
              <button key={p} onClick={() => { setInput(p); setTimeout(() => inputRef.current?.focus(), 50); }} style={{
                background:"rgba(0,229,255,0.06)", border:"1px solid rgba(0,229,255,0.18)",
                borderRadius:20, padding:"5px 11px",
                color:"rgba(0,229,255,0.82)", fontSize:11, fontWeight:600,
                cursor:"pointer", whiteSpace:"nowrap", flexShrink:0, transition:"all 0.16s",
              }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(0,229,255,0.14)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(0,229,255,0.06)"}
              >{p}</button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div style={{ padding:"8px 12px 22px", flexShrink:0, borderTop:"1px solid rgba(0,229,255,0.06)" }}>
          <div style={{
            display:"flex", alignItems:"center", gap:8,
            background:"rgba(255,255,255,0.04)",
            border:"1.5px solid rgba(0,229,255,0.2)",
            borderRadius:50, padding:"8px 8px 8px 14px",
            transition:"border-color 0.2s",
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Chemix AI anything..."
              style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#fff", fontSize:13, fontFamily:"inherit" }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || thinking}
              style={{
                width:36, height:36, borderRadius:50, flexShrink:0, border:"none",
                background: input.trim() && !thinking
                  ? "linear-gradient(135deg,#00e5ff,#7c4dff)"
                  : "rgba(255,255,255,0.07)",
                cursor: input.trim() && !thinking ? "pointer" : "default",
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all 0.2s",
                boxShadow: input.trim() && !thinking ? "0 0 12px rgba(0,229,255,0.35)" : "none",
              }}
            >
              {thinking
                ? <div style={{ width:13, height:13, border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              }
            </button>
          </div>
          <div style={{ textAlign:"center", marginTop:5, color:"rgba(255,255,255,0.18)", fontSize:9.5 }}>
            Chemix AI · {isOnline ? "Powered by Claude" : "Offline Mode — Local Chemistry Knowledge"}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ABOUT MODAL
// ─────────────────────────────────────────────
const AboutModal = ({ onClose }) => (
  <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(8px)", display:"flex", alignItems:"flex-end", justifyContent:"center", animation:"fadeIn 0.2s ease" }}>
    <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:480, background:"linear-gradient(160deg,#0d1f15 0%,#0a1625 100%)", borderRadius:"28px 28px 0 0", border:"1px solid rgba(74,222,128,0.25)", borderBottom:"none", padding:"0 0 40px", maxHeight:"88vh", overflowY:"auto", animation:"slideUp 0.32s cubic-bezier(0.4,0,0.2,1)" }}>
      <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 4px" }}>
        <div style={{ width:42, height:4, borderRadius:2, background:"rgba(255,255,255,0.2)" }} />
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 22px 18px", borderBottom:"1px solid rgba(74,222,128,0.12)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <img src={logo} alt="logo" style={{ width:40, height:40, borderRadius:12, objectFit:"cover", boxShadow:"0 0 14px rgba(74,222,128,0.4)" }} />
          <div>
            <div style={{ fontSize:15, fontWeight:900 }}><span style={{ color:"#4ade80" }}>Chemix</span><span style={{ color:"#60a5fa" }}>Encyclopedia</span></div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", marginTop:1 }}>by TimedCoder555</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:50, width:34, height:34, color:"#fff", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
      </div>
      <div style={{ padding:"20px 22px" }}>
        <p style={{ color:"rgba(255,255,255,0.8)", fontSize:13.5, lineHeight:1.75, marginBottom:20 }}>
          Chemix Encyclopedia is a futuristic chemistry platform for students, researchers, and science lovers.
          Explore <span style={{ color:"#4ade80", fontWeight:700 }}>100 Million+</span> compounds powered by PubChem.
        </p>
        <div style={{ background:"rgba(74,222,128,0.07)", border:"1px solid rgba(74,222,128,0.18)", borderRadius:16, padding:"14px 16px", marginBottom:14 }}>
          <div style={{ color:"#4ade80", fontWeight:800, fontSize:11.5, letterSpacing:0.8, marginBottom:10 }}>✨ FEATURES</div>
          {["100M+ Compound Database","Real-time PubChem Search","IUPAC + Common Name Detection","Molecular Weight Info","Chemix AI Assistant","Favorites System","Mobile Optimized","Futuristic Glassmorphism UI"].map(item => (
            <div key={item} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:"#4ade80", flexShrink:0 }} />
              <span style={{ color:"rgba(255,255,255,0.72)", fontSize:12.5 }}>{item}</span>
            </div>
          ))}
        </div>
        {[
          { color:"#60a5fa", label:"📚 BUILT FOR", text:"Students, chemistry enthusiasts, researchers, developers, and curious minds exploring the world of chemistry." },
          { color:"#fbbf24", label:"🌿 VISION", text:"Making chemistry exploration simple, futuristic, and enjoyable for everyone." },
        ].map(sec => (
          <div key={sec.label} style={{ background:`${sec.color}0e`, border:`1px solid ${sec.color}22`, borderRadius:16, padding:"14px 16px", marginBottom:14 }}>
            <div style={{ color:sec.color, fontWeight:800, fontSize:11.5, letterSpacing:0.8, marginBottom:8 }}>{sec.label}</div>
            <p style={{ color:"rgba(255,255,255,0.68)", fontSize:12.5, lineHeight:1.7 }}>{sec.text}</p>
          </div>
        ))}
        <div style={{ background:"rgba(167,139,250,0.08)", border:"1px solid rgba(167,139,250,0.18)", borderRadius:16, padding:"14px 16px", marginBottom:20 }}>
          <div style={{ color:"#a78bfa", fontWeight:800, fontSize:11.5, letterSpacing:0.8, marginBottom:8 }}>⚡ TECHNOLOGY</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {["React.js","PubChem API","Claude AI","Modern UI/UX","Responsive Design"].map(t => (
              <span key={t} style={{ background:"rgba(167,139,250,0.14)", border:"1px solid rgba(167,139,250,0.25)", borderRadius:20, padding:"4px 12px", color:"#c4b5fd", fontSize:12, fontWeight:600 }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ textAlign:"center", color:"rgba(255,255,255,0.45)", fontSize:13 }}>
          Made with passion by <span style={{ color:"#4ade80", fontWeight:700 }}>TimedCoder555</span> 💚
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// RESULT CARD
// ─────────────────────────────────────────────
const ResultCard = ({ compoundData, isFav, onToggleFav }) => {
  const rows = [
    { icon:"🏷️", label:"IUPAC NAME",      val: compoundData.IUPACName || compoundData.searchName || "Unknown", accent:"#00e5b0" },
    { icon:"✨",  label:"COMMON NAME",     val: compoundData.commonName || "Not Available", accent:"#a78bfa", glow:true },
    { icon:"⚗️", label:"FORMULA",          val: compoundData.MolecularFormula, accent:"#60a5fa" },
    { icon:"⚖️", label:"MOLECULAR WEIGHT", val: `${compoundData.MolecularWeight} g/mol`, accent:"#fbbf24" },
  ];
  return (
    <div style={{ marginBottom:18, background:"rgba(8,22,12,0.94)", borderRadius:22, overflow:"hidden", boxShadow:"0 8px 32px rgba(0,229,176,0.10),0 2px 8px rgba(0,0,0,0.4)", border:"1px solid rgba(0,229,176,0.18)", backdropFilter:"blur(20px)", animation:"slideDown 0.38s ease both" }}>
      <div style={{ background:"linear-gradient(90deg,rgba(0,229,176,0.12),rgba(96,165,250,0.08))", padding:"13px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid rgba(0,229,176,0.1)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ position:"relative", width:10, height:10 }}>
            <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#00e5b0", animation:"pingDot 1.4s ease-in-out infinite", opacity:0.5 }} />
            <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#00e5b0" }} />
          </div>
          <span style={{ color:"#00e5b0", fontWeight:800, fontSize:13, letterSpacing:0.5 }}>Compound Found</span>
          <span style={{ background:"rgba(0,229,176,0.1)", border:"1px solid rgba(0,229,176,0.22)", borderRadius:20, padding:"2px 9px", color:"rgba(0,229,176,0.75)", fontSize:10, fontWeight:700 }}>PubChem</span>
        </div>
        <button onClick={onToggleFav} style={{ width:40, height:40, borderRadius:12, border:"none", cursor:"pointer", background: isFav ? "linear-gradient(135deg,#4ade80,#22c55e)" : "rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow: isFav ? "0 0 14px rgba(74,222,128,0.4)" : "none", transition:"all 0.22s" }}>
          <span style={{ fontSize:18, lineHeight:1 }}>{isFav ? "★" : "☆"}</span>
        </button>
      </div>
      {rows.map((r, i) => (
        <div key={r.label} style={{ display:"flex", alignItems:"flex-start", gap:13, padding:"12px 15px", borderBottom: i < rows.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none", position:"relative", background: r.glow ? "rgba(167,139,250,0.04)" : "transparent" }}>
          <div style={{ width:34, height:34, borderRadius:10, flexShrink:0, background:`${r.accent}15`, border:`1.5px solid ${r.accent}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, boxShadow: r.glow ? `0 0 10px ${r.accent}25` : "none" }}>{r.icon}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:r.accent, fontSize:9, fontWeight:800, letterSpacing:1, marginBottom:3, opacity:0.8 }}>{r.label}</div>
            <div style={{ color: r.val==="Not Available" ? "rgba(255,255,255,0.3)" : "#fff", fontSize:13.5, fontWeight: r.val==="Not Available" ? 400 : 700, wordBreak:"break-all", lineHeight:1.4, fontStyle: r.val==="Not Available" ? "italic" : "normal" }}>{r.val}</div>
          </div>
          <div style={{ position:"absolute", left:0, top:"20%", bottom:"20%", width:3, borderRadius:"0 2px 2px 0", background:r.accent, opacity:0.45 }} />
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
const Main = () => {
  const [value, setValue]           = useState("");
  const [compoundData, setCompound] = useState(null);
  const [errorMsg, setErrorMsg]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [activeTab, setActiveTab]   = useState("home");
  const [showAbout, setShowAbout]   = useState(false);
  const [showAI, setShowAI]         = useState(false);
  const [navPage, setNavPage]       = useState("home");
  const [favorites, setFavorites]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("chemix_favorites") || "[]"); }
    catch { return []; }
  });
  const fetchRef = useRef(false); // prevent duplicate requests

  useEffect(() => {
    localStorage.setItem("chemix_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ── PUBCHEM SEARCH (robust) ──────────────────
  const handleSearch = useCallback(async (q) => {
    const query = normalizeQuery(q || value);
    if (!query) { setErrorMsg("Please enter a compound name."); return; }
    if (fetchRef.current) return; // prevent duplicate
    fetchRef.current = true;

    setErrorMsg(""); setCompound(null); setLoading(true);

    // Retry helper
    const fetchWithRetry = async (url, retries = 2) => {
      for (let i = 0; i <= retries; i++) {
        try {
          const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
          return r;
        } catch (e) {
          if (i === retries) throw e;
          await new Promise(r => setTimeout(r, 800));
        }
      }
    };

    try {
      const propRes = await fetchWithRetry(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`
      );

      if (!propRes.ok) {
        setErrorMsg("❌ No compound found. Try a different name or formula.");
        setLoading(false); fetchRef.current = false; return;
      }

      const propData = await safeJson(propRes);
      if (!propData?.PropertyTable?.Properties?.length) {
        setErrorMsg("❌ No compound found. Try: water, glucose, ethanol...");
        setLoading(false); fetchRef.current = false; return;
      }

      const props = propData.PropertyTable.Properties[0];

      // Get common name from synonyms (non-blocking)
      let commonName = null;
      try {
        const synRes = await fetchWithRetry(
          `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${props.CID}/synonyms/JSON`
        );
        if (synRes.ok) {
          const synData = await safeJson(synRes);
          const synonyms = synData?.InformationList?.Information?.[0]?.Synonym || [];
          commonName = pickCommonName(synonyms, props.IUPACName);
        }
      } catch (_) { /* synonyms are optional */ }

      setCompound({ ...props, searchName: query, commonName: commonName || "Not Available" });
      setNavPage("home"); setActiveTab("home");

    } catch (err) {
      if (err.name === "AbortError" || err.name === "TimeoutError") {
        setErrorMsg("⏱️ Request timed out. Please check your connection.");
      } else {
        setErrorMsg("⚠️ Failed to fetch. Please try again.");
      }
    }

    setLoading(false);
    fetchRef.current = false;
  }, [value]);

  const isFav    = (c) => c && favorites.some(f => f.MolecularFormula === c.MolecularFormula);
  const addFav   = (c) => { if (!c || isFav(c)) return; setFavorites(p => [c, ...p]); };
  const removeFav = (f) => setFavorites(p => p.filter(x => x.MolecularFormula !== f));
  const toggleFav = () => isFav(compoundData) ? removeFav(compoundData.MolecularFormula) : addFav(compoundData);

  return (
    <div style={{ minHeight:"100vh", background:"#eef2ee", fontFamily:"'Segoe UI',system-ui,sans-serif", overflowX:"hidden" }}>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pingDot{0%{transform:scale(1);opacity:0.6}70%{transform:scale(2.2);opacity:0}100%{transform:scale(2.2);opacity:0}}
        @keyframes rainbowFlow{0%{background-position:0% 50%}100%{background-position:200% 50%}}
        @keyframes aiTextFlow{0%{background-position:0% 50%}100%{background-position:250% 50%}}
        @keyframes aiGlow{0%,100%{box-shadow:0 0 16px rgba(0,229,255,0.45)}50%{box-shadow:0 0 28px rgba(124,77,255,0.65),0 0 44px rgba(0,229,255,0.25)}}
        @keyframes aiBtnFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes aiBtnGlow{0%,100%{box-shadow:0 4px 24px rgba(0,229,255,0.4),0 2px 12px rgba(0,0,0,0.5)}50%{box-shadow:0 4px 36px rgba(124,77,255,0.6),0 0 50px rgba(0,229,255,0.25),0 2px 12px rgba(0,0,0,0.5)}}
        @keyframes thinkDot{0%,80%,100%{transform:scale(0.55);opacity:0.35}40%{transform:scale(1);opacity:1}}
        @keyframes reportPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,80,80,0.35)}50%{box-shadow:0 0 0 7px rgba(255,80,80,0)}}

        .rainbow-text{background:linear-gradient(90deg,#ff0080,#ff4500,#ffd700,#00e676,#00bcd4,#7c4dff,#ff4081,#ff0080);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:rainbowFlow 2.4s linear infinite;font-weight:700;}
        input::placeholder{color:rgba(255,255,255,0.4);}
        input:focus{outline:none;}
        .nav-lnk{transition:all 0.18s;cursor:pointer;}
        .nav-lnk:hover{color:#00e5b0!important;}
        .search-box:focus-within{border-color:rgba(74,222,128,0.6)!important;box-shadow:0 0 0 3px rgba(74,222,128,0.1)!important;}
        .chip:hover{background:rgba(45,90,61,0.22)!important;transform:translateY(-1px);}
        .plus-btn{transition:all 0.18s;}
        .plus-btn:hover{transform:scale(1.08);}
        .plus-btn:active{transform:scale(0.93);}
        .fav-card{transition:transform 0.2s,box-shadow 0.2s;}
        .fav-card:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,0.22)!important;}
        .el-card{transition:all 0.2s;}
        .el-card:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,0.12)!important;}
        .mol-card{transition:all 0.2s;}
        .mol-card:hover{background:#f3f8f3!important;}
        .report-btn{animation:reportPulse 2.2s ease-in-out infinite;transition:transform 0.18s!important;}
        .report-btn:hover{transform:translateY(-2px) scale(1.02)!important;}
        /* AI FAB — float + glow, no overlap */
        .ai-fab{
          animation:aiBtnFloat 3.2s ease-in-out infinite,aiBtnGlow 3.2s ease-in-out infinite;
          transition:transform 0.2s,box-shadow 0.2s;
        }
        .ai-fab:hover{
          transform:translateY(-5px) scale(1.07)!important;
          animation:none!important;
          box-shadow:0 0 44px rgba(0,229,255,0.75),0 0 70px rgba(124,77,255,0.45)!important;
        }
        .ai-fab:active{transform:scale(0.94)!important;}
        /* Hide scrollbar on quick prompts */
        div::-webkit-scrollbar{display:none;}
        @media(min-width:480px){.content-pad{padding:16px 24px 100px!important;}}
      `}</style>

      {/* ══ NAVBAR ══ */}
      <div style={{ background:"rgba(4,12,8,0.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(74,222,128,0.12)", position:"sticky", top:0, zIndex:300 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.05)", flexWrap:"wrap" }}>
          <img src={logo} alt="logo" style={{ width:44, height:44, borderRadius:12, objectFit:"cover", boxShadow:"0 0 14px rgba(74,222,128,0.32)", flexShrink:0 }} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:"clamp(14px,4vw,18px)", fontWeight:900, lineHeight:1.1, whiteSpace:"nowrap" }}>
              <span style={{ color:"#00e5b0" }}>Chemix-</span><span style={{ color:"#00c4ff" }}>Encyclopedia</span>
            </div>
            <div style={{ fontSize:11.5, marginTop:3 }}>by <span className="rainbow-text">Timedcoder</span></div>
          </div>
          <button className="report-btn" onClick={() => window.open("https://github.com/TimedCoder555/Chemix-Encyclopedia/issues","_blank")} style={{ flexShrink:0, display:"flex", alignItems:"center", gap:7, background:"linear-gradient(135deg,#180808,#2a0e0e)", border:"1.5px solid rgba(255,80,80,0.45)", borderRadius:13, padding:"7px 12px", cursor:"pointer" }}>
            <span style={{ fontSize:16, lineHeight:1 }}>🐛</span>
            <div><div style={{ color:"#ff6b6b", fontSize:10.5, fontWeight:800, letterSpacing:0.4, lineHeight:1.1 }}>REPORT HERE</div><div style={{ color:"rgba(255,107,107,0.55)", fontSize:9, lineHeight:1.1 }}>Bugs &amp; issues</div></div>
          </button>
        </div>
        <div style={{ display:"flex" }}>
          {[{id:"home",label:"HOME"},{id:"elements",label:"ELEMENTS"},{id:"molecules",label:"MOLECULES"},{id:"about",label:"ABOUT"}].map(link => {
            const active = link.id !== "about" && navPage === link.id;
            return (
              <button key={link.id} className="nav-lnk" onClick={() => { if(link.id==="about"){setShowAbout(true);return;} setNavPage(link.id);setActiveTab("home"); }} style={{ flex:1, background:"none", border:"none", color: active?"#00e5b0":"rgba(255,255,255,0.52)", fontSize:10.5, fontWeight:800, letterSpacing:0.6, padding:"9px 4px", borderBottom: active?"2.5px solid #00e5b0":"2.5px solid transparent", cursor:"pointer", transition:"all 0.18s" }}>
                {link.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ HERO ══ */}
      <div style={{ position:"relative", minHeight:400, backgroundImage:`url(${heroBg})`, backgroundSize:"cover", backgroundPosition:"center", display:"flex", flexDirection:"column" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(2,10,5,0.52) 0%,rgba(10,30,18,0.45) 55%,rgba(25,55,35,0.78) 100%)" }} />
        <div style={{ position:"relative", zIndex:5, flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"32px 22px 56px", animation:"fadeUp 0.7s ease both" }}>
          <h1 style={{ fontSize:"clamp(26px,8vw,42px)", fontWeight:900, color:"#fff", lineHeight:1.15, letterSpacing:-0.5, marginBottom:12, textShadow:"0 2px 24px rgba(0,0,0,0.5)" }}>
            "Chemistry is the<br/><span style={{ color:"#86efac" }}>poetry</span> of<br/>invisible molecules."
          </h1>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:14, lineHeight:1.7, maxWidth:320 }}>
            Explore compounds, elements, reactions and molecular structures.
          </p>
        </div>
        <div style={{ position:"absolute", bottom:-1, left:0, right:0, zIndex:5 }}>
          <svg viewBox="0 0 414 56" width="100%" height="56" preserveAspectRatio="none">
            <path d="M0,0 C60,40 140,5 220,32 C290,54 360,12 414,38 L414,56 L0,56 Z" fill="#eef2ee"/>
          </svg>
        </div>
      </div>

      {/* ══ SEARCH BAR ══ */}
      <div style={{ position:"sticky", top:88, zIndex:100, background:"rgba(238,242,238,0.97)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(0,0,0,0.06)", padding:"9px 13px", display:"flex", alignItems:"center", gap:9 }}>
        <div className="search-box" style={{ flex:1, display:"flex", alignItems:"center", gap:8, background:"#273329", border:"1.5px solid rgba(74,222,128,0.22)", borderRadius:50, padding:"10px 13px", transition:"all 0.22s" }}>
          {loading
            ? <div style={{ width:13, height:13, border:"2px solid #4ade80", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.7s linear infinite", flexShrink:0 }} />
            : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          }
          <input
            type="text" value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key==="Enter" && handleSearch()}
            placeholder="Search: H2O, CO2, NaCl, glucose..."
            style={{ flex:1, background:"transparent", border:"none", color:"#fff", fontSize:13, fontFamily:"inherit", minWidth:0 }}
          />
          {value && <button onClick={()=>{setValue("");setCompound(null);setErrorMsg("");}} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:17, padding:0, lineHeight:1 }}>×</button>}
        </div>
        <button onClick={()=>setActiveTab(activeTab==="favorites"?"home":"favorites")} style={{ flexShrink:0, background: activeTab==="favorites"?"#4ade80":"#273329", border:"1.5px solid rgba(74,222,128,0.28)", borderRadius:50, padding:"9px 13px", color: activeTab==="favorites"?"#0a2010":"rgba(255,255,255,0.78)", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5, transition:"all 0.2s", whiteSpace:"nowrap" }}>
          ⭐{favorites.length>0 && <span style={{ background: activeTab==="favorites"?"#0a2010":"#4ade80", color: activeTab==="favorites"?"#4ade80":"#0a2010", borderRadius:10, padding:"1px 5px", fontSize:9.5, fontWeight:800 }}>{favorites.length}</span>}
        </button>
      </div>

      {/* ══ CONTENT ══ */}
      <div className="content-pad" style={{ padding:"13px 14px 100px", maxWidth:520, margin:"0 auto" }}>
        {errorMsg && (
          <div style={{ marginBottom:12, color:"#ef4444", fontSize:13, fontWeight:600, background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:12, padding:"10px 14px", animation:"fadeIn 0.3s ease" }}>
            {errorMsg}
          </div>
        )}

        {/* HOME */}
        {activeTab==="home" && navPage==="home" && (
          <>
            {compoundData && <ResultCard compoundData={compoundData} isFav={isFav(compoundData)} onToggleFav={toggleFav} />}
            <p style={{ color:"#7a8e7a", fontSize:10, fontWeight:700, letterSpacing:0.8, marginBottom:8 }}>QUICK SEARCH</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
              {[{label:"H₂O",q:"water"},{label:"CO₂",q:"carbon dioxide"},{label:"NaCl",q:"sodium chloride"},{label:"NH₃",q:"ammonia"},{label:"C₆H₁₂O₆",q:"glucose"},{label:"CH₄",q:"methane"},{label:"C₂H₅OH",q:"ethanol"}].map(({label,q})=>(
                <button key={label} className="chip" onClick={()=>{setValue(q);handleSearch(q);}} style={{ background:"rgba(45,90,61,0.09)", border:"1.5px solid rgba(45,90,61,0.17)", borderRadius:20, padding:"5px 11px", color:"#1a4a2a", fontSize:11.5, fontWeight:700, cursor:"pointer", fontFamily:"monospace", transition:"all 0.2s" }}>{label}</button>
              ))}
            </div>
            {!compoundData && (
              <div style={{ background:"#fff", borderRadius:20, padding:"26px 16px", textAlign:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize:34, marginBottom:9 }}>⚗️</div>
                <div style={{ color:"#1a4a2a", fontWeight:800, fontSize:14, marginBottom:5 }}>Start exploring</div>
                <div style={{ color:"#9ca3af", fontSize:12.5, lineHeight:1.65 }}>Type any compound name or formula and press Enter. Try: water, CO2, NaCl, glucose.</div>
              </div>
            )}
          </>
        )}

        {/* ELEMENTS */}
        {activeTab==="home" && navPage==="elements" && (
          <div style={{ animation:"fadeUp 0.4s ease both" }}>
            <div style={{ background:"#fff", borderRadius:20, padding:"20px 16px", textAlign:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.05)", marginBottom:12 }}>
              <div style={{ fontSize:36, marginBottom:7 }}>🔬</div>
              <div style={{ color:"#1a4a2a", fontWeight:800, fontSize:14, marginBottom:5 }}>Elements</div>
              <p style={{ color:"#9ca3af", fontSize:12.5, lineHeight:1.6 }}>Tap any element to search it instantly.</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
              {[{symbol:"H",name:"Hydrogen",num:1,color:"#60a5fa"},{symbol:"O",name:"Oxygen",num:8,color:"#f87171"},{symbol:"C",name:"Carbon",num:6,color:"#a78bfa"},{symbol:"N",name:"Nitrogen",num:7,color:"#4ade80"},{symbol:"Na",name:"Sodium",num:11,color:"#fbbf24"},{symbol:"Fe",name:"Iron",num:26,color:"#fb923c"},{symbol:"Au",name:"Gold",num:79,color:"#f59e0b"},{symbol:"Ag",name:"Silver",num:47,color:"#94a3b8"}].map(el=>(
                <button key={el.symbol} className="el-card" onClick={()=>{setValue(el.name);handleSearch(el.name);setNavPage("home");}} style={{ background:"#fff", border:`2px solid ${el.color}28`, borderRadius:15, padding:"12px 11px", display:"flex", alignItems:"center", gap:10, cursor:"pointer", textAlign:"left", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ width:44, height:44, borderRadius:12, flexShrink:0, background:`${el.color}15`, border:`2px solid ${el.color}38`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color:el.color }}>{el.symbol}</div>
                  <div><div style={{ color:"#1a2e1a", fontWeight:700, fontSize:12.5 }}>{el.name}</div><div style={{ color:"#9ca3af", fontSize:10.5, marginTop:2 }}>Atomic № {el.num}</div></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MOLECULES */}
        {activeTab==="home" && navPage==="molecules" && (
          <div style={{ animation:"fadeUp 0.4s ease both" }}>
            <div style={{ background:"#fff", borderRadius:20, padding:"20px 16px", textAlign:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.05)", marginBottom:12 }}>
              <div style={{ fontSize:36, marginBottom:7 }}>🧪</div>
              <div style={{ color:"#1a4a2a", fontWeight:800, fontSize:14, marginBottom:5 }}>Molecules</div>
              <p style={{ color:"#9ca3af", fontSize:12.5, lineHeight:1.6 }}>Tap any molecule to search instantly.</p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              {[{formula:"H₂O",name:"Water",desc:"Universal solvent of life",q:"water",color:"#60a5fa"},{formula:"CO₂",name:"Carbon Dioxide",desc:"Greenhouse gas, photosynthesis fuel",q:"carbon dioxide",color:"#f87171"},{formula:"NH₃",name:"Ammonia",desc:"Key nitrogen compound in fertilizers",q:"ammonia",color:"#4ade80"},{formula:"CH₄",name:"Methane",desc:"Simplest hydrocarbon, natural gas",q:"methane",color:"#fbbf24"},{formula:"C₆H₁₂O₆",name:"Glucose",desc:"Primary energy source for cells",q:"glucose",color:"#fb923c"},{formula:"C₂H₅OH",name:"Ethanol",desc:"Alcohol used in beverages & fuel",q:"ethanol",color:"#a78bfa"},{formula:"NaCl",name:"Sodium Chloride",desc:"Common table salt, ionic bond",q:"sodium chloride",color:"#34d399"}].map(mol=>(
                <button key={mol.formula} className="mol-card" onClick={()=>{setValue(mol.q);handleSearch(mol.q);setNavPage("home");}} style={{ background:"#fff", border:`2px solid ${mol.color}25`, borderRadius:15, padding:"12px 13px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", textAlign:"left", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ width:50, height:50, borderRadius:13, flexShrink:0, background:`${mol.color}12`, border:`2px solid ${mol.color}35`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:mol.color, fontFamily:"monospace", textAlign:"center", padding:2 }}>{mol.formula}</div>
                  <div><div style={{ color:"#1a2e1a", fontWeight:700, fontSize:13 }}>{mol.name}</div><div style={{ color:"#9ca3af", fontSize:11.5, marginTop:2 }}>{mol.desc}</div></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FAVORITES */}
        {activeTab==="favorites" && (
          <div style={{ animation:"fadeUp 0.3s ease both" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:11 }}>
              <p style={{ color:"#7a8e7a", fontSize:10, fontWeight:700, letterSpacing:0.8 }}>SAVED ({favorites.length})</p>
              {favorites.length>0 && <button onClick={()=>setFavorites([])} style={{ background:"none", border:"none", color:"#ef4444", fontSize:11, fontWeight:700, cursor:"pointer" }}>Clear all</button>}
            </div>
            {favorites.length===0 ? (
              <div style={{ background:"#fff", borderRadius:20, padding:"34px 16px", textAlign:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize:34, marginBottom:9 }}>⭐</div>
                <div style={{ color:"#1a4a2a", fontWeight:800, fontSize:14, marginBottom:5 }}>No favorites yet</div>
                <div style={{ color:"#9ca3af", fontSize:12.5, lineHeight:1.6 }}>Search a compound and tap ☆ to save here.</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {favorites.map((fav,idx)=>(
                  <div key={fav.MolecularFormula} className="fav-card" style={{ background:CARD_GRADS[idx%CARD_GRADS.length], borderRadius:20, boxShadow:"0 4px 16px rgba(0,0,0,0.14)", animation:"fadeUp 0.35s ease both" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 14px" }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:19, fontWeight:900, color:"#fff", marginBottom:2 }}>{fav.MolecularFormula}</div>
                        {fav.commonName && fav.commonName!=="Not Available" && <div style={{ color:"#a78bfa", fontSize:11, fontWeight:600, marginBottom:2 }}>✨ {fav.commonName}</div>}
                        <div style={{ color:"rgba(255,255,255,0.6)", fontSize:11, marginBottom:5, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"90%" }}>{fav.IUPACName||fav.searchName||"Unknown"}</div>
                        <span style={{ background:"rgba(255,255,255,0.12)", borderRadius:10, padding:"2px 9px", color:"rgba(255,255,255,0.8)", fontSize:10.5, fontWeight:600 }}>{fav.MolecularWeight} g/mol</span>
                      </div>
                      <button className="plus-btn" onClick={()=>removeFav(fav.MolecularFormula)} style={{ width:50, height:50, borderRadius:14, flexShrink:0, marginLeft:11, background:"rgba(255,255,255,0.86)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(0,0,0,0.2)" }}>
                        <span style={{ fontSize:25, color:"#1a3d2b", lineHeight:1, fontWeight:300 }}>−</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ FLOATING AI BUTTON ══
          Positioned LEFT side to avoid overlap with content on right */}
      <button
        className="ai-fab"
        onClick={() => setShowAI(true)}
        style={{
          position:"fixed",
          bottom:24, right:18,   /* right side, above safe area */
          zIndex:400,
          width:58, height:58,
          borderRadius:"50%",
          border:"2px solid rgba(0,229,255,0.45)",
          background:"linear-gradient(145deg,#001828,#08001e)",
          cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:24,
        }}
        title="Chemix AI Assistant"
        aria-label="Open Chemix AI"
      >
        🧠
        {/* Outer ring */}
        <div style={{ position:"absolute", inset:-5, borderRadius:"50%", border:"1px solid rgba(0,229,255,0.18)", pointerEvents:"none" }} />
        {/* AI badge */}
        <div style={{ position:"absolute", top:-6, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(90deg,#00e5ff,#7c4dff)", borderRadius:20, padding:"1.5px 7px", color:"#fff", fontSize:8, fontWeight:800, letterSpacing:0.5, whiteSpace:"nowrap", boxShadow:"0 2px 7px rgba(0,229,255,0.38)" }}>AI</div>
      </button>

      {/* MODALS */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showAI    && <ChemixAIModal onClose={() => setShowAI(false)} compoundData={compoundData} />}
    </div>
  );
};

export default Main;