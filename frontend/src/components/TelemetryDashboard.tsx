// placeholder for the telemetry dashboard on the UI
// used for testing the http based datapath

import React, { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";

const WS_URL = "ws://100.114.42.48:8080"; // Tailscale static IP address for now

const TelemetryDashboard: React.FC = () => {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [usePrimaryMethod, setUsePrimaryMethod] = useState(true);

  // WebSocket Hook
  const { sendMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    shouldReconnect: () => true, // Auto-reconnect on failure
  });

  // Handle incoming telemetry
  useEffect(() => {
    if (lastJsonMessage) {
      setTelemetry(lastJsonMessage);
    }
  }, [lastJsonMessage]);

  // Connection Status Indicator
  useEffect(() => {
    setIsConnected(readyState === 1);
  }, [readyState]);

  // Toggle between primary and backup telemetry
  const toggleTelemetrySource = () => {
    setUsePrimaryMethod((prev) => !prev);
    if (!usePrimaryMethod) {
      sendMessage("STOP_TELEMETRY"); // Stop WebSocket if primary is active
    }
  };

  return (
    <div className="container">
      <h2>Drone Telemetry Dashboard</h2>

      <div className="status">
        <p>🛰️ Connection: {isConnected ? "✅ Connected" : "❌ Disconnected"}</p>
        <p>📡 Using: {usePrimaryMethod ? "Primary (gRPC)" : "Backup (WebSocket)"}</p>
        <button onClick={toggleTelemetrySource}>
          {usePrimaryMethod ? "Switch to WebSocket" : "Switch to gRPC"}
        </button>
      </div>

      {telemetry ? (
        <div className="telemetry-data">
          <p>🛫 Altitude: {telemetry.altitude} m</p>
          <p>🔋 Battery: {telemetry.battery}%</p>
          <p>📶 RSSI: {telemetry.rssi} dBm</p>
          {telemetry.gps && (
            <p>📍 GPS: {telemetry.gps.lat}, {telemetry.gps.lon}</p>
          )}
          <p>✈️ Flight Mode: {telemetry.flightMode}</p>
        </div>
      ) : (
        <p>Waiting for telemetry data...</p>
      )}
    </div>
  );
};

export default TelemetryDashboard;
