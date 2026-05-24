import React from "react";
import "./App.css";

import logo from "./img/logo.png";
import Main from "./components/main";

function App() {

  const openReport = () => {
    window.open(
      "https://github.com/YOUR_USERNAME/YOUR_REPO/issues",
      "_blank"
    );
  };

  return (
    <div className="app-container">

      {/* TOP HEADER ONLY (NO NAV LINKS) */}
      <header className="top-bar">

        <div className="brand">
          <img src={logo} alt="logo" className="logo" />

          <div>
            <h1>Chemix-Encyclopedia</h1>

            <div className="sub-row">

              <span className="timedcoder">
                TimedCoder
              </span>

              <button
                className="report-btn"
                onClick={openReport}
              >
                REPORT HERE
              </button>

            </div>
          </div>
        </div>

      </header>

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

      {/* BOTTOM NAV ONLY */}
      <nav className="bottom-nav">

        <div className="nav-item active">HOME</div>
        <div className="nav-item">ELEMENTS</div>
        <div className="nav-item">MOLECULES</div>
        <div className="nav-item">ABOUT</div>

      </nav>

    </div>
  );
}

export default App;