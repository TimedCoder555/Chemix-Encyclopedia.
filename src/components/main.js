import React, { useState } from "react";

const Main = () => {
  const [value, setValue] = useState("");

  const handleSearch = async () => {

  if (!value.trim()) {
    alert("Please enter a compound name 😄");
    return;
  }

  try {

    const response = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
        value
      )}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`
    );

    const data = await response.json();

    console.log(data);

    const compound =
      data.PropertyTable.Properties[0];

    alert(
      `Compound Found 😎\n\n` +
      `Name: ${compound.IUPACName}\n` +
      `Formula: ${compound.MolecularFormula}\n` +
      `Weight: ${compound.MolecularWeight}`
    );

  } catch (error) {

    alert("Compound not found 😭");

    console.log(error);

  }

};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050816",
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

      {/* SEARCH BOX */}

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
        <h2 style={{ color: "#00ffe5" }}>
          Welcome to Chemix-Encyclopedia 😎
        </h2>

        <p style={{ color: "#cbd5e1", lineHeight: "1.8" }}>
made by TimedCoder555.
..   Chemix-Encyclopedia.
          This chemistry web application helps users explore chemical
          compounds, molecular information, and scientific resources.
        </p>
      </div>
    </div>
  );
};

export default Main;