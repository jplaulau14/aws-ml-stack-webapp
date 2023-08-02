// src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!url && !file) {
      setError("Please provide at least one input: URL or File.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    // TODO: Implement API call to your AWS Lambda function

    // For demo purposes, assume API endpoint is 'https://yourapi.endpoint'
    let formData = new FormData();
    if (file) formData.append('file', file);
    
    try {
      const res = await fetch('https://3c1iaap5i7.execute-api.us-east-1.amazonaws.com/dev/textract-function/textract_handler', {
        method: 'POST',
        body: JSON.stringify({
          source_type: file ? 'upload' : 'url',
          file_content: file ? await toBase64(file) : url
        })
      });
      
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError("Failed to process the request.");
    }

    setLoading(false);
  };

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // exclude the base64 MIME-type declaration part
    reader.onerror = error => reject(error);
  });

  return (
    <div className="App">
      <h1>Textract PWA</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Image URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
        />
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Textract!"}
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <div className="output-container">
          <img src={url || URL.createObjectURL(file)} alt="Processed content" />
          <div>
            {response.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
