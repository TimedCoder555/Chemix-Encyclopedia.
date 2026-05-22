import React, { useState, useEffect, useRef } from "react";
import logo from "../img/logo.png";

// =========================
// CHEMICAL DATA
// =========================

const chemicals = [
  {
    id: 1, name: "Water", formula: "H₂O",
    description: "The universal solvent of life",
    color: "#00d4ff", bg: "linear-gradient(135deg, #0a3a4a 0%, #0d6377 100%)",
    atoms: [
      { symbol: "H", x: 28, y: 58, r: 17, color: "#a8e6ff" },
      { symbol: "O", x: 50, y: 40, r: 23, color: "#00d4ff" },
      { symbol: "H", x: 72, y: 58, r: 17, color: "#a8e6ff" },
    ],
    bonds: [
      { x1: "34%", y1: "56%", x2: "46%", y2: "46%" },
      { x1: "66%", y1: "56%", x2: "54%", y2: "46%" },
    ],
  },
  {
    id: 2, name: "Carbon Dioxide", formula: "CO₂",
    description: "Greenhouse gas & photosynthesis fuel",
    color: "#ff6b6b", bg: "linear-gradient(135deg, #3a0a0a 0%, #6d1a1a 100%)",
    atoms: [
      { symbol: "O", x: 18, y: 50, r: 21, color: "#ff6b6b" },
      { symbol: "C", x: 50, y: 50, r: 25, color: "#ff9f43" },
      { symbol: "O", x: 82, y: 50, r: 21, color: "#ff6b6b" },
    ],
    bonds: [
      { x1: "26%", y1: "50%", x2: "43%", y2: "50%" },
      { x1: "57%", y1: "50%", x2: "74%", y2: "50%" },
    ],
  },
  {
    id: 3, name: "Sodium Chloride", formula: "NaCl",
    description: "Common table salt — ionic bond",
    color: "#a29bfe", bg: "linear-gradient(135deg, #1a0a3a 0%, #2e1a6d 100%)",
    atoms: [
      { symbol: "Na", x: 32, y: 50, r: 27, color: "#a29bfe" },
      { symbol: "Cl", x: 68, y: 50, r: 25, color: "#55efc4" },
    ],
    bonds: [{ x1: "41%", y1: "50%", x2: "59%", y2: "50%" }],
  },
  {
    id: 4, name: "Ammonia", formula: "NH₃",
    description: "Nitrogen compound, key in fertilizers",
    color: "#00b894", bg: "linear-gradient(135deg, #0a2a1a 0%, #0d5535 100%)",
    atoms: [
      { symbol: "N", x: 50, y: 36, r: 25, color: "#00b894" },
      { symbol: "H", x: 27, y: 63, r: 16, color: "#81ecec" },
      { symbol: "H", x: 50, y: 70, r: 16, color: "#81ecec" },
      { symbol: "H", x: 73, y: 63, r: 16, color: "#81ecec" },
    ],
    bonds: [
      { x1: "44%", y1: "46%", x2: "32%", y2: "59%" },
      { x1: "50%", y1: "48%", x2: "50%", y2: "62%" },
      { x1: "56%", y1: "46%", x2: "68%", y2: "59%" },
    ],
  },
  {
    id: 5, name: "Glucose", formula: "C₆H₁₂O₆",
    description: "Primary energy source for cells",
    color: "#fdcb6e", bg: "linear-gradient(135deg, #2a1a0a 0%, #6d450a 100%)",
    atoms: [
      { symbol: "C", x: 22, y: 48, r: 19, color: "#fdcb6e" },
      { symbol: "C", x: 48, y: 28, r: 19, color: "#fdcb6e" },
      { symbol: "C", x: 75, y: 42, r: 19, color: "#fdcb6e" },
      { symbol: "O", x: 62, y: 68, r: 17, color: "#ff7675" },
      { symbol: "H", x: 12, y: 68, r: 13, color: "#dfe6e9" },
    ],
    bonds: [
      { x1: "28%", y1: "48%", x2: "43%", y2: "33%" },
      { x1: "53%", y1: "33%", x2: "70%", y2: "44%" },
      { x1: "73%", y1: "50%", x2: "65%", y2: "63%" },
    ],
  },
  {
    id: 6, name: "Methane", formula: "CH₄",
    description: "Simplest hydrocarbon & natural gas",
    color: "#74b9ff", bg: "linear-gradient(135deg, #0a1a3a 0%, #1a356b 100%)",
    atoms: [
      { symbol: "C", x: 50, y: 50, r: 25, color: "#74b9ff" },
      { symbol: "H", x: 23, y: 33, r: 15, color: "#dfe6e9" },
      { symbol: "H", x: 77, y: 33, r: 15, color: "#dfe6e9" },
      { symbol: "H", x: 23, y: 67, r: 15, color: "#dfe6e9" },
      { symbol: "H", x: 77, y: 67, r: 15, color: "#dfe6e9" },
    ],
    bonds: [
      { x1: "43%", y1: "44%", x2: "27%", y2: "36%" },
      { x1: "57%", y1: "44%", x2: "73%", y2: "36%" },
      { x1: "43%", y1: "56%", x2: "27%", y2: "64%" },
      { x1: "57%", y1: "56%", x2: "73%", y2: "64%" },
    ],
  },
  {
    id: 7, name: "Ethanol", formula: "C₂H₅OH",
    description: "Alcohol used in beverages & fuel",
    color: "#fd79a8", bg: "linear-gradient(135deg, #2a0a1a 0%, #6d1a4a 100%)",
    atoms: [
      { symbol: "C", x: 28, y: 50, r: 21, color: "#fd79a8" },
      { symbol: "C", x: 56, y: 50, r: 21, color: "#fd79a8" },
      { symbol: "O", x: 78, y: 36, r: 19, color: "#ff7675" },
      { symbol: "H", x: 14, y: 36, r: 13, color: "#dfe6e9" },
      { symbol: "H", x: 48, y: 72, r: 12, color: "#dfe6e9" },
    ],
    bonds: [
      { x1: "34%", y1: "50%", x2: "50%", y2: "50%" },
      { x1: "62%", y1: "46%", x2: "72%", y2: "39%" },
      { x1: "21%", y1: "46%", x2: "16%", y2: "39%" },
    ],
  },
];

