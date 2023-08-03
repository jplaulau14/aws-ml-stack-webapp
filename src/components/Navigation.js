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
      </div>
    </nav>
  );
}

export default Navigation;
