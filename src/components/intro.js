import React from "react";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import { Card } from "primereact/card";
import cubes from "../img/cubes.svg";
import _2d from "../img/2d.svg";
import periodicTable from "../img/periodic-table.svg";

const header = (props) => {
  const imgUrls = [cubes, _2d, periodicTable];

  return (
    <div className="introimg">
      <img
        alt="Chemix"
        src={imgUrls[props]}
        style={{
          width: "10em",
          paddingTop: "1rem",
          filter: "drop-shadow(0 0 10px cyan)"
        }}
      />
    </div>
  );
};

const Intro = () => {
  return (
    <div
      className="p-d-flex p-jc-center p-ai-center p-flex-column"
      style={{
        color: "white",
        textAlign: "center",
        padding: "20px"
      }}
    >
      <div className="p-mb-4">
        Welcome to
        <h1
          className="p-px-2"
          style={{
            fontFamily: "Montserrat",
            color: "#00ffe5",
            textShadow: "0 0 15px #00ffe5"
          }}
        >
          Chemix-Encyclopedia
        </h1>
      </div>

      <div className="p-mb-4">
        Created and maintained by
        <h2
          className="p-px-2"
          style={{
            fontFamily: "Montserrat",
            color: "#ffd700",
            textShadow: "0 0 10px gold"
          }}
        >
          timedcoder
        </h2>
      </div>

      <div className="p-mb-5" style={{ maxWidth: "700px" }}>
        Explore the amazing world of chemistry with futuristic visuals,
        interactive molecule structures, periodic elements, and compound
        analysis in a beautiful sci-fi interface.
      </div>

      <div className="p-d-flex p-flex-column p-flex-lg-row">
        {["3D Molecules", "2D Compounds", "Periodic Elements"].map((i) => {
          const strMapInd = {
            "3D Molecules": [
              0,
              "View powerful interactive 3D molecular structures in real-time",
            ],
            "2D Compounds": [
              1,
              "Quickly explore 2D compound diagrams and structures",
            ],
            "Periodic Elements": [
              2,
              "Discover detailed information about periodic table elements",
            ],
          };

          return (
            <Card
              className="p-mb-6 p-mr-6 p-mx-5"
              title={i}
              key={strMapInd[i][0]}
              subTitle={strMapInd[i][1]}
              style={{
                width: "15em",
                background: "rgba(20,20,30,0.8)",
                color: "white",
                border: "1px solid cyan",
                boxShadow: "0 0 20px rgba(0,255,255,0.4)",
                borderRadius: "20px",
                backdropFilter: "blur(10px)"
              }}
              header={header(strMapInd[i][0])}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Intro;