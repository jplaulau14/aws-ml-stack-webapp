import React, { useState } from "react";
import "./SageMakerDemo.css";

function SageMakerDemo() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const analyzeGenre = async (inputText) => {
    const payload = {
      action: "sagemaker",
      endpoint_name: "blazingtext-2023-08-22-03-38-33-609",
      payload: {
        instances: [inputText],
      },
    };

    console.log("Request Payload:", payload);

    try {
      const response = await fetch(
        "https://o16ldts418.execute-api.ap-southeast-1.amazonaws.com/dev/aws-ml-stack-serverless/lambda_handler",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        console.error("Response Error:", response.statusText);
        throw new Error(
          `Network response was not ok. Status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during genre analysis:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!text) {
      setError("Please provide input text for genre analysis.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeGenre(text);
      setAnalysisResult(result);
    } catch (err) {
      setError("Failed to process the request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1 className="title">Genre Analysis with SageMaker</h1>

      <div className="input-container">
        <textarea
          placeholder="Enter text to determine its genre"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Analyze Genre!"}
      </button>

      {loading && <div className="loading-circle"></div>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {analysisResult && (
        <div className="output-container">
          <h2>Analysis Result:</h2>
            <div>{JSON.stringify(analysisResult, null, 2)}</div>
          </div>
      )}
    </div>
  );
}

export default SageMakerDemo;
