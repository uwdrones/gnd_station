import { Controller, Get } from '@nestjs/common';

@Controller('api/system')
export class SystemController {
  @Get('status')
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
          used: 3221225472,  // 3 GB in bytes
          free: 5368709120,  // 5 GB in bytes
        },
        network: {
          upload: 1048576,   // 1 MB/s in bytes
          download: 2097152, // 2 MB/s in bytes
          latency: 35,       // 35 ms
        },
        status: 'healthy',
      },
      warnings: [],
      errors: [],
    };
  }

  @Get('metrics')
  getPerformanceMetrics() {
    return {
      cpu: {
        usage: 35.2,
        temperature: 42.5,
      },
      memory: {
        total: 8589934592, // 8 GB in bytes
        used: 3221225472,  // 3 GB in bytes
        free: 5368709120,  // 5 GB in bytes
      },
      network: {
        upload: 1048576,   // 1 MB/s in bytes
        download: 2097152, // 2 MB/s in bytes
        latency: 35,       // 35 ms
      },
    };
  }
} 