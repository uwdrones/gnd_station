import React from "react";
import "./App.css";
import { DroneProvider } from "./context/DroneContext";
import Telemetry from "./components/telemetry/Telemetry";
import SystemMonitor from "./components/system-monitor/SystemMonitor";
import Controls from "./components/controls/Controls";
import Camera from "./components/camera/Camera";

const App = () => {
  return (
    <DroneProvider>
      <div className="app-container">
        <header className="app-header">
          <h1>Drone Ground Station</h1>
        </header>
        
        <main className="app-content">
          <div className="dashboard-layout">
            <div className="dashboard-row">
              <div className="dashboard-col">
                <Telemetry />
              </div>
              <div className="dashboard-col">
                <SystemMonitor />
              </div>
            </div>
            <div className="dashboard-row">
              <div className="dashboard-col">
                <Controls />
              </div>
              <div className="dashboard-col">
                <Camera />
              </div>
            </div>
          </div>
        </main>
      </div>
    </DroneProvider>
  );
};

export default App;
