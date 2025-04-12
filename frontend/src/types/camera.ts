export interface CameraStatus {
  isActive: boolean;
  resolution: {
    width: number;
    height: number;
  };
  fps: number;
  format: string;
  status: 'streaming' | 'idle' | 'error';
}

export interface CameraFeed {
  timestamp: number;
  frame: string; // Base64 encoded image
  metadata: {
    exposure: number;
    gain: number;
    whiteBalance: number;
  };
} 