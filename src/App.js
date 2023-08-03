import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import TextractDemo from "./pages/TextractDemo";
import ComprehendDemo from "./pages/ComprehendDemo";
import Service3Demo from "./pages/Service3Demo";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<TextractDemo />} exact />
          <Route path="/ComprehendDemo" element={<ComprehendDemo />} />
          <Route path="/service3" element={<Service3Demo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
