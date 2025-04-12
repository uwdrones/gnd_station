import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DroneGateway } from './gateway/drone-gateway';
import { SystemController } from './controllers/system.controller';
import { CameraController } from './controllers/camera.controller';
import { ControlController } from './controllers/control.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    SystemController,
    CameraController,
    ControlController,
  ],
  providers: [AppService, DroneGateway],
})
export class AppModule {}
