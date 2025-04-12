import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('telemetry')
  getTelemetry() {
    // Mock telemetry data for testing
    return {
      timestamp: Date.now(),
      position: {
        latitude: 47.655548,
        longitude: -122.3032,
        altitude: 100.5,
      },
      velocity: {
        x: 0.5,
        y: 1.2,
        z: -0.3,
      },
      attitude: {
        roll: 0.1,
        pitch: -0.2,
        yaw: 45.0,
      },
      battery: {
        voltage: 12.6,
        current: 2.4,
        percentage: 85.3,
      },
      status: 'active',
    };
  }

  @Get('system/status')
  getSystemStatus() {
    // Mock system status for testing
    return {
      timestamp: Date.now(),
      metrics: {
        cpu: {
          usage: 35.2,
          temperature: 42.5,
        },
        memory: {
          total: 8589934592, // 8 GB in bytes
          used: 3221225472, // 3 GB in bytes
          free: 5368709120, // 5 GB in bytes
        },
        network: {
          upload: 1048576, // 1 MB/s in bytes
          download: 2097152, // 2 MB/s in bytes
          latency: 35, // 35 ms
        },
        status: 'healthy',
      },
      warnings: [],
      errors: [],
    };
  }
}