// =========================
// MOLECULE CARD
// =========================

const MoleculeCard = ({ chem, isActive }) => (
  <div style={{
    background: chem.bg,
    borderRadius: 22,
    padding: "18px 14px 16px",
    display: "flex", flexDirection: "column", alignItems: "center",
    position: "relative", overflow: "hidden",
    border: `1.5px solid ${chem.color}${isActive ? "66" : "28"}`,
    boxShadow: isActive
      ? `0 0 32px ${chem.color}44, 0 8px 28px rgba(0,0,0,0.5)`
      : "0 4px 14px rgba(0,0,0,0.3)",
    transform: isActive ? "scale(1)" : "scale(0.88)",
    opacity: isActive ? 1 : 0.58,
    transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)",
    cursor: isActive ? "default" : "pointer",
    minHeight: 220, userSelect: "none",
  }}>
    <div style={{
      position: "absolute", top: -22, right: -22,
      width: 90, height: 90, borderRadius: "50%",
      background: `radial-gradient(circle, ${chem.color}33, transparent 70%)`,
      pointerEvents: "none",
    }} />
    <div style={{ width: "100%", height: 112 }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ overflow: "visible" }}>
        {chem.bonds.map((b, i) => (
          <line key={i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
            stroke={chem.color} strokeWidth="2.2" strokeOpacity="0.65" strokeLinecap="round" />
        ))}
        {chem.atoms.map((a, i) => (
          <g key={i}>
            <circle cx={`${a.x}%`} cy={`${a.y}%`} r={a.r}
              fill={a.color} fillOpacity="0.15" stroke={a.color} strokeWidth="1.6" />
            <text x={`${a.x}%`} y={`${a.y}%`}
              textAnchor="middle" dominantBaseline="central"
              fill={a.color} fontSize={a.r > 20 ? "10" : "8"}
              fontWeight="700" fontFamily="monospace">{a.symbol}</text>
          </g>
        ))}
      </svg>
    </div>
    <div style={{ textAlign: "center", marginTop: 4 }}>
      <div style={{ fontSize: 19, fontWeight: 800, color: "#fff" }}>{chem.formula}</div>
      <div style={{ fontSize: 12, color: chem.color, fontWeight: 600, marginTop: 2 }}>{chem.name}</div>
      <div style={{ fontSize: 10, color: "#ffffff66", marginTop: 3, lineHeight: 1.4 }}>{chem.description}</div>
    </div>
  </div>
);

