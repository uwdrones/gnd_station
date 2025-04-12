import React from 'react';
import './Telemetry.css';
import { useDrone } from '../../context/DroneContext';
import { TelemetryData } from '../../types/telemetry';

const Telemetry: React.FC = () => {
  const { state } = useDrone();
  const { telemetry } = state;

  const renderTelemetryData = (data: TelemetryData) => (
    <div className="telemetry-data">
      <div className="telemetry-row">
        <span className="telemetry-label">Position:</span>
        <span className="telemetry-value">
          {data.position.latitude.toFixed(6)}°, {data.position.longitude.toFixed(6)}°
        </span>
      </div>
      <div className="telemetry-row">
        <span className="telemetry-label">Altitude:</span>
        <span className="telemetry-value">{data.position.altitude.toFixed(2)} m</span>
      </div>
      <div className="telemetry-row">
        <span className="telemetry-label">Velocity:</span>
        <span className="telemetry-value">
          X: {data.velocity.x.toFixed(2)} m/s, 
          Y: {data.velocity.y.toFixed(2)} m/s, 
          Z: {data.velocity.z.toFixed(2)} m/s
        </span>
      </div>
      <div className="telemetry-row">
        <span className="telemetry-label">Attitude:</span>
        <span className="telemetry-value">
          Roll: {data.attitude.roll.toFixed(2)}°, 
          Pitch: {data.attitude.pitch.toFixed(2)}°, 
          Yaw: {data.attitude.yaw.toFixed(2)}°
        </span>
      </div>
      <div className="telemetry-row">
        <span className="telemetry-label">Battery:</span>
        <span className="telemetry-value">
          {data.battery.percentage.toFixed(1)}% ({data.battery.voltage.toFixed(2)}V, {data.battery.current.toFixed(2)}A)
        </span>
      </div>
      <div className="telemetry-row">
        <span className={`telemetry-status telemetry-status-${data.status}`}>
          Status: {data.status.toUpperCase()}
        </span>
      </div>
    </div>
  );

  return (
    <div className="telemetry-container">
      <h2>Telemetry Data</h2>
      {telemetry ? (
        renderTelemetryData(telemetry)
      ) : (
        <div className="telemetry-loading">Loading telemetry data...</div>
      )}
    </div>
  );
};

export default Telemetry; 