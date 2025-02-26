import React from "react";
import HelloWorld from "./components/HelloWorld";
import TelemetryDashboard from "./components/TelemetryDashboard";
import "./App.css";
import "./components/TelemetryDashboard.css"; // Correct path

const App: React.FC = () => {
  return (
    <div>
      <HelloWorld />
      <TelemetryDashboard />
    </div>
  );
};

export default App;
