// src/App.js
import React, { useState } from "react";
import "./TextractDemo.css";

function TextractDemo() {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [urlResponse, setUrlResponse] = useState(null);
  const [fileResponse, setFileResponse] = useState(null);
  const [error, setError] = useState(null);
  const [processingUrl, setProcessingUrl] = useState("");
  const [processingFile, setProcessingFile] = useState(null);

  const processImage = async (sourceType, content) => {
    try {
      const res = await fetch(
        "https://3c1iaap5i7.execute-api.us-east-1.amazonaws.com/dev/textract-function/lambda_handler",
        {
          method: "POST",
          body: JSON.stringify({
            action: "textract",
            source_type: sourceType,
            file_content: content,
          }),
        }
      );

      return await res.json();
    } catch (err) {
      setError("Failed to process the request.");
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
    setUrlResponse(null);
    setFileResponse(null);

    if (url) {
      const urlData = await processImage("url", url);
      setUrlResponse(urlData);
    }

    if (file) {
      const fileData = await processImage("upload", await toBase64(file));
      setFileResponse(fileData);
    }

    setLoading(false);
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
      <h1 className="title">Single-page Text Extraction</h1>

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
        {loading ? "Processing..." : "Textract!"}
      </button>

      {loading && <div className="loading-circle"></div>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {urlResponse && (
        <div className="output-container">
          <img src={processingUrl} alt="Processed content from URL" />
          <div>
            {urlResponse.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      )}

      {fileResponse && (
        <div className="output-container">
          <img
            src={URL.createObjectURL(processingFile)}
            alt="Processed content from File"
          />
          <div>
            {fileResponse.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TextractDemo;
