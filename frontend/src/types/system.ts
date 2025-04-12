export interface SystemMetrics {
  cpu: {
    usage: number;
    temperature: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
  };
  network: {
    upload: number;
    download: number;
    latency: number;
  };
  status: 'healthy' | 'warning' | 'critical';
}

export interface SystemStatus {
  timestamp: number;
  metrics: SystemMetrics;
  warnings: string[];
  errors: string[];
} 