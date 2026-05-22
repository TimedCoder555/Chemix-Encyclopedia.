import React, { useState } from "react";

const Main = () => {

  // =========================
  // STATES
  // =========================

  const [value, setValue] = useState("");

  const [compoundData, setCompoundData] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  // =========================
  // SEARCH FUNCTION
  // =========================

  const handleSearch = async () => {

    // EMPTY SEARCH STOP

    if (!value.trim()) {
      setCompoundData(null);
      setErrorMessage("Please enter a compound name.");
      return;
    }

    try {

      // API REQUEST

      const response = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
          value
        )}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`
      );

      // IF INVALID COMPOUND

      if (!response.ok) {

        setCompoundData(null);

        setErrorMessage("❌ No compound found.");

        return;
      }

      const data = await response.json();

      // SAFETY CHECK

      if (
        !data.PropertyTable ||
        !data.PropertyTable.Properties ||
        data.PropertyTable.Properties.length === 0
      ) {

        setCompoundData(null);

        setErrorMessage("❌ No compound found.");

        return;
      }

      // GET COMPOUND

      const compound = data.PropertyTable.Properties[0];

      setCompoundData(compound);

      setErrorMessage("");

    } catch (error) {

      console.log(error);

      setCompoundData(null);

      setErrorMessage("⚠️ Failed to fetch compound data.");

    }

  };

  // =========================
  // UI
  // =========================

  return (

    <div
      style={{
        minHeight: "100vh",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
        textAlign: "center",
      }}
    >

      {/* ========================= */}
      {/* TOP LEFT BRAND */}
      {/* ========================= */}

      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          textAlign: "left",
        }}
      >

        <h2
          style={{
            color: "#00ffe5",
            margin: "0",
            fontSize: "24px",
          }}
        >
          Chemix-Encyclopedia
        </h2>

        <p
          style={{
            color: "#94a3b8",
            margin: "0",
            fontSize: "14px",
          }}
        >
          by TimedCoder555
        </p>

      </div>

      {/* ========================= */}
      {/* MAIN TITLE */}
      {/* ========================= */}

      <h1
        style={{
          fontSize: "3rem",
          color: "#00ffe5",
          marginTop: "80px",
          marginBottom: "10px",
          textShadow: "0 0 20px #00ffe5",
        }}
      >
        Explore The World Of Chemistry ⚗️
      </h1>

      <p
        style={{
          color: "#9ca3af",
          marginBottom: "40px",
          fontSize: "18px",
        }}
      >
        Molecules • Elements • Scientific Data
      </p>

      {/* ========================= */}
      {/* SEARCH AREA */}
      {/* ========================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >

        <input
          type="text"
          placeholder="Search Compound..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          style={{
            padding: "15px",
            width: "320px",
            borderRadius: "12px",
            border: "1px solid cyan",
            background: "rgba(15,23,42,0.9)",
            color: "white",
            outline: "none",
            fontSize: "16px",
            boxShadow: "0 0 15px rgba(0,255,255,0.2)",
          }}
        />

        <button
          onClick={handleSearch}
          style={{
            padding: "15px 25px",
            borderRadius: "12px",
            border: "none",
            background: "#00ffe5",
            color: "black",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
            boxShadow: "0 0 20px rgba(0,255,229,0.5)",
          }}
        >
          Search
        </button>

      </div>

      {/* ========================= */}
      {/* ERROR MESSAGE */}
      {/* ========================= */}

      {

        errorMessage && (

          <div
            style={{
              marginTop: "25px",
              color: "#ff6b6b",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            {errorMessage}
          </div>

        )

      }

      {/* ========================= */}
      {/* RESULT CARD */}
      {/* ========================= */}

      {

        compoundData && (

          <div
            style={{
              marginTop: "40px",
              background: "rgba(0,0,0,0.55)",
              border: "1px solid #00e5ff",
              borderRadius: "20px",
              padding: "30px",
              maxWidth: "700px",
              marginLeft: "auto",
              marginRight: "auto",
              boxShadow: "0 0 25px rgba(0,229,255,0.3)",
              backdropFilter: "blur(10px)",
            }}
          >

            <h2
              style={{
                color: "#00e5ff",
                marginBottom: "20px",
              }}
            >
              Compound Information
            </h2>

            <p style={{ marginBottom: "15px" }}>
              <strong>Name:</strong>{" "}
              {compoundData.IUPACName || "Unknown"}
            </p>

            <p style={{ marginBottom: "15px" }}>
              <strong>Formula:</strong>{" "}
              {compoundData.MolecularFormula}
            </p>

            <p>
              <strong>Molecular Weight:</strong>{" "}
              {compoundData.MolecularWeight}
            </p>

          </div>

        )

      }

      {/* ========================= */}
      {/* INFO CARD */}
      {/* ========================= */}

      <div
        style={{
          marginTop: "60px",
          background: "rgba(15,23,42,0.85)",
          padding: "30px",
          borderRadius: "20px",
          maxWidth: "700px",
          marginLeft: "auto",
          marginRight: "auto",
          boxShadow: "0 0 20px rgba(0,255,229,0.2)",
          border: "1px solid rgba(0,255,229,0.2)",
        }}
      >

        <h2
          style={{
            color: "#00ffe5",
            marginBottom: "15px",
          }}
        >
          Welcome to Chemix-Encyclopedia 😎
        </h2>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: "1.8",
          }}
        >
          Made by TimedCoder555.
          <br /><br />

          Chemix-Encyclopedia helps users explore
          chemical compounds, molecular information,
          and scientific chemistry resources in a
          futuristic chemistry interface.
        </p>

      </div>

    </div>

  );

};

export default Main;