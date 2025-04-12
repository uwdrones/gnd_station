import React, { useEffect, useRef } from 'react';
import './Camera.css';
import { useDrone } from '../../context/DroneContext';
import { cameraService } from '../../services/api';

const Camera: React.FC = () => {
  const { state, dispatch } = useDrone();
  const { cameraStatus, cameraFeed } = state;
  const videoRef = useRef<HTMLImageElement>(null);

  // Fetch camera feed at regular intervals
  useEffect(() => {
    if (!cameraStatus?.isActive) return;

    const fetchCameraFeed = async () => {
      try {
        const response = await cameraService.getCameraFeed();
        dispatch({ type: 'SET_CAMERA_FEED', payload: response.data });
      } catch (error) {
        if (error instanceof Error) {
          dispatch({ type: 'SET_ERROR', payload: error.message });
        }
      }
    };

    // Initial fetch
    fetchCameraFeed();

    // Set up interval for continuous updates
    const interval = setInterval(fetchCameraFeed, 100); // 10 FPS

    return () => clearInterval(interval);
  }, [cameraStatus?.isActive, dispatch]);

  // Update image when feed changes
  useEffect(() => {
    if (videoRef.current && cameraFeed?.frame) {
      videoRef.current.src = `data:image/jpeg;base64,${cameraFeed.frame}`;
    }
  }, [cameraFeed]);

  const renderCameraMetadata = () => {
    if (!cameraStatus || !cameraFeed) return null;

    return (
      <div className="camera-metadata">
        <div className="metadata-item">
          <span className="metadata-label">Resolution:</span>
          <span className="metadata-value">
            {cameraStatus.resolution.width} x {cameraStatus.resolution.height}
          </span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">FPS:</span>
          <span className="metadata-value">{cameraStatus.fps}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Format:</span>
          <span className="metadata-value">{cameraStatus.format}</span>
        </div>
        {cameraFeed.metadata && (
          <>
            <div className="metadata-item">
              <span className="metadata-label">Exposure:</span>
              <span className="metadata-value">{cameraFeed.metadata.exposure.toFixed(2)}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Gain:</span>
              <span className="metadata-value">{cameraFeed.metadata.gain.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="camera-container">
      <div className="camera-header">
        <h2>Camera Feed</h2>
        {cameraStatus && (
          <div className={`camera-status camera-status-${cameraStatus.status}`}>
            {cameraStatus.status.toUpperCase()}
          </div>
        )}
      </div>

      <div className="camera-view">
        {cameraStatus?.isActive ? (
          <img 
            ref={videoRef} 
            className="camera-feed" 
            alt="Camera feed" 
          />
        ) : (
          <div className="camera-offline">
            Camera is offline
          </div>
        )}
      </div>

      {renderCameraMetadata()}
    </div>
  );
};

export default Camera; 