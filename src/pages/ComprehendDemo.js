import React, { useState } from "react";
import "./ComprehendDemo.css";

function ComprehendDemo() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const analyzeSentiment = async (inputText) => {
    try {
      const response = await fetch(
        "https://o16ldts418.execute-api.ap-southeast-1.amazonaws.com/dev/aws-ml-stack-serverless/lambda_handler",
        {
          method: "POST",
          body: JSON.stringify({
            action: "comprehend",
            text: inputText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during sentiment analysis:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!text) {
      setError("Please provide input text for sentiment analysis.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeSentiment(text);
      setAnalysisResult(result);
    } catch (err) {
      setError("Failed to process the request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1 className="title">Sentiment Analysis with Comprehend</h1>

      <div className="input-container">
        <textarea
          placeholder="Enter text for sentiment analysis"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Comprehend!"}
      </button>

      {loading && <div className="loading-circle"></div>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {analysisResult && (
        <div className="output-container">
          <h2>Analysis Result:</h2>
          <p>
            <strong>Sentiment:</strong> {analysisResult.Sentiment}
          </p>
          {analysisResult.SentimentScore && (
            <div>
              <p>
                <strong>Positive Score:</strong>{" "}
                {analysisResult.SentimentScore.Positive}
              </p>
              <p>
                <strong>Negative Score:</strong>{" "}
                {analysisResult.SentimentScore.Negative}
              </p>
              <p>
                <strong>Neutral Score:</strong>{" "}
                {analysisResult.SentimentScore.Neutral}
              </p>
              <p>
                <strong>Mixed Score:</strong>{" "}
                {analysisResult.SentimentScore.Mixed}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ComprehendDemo;
