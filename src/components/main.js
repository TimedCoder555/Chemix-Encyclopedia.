import React, { useState } from "react";

const Main = () => {

  // SEARCH INPUT
  const [value, setValue] = useState("");

  // COMPOUND DATA
  const [compoundData, setCompoundData] = useState(null);

  // SEARCH FUNCTION
  const handleSearch = async () => {

    if (!value.trim()) {
      return;
    }

    try {

      const response = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
          value
        )}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`
      );

      const data = await response.json();

      const compound =
        data.PropertyTable.Properties[0];

      setCompoundData(compound);

    } catch (error) {

      setCompoundData(null);

      console.log(error);

    }

  };

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

      {/* TITLE */}

      <h1
        style={{
          fontSize: "3rem",
          color: "#00ffe5",
          marginBottom: "10px",
        }}
      >
        Chemix-Encyclopedia
      </h1>

      <p
        style={{
          color: "#9ca3af",
          marginBottom: "40px",
        }}
      >
        Explore Molecules • Chemistry • Scientific Data
      </p>

      {/* SEARCH AREA */}

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
          style={{
            padding: "15px",
            width: "300px",
            borderRadius: "10px",
            border: "1px solid cyan",
            background: "#0f172a",
            color: "white",
            outline: "none",
            fontSize: "16px",
          }}
        />

        <button
          onClick={handleSearch}
          style={{
            padding: "15px 25px",
            borderRadius: "10px",
            border: "none",
            background: "#00ffe5",
            color: "black",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Search
        </button>

      </div>

      {/* COMPOUND RESULT CARD */}

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
              <strong>Name:</strong>
              {" "}
              {compoundData.IUPACName}
            </p>

            <p style={{ marginBottom: "15px" }}>
              <strong>Formula:</strong>
              {" "}
              {compoundData.MolecularFormula}
            </p>

            <p>
              <strong>Molecular Weight:</strong>
              {" "}
              {compoundData.MolecularWeight}
            </p>

          </div>

        )

      }

      {/* INFO CARD */}

      <div
        style={{
          marginTop: "50px",
          background: "#0f172a",
          padding: "30px",
          borderRadius: "20px",
          maxWidth: "700px",
          marginLeft: "auto",
          marginRight: "auto",
          boxShadow: "0 0 20px rgba(0,255,229,0.2)",
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
          futuristic interface.
        </p>

      </div>

    </div>

  );

};

export default Main;