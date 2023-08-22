import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import TextractDemo from "./pages/TextractDemo";
import ComprehendDemo from "./pages/ComprehendDemo";
import TextractComprehendDemo from "./pages/TextractComprehendDemo";
import PollyDemo from "./pages/PollyDemo";
import RekognitionDemo from "./pages/RekognitionDemo";
import SageMakerDemo from "./pages/SageMakerDemo";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<TextractDemo />} exact />
          <Route path="/ComprehendDemo" element={<ComprehendDemo />} />
          <Route path="/TextractComprehendDemo" element={<TextractComprehendDemo />} />
          <Route path="/PollyDemo" element={<PollyDemo />} />
          <Route path="/RekognitionDemo" element={<RekognitionDemo />} />
          <Route path="/SageMakerDemo" element={<SageMakerDemo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
