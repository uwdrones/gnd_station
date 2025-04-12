import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { TelemetryData } from '../types/telemetry';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Socket instance
let socket: Socket | null = null;

// Initialize socket connection
const initializeSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL);
    
    socket.on('connect', () => {
      console.log('Socket connected');
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }
  
  return socket;
};

export const telemetryService = {
  getTelemetry: () => api.get('/telemetry'),
  subscribeToTelemetry: (callback: (data: TelemetryData) => void) => {
    const socket = initializeSocket();
    
    // Remove any existing listeners to prevent duplicates
    socket.off('telemetry');
    
    // Subscribe to telemetry events
    socket.on('telemetry', (data: TelemetryData) => {
      callback(data);
    });
    
    // Return function to unsubscribe
    return () => {
      socket.off('telemetry');
    };
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