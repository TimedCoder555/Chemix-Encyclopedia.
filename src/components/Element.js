import React, { Component } from "react";

import { elements } from "./_data";

/* Chemix Element Component */

export default class Element extends Component {

  state = {
    hover: false,
  };

  /* Open Info */

  openInfo = () => {
    this.props.showInfo(this.props.num);
  };

  /* Hover Effects */

  onMouseEnter = () => {
    this.setState({
      hover: true,
    });
  };

  onMouseLeave = () => {
    this.setState({
      hover: false,
    });
  };

  render() {

    let { num } = this.props;

    let element = elements[num];

    /* Hidden Effect */

    let shade =
      element.symbol in this.props.toShow
        ? {}
        : {
            opacity: "0.25",
            filter: "grayscale(70%)",
          };

    return (

      <div

        title={element.name}

        onMouseEnter={this.onMouseEnter}

        onMouseLeave={this.onMouseLeave}

        onClick={this.openInfo}

        className={`
          element
          element-${num}
          ${element.category}
          ${this.state.hover ? "active" : ""}
        `}

        style={{
          ...shade,

          borderRadius: "18px",

          transition: "0.35s",

          background:
            this.state.hover
              ? "linear-gradient(135deg, rgba(0,229,255,0.25), rgba(124,77,255,0.25))"
              : "",

          boxShadow:
            this.state.hover
              ? "0 0 25px rgba(0,229,255,0.45)"
              : "0 0 10px rgba(255,255,255,0.05)",

          transform:
            this.state.hover
              ? "scale(1.08)"
              : "scale(1)",

          border:
            this.state.hover
              ? "1px solid rgba(0,229,255,0.6)"
              : "1px solid rgba(255,255,255,0.08)",

          backdropFilter: "blur(10px)",

          overflow: "hidden",

          cursor: "pointer",
        }}

      >

        {/* Atomic Number */}

        <div
          className="number"
          style={{
            color: "#cbd5e1",
            fontSize: "10px",
            paddingLeft: "4px",
            paddingTop: "2px",
          }}
        >
          {element.number}
        </div>

        {/* Symbol */}

        <div
          className="symbol"
          style={{
            color: "#ffffff",
            textShadow: this.state.hover
              ? "0 0 12px #00e5ff"
              : "0 0 6px rgba(255,255,255,0.3)",

            transition: "0.3s",
          }}
        >
          {element.symbol}
        </div>

        {/* Name */}

        <div
          className="element-name"
          style={{
            color: "#d1d5db",
            fontWeight: "500",
            letterSpacing: "0.3px",
          }}
        >
          {element.name}
        </div>

      </div>
    );
  }
}