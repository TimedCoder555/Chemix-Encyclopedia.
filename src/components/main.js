import React, { useState, useEffect, useRef } from "react";
import logo from "../img/logo.png";
import heroBg from "../img/bg.jpg";

const Main = () => {

  const [value, setValue] = useState("");
  const [compoundData, setCompoundData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("chemix_favorites") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("chemix_favorites", JSON.stringify(favorites));
  }, [favorites]);

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
      setActiveTab("home");
    } catch { setErrorMessage("⚠️ Failed to fetch data."); }
    setLoading(false);
  };

  const isFav = (c) => c && favorites.some(f => f.MolecularFormula === c.MolecularFormula);
  const addFav = (c) => { if (!c || isFav(c)) return; setFavorites(p => [c, ...p]); };
  const removeFav = (formula) => setFavorites(p => p.filter(f => f.MolecularFormula !== formula));

  const cardGrads = [
    "linear-gradient(135deg, #2d5a3d 0%, #1a3d2b 100%)",
    "linear-gradient(135deg, #2d3d5a 0%, #1a2b3d 100%)",
    "linear-gradient(135deg, #5a3d2d 0%, #3d2b1a 100%)",
    "linear-gradient(135deg, #4a3d20 0%, #2b2010 100%)",
    "linear-gradient(135deg, #3d2d5a 0%, #2b1a3d 100%)",
    "linear-gradient(135deg, #1a4a3a 0%, #0d2d22 100%)",
    "linear-gradient(135deg, #5a2d3d 0%, #3d1a2b 100%)",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#eef2ee", fontFamily: "'Segoe UI', system-ui, sans-serif", overflowX: "hidden" }}>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        input::placeholder { color: rgba(255,255,255,0.5); }
        input:focus { outline: none; }
        .fav-card { transition: transform 0.2s, box-shadow 0.2s; cursor: default; }
        .fav-card:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.18) !important; }
        .chip:hover { background: rgba(45,90,61,0.2) !important; transform: translateY(-1px); }
        .plus-btn:active { transform: scale(0.94) !important; }
        .tab:hover { background: rgba(255,255,255,0.2) !important; }
        .search-box:focus-within { border-color: rgba(255,255,255,0.8) !important; }
        .sbtn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(74,222,128,0.45) !important; }
        .sbtn:active { transform: scale(0.97); }
      `}</style>

      {/* ══════════ HERO ══════════ */}
      <div style={{
        position: "relative", minHeight: 430,
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", flexDirection: "column",
      }}>

        {/* Overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg,rgba(5,20,10,0.6) 0%,rgba(20,55,30,0.5) 55%,rgba(40,80,50,0.75) 100%)",
        }} />

        {/* ── TOP BAR ── */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", alignItems: "center", gap: 10,
          padding: "14px 14px 0",
        }}>

          {/* Search — LEFT */}
          <div className="search-box" style={{
            flex: 1, display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.13)",
            border: "1.5px solid rgba(255,255,255,0.28)",
            borderRadius: 50, padding: "9px 14px",
            backdropFilter: "blur(18px)",
            transition: "border-color 0.2s",
          }}>
            {loading
              ? <div style={{ width: 14, height: 14, border: "2px solid #4ade80", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
            }
            <input
              type="text" value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Search compound..."
              style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 13.5, fontFamily: "inherit", minWidth: 0 }}
            />
            {value && (
              <button onClick={() => { setValue(""); setCompoundData(null); setErrorMessage(""); }}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.65)", cursor: "pointer", fontSize: 17, padding: 0, lineHeight: 1 }}>×</button>
            )}
          </div>

          {/* Nav — RIGHT */}
          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            {[
              { id: "home", label: "Home" },
              { id: "favorites", label: "Favs", badge: favorites.length },
            ].map(t => (
              <button key={t.id} className="tab" onClick={() => setActiveTab(t.id)} style={{
                background: activeTab === t.id ? "rgba(255,255,255,0.22)" : "transparent",
                border: activeTab === t.id ? "1px solid rgba(255,255,255,0.38)" : "1px solid transparent",
                borderRadius: 20, padding: "6px 11px",
                color: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.65)",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                backdropFilter: "blur(10px)", transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                {t.label}
                {t.badge > 0 && (
                  <span style={{ background: "#4ade80", color: "#0a2010", borderRadius: 10, padding: "1px 5px", fontSize: 10, fontWeight: 800 }}>
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── HERO TEXT ── */}
        <div style={{
          position: "relative", zIndex: 10, flex: 1,
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          padding: "0 20px 54px",
          animation: "fadeUp 0.7s ease both",
        }}>
          <h1 style={{
            fontSize: "clamp(26px,8vw,38px)", fontWeight: 900, color: "#fff",
            lineHeight: 1.18, letterSpacing: -0.5, marginBottom: 10,
            textShadow: "0 2px 18px rgba(0,0,0,0.45)",
          }}>
            "Chemistry is the<br />
            <span style={{ color: "#86efac" }}>poetry</span> of<br />
            invisible molecules."
          </h1>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 14, lineHeight: 1.65, maxWidth: 340 }}>
            Explore compounds, elements, reactions and molecular structures in a futuristic chemistry experience.
          </p>
          <button className="sbtn" onClick={() => handleSearch()} style={{
            marginTop: 18, alignSelf: "flex-start",
            background: "linear-gradient(135deg,#4ade80,#22c55e)",
            border: "none", borderRadius: 50, padding: "11px 22px",
            color: "#0a2010", fontSize: 13.5, fontWeight: 800, cursor: "pointer",
            boxShadow: "0 4px 18px rgba(74,222,128,0.38)",
            display: "flex", alignItems: "center", gap: 8, transition: "all 0.22s",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Search Compound
          </button>
          {errorMessage && (
            <div style={{ marginTop: 10, color: "#fca5a5", fontSize: 13, fontWeight: 600, animation: "fadeIn 0.3s ease" }}>
              {errorMessage}
            </div>
          )}
        </div>

        {/* Wave */}
        <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, zIndex: 5 }}>
          <svg viewBox="0 0 414 56" width="100%" height="56" preserveAspectRatio="none">
            <path d="M0,0 C60,40 120,8 200,30 C270,50 340,12 414,36 L414,56 L0,56 Z" fill="#eef2ee"/>
          </svg>
        </div>
      </div>

      {/* ══════════ CONTENT ══════════ */}
      <div style={{ padding: "10px 15px 50px", maxWidth: 480, margin: "0 auto" }}>

        {/* Search result */}
        {compoundData && activeTab === "home" && (
          <div style={{
            marginBottom: 18, background: "#fff",
            borderRadius: 20, overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.09)",
            animation: "slideDown 0.38s ease both",
          }}>
            <div style={{
              background: "linear-gradient(135deg,#2d5a3d,#1a3d2b)",
              padding: "14px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 7px #4ade80" }} />
                <span style={{ color: "#86efac", fontWeight: 700, fontSize: 12.5 }}>Compound Found</span>
              </div>
              {/* + / ★ button */}
              <button className="plus-btn" onClick={() => isFav(compoundData) ? removeFav(compoundData.MolecularFormula) : addFav(compoundData)} style={{
                width: 40, height: 40, borderRadius: 13,
                background: isFav(compoundData) ? "#4ade80" : "rgba(255,255,255,0.15)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              }}>
                <span style={{ fontSize: 20, color: isFav(compoundData) ? "#0a2010" : "#fff", lineHeight: 1 }}>
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

        {/* HOME tab */}
        {activeTab === "home" && (
          <>
            <p style={{ color: "#7a8e7a", fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, marginBottom: 9 }}>
              QUICK SEARCH
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
              {[
                { label: "H₂O", q: "water" }, { label: "CO₂", q: "carbon dioxide" },
                { label: "NaCl", q: "sodium chloride" }, { label: "NH₃", q: "ammonia" },
                { label: "C₆H₁₂O₆", q: "glucose" }, { label: "CH₄", q: "methane" },
                { label: "C₂H₅OH", q: "ethanol" },
              ].map(({ label, q }) => (
                <button key={label} className="chip" onClick={() => { setValue(q); handleSearch(q); }} style={{
                  background: "rgba(45,90,61,0.10)", border: "1.5px solid rgba(45,90,61,0.18)",
                  borderRadius: 20, padding: "6px 12px",
                  color: "#2d5a3d", fontSize: 12, fontWeight: 700,
                  cursor: "pointer", fontFamily: "monospace", transition: "all 0.2s",
                }}>{label}</button>
              ))}
            </div>

            {!compoundData && (
              <div style={{
                background: "#fff", borderRadius: 20, padding: "28px 18px",
                textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}>
                <div style={{ fontSize: 38, marginBottom: 10 }}>⚗️</div>
                <div style={{ color: "#2d5a3d", fontWeight: 800, fontSize: 15, marginBottom: 6 }}>Start exploring</div>
                <div style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.65 }}>
                  Type a compound name or formula in the search bar, then tap Search.
                </div>
              </div>
            )}

            {/* Info footer */}
            <div style={{ marginTop: 18, background: "#fff", borderRadius: 20, padding: "18px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                <img src={logo} alt="logo" style={{ width: 34, height: 34, borderRadius: 10, objectFit: "cover" }} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 800 }}>
                    <span style={{ color: "#2d5a3d" }}>Chemix</span>
                    <span style={{ color: "#1a6d4a" }}>Encyclopedia</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>by TimedCoder555 · Powered by PubChem</div>
                </div>
              </div>
              <p style={{ color: "#6b7280", fontSize: 12.5, lineHeight: 1.7 }}>
                Explore chemical compounds, molecular data and scientific chemistry resources in a futuristic interface.
              </p>
            </div>
          </>
        )}

        {/* FAVORITES tab */}
        {activeTab === "favorites" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={{ color: "#7a8e7a", fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8 }}>
                SAVED COMPOUNDS ({favorites.length})
              </p>
              {favorites.length > 0 && (
                <button onClick={() => setFavorites([])} style={{
                  background: "none", border: "none", color: "#ef4444", fontSize: 11, fontWeight: 700, cursor: "pointer",
                }}>Clear all</button>
              )}
            </div>

            {favorites.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 20, padding: "36px 18px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: 38, marginBottom: 10 }}>⭐</div>
                <div style={{ color: "#2d5a3d", fontWeight: 800, fontSize: 15, marginBottom: 6 }}>No favorites yet</div>
                <div style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.65 }}>
                  Search a compound and tap <strong style={{ color: "#2d5a3d" }}>+</strong> to save it here.
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {favorites.map((fav, idx) => (
                  <div key={fav.MolecularFormula} className="fav-card" style={{
                    background: cardGrads[idx % cardGrads.length],
                    borderRadius: 20,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.13)",
                    animation: "fadeUp 0.35s ease both",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 3 }}>
                          {fav.MolecularFormula}
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 12, marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "95%" }}>
                          {fav.IUPACName || fav.searchName || "Unknown"}
                        </div>
                        <span style={{
                          background: "rgba(255,255,255,0.16)", borderRadius: 10,
                          padding: "2px 10px", color: "rgba(255,255,255,0.88)", fontSize: 11, fontWeight: 600,
                        }}>
                          {fav.MolecularWeight} g/mol
                        </span>
                      </div>
                      {/* Big + button */}
                      <button className="plus-btn" onClick={() => removeFav(fav.MolecularFormula)} style={{
                        width: 54, height: 54, borderRadius: 16, flexShrink: 0, marginLeft: 12,
                        background: "rgba(255,255,255,0.9)",
                        border: "none", cursor: "pointer", transition: "all 0.2s",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                      }}>
                        <span style={{ fontSize: 28, color: "#2d5a3d", lineHeight: 1, fontWeight: 300 }}>−</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// constant needed inside component scope
const cardGrads = [
  "linear-gradient(135deg, #2d5a3d 0%, #1a3d2b 100%)",
  "linear-gradient(135deg, #2d3d5a 0%, #1a2b3d 100%)",
  "linear-gradient(135deg, #5a3d2d 0%, #3d2b1a 100%)",
  "linear-gradient(135deg, #4a3d20 0%, #2b2010 100%)",
  "linear-gradient(135deg, #3d2d5a 0%, #2b1a3d 100%)",
  "linear-gradient(135deg, #1a4a3a 0%, #0d2d22 100%)",
  "linear-gradient(135deg, #5a2d3d 0%, #3d1a2b 100%)",
];

export default Main;