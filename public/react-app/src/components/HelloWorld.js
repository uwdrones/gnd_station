import React, { useState, useRef, useEffect } from 'react';
import './HelloWorld.css';

const HelloWorld = () => {
  const [clicks, setClicks] = useState(0);
  const videoRef = useRef(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            deviceId: 0,
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Error accessing camera: ' + err.message);
        console.error('Error:', err);
      }
    }
    
    setupCamera();
    
    // Cleanup function to stop the camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="hello-container">
      <h1 className="title">
        Hello, World!
      </h1>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          className="camera-feed"
        />
      )}
      <button 
        onClick={() => setClicks(prev => prev + 1)}
        className="click-button"
      >
        Click me!
      </button>
      <p className="click-count">
        You've clicked {clicks} times
      </p>
    </div>
  );
};

export default HelloWorld;
