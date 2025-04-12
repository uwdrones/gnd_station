export type ControlCommand = 
  | 'takeoff'
  | 'land'
  | 'hover'
  | 'move'
  | 'rotate'
  | 'emergency_stop';

export interface ControlParams {
  x?: number;
  y?: number;
  z?: number;
  yaw?: number;
  speed?: number;
}

export interface ControlStatus {
  isConnected: boolean;
  lastCommand: ControlCommand | null;
  lastCommandTime: number | null;
  status: 'ready' | 'busy' | 'error';
  error?: string;
} 