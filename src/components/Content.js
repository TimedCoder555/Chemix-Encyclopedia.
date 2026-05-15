import React from "react";

import { Card } from "primereact/card";

import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/themes/vela-blue/theme.css";

/* Chemix 3D Viewer */

const Main = () => {

  return (

    <div
      style={{
        width: "100%",
        padding: "20px",
      }}
    >

      <Card

        title={
          <div
            style={{
              textAlign: "center",
              fontSize: "32px",
              fontWeight: "bold",
              color: "#00e5ff",
              textShadow: "0 0 15px #00e5ff",
              letterSpacing: "1px",
            }}
          >
            ⚗️ Chemix 3D Compound Viewer
          </div>
        }

        style={{
          width: "95%",
          maxWidth: "1400px",
          margin: "auto",
          borderRadius: "25px",
          overflow: "hidden",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 0 40px rgba(0,229,255,0.15)",
        }}

      >

        {/* Description */}

        <p
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#cbd5e1",
            fontSize: "16px",
            letterSpacing: "0.5px",
          }}
        >
          Explore scientific molecules and compounds in immersive 3D experience.
        </p>

        {/* 3D Viewer */}

        <iframe
          title="Chemix 3D Viewer"

          className="pubchem-widget"

          src="https://pubchem.ncbi.nlm.nih.gov/compound/aspirin#section=3D-Conformer&fullscreen=true&embed=true&hide_title=true"

          style={{
            width: "100%",
            height: "650px",
            border: "none",
            borderRadius: "20px",
            boxShadow: "0 0 25px rgba(0,229,255,0.2)",
          }}

        ></iframe>

        {/* Footer */}

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "14px",
          }}
        >
          Powered by Chemix-Encyclopedia ⚡
        </div>

      </Card>

    </div>
  );
};

export default Main;