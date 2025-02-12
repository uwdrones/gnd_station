import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DroneGateway } from './gateway/drone-gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, DroneGateway],
})
export class AppModule {}
