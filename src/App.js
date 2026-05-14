import React from "react";
import "./App.css";
import Main from "./components/main";
import logo from "./img/logo.png";

function App() {
  return (
    <section className="App-header">

      {/* Logo */}
      <img
        alt="Chemix-Encyclopedia"
        src={logo}
        className="logo"
        onClick={() => {
          window.location.reload();
        }}
      />

      {/* Title */}
      <h1 className="title">
        Chemix-Encyclopedia
      </h1>

      {/* Subtitle */}
      <p className="subtitle">
        Interactive Scientific Chemistry Experience
      </p>

      {/* Main Content */}
      <div className="App">
        <center>
          <Main />
        </center>
      </div>

    </section>
  );
}

export default App;