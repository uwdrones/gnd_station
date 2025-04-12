export interface TelemetryData {
  timestamp: number;
  position: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  velocity: {
    x: number;
    y: number;
    z: number;
  };
  attitude: {
    roll: number;
    pitch: number;
    yaw: number;
  };
  battery: {
    voltage: number;
    current: number;
    percentage: number;
  };
  status: 'active' | 'warning' | 'error';
} 