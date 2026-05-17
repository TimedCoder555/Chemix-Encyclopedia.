import React, { useState } from "react";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import IframeResizer from "iframe-resizer-react";
import "primeflex/primeflex.css";
import "primereact/resources/themes/lara-dark-purple/theme.css";
import { InputText } from "primereact/inputtext";

import PeriodicTable from "./PeriodicTable";
import Intro from "./intro";
import ColorCodes from "./ColorCodes";

let temp = "";

const Main = () => {
  const [validity, setValidity] = useState(false);
  const [value, setValue] = useState("");
  const [widgetId, setWidgetId] = useState(temp);
  const [compound, setCompound] = useState({});

  const handleSearch = () => {
    if (!value.trim()) return;
    
    // সঠিক উইজেট URL ফরম্যাট
    const searchUrl = `https://pubchem.ncbi.nlm.nih.gov/compound/${encodeURIComponent(
      value.trim()
    )}#section=Structures&embed=true&hide_title=true`;
    
    setWidgetId(searchUrl);
    getAtoms(value, setCompound);
    chkCompoundName(value, setValidity);
  };

  return (
    <div className="main">
      {/* TOP TITLE */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            color: "#00ffe5",
            textShadow: "0 0 20px #00ffe5",
            marginBottom: "10px",
          }}
        >
          Chemix-Encyclopedia
        </h1>
        <p
          style={{
            color: "#cccccc",
            fontSize: "1.1rem",
          }}
        >
          Explore Molecules • 3D Structures • Periodic Elements
        </p>
      </div>

      {/* SEARCH BOX */}
      <div
        className="p-card"
        style={{
          minWidth: "200px",
          background: "rgba(15,15,25,0.85)",
          borderRadius: "20px",
          padding: "20px",
          border: "1px solid #00ffe5",
          boxShadow: "0 0 25px rgba(0,255,229,0.3)",
        }}
      >
        <span className="p-input-icon-left p-card-content searchbar">
          <i className="pi pi-search" />
          <InputText
            className="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search Any Chemical Compound (e.g. Water, Aspirin)..."
            style={{
              background: "#101820",
              color: "white",
              border: "1px solid cyan",
            }}
          />
          <Button
            style={{
              marginLeft: "-38px",
              height: "40px",
              background: "#00ffe5",
              border: "none",
              color: "black",
            }}
            icon="pi pi-search"
            className="p-button"
            onClick={handleSearch}
          />
        </span>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ paddingTop: 60 }} className="container">
        <Card
          title=""
          style={{
            margin: "auto",
            borderRadius: "20px",
            background: "rgba(10,10,20,0.9)",
            color: "white",
            border: "1px solid #00ffe5",
            boxShadow: "0 0 30px rgba(0,255,255,0.25)",
          }}
        >
          {validity ? (
            <>
              <IframeResizer
                title="Structures"
                id="struct"
                heightCalculationMethod="bodyScroll"
                className="pubchem-widget"
                target="_self"
                src={widgetId}
                checkOrigin={false}
                style={{
                  width: "100%",
                  minHeight: 600,
                  border: "0px",
                  borderRadius: "15px",
                  background: "#111",
                }}
              />
              <div style={{ marginTop: "30px" }}>
                <ColorCodes toShowEls={compound} />
              </div>
              <PeriodicTable
                toShow={compound}
                compound={value}
                style={{ width: "100%" }}
              />
            </>
          ) : (
            <Intro />
          )}
        </Card>
      </div>
    </div>
  );
};

let getAtoms = (name, func) => {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
    name.trim()
  )}/property/MolecularFormula/JSON`;

  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      try {
        return data["PropertyTable"]["Properties"][0]["MolecularFormula"];
      } catch {
        return null;
      }
    })
    .then((compound) => {
      if (!compound) return;
      const atoms = {};
      const regex = /[A-Z][a-z]?/gm;
      let m;
      while ((m = regex.exec(compound)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        for (let i of m) {
          atoms[i] = 0;
        }
      }
      console.log("atoms ->", atoms);
      func(atoms);
    })
    .catch((err) => console.error("Error fetching atoms:", err));
};

// এই ফাংশনটি এখন সম্পূর্ণ ফিক্সড এবং সঠিক API ব্যবহার করছে
let chkCompoundName = (name, setFuncCallback) => {
  const apiUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
    name.trim()
  )}/description/JSON`;

  fetch(apiUrl)
    .then((resp) => {
      if (resp.ok) {
        setFuncCallback(true);
      } else {
        setFuncCallback(false);
        alert("Compound not found! Please check the spelling.");
      }
    })
    .catch(() => {
      setFuncCallback(false);
    });
};

export default Main;