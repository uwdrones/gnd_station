// TODO: PLACEHOLDER FOR THE DRONE'S WEBSOCKET GATEWAY

import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true }) // Allow cross-origin communication
export class DroneGateway {
  @WebSocketServer()
  server: Server;

  // Send telemetry updates to connected clients
  sendTelemetry(data: any) {
    this.server.emit('telemetry', data);
  }

  // Listen for control commands from clients
  @SubscribeMessage('control')
  handleControl(client: any, payload: any) {
    console.log(`Received control command:`, payload);
    // Handle control logic here (e.g., send to flight controller)
  }
}
