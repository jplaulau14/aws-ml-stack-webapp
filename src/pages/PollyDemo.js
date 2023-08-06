import React, { useState, useRef } from "react";

function PollyDemo() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [showVideos, setShowVideos] = useState(false);
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  const handlePolly = async () => {
    if (!text.trim()) {
      setError("Please provide some text for processing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://o16ldts418.execute-api.ap-southeast-1.amazonaws.com/dev/aws-ml-stack-serverless/lambda_handler",
        {
          method: "POST",
          body: JSON.stringify({
            action: "polly",
            text: text,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      setAudioData(data.audio);
    } catch (err) {
      setError(`Failed to process the request: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    const audio = new Audio(`data:audio/mp3;base64,${audioData}`);
    audio.play();
    if (videoRef1.current && videoRef2.current) {
        videoRef1.current.play();
        videoRef2.current.play();
        setShowVideos(true); 
      } else {
        console.error("Video refs are not yet set.");
      }
  };

  return (
    <div className="App">
      <h1 className="title">Amazon Polly Demo</h1>

      <div className="input-container">
        <textarea
          placeholder="Enter text for audio conversion"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <button onClick={handlePolly} disabled={loading}>
        Polly
      </button>

      {loading && <div className="loading-circle"></div>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {audioData && <button onClick={handlePlay}>Play</button>}
      {showVideos && (
        <div className="video-container" style={{ marginTop: "20px" }}>
          <video ref={videoRef1} width="480" height="360" autoPlay loop>
            <source src="/videos/minecraft.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <video ref={videoRef2} width="480" height="360" autoPlay loop>
            <source src="/videos/subway_surfer.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}

export default PollyDemo;
