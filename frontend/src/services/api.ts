import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const telemetryService = {
  getTelemetry: () => api.get('/telemetry'),
  subscribeToTelemetry: (callback: (data: any) => void) => {
    // WebSocket implementation will go here
  },
};

export const systemService = {
  getSystemStatus: () => api.get('/system/status'),
  getPerformanceMetrics: () => api.get('/system/metrics'),
};

export const cameraService = {
  getCameraFeed: () => api.get('/camera/feed'),
  getCameraStatus: () => api.get('/camera/status'),
};

export const controlService = {
  sendCommand: (command: string, params?: any) => 
    api.post('/control/command', { command, params }),
  getControlStatus: () => api.get('/control/status'),
}; 