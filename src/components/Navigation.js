import React from "react";
import { Link } from "react-router-dom";
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className="nav-link">Textract</Link>
        <Link to="/ComprehendDemo" className="nav-link">Comprehend</Link>
        <Link to="/TextractComprehendDemo" className="nav-link">Textract+Comprehend</Link>
        <Link to="/PollyDemo" className="nav-link">Polly</Link>
      </div>
    </nav>
  );
}

export default Navigation;
