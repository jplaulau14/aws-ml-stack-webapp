// src/TextractComprehendDemo.js
import React, { useState } from "react";

function TextractComprehendDemo() {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [processingUrl, setProcessingUrl] = useState("");
  const [processingFile, setProcessingFile] = useState(null);

  const processImageAndAnalyze = async (sourceType, content) => {
    try {
      const textractRes = await fetch(
        "https://o16ldts418.execute-api.ap-southeast-1.amazonaws.com/dev/aws-ml-stack-serverless/lambda_handler",
        {
          method: "POST",
          body: JSON.stringify({
            action: "textract-comprehend",
            source_type: sourceType,
            file_content: content,
          }),
        }
      );

      if (!textractRes.ok) {
        throw new Error("Network response was not ok for textract.");
      }

      const data = await textractRes.json();
      return data;
    } catch (error) {
      console.error("Error during processing and sentiment analysis:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!url && !file) {
      setError("Please provide at least one input: URL or File.");
      return;
    }
    setProcessingUrl(url);
    setProcessingFile(file);

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      let result;
      if (url) {
        result = await processImageAndAnalyze("url", url);
      } else if (file) {
        result = await processImageAndAnalyze("upload", await toBase64(file));
      }

      setAnalysisResult(result);
    } catch (err) {
      setError("Failed to process the request.");
    } finally {
      setLoading(false);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // exclude the base64 MIME-type declaration part
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className="App">
      <h1 className="title">Text Extraction and Sentiment Analysis</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Image URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Extract and Analyze"}
      </button>

      {loading && <div className="loading-circle"></div>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {analysisResult && (
        <>
          {processingUrl && (
            <div className="output-container">
              <img src={processingUrl} alt="Processed content from URL" />
              {/* Shared analysis output */}
              {renderAnalysisOutput(analysisResult)}
            </div>
          )}

          {processingFile && (
            <div className="output-container">
              <img
                src={URL.createObjectURL(processingFile)}
                alt="Processed content from File"
              />
              {/* Shared analysis output */}
              {renderAnalysisOutput(analysisResult)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function renderAnalysisOutput(analysisResult) {
  return (
    <div>
      <h2 className="textract-heading">Textract Result:</h2>
      <p>{analysisResult.ExtractedText.join(" ")}</p>

      <h2 className="comprehend-heading">Comprehend Analysis:</h2>
      <p>
        <strong>Sentiment:</strong> {analysisResult.SentimentAnalysis.Sentiment}
      </p>
      {analysisResult.SentimentAnalysis.SentimentScore && (
        <div>
          <p>
            <strong>Positive Score:</strong>{" "}
            {analysisResult.SentimentAnalysis.SentimentScore.Positive}
          </p>
          <p>
            <strong>Negative Score:</strong>{" "}
            {analysisResult.SentimentAnalysis.SentimentScore.Negative}
          </p>
          <p>
            <strong>Neutral Score:</strong>{" "}
            {analysisResult.SentimentAnalysis.SentimentScore.Neutral}
          </p>
          <p>
            <strong>Mixed Score:</strong>{" "}
            {analysisResult.SentimentAnalysis.SentimentScore.Mixed}
          </p>
        </div>
      )}
    </div>
  );
}

export default TextractComprehendDemo;
