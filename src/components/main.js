import React, { useState, useEffect } from "react";
import logo from "../img/logo.png";
import heroBg from "../img/bg.jpg";

// ─────────────────────────────────────────────
// CARD GRADIENTS
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
  /yl\b|ane\b|ene\b|yne\b|ol\b|al\b|one\b|oic acid\b|ate\b|ide\b/i,
  /^[A-Z][a-z]?\d/, /inchi/i, /smiles/i,
];
const isTechnical = (s) => TECHNICAL_PATTERNS.some(p => p.test(s));
const pickCommonName = (synonyms, iupac) => {
  if (!synonyms?.length) return null;
  const candidates = synonyms.filter(s =>
    s !== iupac && s.length > 1 && s.length < 40 &&
    !/^[0-9\-]+$/.test(s) && !/^InChI=/i.test(s) &&
    !/^[A-Z]{14,}/i.test(s) && !isTechnical(s)
  );
  return candidates[0] || null;
};

// ─────────────────────────────────────────────
// CHEMIX AI MODAL
// ─────────────────────────────────────────────
const ChemixAIModal = ({ onClose, compoundData }) => {
  const [input, setInput]       = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "👋 Hello! I'm **Chemix AI**, your futuristic chemistry assistant.\n\nAsk me anything about chemicals, compounds, reactions, or elements!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // If a compound is loaded, offer context
  useEffect(() => {
    if (compoundData) {
      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text: `🔬 I can see you searched for **${compoundData.searchName}** (${compoundData.MolecularFormula}). Feel free to ask me anything about it!`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, []); // only on open

  const sendMessage = async () => {
    const q = input.trim();
    if (!q || thinking) return;
    setInput("");

    const userMsg = {
      role: "user", text: q,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMsg]);
    setThinking(true);

    // Build context-aware system prompt
    const systemPrompt = `You are Chemix AI, a futuristic chemistry assistant inside the Chemix-Encyclopedia app.
You help users understand chemical compounds, elements, reactions, molecular structures, and chemistry concepts.
Be concise, accurate, and friendly. Use relevant chemistry emojis sparingly.
${compoundData ? `The user currently has this compound loaded: ${compoundData.searchName} (${compoundData.MolecularFormula}, MW: ${compoundData.MolecularWeight} g/mol, IUPAC: ${compoundData.IUPACName}).` : ""}
Keep answers under 120 words unless a detailed explanation is truly needed.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            ...messages
              .filter(m => m.role !== "ai" || messages.indexOf(m) > 0)
              .map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text })),
            { role: "user", content: q },
          ],
        }),
      });
      const data = await res.json();
      const reply = data?.content?.[0]?.text || "Sorry, I couldn't generate a response. Please try again.";
      setMessages(prev => [...prev, {
        role: "ai", text: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "ai", text: "⚠️ Connection error. Please check your internet and try again.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }
    setThinking(false);
  };

  const formatText = (text) =>
    text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(0,0,0,0.82)",
      backdropFilter: "blur(12px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      animation: "fadeIn 0.2s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 500,
        height: "88vh",
        background: "linear-gradient(160deg,#04100a 0%,#060d1a 50%,#08040f 100%)",
        borderRadius: "28px 28px 0 0",
        border: "1px solid rgba(0,229,255,0.2)",
        borderBottom: "none",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        animation: "slideUp 0.35s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: "0 -8px 60px rgba(0,180,255,0.15)",
      }}>

        {/* Handle */}
        <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 4px", flexShrink:0 }}>
          <div style={{ width:40, height:4, borderRadius:2, background:"rgba(255,255,255,0.15)" }} />
        </div>

        {/* Header */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"10px 18px 14px",
          borderBottom:"1px solid rgba(0,229,255,0.1)",
          flexShrink: 0,
          background:"linear-gradient(90deg,rgba(0,229,255,0.06),rgba(124,77,255,0.06))",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {/* AI avatar */}
            <div style={{
              width:42, height:42, borderRadius:14, flexShrink:0,
              background:"linear-gradient(135deg,#00e5ff,#7c4dff,#00bcd4)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:20,
              boxShadow:"0 0 18px rgba(0,229,255,0.5)",
              animation:"aiGlow 2.5s ease-in-out infinite",
            }}>🧠</div>
            <div>
              <div style={{
                fontSize:17, fontWeight:900, lineHeight:1.1,
                background:"linear-gradient(90deg,#00e5ff,#7c4dff,#00bcd4,#00e5ff)",
                backgroundSize:"250% auto",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                backgroundClip:"text",
                animation:"aiTextFlow 3s linear infinite",
              }}>
                Chemix AI
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#00e676", boxShadow:"0 0 6px #00e676", animation:"pingDot 1.4s ease-in-out infinite" }} />
                <span style={{ color:"rgba(255,255,255,0.5)", fontSize:10.5 }}>Online · Chemistry Assistant</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)",
            borderRadius:50, width:34, height:34, color:"rgba(255,255,255,0.7)",
            cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center",
          }}>×</button>
        </div>

        {/* Messages */}
        <div style={{
          flex:1, overflowY:"auto", padding:"14px 16px",
          display:"flex", flexDirection:"column", gap:12,
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display:"flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              alignItems:"flex-end", gap:8,
              animation:"fadeUp 0.3s ease both",
            }}>
              {/* Avatar */}
              {msg.role === "ai" && (
                <div style={{
                  width:30, height:30, borderRadius:10, flexShrink:0,
                  background:"linear-gradient(135deg,#00e5ff,#7c4dff)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:14, boxShadow:"0 0 10px rgba(0,229,255,0.35)",
                }}>🧠</div>
              )}
              <div style={{ maxWidth:"78%", display:"flex", flexDirection:"column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  padding:"10px 14px",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg,#00c853,#00e676)"
                    : "rgba(255,255,255,0.06)",
                  border: msg.role === "user"
                    ? "none"
                    : "1px solid rgba(0,229,255,0.15)",
                  color: msg.role === "user" ? "#001a00" : "rgba(255,255,255,0.88)",
                  fontSize:13.5, lineHeight:1.65,
                  boxShadow: msg.role === "user"
                    ? "0 4px 14px rgba(0,200,83,0.25)"
                    : "0 2px 12px rgba(0,0,0,0.3)",
                }} dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
                <span style={{ color:"rgba(255,255,255,0.25)", fontSize:10, marginTop:3, paddingLeft:2, paddingRight:2 }}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {thinking && (
            <div style={{ display:"flex", alignItems:"flex-end", gap:8, animation:"fadeUp 0.3s ease both" }}>
              <div style={{ width:30, height:30, borderRadius:10, background:"linear-gradient(135deg,#00e5ff,#7c4dff)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🧠</div>
              <div style={{
                padding:"12px 16px",
                borderRadius:"18px 18px 18px 4px",
                background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(0,229,255,0.15)",
                display:"flex", gap:5, alignItems:"center",
              }}>
                {[0,1,2].map(d => (
                  <div key={d} style={{
                    width:7, height:7, borderRadius:"50%",
                    background:"rgba(0,229,255,0.7)",
                    animation:`thinkDot 1.2s ease-in-out ${d * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts */}
        <div style={{ padding:"8px 14px 0", flexShrink:0 }}>
          <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:6 }}>
            {[
              "What is H₂O?",
              "Explain ionic bonds",
              "What is pH?",
              compoundData ? `Tell me about ${compoundData.searchName}` : "Periodic table basics",
              "What is organic chemistry?",
            ].map(prompt => (
              <button key={prompt} onClick={() => { setInput(prompt); }} style={{
                background:"rgba(0,229,255,0.07)",
                border:"1px solid rgba(0,229,255,0.2)",
                borderRadius:20, padding:"5px 12px",
                color:"rgba(0,229,255,0.85)", fontSize:11.5, fontWeight:600,
                cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
                transition:"all 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(0,229,255,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(0,229,255,0.07)"; }}
              >{prompt}</button>
            ))}
          </div>
        </div>

        {/* Input bar */}
        <div style={{
          padding:"10px 14px 20px", flexShrink:0,
          borderTop:"1px solid rgba(0,229,255,0.08)",
        }}>
          <div style={{
            display:"flex", alignItems:"center", gap:10,
            background:"rgba(255,255,255,0.05)",
            border:"1.5px solid rgba(0,229,255,0.22)",
            borderRadius:50, padding:"10px 10px 10px 16px",
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask Chemix AI anything..."
              style={{
                flex:1, background:"transparent", border:"none", outline:"none",
                color:"#fff", fontSize:13.5, fontFamily:"inherit",
              }}
            />
            <button onClick={sendMessage} disabled={!input.trim() || thinking} style={{
              width:38, height:38, borderRadius:50, flexShrink:0,
              background: input.trim() && !thinking
                ? "linear-gradient(135deg,#00e5ff,#7c4dff)"
                : "rgba(255,255,255,0.08)",
              border:"none", cursor: input.trim() && !thinking ? "pointer" : "default",
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all 0.22s",
              boxShadow: input.trim() && !thinking ? "0 0 14px rgba(0,229,255,0.4)" : "none",
            }}>
              {thinking
                ? <div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.5)", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
              }
            </button>
          </div>
          <div style={{ textAlign:"center", marginTop:6, color:"rgba(255,255,255,0.2)", fontSize:10 }}>
            Powered by Claude AI · Chemix Encyclopedia
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
  <div onClick={onClose} style={{
    position:"fixed", inset:0, zIndex:1000,
    background:"rgba(0,0,0,0.75)", backdropFilter:"blur(8px)",
    display:"flex", alignItems:"flex-end", justifyContent:"center",
    animation:"fadeIn 0.2s ease",
  }}>
    <div onClick={e => e.stopPropagation()} style={{
      width:"100%", maxWidth:480,
      background:"linear-gradient(160deg,#0d1f15 0%,#0a1625 100%)",
      borderRadius:"28px 28px 0 0",
      border:"1px solid rgba(74,222,128,0.25)", borderBottom:"none",
      padding:"0 0 40px", maxHeight:"88vh", overflowY:"auto",
      animation:"slideUp 0.32s cubic-bezier(0.4,0,0.2,1)",
    }}>
      <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 4px" }}>
        <div style={{ width:42, height:4, borderRadius:2, background:"rgba(255,255,255,0.2)" }} />
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 22px 18px", borderBottom:"1px solid rgba(74,222,128,0.12)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <img src={logo} alt="logo" style={{ width:40, height:40, borderRadius:12, objectFit:"cover", boxShadow:"0 0 14px rgba(74,222,128,0.4)" }} />
          <div>
            <div style={{ fontSize:15, fontWeight:900 }}>
              <span style={{ color:"#4ade80" }}>Chemix</span><span style={{ color:"#60a5fa" }}>Encyclopedia</span>
            </div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", marginTop:1 }}>by TimedCoder555</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:50, width:34, height:34, color:"#fff", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
      </div>
      <div style={{ padding:"20px 22px" }}>
        <p style={{ color:"rgba(255,255,255,0.8)", fontSize:13.5, lineHeight:1.75, marginBottom:20 }}>
          Chemix Encyclopedia is a futuristic chemistry platform designed for students, researchers, and science lovers.
          Explore more than <span style={{ color:"#4ade80", fontWeight:700 }}>100 Million+</span> chemical compounds powered by PubChem.
        </p>
        {[{ color:"#4ade80", label:"✨ FEATURES", items:["100M+ Compound Database","Molecular Formula Search","IUPAC Name Detection","Common Name Detection","Molecular Weight Information","Chemix AI Assistant","Modern Glassmorphism UI","Fast Real-time Search","Mobile Friendly Design","Favorite Compound System"] }].map(sec => (
          <div key={sec.label} style={{ background:`${sec.color}11`, border:`1px solid ${sec.color}22`, borderRadius:16, padding:"14px 16px", marginBottom:14 }}>
            <div style={{ color:sec.color, fontWeight:800, fontSize:11.5, letterSpacing:0.8, marginBottom:10 }}>{sec.label}</div>
            {sec.items.map(item => (
              <div key={item} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:sec.color, flexShrink:0 }} />
                <span style={{ color:"rgba(255,255,255,0.72)", fontSize:12.5 }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
        {[
          { color:"#60a5fa", label:"📚 BUILT FOR", text:"Students, chemistry enthusiasts, researchers, developers, and curious minds who want to explore the world of chemistry in a beautiful modern interface." },
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
    { icon:"🏷️", label:"IUPAC NAME",       val: compoundData.IUPACName || compoundData.searchName || "Unknown", accent:"#00e5b0" },
    { icon:"✨", label:"COMMON NAME",       val: compoundData.commonName || "Not Available", accent:"#a78bfa", glow:true },
    { icon:"⚗️", label:"FORMULA",           val: compoundData.MolecularFormula, accent:"#60a5fa" },
    { icon:"⚖️", label:"MOLECULAR WEIGHT",  val: `${compoundData.MolecularWeight} g/mol`, accent:"#fbbf24" },
  ];
  return (
    <div style={{ marginBottom:18, background:"rgba(10,25,15,0.92)", borderRadius:22, overflow:"hidden", boxShadow:"0 8px 32px rgba(0,229,176,0.10),0 2px 8px rgba(0,0,0,0.3)", border:"1px solid rgba(0,229,176,0.18)", backdropFilter:"blur(20px)", animation:"slideDown 0.38s ease both" }}>
      <div style={{ background:"linear-gradient(90deg,rgba(0,229,176,0.12),rgba(96,165,250,0.08))", padding:"13px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid rgba(0,229,176,0.12)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ position:"relative", width:10, height:10 }}>
            <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#00e5b0", animation:"pingDot 1.4s ease-in-out infinite", opacity:0.5 }} />
            <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#00e5b0" }} />
          </div>
          <span style={{ color:"#00e5b0", fontWeight:800, fontSize:13, letterSpacing:0.5 }}>Compound Found</span>
          <span style={{ background:"rgba(0,229,176,0.12)", border:"1px solid rgba(0,229,176,0.25)", borderRadius:20, padding:"2px 10px", color:"rgba(0,229,176,0.8)", fontSize:10, fontWeight:700 }}>PubChem</span>
        </div>
        <button onClick={onToggleFav} style={{ width:40, height:40, borderRadius:12, border:"none", cursor:"pointer", background: isFav ? "linear-gradient(135deg,#4ade80,#22c55e)" : "rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow: isFav ? "0 0 14px rgba(74,222,128,0.4)" : "none", transition:"all 0.22s" }}>
          <span style={{ fontSize:18, lineHeight:1 }}>{isFav ? "★" : "☆"}</span>
        </button>
      </div>
      {rows.map((r, i) => (
        <div key={r.label} style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"13px 16px", borderBottom: i < rows.length-1 ? "1px solid rgba(255,255,255,0.05)" : "none", position:"relative", background: r.glow ? "rgba(167,139,250,0.04)" : "transparent" }}>
          <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, background:`${r.accent}18`, border:`1.5px solid ${r.accent}35`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, boxShadow: r.glow ? `0 0 10px ${r.accent}30` : "none" }}>{r.icon}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:r.accent, fontSize:9.5, fontWeight:800, letterSpacing:1, marginBottom:3, opacity:0.85 }}>{r.label}</div>
            <div style={{ color: r.val === "Not Available" ? "rgba(255,255,255,0.35)" : "#fff", fontSize:14, fontWeight: r.val === "Not Available" ? 400 : 700, wordBreak:"break-all", lineHeight:1.4, fontStyle: r.val === "Not Available" ? "italic" : "normal" }}>{r.val}</div>
          </div>
          <div style={{ position:"absolute", left:0, top:"20%", bottom:"20%", width:3, borderRadius:"0 2px 2px 0", background:r.accent, opacity:0.5 }} />
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

  useEffect(() => {
    localStorage.setItem("chemix_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async (q) => {
    const query = (q || value).trim();
    if (!query) { setErrorMsg("Please enter a compound name."); return; }
    setErrorMsg(""); setCompound(null); setLoading(true);
    try {
      const propRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`);
      if (!propRes.ok) { setErrorMsg("❌ No compound found."); setLoading(false); return; }
      const propData = await propRes.json();
      if (!propData.PropertyTable?.Properties?.length) { setErrorMsg("❌ No compound found."); setLoading(false); return; }
      const props = propData.PropertyTable.Properties[0];
      let commonName = null;
      try {
        const synRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${props.CID}/synonyms/JSON`);
        if (synRes.ok) {
          const synData = await synRes.json();
          const synonyms = synData?.InformationList?.Information?.[0]?.Synonym || [];
          commonName = pickCommonName(synonyms, props.IUPACName);
        }
      } catch (_) {}
      setCompound({ ...props, searchName: query, commonName: commonName || "Not Available" });
      setNavPage("home"); setActiveTab("home");
    } catch { setErrorMsg("⚠️ Failed to fetch data."); }
    setLoading(false);
  };

  const isFav    = (c) => c && favorites.some(f => f.MolecularFormula === c.MolecularFormula);
  const addFav   = (c) => { if (!c || isFav(c)) return; setFavorites(p => [c, ...p]); };
  const removeFav = (f) => setFavorites(p => p.filter(x => x.MolecularFormula !== f));
  const toggleFav = () => isFav(compoundData) ? removeFav(compoundData.MolecularFormula) : addFav(compoundData);

  return (
    <div style={{ minHeight:"100vh", background:"#eef2ee", fontFamily:"'Segoe UI',system-ui,sans-serif", overflowX:"hidden" }}>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pingDot{0%{transform:scale(1);opacity:0.6}70%{transform:scale(2.2);opacity:0}100%{transform:scale(2.2);opacity:0}}
        @keyframes rainbowFlow{0%{background-position:0% 50%}100%{background-position:200% 50%}}
        @keyframes aiTextFlow{0%{background-position:0% 50%}100%{background-position:250% 50%}}
        @keyframes aiGlow{0%,100%{box-shadow:0 0 18px rgba(0,229,255,0.5)}50%{box-shadow:0 0 30px rgba(124,77,255,0.7),0 0 50px rgba(0,229,255,0.3)}}
        @keyframes aiBtnFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-6px) scale(1.03)}}
        @keyframes aiBtnGlow{0%,100%{box-shadow:0 0 20px rgba(0,229,255,0.5),0 4px 20px rgba(0,0,0,0.4)}50%{box-shadow:0 0 40px rgba(124,77,255,0.7),0 0 60px rgba(0,229,255,0.3),0 4px 20px rgba(0,0,0,0.4)}}
        @keyframes thinkDot{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}
        @keyframes reportPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,80,80,0.4)}50%{box-shadow:0 0 0 8px rgba(255,80,80,0)}}

        .rainbow-text{background:linear-gradient(90deg,#ff0080,#ff4500,#ffd700,#00e676,#00bcd4,#7c4dff,#ff4081,#ff0080);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:rainbowFlow 2.4s linear infinite;font-weight:700;}
        input::placeholder{color:rgba(255,255,255,0.45);}
        input:focus{outline:none;}
        .nav-lnk{transition:all 0.18s;cursor:pointer;}
        .nav-lnk:hover{color:#00e5b0!important;}
        .search-box:focus-within{border-color:rgba(255,255,255,0.8)!important;box-shadow:0 0 0 3px rgba(255,255,255,0.1)!important;}
        .chip:hover{background:rgba(45,90,61,0.22)!important;transform:translateY(-1px);}
        .plus-btn{transition:all 0.18s;}
        .plus-btn:hover{transform:scale(1.08);}
        .plus-btn:active{transform:scale(0.93);}
        .fav-card{transition:transform 0.2s,box-shadow 0.2s;}
        .fav-card:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,0.22)!important;}
        .el-card:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,0.12)!important;}
        .mol-card:hover{background:#f3f8f3!important;}
        .report-btn{animation:reportPulse 2.2s ease-in-out infinite;transition:transform 0.18s!important;}
        .report-btn:hover{transform:translateY(-2px) scale(1.02)!important;}
        .ai-fab{animation:aiBtnFloat 3s ease-in-out infinite,aiBtnGlow 3s ease-in-out infinite;}
        .ai-fab:hover{transform:translateY(-4px) scale(1.08)!important;animation:none!important;box-shadow:0 0 50px rgba(0,229,255,0.8),0 0 80px rgba(124,77,255,0.5)!important;}
        .ai-fab:active{transform:scale(0.95)!important;}
        @media(min-width:480px){.content-pad{padding:16px 24px 60px!important;}}
      `}</style>

      {/* ══ NAVBAR ══ */}
      <div style={{ background:"rgba(4,12,8,0.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(74,222,128,0.12)", position:"sticky", top:0, zIndex:300 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.05)", flexWrap:"wrap" }}>
          <img src={logo} alt="logo" style={{ width:46, height:46, borderRadius:12, objectFit:"cover", boxShadow:"0 0 16px rgba(74,222,128,0.35)", flexShrink:0 }} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:"clamp(15px,4vw,19px)", fontWeight:900, lineHeight:1.1, whiteSpace:"nowrap" }}>
              <span style={{ color:"#00e5b0" }}>Chemix-</span><span style={{ color:"#00c4ff" }}>Encyclopedia</span>
            </div>
            <div style={{ fontSize:12, marginTop:3 }}>by <span className="rainbow-text">Timedcoder</span></div>
          </div>
          <button className="report-btn" onClick={() => window.open("https://github.com/TimedCoder555/Chemix-Encyclopedia/issues","_blank")} style={{ flexShrink:0, display:"flex", alignItems:"center", gap:8, background:"linear-gradient(135deg,#1a0a0a,#2d1010)", border:"1.5px solid rgba(255,80,80,0.5)", borderRadius:14, padding:"8px 14px", cursor:"pointer" }}>
            <span style={{ fontSize:18, lineHeight:1 }}>🐛</span>
            <div>
              <div style={{ color:"#ff6b6b", fontSize:11, fontWeight:800, letterSpacing:0.5, lineHeight:1.1 }}>REPORT HERE</div>
              <div style={{ color:"rgba(255,107,107,0.6)", fontSize:9.5, lineHeight:1.1 }}>Report bugs &amp; issues</div>
            </div>
          </button>
        </div>
        <div style={{ display:"flex" }}>
          {[{id:"home",label:"HOME"},{id:"elements",label:"ELEMENTS"},{id:"molecules",label:"MOLECULES"},{id:"about",label:"ABOUT"}].map(link => {
            const active = link.id !== "about" && navPage === link.id;
            return (
              <button key={link.id} className="nav-lnk" onClick={() => { if(link.id==="about"){setShowAbout(true);return;} setNavPage(link.id);setActiveTab("home"); }} style={{ flex:1, background:"none", border:"none", color: active?"#00e5b0":"rgba(255,255,255,0.55)", fontSize:11, fontWeight:800, letterSpacing:0.6, padding:"9px 4px", borderBottom: active?"2.5px solid #00e5b0":"2.5px solid transparent", cursor:"pointer", transition:"all 0.18s" }}>
                {link.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ HERO ══ */}
      <div style={{ position:"relative", minHeight:420, backgroundImage:`url(${heroBg})`, backgroundSize:"cover", backgroundPosition:"center", display:"flex", flexDirection:"column" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(2,10,5,0.52) 0%,rgba(10,30,18,0.45) 55%,rgba(25,55,35,0.78) 100%)" }} />
        <div style={{ position:"relative", zIndex:5, flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"36px 22px 60px", animation:"fadeUp 0.7s ease both" }}>
          <h1 style={{ fontSize:"clamp(28px,9vw,44px)", fontWeight:900, color:"#fff", lineHeight:1.15, letterSpacing:-0.5, marginBottom:14, textShadow:"0 2px 24px rgba(0,0,0,0.5)" }}>
            "Chemistry is the<br/><span style={{ color:"#86efac" }}>poetry</span> of<br/>invisible molecules."
          </h1>
          <p style={{ color:"rgba(255,255,255,0.72)", fontSize:14.5, lineHeight:1.7, maxWidth:340 }}>
            Explore compounds, elements, reactions and molecular structures in a futuristic chemistry experience.
          </p>
        </div>
        <div style={{ position:"absolute", bottom:-1, left:0, right:0, zIndex:5 }}>
          <svg viewBox="0 0 414 56" width="100%" height="56" preserveAspectRatio="none">
            <path d="M0,0 C60,40 140,5 220,32 C290,54 360,12 414,38 L414,56 L0,56 Z" fill="#eef2ee"/>
          </svg>
        </div>
      </div>

      {/* ══ SEARCH BAR ══ */}
      <div style={{ position:"sticky", top:95, zIndex:100, background:"rgba(238,242,238,0.96)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(0,0,0,0.06)", padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
        <div className="search-box" style={{ flex:1, display:"flex", alignItems:"center", gap:8, background:"#2d3d30", border:"1.5px solid rgba(74,222,128,0.25)", borderRadius:50, padding:"10px 14px", transition:"all 0.22s" }}>
          {loading
            ? <div style={{ width:14, height:14, border:"2px solid #4ade80", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.7s linear infinite", flexShrink:0 }} />
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          }
          <input type="text" value={value} onChange={e=>setValue(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSearch()} placeholder="Search compound name or formula..." style={{ flex:1, background:"transparent", border:"none", color:"#fff", fontSize:13.5, fontFamily:"inherit", minWidth:0 }} />
          {value && <button onClick={()=>{setValue("");setCompound(null);setErrorMsg("");}} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:18, padding:0, lineHeight:1 }}>×</button>}
        </div>
        <button onClick={()=>setActiveTab(activeTab==="favorites"?"home":"favorites")} style={{ flexShrink:0, background: activeTab==="favorites"?"#4ade80":"#2d3d30", border:"1.5px solid rgba(74,222,128,0.3)", borderRadius:50, padding:"9px 14px", color: activeTab==="favorites"?"#0a2010":"rgba(255,255,255,0.8)", fontSize:12.5, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, transition:"all 0.2s", whiteSpace:"nowrap" }}>
          ⭐{favorites.length>0&&<span style={{ background: activeTab==="favorites"?"#0a2010":"#4ade80", color: activeTab==="favorites"?"#4ade80":"#0a2010", borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:800 }}>{favorites.length}</span>}
        </button>
      </div>

      {/* ══ CONTENT ══ */}
      <div className="content-pad" style={{ padding:"14px 15px 80px", maxWidth:520, margin:"0 auto" }}>
        {errorMsg && <div style={{ marginBottom:12, color:"#ef4444", fontSize:13, fontWeight:600, background:"rgba(239,68,68,0.08)", borderRadius:12, padding:"10px 14px", animation:"fadeIn 0.3s ease" }}>{errorMsg}</div>}

        {activeTab==="home" && navPage==="home" && (
          <>
            {compoundData && <ResultCard compoundData={compoundData} isFav={isFav(compoundData)} onToggleFav={toggleFav} />}
            <p style={{ color:"#7a8e7a", fontSize:10.5, fontWeight:700, letterSpacing:0.8, marginBottom:9 }}>QUICK SEARCH</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:18 }}>
              {[{label:"H₂O",q:"water"},{label:"CO₂",q:"carbon dioxide"},{label:"NaCl",q:"sodium chloride"},{label:"NH₃",q:"ammonia"},{label:"C₆H₁₂O₆",q:"glucose"},{label:"CH₄",q:"methane"},{label:"C₂H₅OH",q:"ethanol"}].map(({label,q})=>(
                <button key={label} className="chip" onClick={()=>{setValue(q);handleSearch(q);}} style={{ background:"rgba(45,90,61,0.10)", border:"1.5px solid rgba(45,90,61,0.18)", borderRadius:20, padding:"6px 12px", color:"#1a4a2a", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"monospace", transition:"all 0.2s" }}>{label}</button>
              ))}
            </div>
            {!compoundData && (
              <div style={{ background:"#fff", borderRadius:20, padding:"28px 18px", textAlign:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize:36, marginBottom:10 }}>⚗️</div>
                <div style={{ color:"#1a4a2a", fontWeight:800, fontSize:15, marginBottom:6 }}>Start exploring</div>
                <div style={{ color:"#9ca3af", fontSize:13, lineHeight:1.65 }}>Type a compound name or formula above and press Enter.</div>
              </div>
            )}
          </>
        )}

        {activeTab==="home" && navPage==="elements" && (
          <div style={{ animation:"fadeUp 0.4s ease both" }}>
            <div style={{ background:"#fff", borderRadius:20, padding:"22px 18px", textAlign:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.05)", marginBottom:14 }}>
              <div style={{ fontSize:38, marginBottom:8 }}>🔬</div>
              <div style={{ color:"#1a4a2a", fontWeight:800, fontSize:15, marginBottom:6 }}>Elements</div>
              <p style={{ color:"#9ca3af", fontSize:13, lineHeight:1.65 }}>Tap any element to search it instantly.</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[{symbol:"H",name:"Hydrogen",num:1,color:"#60a5fa"},{symbol:"O",name:"Oxygen",num:8,color:"#f87171"},{symbol:"C",name:"Carbon",num:6,color:"#a78bfa"},{symbol:"N",name:"Nitrogen",num:7,color:"#4ade80"},{symbol:"Na",name:"Sodium",num:11,color:"#fbbf24"},{symbol:"Fe",name:"Iron",num:26,color:"#fb923c"},{symbol:"Au",name:"Gold",num:79,color:"#f59e0b"},{symbol:"Ag",name:"Silver",num:47,color:"#94a3b8"}].map(el=>(
                <button key={el.symbol} className="el-card" onClick={()=>{setValue(el.name);handleSearch(el.name);setNavPage("home");}} style={{ background:"#fff", border:`2px solid ${el.color}30`, borderRadius:16, padding:"13px 12px", display:"flex", alignItems:"center", gap:11, cursor:"pointer", transition:"all 0.2s", textAlign:"left", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ width:46, height:46, borderRadius:13, flexShrink:0, background:`${el.color}18`, border:`2px solid ${el.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:900, color:el.color }}>{el.symbol}</div>
                  <div><div style={{ color:"#1a2e1a", fontWeight:700, fontSize:13 }}>{el.name}</div><div style={{ color:"#9ca3af", fontSize:11, marginTop:2 }}>Atomic № {el.num}</div></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab==="home" && navPage==="molecules" && (
          <div style={{ animation:"fadeUp 0.4s ease both" }}>
            <div style={{ background:"#fff", borderRadius:20, padding:"22px 18px", textAlign:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.05)", marginBottom:14 }}>
              <div style={{ fontSize:38, marginBottom:8 }}>🧪</div>
              <div style={{ color:"#1a4a2a", fontWeight:800, fontSize:15, marginBottom:6 }}>Molecules</div>
              <p style={{ color:"#9ca3af", fontSize:13, lineHeight:1.65 }}>Tap any molecule to search it instantly.</p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[{formula:"H₂O",name:"Water",desc:"Universal solvent of life",q:"water",color:"#60a5fa"},{formula:"CO₂",name:"Carbon Dioxide",desc:"Greenhouse gas, used in photosynthesis",q:"carbon dioxide",color:"#f87171"},{formula:"NH₃",name:"Ammonia",desc:"Key nitrogen compound in fertilizers",q:"ammonia",color:"#4ade80"},{formula:"CH₄",name:"Methane",desc:"Simplest hydrocarbon, natural gas",q:"methane",color:"#fbbf24"},{formula:"C₆H₁₂O₆",name:"Glucose",desc:"Primary energy source for cells",q:"glucose",color:"#fb923c"},{formula:"C₂H₅OH",name:"Ethanol",desc:"Alcohol used in beverages & fuel",q:"ethanol",color:"#a78bfa"},{formula:"NaCl",name:"Sodium Chloride",desc:"Common table salt, ionic bond",q:"sodium chloride",color:"#34d399"}].map(mol=>(
                <button key={mol.formula} className="mol-card" onClick={()=>{setValue(mol.q);handleSearch(mol.q);setNavPage("home");}} style={{ background:"#fff", border:`2px solid ${mol.color}28`, borderRadius:16, padding:"13px 14px", display:"flex", alignItems:"center", gap:13, cursor:"pointer", textAlign:"left", transition:"all 0.2s", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ width:54, height:54, borderRadius:14, flexShrink:0, background:`${mol.color}15`, border:`2px solid ${mol.color}38`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11.5, fontWeight:900, color:mol.color, fontFamily:"monospace", textAlign:"center", padding:2 }}>{mol.formula}</div>
                  <div><div style={{ color:"#1a2e1a", fontWeight:700, fontSize:13.5 }}>{mol.name}</div><div style={{ color:"#9ca3af", fontSize:12, marginTop:2 }}>{mol.desc}</div></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab==="favorites" && (
          <div style={{ animation:"fadeUp 0.3s ease both" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <p style={{ color:"#7a8e7a", fontSize:10.5, fontWeight:700, letterSpacing:0.8 }}>SAVED COMPOUNDS ({favorites.length})</p>
              {favorites.length>0 && <button onClick={()=>setFavorites([])} style={{ background:"none", border:"none", color:"#ef4444", fontSize:11, fontWeight:700, cursor:"pointer" }}>Clear all</button>}
            </div>
            {favorites.length===0 ? (
              <div style={{ background:"#fff", borderRadius:20, padding:"36px 18px", textAlign:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize:36, marginBottom:10 }}>⭐</div>
                <div style={{ color:"#1a4a2a", fontWeight:800, fontSize:15, marginBottom:6 }}>No favorites yet</div>
                <div style={{ color:"#9ca3af", fontSize:13, lineHeight:1.65 }}>Search a compound and tap ☆ to save here.</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
                {favorites.map((fav,idx)=>(
                  <div key={fav.MolecularFormula} className="fav-card" style={{ background:CARD_GRADS[idx%CARD_GRADS.length], borderRadius:20, boxShadow:"0 4px 16px rgba(0,0,0,0.14)", animation:"fadeUp 0.35s ease both" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"15px" }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:20, fontWeight:900, color:"#fff", marginBottom:2 }}>{fav.MolecularFormula}</div>
                        {fav.commonName && fav.commonName!=="Not Available" && <div style={{ color:"#a78bfa", fontSize:11.5, fontWeight:600, marginBottom:2 }}>✨ {fav.commonName}</div>}
                        <div style={{ color:"rgba(255,255,255,0.62)", fontSize:11.5, marginBottom:6, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"90%" }}>{fav.IUPACName||fav.searchName||"Unknown"}</div>
                        <span style={{ background:"rgba(255,255,255,0.13)", borderRadius:10, padding:"2px 10px", color:"rgba(255,255,255,0.82)", fontSize:11, fontWeight:600 }}>{fav.MolecularWeight} g/mol</span>
                      </div>
                      <button className="plus-btn" onClick={()=>removeFav(fav.MolecularFormula)} style={{ width:52, height:52, borderRadius:15, flexShrink:0, marginLeft:12, background:"rgba(255,255,255,0.88)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(0,0,0,0.2)" }}>
                        <span style={{ fontSize:26, color:"#1a3d2b", lineHeight:1, fontWeight:300 }}>−</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ FLOATING AI BUTTON ══ */}
      <button
        className="ai-fab"
        onClick={() => setShowAI(true)}
        style={{
          position: "fixed",
          bottom: 28, right: 20,
          zIndex: 500,
          width: 62, height: 62,
          borderRadius: "50%",
          border: "2px solid rgba(0,229,255,0.5)",
          background: "linear-gradient(135deg,#001a2e,#0a0020)",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26,
        }}
        title="Open Chemix AI"
      >
        🧠
        {/* Outer ring */}
        <div style={{
          position:"absolute", inset:-4, borderRadius:"50%",
          border:"1.5px solid rgba(0,229,255,0.25)",
          pointerEvents:"none",
        }} />
        {/* Label badge */}
        <div style={{
          position:"absolute", top:-8, left:"50%", transform:"translateX(-50%)",
          background:"linear-gradient(90deg,#00e5ff,#7c4dff)",
          borderRadius:20, padding:"2px 8px",
          color:"#fff", fontSize:8.5, fontWeight:800, letterSpacing:0.5,
          whiteSpace:"nowrap",
          boxShadow:"0 2px 8px rgba(0,229,255,0.4)",
        }}>AI</div>
      </button>

      {/* MODALS */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showAI    && <ChemixAIModal onClose={() => setShowAI(false)} compoundData={compoundData} />}
    </div>
  );
};

export default Main;
