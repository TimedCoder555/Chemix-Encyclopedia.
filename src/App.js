import React from "react";
import "./App.css";

import bgImage from "./img/chem-bg.jpg";
import logo from "./img/logo.png";

import Main from "./components/main";

function App() {
  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `linear-gradient(
          rgba(5,10,25,0.82),
          rgba(5,10,25,0.9)
        ), url(${bgImage})`,
      }}
    >
      {/* NAVBAR */}

      <nav className="navbar">

        <div className="brand">

          <img src={logo} alt="logo" className="logo" />

          <div>
            <h1>Chemix-Encyclopedia</h1>

            <p>by Timedcoder</p>
          </div>

        </div>

        <ul className="nav-links">
          <li>HOME</li>
          <li>ELEMENTS</li>
          <li>MOLECULES</li>
          <li>ABOUT</li>
        </ul>

      </nav>

      {/* HERO SECTION */}

      <section className="hero">

        <h2>
          “Chemistry is the poetry
          <br />
          of invisible molecules.”
        </h2>

        <p>
          Explore compounds, elements,
          reactions and molecular structures
          in a futuristic chemistry experience.
        </p>

      </section>

      {/* MAIN APP */}

      <div className="main-content">
        <Main />
      </div>

    </div>
  );
}

export default App;