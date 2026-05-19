import React from "react";
import colorData from "../_color.json";

const elements = colorData.elements;

import { Chip } from "primereact/chip";

import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";

/* Chemix Color Codes Component */

const ColorCodes = ({ toShowEls }) => {

  return (

    <div
      className="p-d-flex p-ai-baseline p-flex-wrap p-px-3"
      style={{
        marginTop: "30px",
        justifyContent: "center",
      }}
    >

      {/* Title */}

      <div className="p-mr-3 p-mb-3">

        <h1
          style={{
            color: "#00e5ff",
            textShadow: "0 0 12px #00e5ff",
            fontSize: "32px",
          }}
        >
          ⚗️ Chemix Color Codes
        </h1>

      </div>

      {/* Elements */}

      {elements
        .filter((item) => {
          return item["symbol"] in toShowEls;
        })

        .map((item) => {

          return (

            <Chip
              key={item["symbol"]}

              template={

                <div
                  className="p-d-flex p-ai-center"
                  style={{
                    fontSize: "1.05em",
                    padding: "8px 12px",
                    color: "white",
                  }}
                >

                  {/* Color Dot */}

                  <i
                    className="pi pi-circle-on p-pr-2"
                    style={{
                      color: item["cpk-hex"],
                      fontSize: "18px",
                      marginRight: "8px",
                      textShadow: `0 0 10px ${item["cpk-hex"]}`,
                    }}
                  ></i>

                  {/* Element Name */}

                  <span
                    style={{
                      fontWeight: "bold",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {item["name"]}
                  </span>

                </div>
              }

              className="p-mr-2 p-mb-2"

              style={{
                borderRadius: "50px",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 0 15px rgba(0,229,255,0.15)",
              }}
            />

          );

        })}

    </div>

  );
};

export default ColorCodes;