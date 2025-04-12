import React, { useState, useRef, useEffect } from 'react';
import './HelloWorld.css';

function HelloWorld() {
  const [clicks, setClicks] = useState(0);
  const frontVideoRef = useRef(null);
  const downwardVideoRef = useRef(null);
  const [frontError, setFrontError] = useState('');
  const [downwardError, setDownwardError] = useState('');

  useEffect(() => {
    async function setupCameras() {
      try {
        // Get list of available video devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        // For demo purposes - use the same camera for both views
        // In a real app, you would use different deviceIds
        if (videoDevices.length > 0) {
          const deviceId = videoDevices[0]?.deviceId;

          // Front camera setup
          const frontStream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: deviceId,
              width: { ideal: 640 },
              height: { ideal: 480 }
            }
          });

          if (frontVideoRef.current) {
            frontVideoRef.current.srcObject = frontStream;
          }

          // For demo - reuse the same camera for downward view
          // In reality, this would be a separate camera
          const downwardStream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: deviceId,
              width: { ideal: 640 },
              height: { ideal: 480 }
            }
          });

          if (downwardVideoRef.current) {
            downwardVideoRef.current.srcObject = downwardStream;
          }
        } else {
          setFrontError('No camera devices found');
          setDownwardError('No camera devices found');
        }
      } catch (err) {
        setFrontError('Error accessing camera: ' + err.message);
        setDownwardError('Error accessing camera: ' + err.message);
        console.error('Error:', err);
      }
    }

    setupCameras();

    // Cleanup function to stop both cameras when component unmounts
    return () => {
      if (frontVideoRef.current && frontVideoRef.current.srcObject) {
        frontVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (downwardVideoRef.current && downwardVideoRef.current.srcObject) {
        downwardVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="main-container">
      <h1 className="title">Ground Station Interface</h1>

      <div className="camera-grid">
        {/* Front Camera Feed */}
        <div className="camera-container">
          <div className="camera-frame">
            <div className="camera-view">
              {frontError ? (
                <div className="error-display">
                  <p className="error-message">{frontError}</p>
                </div>
              ) : (
                <video
                  ref={frontVideoRef}
                  autoPlay
                  playsInline
                  className="camera-feed" />
              )}
              <div className="camera-label top-left">
                <span>CAM_01</span>
              </div>
              <div className="camera-label bottom-right">
                <span>FRONT VIEW</span>
              </div>
            </div>
          </div>
        </div>

        {/* Downward Camera Feed */}
        <div className="camera-container">
          <div className="camera-frame">
            <div className="camera-view">
              {downwardError ? (
                <div className="error-display">
                  <p className="error-message">{downwardError}</p>
                </div>
              ) : (
                <video
                  ref={downwardVideoRef}
                  autoPlay
                  playsInline
                  className="camera-feed" />
              )}
              <div className="camera-label top-left">
                <span>CAM_02</span>
              </div>
              <div className="camera-label bottom-right">
                <span>DOWNWARD VIEW</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WASD Controls */}
      <div className="controls-section">
        <p className="controls-label">CONTROLS</p>
        <div className="wasd-container">
          <div className="wasd-row">
            <div className="wasd-spacer"></div>
            <button className="wasd-button">W</button>
            <div className="wasd-spacer"></div>
          </div>
          <div className="wasd-row">
            <button className="wasd-button">A</button>
            <button className="wasd-button">S</button>
            <button className="wasd-button">D</button>
          </div>
        </div>
      </div>

      <div className="system-controls">
        <button
          onClick={() => setClicks(prev => prev + 1)}
          className="activate-button"
        >
          ACTIVATE SYSTEM
        </button>
        <p className="activation-count">
          System activated {clicks} times
        </p>
      </div>

      <div className="system-status">
        <p>[ SYSTEM OPERATIONAL | STATUS: MONITORING ]</p>
      </div>
    </div>
  );
}

export default HelloWorld;