import Element from "./Element";
import React, { Component, Fragment } from "react";
import { elements } from "./_data";

class PeriodicTable extends Component {
  state = {
    showInfo: false,
    element: {},
  };

  showInfo = (num) => {
    this.setState({
      showInfo: true,
      element: elements[num],
    });
  };

  closeInfo = () => {
    this.setState({
      showInfo: false,
    });
  };

  render() {
    let {
      name,
      summary,
      symbol,
      category,
      number,
      source,
      appearance,
      atomic_mass,
      molar_heat,
      density,
      melt,
      boil,
    } = this.state.element;

    let toShowEl = this.props.toShow;

    const compound = this.props.compound.trim();

    let compoundName = "";

    try {
      compoundName =
        compound[0].toUpperCase() + compound.slice(1).toLowerCase();
    } catch {}

    return (
      <div
        className="wrapper"
        style={{
          marginTop: "40px",
          color: "white",
        }}
      >
        {/* TITLE */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1
            style={{
              color: "#00ffe5",
              textShadow: "0 0 15px cyan",
              fontSize: "2.5rem",
            }}
          >
            Elements Present in {compoundName}
          </h1>

          <h3
            style={{
              color: "#cccccc",
              fontWeight: "normal",
            }}
          >
            Click any element to explore detailed information
          </h3>
        </div>

        {/* PERIODIC TABLE */}
        <div
          id="table"
          style={{
            background: "rgba(10,10,20,0.9)",
            padding: "20px",
            borderRadius: "20px",
            border: "1px solid cyan",
            boxShadow: "0 0 25px rgba(0,255,255,0.25)",
          }}
        >
          {Object.keys(elements).map((num) => (
            <Element
              key={num}
              showInfo={this.showInfo}
              toShow={toShowEl}
              num={num}
            />
          ))}

          {/* INFO BOX */}
          {this.state.showInfo ? (
            <Fragment>
              <div className="infobox">
                <div
                  id="element-box"
                  className={`${category}`}
                  style={{
                    borderRadius: "15px",
                    boxShadow: "0 0 20px rgba(0,255,255,0.4)",
                  }}
                >
                  <div className="number">{number}</div>

                  <div className="symbol">{symbol}</div>

                  <div className="element-name">{name}</div>
                </div>

                <div
                  id="information"
                  style={{
                    background: "rgba(15,15,30,0.95)",
                    color: "white",
                    borderRadius: "15px",
                    padding: "20px",
                    border: "1px solid cyan",
                    boxShadow: "0 0 25px rgba(0,255,255,0.3)",
                  }}
                >
                  {/* CLOSE BUTTON */}
                  <div
                    onClick={this.closeInfo}
                    className="close-button"
                    title="Close Info"
                    style={{
                      color: "#ff4d6d",
                      fontWeight: "bold",
                    }}
                  >
                    ✖ Close
                  </div>

                  <div>
                    <h1
                      className="big_title"
                      style={{
                        color: "#00ffe5",
                        textShadow: "0 0 10px cyan",
                      }}
                    >
                      {name}
                    </h1>

                    <span
                      className={`cat_name ${category}`}
                      style={{
                        marginLeft: "10px",
                        padding: "5px 10px",
                        borderRadius: "10px",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      {category}
                    </span>

                    {/* APPEARANCE */}
                    {appearance ? (
                      <div
                        className="appearance"
                        style={{ marginTop: "15px" }}
                      >
                        <strong>Appearance:</strong> {appearance}
                      </div>
                    ) : (
                      ""
                    )}

                    {/* ATOMIC INFO */}
                    <div
                      className="atom_info"
                      style={{
                        marginTop: "15px",
                        color: "#ffd700",
                        lineHeight: "1.8",
                      }}
                    >
                      <div>Atomic Mass: {atomic_mass}</div>

                      <div>Density: {density}</div>

                      {molar_heat ? (
                        <div>Molar Heat: {molar_heat}</div>
                      ) : (
                        ""
                      )}

                      {melt ? <div>Melting Point: {melt}K</div> : ""}

                      {boil ? <div>Boiling Point: {boil}K</div> : ""}
                    </div>

                    {/* SUMMARY */}
                    <div
                      style={{
                        marginTop: "20px",
                        lineHeight: "1.7",
                        color: "#dddddd",
                      }}
                    >
                      {summary} ...

                      <br />
                      <br />

                      <a
                        target="_blank"
                        href={source}
                        rel="noreferrer"
                        style={{
                          color: "#00ffe5",
                          textDecoration: "none",
                          fontWeight: "bold",
                        }}
                      >
                        Read Full Source →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default PeriodicTable;