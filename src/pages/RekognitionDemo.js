// src/RekognitionDemo.js
import React, { useState } from "react";
import "./RekognitionDemo.css";

function RekognitionDemo() {
  const [rekognitionType, setRekognitionType] = useState("label");
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setShowCamera(true);
    } catch (error) {
      console.error("Error accessing the camera:", error);
      setError("Failed to access the camera.");
    }
  };

  const captureSnapshot = () => {
    if (!cameraStream) return;

    // Create a canvas element to render the snapshot
    const canvas = document.createElement("canvas");
    const videoEl = document.querySelector("video"); // the video element used to display camera feed

    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    canvas.getContext("2d").drawImage(videoEl, 0, 0);

    // Convert canvas to image data
    const dataURL = canvas.toDataURL("image/jpeg");
    const binary = atob(dataURL.split(",")[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], { type: "image/jpeg" });

    setCapturedImage(dataURL);
    setImageData(btoa(blob));

    // Removed the closeCamera() line here
  };

  const rekognizeImage = async (service, image) => {
    try {
      const response = await fetch(
        "https://o16ldts418.execute-api.ap-southeast-1.amazonaws.com/dev/aws-ml-stack-serverless/lambda_handler",
        {
          method: "POST",
          body: JSON.stringify({
            rekognition_type: service,
            image_data: image,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during image analysis:", error);
      throw error;
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setShowCamera(false);
    }
  };

  const handleSubmit = async () => {
    if (!rekognitionType || !imageData) {
      setError("Please select a service and provide image data.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await rekognizeImage(rekognitionType, imageData); // Using rekognitionType here
      if (result) {
        setSuccess(true);
      }
    } catch (err) {
      setError("Failed to process the request.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageData(btoa(reader.result));
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="App">
      <h1 className="title">Image Analysis with Rekognition</h1>

      <div className="dropdown-container" style={{ marginBottom: "20px" }}>
        <select
          value={rekognitionType}
          onChange={(e) => setRekognitionType(e.target.value)}
        >
          <option value="label">Label Detection</option>
          <option value="detect_faces">Facial Analysis</option>
        </select>
      </div>

      {showCamera && (
        <div className="camera-container">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured Snapshot"
              style={{ width: "100%" }}
            />
          ) : (
            <video
              autoPlay
              playsInline
              ref={(video) => {
                if (video && cameraStream) {
                  video.srcObject = cameraStream;
                }
              }}
            />
          )}
          <div style={{ marginTop: "10px" }}>
            <button onClick={captureSnapshot} style={{ marginRight: "10px" }}>
              {capturedImage ? "Retake Snapshot" : "Take Snapshot"}
            </button>
            <button onClick={closeCamera}>Close Camera</button>
          </div>
        </div>
      )}

      <div className="input-container">
        <input type="file" onChange={handleImageUpload} />
        <button onClick={startCamera}>Open Camera</button>
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Rekognize!"}
      </button>

      {loading && <div className="loading-circle"></div>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {success && (
        <div className="output-container">
          <h1>Success</h1>
        </div>
      )}
    </div>
  );
}

export default RekognitionDemo;