// =========================
// MAIN COMPONENT
// =========================

const Main = () => {

  const [value, setValue] = useState("");
  const [compoundData, setCompoundData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [current, setCurrent] = useState(0);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const timerRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % chemicals.length);
    }, 3200);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => {
    setCurrent((i + chemicals.length) % chemicals.length);
    startTimer();
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      goTo(dx < 0 ? current + 1 : current - 1);
    }
    touchStartX.current = null;
  };

  const onMouseDown = (e) => { isDragging.current = false; dragStartX.current = e.clientX; };
  const onMouseMove = (e) => {
    if (dragStartX.current !== null && Math.abs(e.clientX - dragStartX.current) > 5)
      isDragging.current = true;
  };
  const onMouseUp = (e) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    if (isDragging.current && Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
    dragStartX.current = null;
    isDragging.current = false;
  };

  const prev = (current - 1 + chemicals.length) % chemicals.length;
  const next = (current + 1) % chemicals.length;

  const handleSearch = async () => {
    if (!value.trim()) {
      setCompoundData(null);
      setErrorMessage("Please enter a compound name.");
      return;
    }
    setErrorMessage("");
    setCompoundData(null);
    try {
      const response = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(value)}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`
      );
      if (!response.ok) { setErrorMessage("❌ No compound found."); return; }
      const data = await response.json();
      if (!data.PropertyTable?.Properties?.length) { setErrorMessage("❌ No compound found."); return; }
      setCompoundData(data.PropertyTable.Properties[0]);
    } catch (error) {
      console.log(error);
      setErrorMessage("⚠️ Failed to fetch compound data.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #061410 0%, #0a1625 50%, #061008 100%)",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      overflowX: "hidden",
    }}>

      <style>{`
        * { box-sizing: border-box; }
        @keyframes blobFloat1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(25px,-18px) scale(1.1)} }
        @keyframes blobFloat2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,25px) scale(1.08)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 20px #00ff8820} 50%{box-shadow:0 0 36px #00ff8840} }
        input::placeholder { color: #ffffff44; }
        input:focus { outline: none; border-color: #00ff88 !important; box-shadow: 0 0 0 3px #00ff8818 !important; }
        .pill:hover { background: rgba(0,255,136,0.15) !important; border-color: #00ff88 !important; transform: translateY(-2px); }
        .sbtn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,255,136,0.4) !important; }
        .result-row:not(:last-child) { border-bottom: 1px solid #ffffff0d; }
      `}</style>

      {/* BG Blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "8%", left: "3%", width: 260, height: 260, borderRadius: "50%",
          background: "radial-gradient(circle, #00ff8830 0%, transparent 70%)",
          filter: "blur(55px)", animation: "blobFloat1 9s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "12%", right: "4%", width: 210, height: 210, borderRadius: "50%",
          background: "radial-gradient(circle, #00aaff25 0%, transparent 70%)",
          filter: "blur(45px)", animation: "blobFloat2 11s ease-in-out infinite",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ===== LOGO HEADER (NO duplicate navbar — just logo + brand name) ===== */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 12, padding: "28px 20px 6px",
          animation: "fadeUp 0.6s ease both",
        }}>
          <img
            src={logo}
            alt="Chemix Logo"
            style={{
              width: 50, height: 50, borderRadius: 14,
              boxShadow: "0 0 20px #00ff8866",
              objectFit: "cover",
            }}
          />
          <div>
            <div style={{ fontSize: 19, fontWeight: 900, lineHeight: 1.1 }}>
              <span style={{ color: "#00ff88" }}>Chemix</span>
              <span style={{ color: "#00aaff" }}>Encyclopedia</span>
            </div>
            <div style={{ color: "#ffffff44", fontSize: 10.5, fontWeight: 500, letterSpacing: 0.5, marginTop: 2 }}>
              Powered by PubChem
            </div>
          </div>
        </div>

        {/* ===== HERO TITLE ===== */}
        <div style={{ textAlign: "center", padding: "18px 20px 0", animation: "fadeUp 0.75s ease both" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(0,255,136,0.07)",
            border: "1px solid #00ff8830",
            borderRadius: 20, padding: "4px 14px",
            fontSize: 10.5, color: "#00ff88",
            fontWeight: 700, letterSpacing: 1.2, marginBottom: 12,
          }}>🧬 CHEMISTRY DATABASE</div>

          <h1 style={{
            fontSize: "clamp(22px,6vw,30px)", fontWeight: 900, lineHeight: 1.2, margin: 0,
            background: "linear-gradient(90deg, #00ff88, #00d4ff, #a29bfe)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "shimmer 4s linear infinite",
          }}>
            Explore Chemical<br />Compounds
          </h1>
          <p style={{ color: "#ffffff55", fontSize: 13, marginTop: 8 }}>
            Search from millions of compounds via PubChem
          </p>
        </div>

        {/* ===== SEARCH BAR ===== */}
        <div style={{ padding: "20px 18px 0", animation: "fadeUp 0.9s ease both" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,0.05)",
            border: "1.5px solid #00ff8830",
            borderRadius: 18, padding: "11px 14px",
            backdropFilter: "blur(20px)",
          }}>
            <span style={{ fontSize: 17, flexShrink: 0 }}>🔍</span>
            <input
              type="text"
              placeholder="Search: H2O, CO2, NaCl, Glucose..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{
                flex: 1, background: "transparent", border: "none",
                color: "#fff", fontSize: 14, fontFamily: "inherit",
              }}
            />
            <button className="sbtn" onClick={handleSearch} style={{
              background: "linear-gradient(135deg, #00ff88, #00aaff)",
              border: "none", borderRadius: 12, padding: "8px 18px",
              color: "#061410", fontSize: 13, fontWeight: 800,
              cursor: "pointer", transition: "all 0.25s", flexShrink: 0,
              boxShadow: "0 4px 14px rgba(0,255,136,0.3)",
            }}>Search</button>
          </div>

          {errorMessage && (
            <div style={{
              marginTop: 10, color: "#ff6b6b", fontSize: 13,
              fontWeight: 600, textAlign: "center",
              background: "rgba(255,107,107,0.08)", borderRadius: 10, padding: "8px 14px",
            }}>{errorMessage}</div>
          )}
        </div>

        {/* ===== RESULT CARD ===== */}
        {compoundData && (
          <div style={{
            margin: "16px 18px 0",
            background: "rgba(0,255,136,0.04)",
            border: "1.5px solid #00ff8840",
            borderRadius: 20, overflow: "hidden",
            backdropFilter: "blur(16px)",
            boxShadow: "0 0 28px rgba(0,255,136,0.1)",
            animation: "fadeUp 0.5s ease both",
          }}>
            <div style={{
              background: "linear-gradient(90deg,#00ff8814,#00aaff0e)",
              padding: "13px 18px", borderBottom: "1px solid #00ff8818",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px #00ff88" }} />
              <span style={{ color: "#00ff88", fontWeight: 700, fontSize: 13 }}>Compound Found</span>
            </div>
            <div>
              {[
                { label: "IUPAC Name", value: compoundData.IUPACName || "Unknown", icon: "🏷️" },
                { label: "Formula", value: compoundData.MolecularFormula, icon: "⚗️" },
                { label: "Mol. Weight", value: `${compoundData.MolecularWeight} g/mol`, icon: "⚖️" },
              ].map((row) => (
                <div key={row.label} className="result-row" style={{
                  display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 18px",
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
                  <div>
                    <div style={{ color: "#ffffff44", fontSize: 10, fontWeight: 700, letterSpacing: 0.8, marginBottom: 2 }}>{row.label}</div>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, wordBreak: "break-all" }}>{row.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== CAROUSEL HEADER ===== */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "24px 20px 10px",
        }}>
          <span style={{ color: "#ffffff44", fontSize: 11, fontWeight: 700, letterSpacing: 0.8 }}>
            FEATURED COMPOUNDS
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => goTo(current - 1)} style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid #ffffff20",
              borderRadius: 8, width: 28, height: 28, color: "#fff",
              cursor: "pointer", fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>‹</button>
            <span style={{ color: "#00ff8877", fontSize: 12, fontWeight: 600, minWidth: 36, textAlign: "center" }}>
              {current + 1}/{chemicals.length}
            </span>
            <button onClick={() => goTo(current + 1)} style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid #ffffff20",
              borderRadius: 8, width: 28, height: 28, color: "#fff",
              cursor: "pointer", fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>›</button>
          </div>
        </div>

        {/* ===== CAROUSEL ===== */}
        <div
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
          style={{
            display: "grid", gridTemplateColumns: "1fr 1.18fr 1fr",
            gap: 10, padding: "0 12px", alignItems: "center",
            cursor: "grab", userSelect: "none",
          }}
        >
          {[prev, current, next].map((idx, pos) => (
            <div key={chemicals[idx].id} onClick={() => pos !== 1 && goTo(idx)}>
              <MoleculeCard chem={chemicals[idx]} isActive={pos === 1} />
            </div>
          ))}
        </div>

        {/* ===== DOTS ===== */}
        <div style={{ display: "flex", justifyContent: "center", gap: 7, padding: "14px 0 4px" }}>
          {chemicals.map((_, i) => (
            <div key={i} onClick={() => goTo(i)} style={{
              width: i === current ? 22 : 7, height: 7, borderRadius: 4,
              background: i === current ? "linear-gradient(90deg,#00ff88,#00aaff)" : "#ffffff25",
              cursor: "pointer", transition: "all 0.38s cubic-bezier(0.4,0,0.2,1)",
            }} />
          ))}
        </div>

        {/* ===== WAVE ===== */}
        <div style={{ height: 44, marginTop: 6 }}>
          <svg viewBox="0 0 400 44" width="100%" height="100%" preserveAspectRatio="none">
            <path d="M0,22 C80,0 140,44 200,22 C260,0 320,44 400,22 L400,44 L0,44 Z" fill="rgba(0,255,136,0.04)" />
            <path d="M0,30 C70,8 160,44 240,28 C310,14 360,42 400,30 L400,44 L0,44 Z" fill="rgba(0,170,255,0.03)" />
          </svg>
        </div>

        {/* ===== QUICK PILLS ===== */}
        <div style={{ padding: "4px 18px 36px" }}>
          <p style={{ color: "#ffffff40", fontSize: 11, textAlign: "center", fontWeight: 700, letterSpacing: 0.8, marginBottom: 12 }}>
            QUICK SEARCH
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {[
              { label: "H₂O", query: "water" },
              { label: "CO₂", query: "carbon dioxide" },
              { label: "NaCl", query: "sodium chloride" },
              { label: "NH₃", query: "ammonia" },
              { label: "C₆H₁₂O₆", query: "glucose" },
              { label: "CH₄", query: "methane" },
              { label: "C₂H₅OH", query: "ethanol" },
            ].map(({ label, query }) => (
              <button key={label} className="pill" onClick={() => {
                setValue(query);
                setTimeout(handleSearch, 50);
              }} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #00ff8825",
                borderRadius: 20, padding: "6px 14px",
                color: "#00ff88", fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: "monospace",
                transition: "all 0.22s ease",
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* ===== INFO CARD ===== */}
        <div style={{
          margin: "0 18px 44px",
          background: "rgba(255,255,255,0.025)",
          border: "1px solid #ffffff0e",
          borderRadius: 20, padding: "22px 20px",
          backdropFilter: "blur(10px)",
          animation: "pulseGlow 4s ease-in-out infinite",
        }}>
          <h2 style={{ color: "#00ff88", fontSize: 16, fontWeight: 800, marginBottom: 10 }}>
            Welcome to Chemix-Encyclopedia 😎
          </h2>
          <p style={{ color: "#ffffff55", fontSize: 13, lineHeight: 1.75 }}>
            Made by <span style={{ color: "#00aaff", fontWeight: 700 }}>TimedCoder555</span>.
            <br /><br />
            Chemix-Encyclopedia helps users explore chemical compounds,
            molecular information, and scientific chemistry resources
            in a futuristic chemistry interface.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Main;