import React, { useState } from "react";
import "./App.css";
import ChemixIntro from "./components/ChemixIntro"; // Ensure ChemixIntro.jsx is inside your src/components folder
import Main from "./components/main";

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const openReport = () => {
    window.open("https://github.com/TimedCoder555/Chemix-Encyclopedia/issues", "_blank");
  };

  return (
    <div className="app-container">
      {/* ══════════════════════════════════════
          INTRO ANIMATION ON APP LAUNCH
      ══════════════════════════════════════ */}
      {showIntro ? (
        <ChemixIntro onComplete={() => setShowIntro(false)} />
      ) : (
        <>
          {/* MAIN CONTENT */}
          <div className="main-content">
            <Main />
          </div>

          {/* ══════════════════════════════════════
              FOOTER
          ══════════════════════════════════════ */}
          <footer style={{
            background: "#0a1a0f",
            borderTop: "1px solid rgba(74,222,128,0.15)",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}>

            {/* ── Hero banner inside footer ── */}
            <div style={{
              background: "linear-gradient(135deg,#0d2010 0%,#0a1a14 40%,#111a0d 100%)",
              padding: "48px 24px 40px",
              borderBottom: "1px solid rgba(74,222,128,0.12)",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* BG decoration blobs */}
              <div style={{ position:"absolute", top:-40, right:-40, width:220, height:220, borderRadius:"50%", background:"radial-gradient(circle,rgba(74,222,128,0.06),transparent 70%)", pointerEvents:"none" }} />
              <div style={{ position:"absolute", bottom:-30, left:-30, width:160, height:160, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,200,100,0.05),transparent 70%)", pointerEvents:"none" }} />

              <div style={{ maxWidth:900, margin:"0 auto" }}>
                <h2 style={{
                  fontSize:"clamp(28px,6vw,46px)", fontWeight:900,
                  color:"#fff", lineHeight:1.2, marginBottom:10,
                }}>
                  Explore the world<br />
                  of <span style={{ color:"#4ade80" }}>chemistry.</span>
                </h2>
                <p style={{ color:"rgba(255,255,255,0.6)", fontSize:16, fontWeight:400 }}>
                  Search. Learn. Discover.
                </p>
              </div>
            </div>

            {/* ── Main footer grid ── */}
            <div style={{
              maxWidth: 1000,
              margin: "0 auto",
              padding: "40px 24px 32px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
              gap: "32px 24px",
            }}>

              {/* Col 1 — Brand */}
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                  <div style={{
                    width:46, height:46, borderRadius:12, flexShrink:0,
                    background:"rgba(74,222,128,0.1)",
                    border:"2px solid rgba(74,222,128,0.35)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:22,
                  }}>🧪</div>
                  <div>
                    <div style={{ color:"#4ade80", fontWeight:900, fontSize:15, lineHeight:1.1, letterSpacing:0.3 }}>CHEMIX</div>
                    <div style={{ color:"#4ade80", fontWeight:900, fontSize:15, lineHeight:1.1, letterSpacing:0.3 }}>ENCYCLOPEDIA</div>
                  </div>
                </div>
                <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13, lineHeight:1.7 }}>
                  A futuristic chemistry platform designed for students, researchers, and science lovers.
                </p>
              </div>

              {/* Col 2 — Quick Links */}
              <div>
                <div style={{ color:"#4ade80", fontWeight:800, fontSize:13, letterSpacing:0.8, marginBottom:16, paddingBottom:8, borderBottom:"2px solid #4ade80", display:"inline-block" }}>
                  QUICK LINKS
                </div>
                <ul style={{ listStyle:"none", padding:0, margin:0 }}>
                  {["Home","Elements","Molecules","Favorites","About","Contact"].map(item => (
                    <li key={item} style={{ marginBottom:9, display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80", flexShrink:0 }} />
                      <span style={{ color:"rgba(255,255,255,0.7)", fontSize:13.5, cursor:"pointer", transition:"color 0.2s" }}
                        onMouseEnter={e => e.target.style.color="#4ade80"}
                        onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.7)"}
                      >{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3 — Features */}
              <div>
                <div style={{ color:"#4ade80", fontWeight:800, fontSize:13, letterSpacing:0.8, marginBottom:16, paddingBottom:8, borderBottom:"2px solid #4ade80", display:"inline-block" }}>
                  FEATURES
                </div>
                <ul style={{ listStyle:"none", padding:0, margin:0 }}>
                  {[
                    { icon:"⏱", text:"100M+ Compound Database" },
                    { icon:"🔍", text:"Molecular Formula Search" },
                    { icon:"🏷", text:"IUPAC Name Detection" },
                    { icon:"⚖", text:"Molecular Weight Info" },
                    { icon:"⚡", text:"Fast & Reliable Search" },
                    { icon:"✨", text:"Modern & Futuristic UI" },
                  ].map(f => (
                    <li key={f.text} style={{ marginBottom:9, display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:13, flexShrink:0 }}>{f.icon}</span>
                      <span style={{ color:"rgba(255,255,255,0.7)", fontSize:13 }}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 4 — Connect + Carbon element */}
              <div>
                <div style={{ color:"#4ade80", fontWeight:800, fontSize:13, letterSpacing:0.8, marginBottom:16, paddingBottom:8, borderBottom:"2px solid #4ade80", display:"inline-block" }}>
                  CONNECT WITH ME
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
                  {[
                    { icon:"⬡", label:"GitHub",  value:"github.com/TimedCoder555",     href:"https://github.com/TimedCoder555" },
                    { icon:"◈", label:"Discord", value:"discord.gg/TqV9BjSP",          href:"https://discord.gg/TqV9BjSP" },
                    { icon:"✉", label:"X-box",   value:"coming soon",       href:"https://github.com/TimedCoder555" },
                    { icon:"🌐", label:"Website", value:"Coming Soon...",               href:null },
                  ].map(link => (
                    <div key={link.label} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                      <span style={{ fontSize:15, color:"#4ade80", flexShrink:0, marginTop:1 }}>{link.icon}</span>
                      <div>
                        <div style={{ color:"#4ade80", fontSize:12, fontWeight:700, lineHeight:1.2 }}>{link.label}</div>
                        {link.href
                          ? <a href={link.href} target="_blank" rel="noreferrer" style={{ color:"rgba(255,255,255,0.65)", fontSize:12, textDecoration:"none" }}
                              onMouseEnter={e => e.target.style.color="#4ade80"}
                              onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.65)"}
                            >{link.value}</a>
                          : <span style={{ color:"rgba(255,255,255,0.5)", fontSize:12 }}>{link.value}</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carbon element box */}
                <div style={{
                  width: 80, height: 88,
                  border: "2px solid #4ade80",
                  borderRadius: 8,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  background: "rgba(74,222,128,0.06)",
                  padding: "6px 0",
                }}>
                  <div style={{ color:"#4ade80", fontSize:13, fontWeight:700, lineHeight:1 }}>6</div>
                  <div style={{ color:"#4ade80", fontSize:38, fontWeight:900, lineHeight:1.05 }}>C</div>
                  <div style={{ color:"#4ade80", fontSize:12, fontWeight:700, lineHeight:1 }}>Carbon</div>
                  <div style={{ color:"#4ade80", fontSize:11, lineHeight:1.4 }}>12.011</div>
                </div>
              </div>

            </div>

            {/* ── Bottom bar ── */}
            <div style={{
              borderTop: "1px solid rgba(74,222,128,0.12)",
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              maxWidth: 1000,
              margin: "0 auto",
            }}>

              {/* Left */}
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{
                  width:32, height:32, borderRadius:8,
                  background:"rgba(74,222,128,0.1)",
                  border:"1.5px solid rgba(74,222,128,0.35)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:16,
                }}>🧪</div>
                <span style={{ color:"rgba(255,255,255,0.6)", fontSize:13 }}>
                  Made with <span style={{ color:"#e05252" }}>♥</span> by{" "}
                  <span style={{ color:"rgba(255,255,255,0.85)", fontWeight:700 }}>TimedCoder555</span>
                </span>
              </div>

              {/* Center */}
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12.5, textAlign:"center" }}>
                © 2026 Chemix Encyclopedia. All rights reserved.
              </div>

              {/* Right — social icons */}
              <div style={{ display:"flex", gap:10 }}>
                {[
                  { icon:"⬡", href:"https://github.com/TimedCoder555", title:"GitHub" },
                  { icon:"◈", href:"https://discord.gg/TqV9BjSP",     title:"Discord" },
                  { icon:"📷", href:"#",                               title:"Instagram" },
                  { icon:"🐦", href:"#",                               title:"Twitter" },
                ].map(s => (
                  <a key={s.title} href={s.href} target="_blank" rel="noreferrer" title={s.title} style={{
                    width:36, height:36, borderRadius:"50%",
                    background:"rgba(74,222,128,0.08)",
                    border:"1.5px solid rgba(74,222,128,0.25)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:16, textDecoration:"none",
                    transition:"all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background="rgba(74,222,128,0.2)"; e.currentTarget.style.borderColor="#4ade80"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="rgba(74,222,128,0.08)"; e.currentTarget.style.borderColor="rgba(74,222,128,0.25)"; }}
                  >{s.icon}</a>
                ))}
              </div>
            </div>

          </footer>
        </>
      )}
    </div>
  );
}

export default App;
