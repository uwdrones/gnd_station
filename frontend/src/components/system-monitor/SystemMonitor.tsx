import React from 'react';
import './SystemMonitor.css';
import { useDrone } from '../../context/DroneContext';
import { SystemMetrics } from '../../types/system';

const SystemMonitor: React.FC = () => {
  const { state } = useDrone();
  const { systemStatus } = state;

  const renderMetrics = (metrics: SystemMetrics) => (
    <div className="system-metrics">
      <div className="metric-section">
        <h3>CPU</h3>
        <div className="metric-item">
          <div className="metric-label">Usage</div>
          <div className="metric-value">{metrics.cpu.usage.toFixed(1)}%</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${metrics.cpu.usage}%`, backgroundColor: getColorForValue(metrics.cpu.usage, 80, 95) }}
            ></div>
          </div>
        </div>
        <div className="metric-item">
          <div className="metric-label">Temperature</div>
          <div className="metric-value">{metrics.cpu.temperature.toFixed(1)}°C</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${(metrics.cpu.temperature / 100) * 100}%`, 
                backgroundColor: getColorForValue(metrics.cpu.temperature, 70, 85) 
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="metric-section">
        <h3>Memory</h3>
        <div className="metric-item">
          <div className="metric-label">Used</div>
          <div className="metric-value">
            {formatBytes(metrics.memory.used)} / {formatBytes(metrics.memory.total)}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${(metrics.memory.used / metrics.memory.total) * 100}%`,
                backgroundColor: getColorForValue((metrics.memory.used / metrics.memory.total) * 100, 80, 95)
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="metric-section">
        <h3>Network</h3>
        <div className="metric-item">
          <div className="metric-label">Upload</div>
          <div className="metric-value">{formatBytes(metrics.network.upload)}/s</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">Download</div>
          <div className="metric-value">{formatBytes(metrics.network.download)}/s</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">Latency</div>
          <div className="metric-value">{metrics.network.latency} ms</div>
        </div>
      </div>

      <div className={`system-status system-status-${metrics.status}`}>
        System Status: {metrics.status.toUpperCase()}
      </div>
    </div>
  );

  // Helper function to format bytes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Helper function to get color based on value
  const getColorForValue = (value: number, warningThreshold: number, criticalThreshold: number): string => {
    if (value >= criticalThreshold) return '#dc3545'; // red
    if (value >= warningThreshold) return '#ffc107'; // yellow
    return '#28a745'; // green
  };

  return (
    <div className="system-monitor-container">
      <h2>System Monitor</h2>
      {systemStatus && systemStatus.metrics ? (
        renderMetrics(systemStatus.metrics)
      ) : (
        <div className="system-loading">Loading system data...</div>
      )}
    </div>
  );
};

export default SystemMonitor; 