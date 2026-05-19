import React from "react";

const Intro = () => {
  return (
    <div
      style={{
        color: "white",
        textAlign: "center",
        padding: "40px",
      }}
    >
      <h1
        style={{
          color: "#00ffe5",
          fontSize: "2.5rem",
          marginBottom: "15px",
        }}
      >
        Welcome to Chemix-Encyclopedia
      </h1>

      <p
        style={{
          color: "#cccccc",
          fontSize: "1.1rem",
        }}
      >
        Search any chemical compound to explore structures and elements.
      </p>
    </div>
  );
};

export default Intro;