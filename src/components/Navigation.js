import React from "react";
import { Link } from "react-router-dom";
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className="nav-link">Textract</Link>
        <Link to="/ComprehendDemo" className="nav-link">Comprehend</Link>
        <Link to="/service3" className="nav-link">Service 3</Link>
      </div>
    </nav>
  );
}

export default Navigation;
