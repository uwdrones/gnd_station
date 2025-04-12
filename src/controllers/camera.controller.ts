import { Controller, Get } from '@nestjs/common';

@Controller('api/camera')
export class CameraController {
  @Get('status')
  getCameraStatus() {
    return {
      isActive: true,
      resolution: {
        width: 1280,
        height: 720,
      },
      fps: 30,
      format: 'H.264',
      status: 'streaming',
    };
  }

  @Get('feed')
  getCameraFeed() {
    // In a real implementation, this would stream actual camera data
    // For this demo, we'll return a sample base64-encoded small image
    const mockBase64Image = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 1x1 transparent GIF
    
    return {
      timestamp: Date.now(),
      frame: mockBase64Image,
      metadata: {
        exposure: 1.5,
        gain: 2.0,
        whiteBalance: 4200,
      },
    };
  }
} 