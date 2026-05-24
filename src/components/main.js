import React, { useState, useEffect, useRef } from "react";
import logo from "../img/logo.png";
import heroBg from "../img/bg.jpg";

// ─────────────────────────────────────────────
// ABOUT MODAL
// ─────────────────────────────────────────────
const AboutModal = ({ onClose }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(8px)",
    display: "flex", alignItems: "flex-end", justifyContent: "center",
    animation: "fadeIn 0.2s ease",
  }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{
      width: "100%", maxWidth: 480,
      background: "linear-gradient(160deg, #0d1f15 0%, #0a1625 100%)",
      borderRadius: "28px 28px 0 0",
      border: "1px solid rgba(74,222,128,0.25)",
      borderBottom: "none",
      padding: "0 0 40px",
      maxHeight: "88vh", overflowY: "auto",
      animation: "slideUp 0.32s cubic-bezier(0.4,0,0.2,1)",
    }}>
      {/* Handle bar */}
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
        <div style={{ width: 42, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} />
      </div>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 22px 18px",
        borderBottom: "1px solid rgba(74,222,128,0.12)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logo} alt="logo" style={{ width: 40, height: 40, borderRadius: 12, objectFit: "cover", boxShadow: "0 0 14px rgba(74,222,128,0.4)" }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 900 }}>
              <span style={{ color: "#4ade80" }}>Chemix</span>
              <span style={{ color: "#60a5fa" }}>Encyclopedia</span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>by TimedCoder555</div>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 50, width: 34, height: 34, color: "#fff",
          cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
        }}>×</button>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 22px" }}>
        {/* Intro */}
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13.5, lineHeight: 1.75, marginBottom: 20 }}>
          Chemix Encyclopedia is a futuristic chemistry platform designed for students, researchers, and science lovers.
          Explore more than <span style={{ color: "#4ade80", fontWeight: 700 }}>100 Million+</span> chemical compounds
          with powerful search technology powered by PubChem database.
        </p>

        {/* Features */}
        <div style={{
          background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.18)",
          borderRadius: 16, padding: "16px 18px", marginBottom: 16,
        }}>
          <div style={{ color: "#4ade80", fontWeight: 800, fontSize: 12.5, letterSpacing: 0.8, marginBottom: 12 }}>
            ✨ FEATURES
          </div>
          {[
            "100M+ Compound Database",
            "Molecular Formula Search",
            "IUPAC Name Detection",
            "Molecular Weight Information",
            "Modern Glassmorphism UI",
            "Fast Real-time Search",
            "Mobile Friendly Design",
            "Featured Compound Carousel",
            "Favorite Compound System",
            "Quick Search Buttons",
          ].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Built For */}
        <div style={{
          background: "rgba(96,165,250,0.07)", border: "1px solid rgba(96,165,250,0.18)",
          borderRadius: 16, padding: "16px 18px", marginBottom: 16,
        }}>
          <div style={{ color: "#60a5fa", fontWeight: 800, fontSize: 12.5, letterSpacing: 0.8, marginBottom: 8 }}>
            📚 BUILT FOR
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.7 }}>
            Students, chemistry enthusiasts, researchers, developers, and curious minds who want to explore the world of chemistry in a beautiful modern interface.
          </p>
        </div>

        {/* Tech */}
        <div style={{
          background: "rgba(167,139,250,0.07)", border: "1px solid rgba(167,139,250,0.18)",
          borderRadius: 16, padding: "14px 18px", marginBottom: 16,
        }}>
          <div style={{ color: "#a78bfa", fontWeight: 800, fontSize: 12.5, letterSpacing: 0.8, marginBottom: 8 }}>
            ⚡ TECHNOLOGY
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {["React.js", "PubChem API", "Modern UI/UX", "Responsive Design"].map(t => (
              <span key={t} style={{
                background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.25)",
                borderRadius: 20, padding: "4px 12px",
                color: "#c4b5fd", fontSize: 12, fontWeight: 600,
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Vision */}
        <div style={{
          background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.18)",
          borderRadius: 16, padding: "14px 18px", marginBottom: 20,
        }}>
          <div style={{ color: "#fbbf24", fontWeight: 800, fontSize: 12.5, letterSpacing: 0.8, marginBottom: 8 }}>
            🌿 VISION
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.7 }}>
            Making chemistry exploration simple, futuristic, and enjoyable for everyone.
          </p>
        </div>

        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
          Made with passion by <span style={{ color: "#4ade80", fontWeight: 700 }}>TimedCoder555</span> 💚
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
const Main = () => {

  const [value, setValue] = useState("");
  const [compoundData, setCompoundData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showAbout, setShowAbout] = useState(false);
  const [navPage, setNavPage] = useState("home"); // home | elements | molecules
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("chemix_favorites") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("chemix_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ── SEARCH ──
  const handleSearch = async (q) => {
    const query = (q || value).trim();
    if (!query) { setErrorMessage("Please enter a compound name."); return; }
    setErrorMessage(""); setCompoundData(null); setLoading(true);
    try {
      const res = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`
      );
      if (!res.ok) { setErrorMessage("❌ No compound found."); setLoading(false); return; }
      const data = await res.json();
      if (!data.PropertyTable?.Properties?.length) { setErrorMessage("❌ No compound found."); setLoading(false); return; }
      setCompoundData({ ...data.PropertyTable.Properties[0], searchName: query });
      setNavPage("home"); setActiveTab("home");
    } catch { setErrorMessage("⚠️ Failed to fetch data."); }
    setLoading(false);
  };

  const isFav = (c) => c && favorites.some(f => f.MolecularFormula === c.MolecularFormula);
  const addFav = (c) => { if (!c || isFav(c)) return; setFavorites(p => [c, ...p]); };
  const removeFav = (formula) => setFavorites(p => p.filter(f => f.MolecularFormula !== formula));

  const cardGrads = [
    "linear-gradient(135deg,#1a3d2b,#0d2b1a)",
    "linear-gradient(135deg,#1a2b3d,#0d1a2b)",
    "linear-gradient(135deg,#3d2b1a,#2b1a0d)",
    "linear-gradient(135deg,#2b2010,#1a1408)",
    "linear-gradient(135deg,#2b1a3d,#1a0d2b)",
    "linear-gradient(135deg,#0d2d22,#071a14)",
    "linear-gradient(135deg,#3d1a2b,#2b0d1a)",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#eef2ee", fontFamily: "'Segoe UI', system-ui, sans-serif", overflowX: "hidden" }}>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(60px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        input::placeholder { color: rgba(255,255,255,0.5); }
        input:focus { outline: none; }
        .fav-card { transition: transform 0.2s, box-shadow 0.2s; }
        .fav-card:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.2) !important; }
        .chip:hover { background: rgba(45,90,61,0.2) !important; transform: translateY(-1px); }
        .plus-btn { transition: all 0.18s; }
        .plus-btn:hover { transform: scale(1.08); }
        .plus-btn:active { transform: scale(0.94); }
        .nav-link { transition: all 0.18s; cursor: pointer; }
        .nav-link:hover { color: #00e5b0 !important; }
        .search-box:focus-within { border-color: rgba(255,255,255,0.85) !important; box-shadow: 0 0 0 3px rgba(255,255,255,0.12) !important; }
        .sbtn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(74,222,128,0.45) !important; }
      `}</style>

      {/* ══════════════ TOP NAVBAR ══════════════ */}
      <div style={{
        background: "rgba(5,15,10,0.97)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(74,222,128,0.12)",
        position: "sticky", top: 0, zIndex: 200,
      }}>
        {/* Row 1: Logo + brand */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 16px 8px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <img src={logo} alt="logo" style={{
            width: 46, height: 46, borderRadius: 12, objectFit: "cover",
            boxShadow: "0 0 16px rgba(74,222,128,0.35)",
          }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.1 }}>
              <span style={{ color: "#00e5b0" }}>Chemix-</span>
              <span style={{ color: "#00c4ff" }}>Encyclopedia</span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.42)", fontSize: 11, marginTop: 1 }}>by Timedcoder</div>
          </div>
        </div>

        {/* Row 2: Nav links */}
        <div style={{ display: "flex", padding: "0 6px" }}>
          {[
            { id: "home", label: "HOME" },
            { id: "elements", label: "ELEMENTS" },
            { id: "molecules", label: "MOLECULES" },
            { id: "about", label: "ABOUT" },
          ].map(link => (
            <button key={link.id} className="nav-link" onClick={() => {
              if (link.id === "about") { setShowAbout(true); return; }
              setNavPage(link.id);
              setActiveTab("home");
            }} style={{
              flex: 1, background: "none", border: "none",
              color: navPage === link.id && link.id !== "about"
                ? "#00e5b0" : "rgba(255,255,255,0.6)",
              fontSize: 11, fontWeight: 800, letterSpacing: 0.6,
              padding: "10px 4px",
              borderBottom: navPage === link.id && link.id !== "about"
                ? "2px solid #00e5b0" : "2px solid transparent",
              cursor: "pointer",
              transition: "all 0.18s",
            }}>
              {link.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════ HERO ══════════════ */}
      <div style={{
        position: "relative", minHeight: 420,
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", flexDirection: "column",
      }}>
        {/* Overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg,rgba(2,10,5,0.52) 0%,rgba(10,30,18,0.45) 55%,rgba(25,55,35,0.78) 100%)",
        }} />

        {/* Hero text */}
        <div style={{
          position: "relative", zIndex: 5, flex: 1,
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "36px 22px 60px",
          animation: "fadeUp 0.7s ease both",
        }}>
          <h1 style={{
            fontSize: "clamp(28px,9vw,44px)", fontWeight: 900, color: "#fff",
            lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 14,
            textShadow: "0 2px 24px rgba(0,0,0,0.5)",
          }}>
            "Chemistry is the<br />
            <span style={{ color: "#86efac" }}>poetry</span> of<br />
            invisible molecules."
          </h1>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 14.5, lineHeight: 1.7, maxWidth: 340 }}>
            Explore compounds, elements, reactions and molecular structures in a futuristic chemistry experience.
          </p>
        </div>

        {/* Wave */}
        <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, zIndex: 5 }}>
          <svg viewBox="0 0 414 56" width="100%" height="56" preserveAspectRatio="none">
            <path d="M0,0 C60,40 140,5 220,32 C290,54 360,12 414,38 L414,56 L0,56 Z" fill="#eef2ee" />
          </svg>
        </div>
      </div>

      {/* ══════════════ STICKY SEARCH + TABS ══════════════ */}
      <div style={{
        position: "sticky", top: 88, zIndex: 100,
        background: "rgba(238,242,238,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "10px 14px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        {/* Search */}
        <div className="search-box" style={{
          flex: 1, display: "flex", alignItems: "center", gap: 8,
          background: "#2d3d30",
          border: "1.5px solid rgba(74,222,128,0.25)",
          borderRadius: 50, padding: "10px 14px",
          transition: "all 0.22s",
        }}>
          {loading
            ? <div style={{ width: 14, height: 14, border: "2px solid #4ade80", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
          }
          <input
            type="text" value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Search compound..."
            style={{
              flex: 1, background: "transparent", border: "none",
              color: "#fff", fontSize: 13.5, fontFamily: "inherit", minWidth: 0,
            }}
          />
          {value && (
            <button onClick={() => { setValue(""); setCompoundData(null); setErrorMessage(""); }}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 18, padding: 0, lineHeight: 1 }}>×</button>
          )}
        </div>

        {/* ⭐ Favorites tab button */}
        <button onClick={() => setActiveTab(activeTab === "favorites" ? "home" : "favorites")} style={{
          flexShrink: 0,
          background: activeTab === "favorites" ? "#4ade80" : "#2d3d30",
          border: "1.5px solid rgba(74,222,128,0.3)",
          borderRadius: 50, padding: "9px 14px",
          color: activeTab === "favorites" ? "#0a2010" : "rgba(255,255,255,0.8)",
          fontSize: 12.5, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
          whiteSpace: "nowrap",
        }}>
          ⭐
          {favorites.length > 0 && (
            <span style={{
              background: activeTab === "favorites" ? "#0a2010" : "#4ade80",
              color: activeTab === "favorites" ? "#4ade80" : "#0a2010",
              borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 800,
            }}>{favorites.length}</span>
          )}
        </button>
      </div>

      {/* ══════════════ CONTENT ══════════════ */}
      <div style={{ padding: "14px 15px 60px", maxWidth: 480, margin: "0 auto" }}>

        {errorMessage && (
          <div style={{
            marginBottom: 12, color: "#ef4444", fontSize: 13, fontWeight: 600,
            background: "rgba(239,68,68,0.08)", borderRadius: 12, padding: "10px 14px",
            animation: "fadeIn 0.3s ease",
          }}>{errorMessage}</div>
        )}

        {/* ── HOME / SEARCH RESULT ── */}
        {activeTab === "home" && navPage === "home" && (
          <>
            {/* Result card */}
            {compoundData && (
              <div style={{
                marginBottom: 16, background: "#fff",
                borderRadius: 20, overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.09)",
                animation: "slideDown 0.38s ease both",
              }}>
                <div style={{
                  background: "linear-gradient(135deg,#1a3d2b,#0d2b1a)",
                  padding: "13px 16px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 7px #4ade80" }} />
                    <span style={{ color: "#86efac", fontWeight: 700, fontSize: 12.5 }}>Compound Found</span>
                  </div>
                  <button className="plus-btn" onClick={() => isFav(compoundData) ? removeFav(compoundData.MolecularFormula) : addFav(compoundData)} style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: isFav(compoundData) ? "#4ade80" : "rgba(255,255,255,0.15)",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}>
                    <span style={{ fontSize: 19, color: isFav(compoundData) ? "#0a2010" : "#fff", lineHeight: 1 }}>
                      {isFav(compoundData) ? "★" : "+"}
                    </span>
                  </button>
                </div>
                {[
                  { icon: "🏷️", label: "IUPAC Name", val: compoundData.IUPACName || compoundData.searchName || "Unknown" },
                  { icon: "⚗️", label: "Formula", val: compoundData.MolecularFormula },
                  { icon: "⚖️", label: "Mol. Weight", val: `${compoundData.MolecularWeight} g/mol` },
                ].map((r, i) => (
                  <div key={r.label} style={{
                    display: "flex", alignItems: "center", gap: 13, padding: "12px 16px",
                    borderBottom: i < 2 ? "1px solid #f0f4f0" : "none",
                  }}>
                    <span style={{ fontSize: 17 }}>{r.icon}</span>
                    <div>
                      <div style={{ color: "#adb5bd", fontSize: 9.5, fontWeight: 700, letterSpacing: 0.8, marginBottom: 2 }}>{r.label}</div>
                      <div style={{ color: "#1a2e1a", fontSize: 14, fontWeight: 700, wordBreak: "break-all" }}>{r.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick search */}
            <p style={{ color: "#7a8e7a", fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, marginBottom: 9 }}>QUICK SEARCH</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
              {[
                { label: "H₂O", q: "water" }, { label: "CO₂", q: "carbon dioxide" },
                { label: "NaCl", q: "sodium chloride" }, { label: "NH₃", q: "ammonia" },
                { label: "C₆H₁₂O₆", q: "glucose" }, { label: "CH₄", q: "methane" },
                { label: "C₂H₅OH", q: "ethanol" },
              ].map(({ label, q }) => (
                <button key={label} className="chip" onClick={() => { setValue(q); handleSearch(q); }} style={{
                  background: "rgba(45,90,61,0.10)", border: "1.5px solid rgba(45,90,61,0.18)",
                  borderRadius: 20, padding: "6px 12px",
                  color: "#1a4a2a", fontSize: 12, fontWeight: 700,
                  cursor: "pointer", fontFamily: "monospace", transition: "all 0.2s",
                }}>{label}</button>
              ))}
            </div>

            {!compoundData && (
              <div style={{ background: "#fff", borderRadius: 20, padding: "28px 18px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>⚗️</div>
                <div style={{ color: "#1a4a2a", fontWeight: 800, fontSize: 15, marginBottom: 6 }}>Start exploring</div>
                <div style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.65 }}>
                  Type a compound name or formula in the search bar above and press Enter or tap Search.
                </div>
              </div>
            )}
          </>
        )}

        {/* ── ELEMENTS PAGE ── */}
        {activeTab === "home" && navPage === "elements" && (
          <div style={{ animation: "fadeUp 0.4s ease both" }}>
            <div style={{ background: "#fff", borderRadius: 20, padding: "24px 18px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: 14 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🔬</div>
              <div style={{ color: "#1a4a2a", fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Elements</div>
              <p style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.7 }}>
                Search any element from the periodic table using the search bar above.
                Type the element name or symbol (e.g. "Gold", "Fe", "Carbon").
              </p>
              <button className="sbtn" onClick={() => { setValue(""); document.querySelector("input")?.focus(); }} style={{
                marginTop: 16, background: "linear-gradient(135deg,#4ade80,#22c55e)",
                border: "none", borderRadius: 50, padding: "10px 22px",
                color: "#0a2010", fontSize: 13, fontWeight: 800, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(74,222,128,0.3)", transition: "all 0.22s",
              }}>Search an Element</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { symbol: "H", name: "Hydrogen", num: 1, color: "#60a5fa" },
                { symbol: "O", name: "Oxygen", num: 8, color: "#f87171" },
                { symbol: "C", name: "Carbon", num: 6, color: "#a78bfa" },
                { symbol: "N", name: "Nitrogen", num: 7, color: "#4ade80" },
                { symbol: "Na", name: "Sodium", num: 11, color: "#fbbf24" },
                { symbol: "Fe", name: "Iron", num: 26, color: "#fb923c" },
              ].map(el => (
                <button key={el.symbol} onClick={() => { setValue(el.name); handleSearch(el.name); setNavPage("home"); }} style={{
                  background: "#fff", border: `2px solid ${el.color}33`,
                  borderRadius: 16, padding: "14px 12px",
                  display: "flex", alignItems: "center", gap: 12,
                  cursor: "pointer", transition: "all 0.2s", textAlign: "left",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${el.color}22`, border: `2px solid ${el.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 17, fontWeight: 900, color: el.color, flexShrink: 0,
                  }}>{el.symbol}</div>
                  <div>
                    <div style={{ color: "#1a2e1a", fontWeight: 700, fontSize: 13 }}>{el.name}</div>
                    <div style={{ color: "#9ca3af", fontSize: 11 }}>Atomic № {el.num}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── MOLECULES PAGE ── */}
        {activeTab === "home" && navPage === "molecules" && (
          <div style={{ animation: "fadeUp 0.4s ease both" }}>
            <div style={{ background: "#fff", borderRadius: 20, padding: "24px 18px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: 14 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🧪</div>
              <div style={{ color: "#1a4a2a", fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Molecules</div>
              <p style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.7 }}>
                Explore common molecules. Tap any to search it instantly.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { formula: "H₂O", name: "Water", desc: "Universal solvent of life", q: "water", color: "#60a5fa" },
                { formula: "CO₂", name: "Carbon Dioxide", desc: "Greenhouse gas, used in photosynthesis", q: "carbon dioxide", color: "#f87171" },
                { formula: "NH₃", name: "Ammonia", desc: "Key nitrogen compound in fertilizers", q: "ammonia", color: "#4ade80" },
                { formula: "CH₄", name: "Methane", desc: "Simplest hydrocarbon, natural gas", q: "methane", color: "#fbbf24" },
                { formula: "C₆H₁₂O₆", name: "Glucose", desc: "Primary energy source for cells", q: "glucose", color: "#fb923c" },
                { formula: "C₂H₅OH", name: "Ethanol", desc: "Alcohol used in beverages & fuel", q: "ethanol", color: "#a78bfa" },
                { formula: "NaCl", name: "Sodium Chloride", desc: "Common table salt, ionic bond", q: "sodium chloride", color: "#34d399" },
              ].map(mol => (
                <button key={mol.formula} onClick={() => { setValue(mol.q); handleSearch(mol.q); setNavPage("home"); }} style={{
                  background: "#fff", border: `2px solid ${mol.color}33`,
                  borderRadius: 16, padding: "14px 16px",
                  display: "flex", alignItems: "center", gap: 14,
                  cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                    background: `${mol.color}18`, border: `2px solid ${mol.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 900, color: mol.color, fontFamily: "monospace",
                  }}>{mol.formula}</div>
                  <div>
                    <div style={{ color: "#1a2e1a", fontWeight: 700, fontSize: 14 }}>{mol.name}</div>
                    <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>{mol.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── FAVORITES TAB ── */}
        {activeTab === "favorites" && (
          <div style={{ animation: "fadeUp 0.3s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={{ color: "#7a8e7a", fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8 }}>
                SAVED COMPOUNDS ({favorites.length})
              </p>
              {favorites.length > 0 && (
                <button onClick={() => setFavorites([])} style={{
                  background: "none", border: "none", color: "#ef4444",
                  fontSize: 11, fontWeight: 700, cursor: "pointer",
                }}>Clear all</button>
              )}
            </div>
            {favorites.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 20, padding: "36px 18px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: 38, marginBottom: 10 }}>⭐</div>
                <div style={{ color: "#1a4a2a", fontWeight: 800, fontSize: 15, marginBottom: 6 }}>No favorites yet</div>
                <div style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.65 }}>
                  Search a compound and tap <strong style={{ color: "#2d5a3d" }}>+</strong> to save it here.
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {favorites.map((fav, idx) => (
                  <div key={fav.MolecularFormula} className="fav-card" style={{
                    background: cardGrads[idx % cardGrads.length],
                    borderRadius: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
                    animation: "fadeUp 0.35s ease both",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 3 }}>
                          {fav.MolecularFormula}
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 12, marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "92%" }}>
                          {fav.IUPACName || fav.searchName || "Unknown"}
                        </div>
                        <span style={{
                          background: "rgba(255,255,255,0.14)", borderRadius: 10,
                          padding: "2px 10px", color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 600,
                        }}>{fav.MolecularWeight} g/mol</span>
                      </div>
                      <button className="plus-btn" onClick={() => removeFav(fav.MolecularFormula)} style={{
                        width: 54, height: 54, borderRadius: 16, flexShrink: 0, marginLeft: 12,
                        background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                      }}>
                        <span style={{ fontSize: 28, color: "#1a3d2b", lineHeight: 1, fontWeight: 300 }}>−</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ABOUT MODAL */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
};

const cardGrads = [
  "linear-gradient(135deg,#1a3d2b,#0d2b1a)",
  "linear-gradient(135deg,#1a2b3d,#0d1a2b)",
  "linear-gradient(135deg,#3d2b1a,#2b1a0d)",
  "linear-gradient(135deg,#2b2010,#1a1408)",
  "linear-gradient(135deg,#2b1a3d,#1a0d2b)",
  "linear-gradient(135deg,#0d2d22,#071a14)",
  "linear-gradient(135deg,#3d1a2b,#2b0d1a)",
];

export default Main;