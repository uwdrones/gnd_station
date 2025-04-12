// TODO: PLACEHOLDER FOR THE DRONE'S WEBSOCKET GATEWAY

import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true }) // Allow cross-origin communication
export class DroneGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('DroneGateway');
  private telemetryInterval: NodeJS.Timeout;

  afterInit() {
    this.logger.log('Drone Gateway initialized');

    // Start sending mock telemetry data
    this.startMockTelemetry();
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Send telemetry updates to connected clients
  sendTelemetry(data: any) {
    this.server.emit('telemetry', data);
  }

  // Listen for control commands from clients
  @SubscribeMessage('control')
  handleControl(client: any, payload: any) {
    console.log(`Received control command:`, payload);
    // Handle control logic here (e.g., send to flight controller)

    // Send a simple acknowledgement
    return {
      status: 'received',
      command: payload,
      timestamp: Date.now(),
    };
  }

  private startMockTelemetry() {
    // Clear any existing interval
    if (this.telemetryInterval) {
      clearInterval(this.telemetryInterval);
    }

    // Send mock telemetry data every second
    this.telemetryInterval = setInterval(() => {
      const telemetryData = this.generateMockTelemetryData();
      this.sendTelemetry(telemetryData);
    }, 1000);
  }

  private generateMockTelemetryData() {
    // Add some random variation to make it look more realistic
    const randomVariation = () => (Math.random() - 0.5) * 0.1;

    return {
      timestamp: Date.now(),
      position: {
        latitude: 47.655548 + randomVariation(),
        longitude: -122.3032 + randomVariation(),
        altitude: 100.5 + randomVariation() * 10,
      },
      velocity: {
        x: 0.5 + randomVariation(),
        y: 1.2 + randomVariation(),
        z: -0.3 + randomVariation(),
      },
      attitude: {
        roll: 0.1 + randomVariation() * 5,
        pitch: -0.2 + randomVariation() * 5,
        yaw: 45.0 + randomVariation() * 10,
      },
      battery: {
        voltage: 12.6 + randomVariation(),
        current: 2.4 + randomVariation(),
        percentage: 85.3 + randomVariation() * 2,
      },
      status: 'active',
    };
  }
}
